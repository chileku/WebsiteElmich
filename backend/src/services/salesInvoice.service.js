const { Op } = require("sequelize");
const sequelize = require("../config/database");
const SalesInvoice = require("../models/salesInvoice.model");
const SalesInvoiceDetail = require("../models/salesInvoiceDetail.model");
const Product = require("../models/product.models");
const Account = require("../models/account.model");

// Khai báo association để include hoạt động ổn định
if (!SalesInvoice.associations?.SalesInvoiceDetails) {
  SalesInvoice.hasMany(SalesInvoiceDetail, { foreignKey: "SalesInvoiceID" });
  SalesInvoiceDetail.belongsTo(SalesInvoice, { foreignKey: "SalesInvoiceID" });
}
if (!SalesInvoiceDetail.associations?.Product) {
  SalesInvoiceDetail.belongsTo(Product, { foreignKey: "ProductID", as: "Product" });
}
if (!SalesInvoice.associations?.Account) {
  SalesInvoice.belongsTo(Account, { foreignKey: "AccountID", as: "Account" });
}

const getAll = async (query) => {
  const where = {};
  const includeAccount = {
    model: Account,
    as: "Account",
    required: false,
    attributes: ["FullName", "Phone", "Email"],
  };

  // 🔍 Search theo Account FullName, Email hoặc PaymentMethod
  if (query.keyword) {
    const kw = `%${query.keyword}%`;
    
    // Tìm các Account khớp với keyword trước
    const matchedAccounts = await Account.findAll({
      where: {
        [Op.or]: [
          { FullName: { [Op.like]: kw } },
          { Email: { [Op.like]: kw } },
        ]
      },
      attributes: ['AccountID']
    });
    const accountIds = matchedAccounts.map(a => a.AccountID);

    where[Op.or] = [
      { PaymentMethod: { [Op.like]: kw } },
      { Address: { [Op.like]: kw } },
      ...(accountIds.length > 0 ? [{ AccountID: { [Op.in]: accountIds } }] : [])
    ];
  }

  //  Lọc theo trạng thái đơn hàng
  if (query.status) {
    where.Status = query.status;
  }

  //  Lọc theo hình thức thanh toán
  if (query.paymentMethod) {
    where.PaymentMethod = query.paymentMethod;
  }

  //  Lọc theo trạng thái thanh toán
  if (query.paymentStatus) {
    where.PaymentStatus = query.paymentStatus;
  }

  //  Lọc theo ngày (EntryDate)
  if (query.startDate || query.endDate) {
    where.EntryDate = {};
    if (query.startDate) {
      where.EntryDate[Op.gte] = new Date(query.startDate);
    }
    if (query.endDate) {
      const end = new Date(query.endDate);
      end.setHours(23, 59, 59, 999);
      where.EntryDate[Op.lte] = end;
    }
  }

  //  Phân trang
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const offset = (page - 1) * limit;

  const { count, rows } = await SalesInvoice.findAndCountAll({
    where,
    limit,
    offset,
    distinct: true,
    include: [
      {
        model: SalesInvoiceDetail,
        required: false,
        include: [
          {
            model: Product,
            as: "Product",
            required: false,
            attributes: ["ProductID", "ProductName", "Price"],
          },
        ],
      },
      includeAccount,
    ],
    order: [["EntryDate", "DESC"]],
  });

  return {
    data: rows,
    pagination: {
      total: count,
      currentPage: page,
      limit,
      totalPages: Math.ceil(count / limit),
    },
  };
};

const getById = async (id, transaction = null) => {
  return await SalesInvoice.findByPk(id, {
    include: [SalesInvoiceDetail],
    transaction
  });
};

const create = async (data) => {
  const { details, ...invoiceData } = data;
  return await sequelize.transaction(async (t) => {
    const invoice = await SalesInvoice.create(invoiceData, { transaction: t });

    if (details && details.length > 0) {
      const detailData = details.map((d) => ({
        ...d,
        SalesInvoiceID: invoice.SalesInvoiceID,
      }));
      await SalesInvoiceDetail.bulkCreate(detailData, { transaction: t });
    }

    return await getById(invoice.SalesInvoiceID, t);
  });
};

const update = async (id, data) => {
  const { details, ...invoiceData } = data;
  return await sequelize.transaction(async (t) => {
    const currentInvoice = await SalesInvoice.findByPk(id, {
      include: [SalesInvoiceDetail],
      transaction: t,
    });
    if (!currentInvoice) throw new Error("Order not found");

    const oldStatus = currentInvoice.Status;
    const newStatus = data.Status;

    // Cập nhật thông tin chính của đơn hàng
    await SalesInvoice.update(invoiceData, {
      where: { SalesInvoiceID: id },
      transaction: t,
    });

    // Nếu chuyển từ pending sang các trạng thái đã xác nhận -> Trừ kho thực tế
    const confirmationStatuses = ["confirmed", "shipping", "done"];
    if (oldStatus === "pending" && confirmationStatuses.includes(newStatus)) {
      const orderDetails = currentInvoice.SalesInvoiceDetails;
      for (const item of orderDetails) {
        await Product.decrement("Quantity", {
          by: item.Quantity,
          where: { ProductID: item.ProductID },
          transaction: t,
        });
      }
    }

    // Cập nhật details (nếu có gửi kèm)
    if (details !== undefined) {
      // Xóa detail cũ
      await SalesInvoiceDetail.destroy({
        where: { SalesInvoiceID: id },
        transaction: t,
      });

      // Thêm lại detail mới
      if (details && details.length > 0) {
        const detailData = details.map((d) => ({
          ...d,
          SalesInvoiceID: id,
        }));
        await SalesInvoiceDetail.bulkCreate(detailData, { transaction: t });
      }
    }

    return await getById(id, t);
  });
};

const remove = async (id) => {
  return await sequelize.transaction(async (t) => {
    await SalesInvoiceDetail.destroy({
      where: { SalesInvoiceID: id },
      transaction: t,
    });

    return await SalesInvoice.destroy({
      where: { SalesInvoiceID: id },
      transaction: t,
    });
  });
};

const getMyOrders = async (accountId, query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const offset = (page - 1) * limit;
  const { count, rows } = await SalesInvoice.findAndCountAll({
    where: { AccountID: accountId },
    distinct: true,
    include: [
      {
        model: SalesInvoiceDetail,
        required: false,
        include: [
          {
            model: Product,
            as: "Product",
            required: false,
            attributes: ["ProductID", "ProductName", "Price"],
          },
        ],
      },
      {
        model: Account,
        as: "Account",
        required: false,
        attributes: ["FullName", "Phone", "Email"],
      },
    ],
    order: [["EntryDate", "DESC"]],
    limit,
    offset,
  });
  return {
    data: rows,
    pagination: { total: count, page, limit, totalPages: Math.ceil(count / limit) },
  };
};

module.exports = { getAll, getById, create, update, remove, getMyOrders };
