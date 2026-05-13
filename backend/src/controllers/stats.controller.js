const { Op, fn, col, literal } = require("sequelize");
const { Product, Category } = require("../models");
const SalesInvoice = require("../models/salesInvoice.model");
const SalesInvoiceDetail = require("../models/salesInvoiceDetail.model");
const Account = require("../models/account.model");
const sequelize = require("../config/database");

// Setup associations nếu chưa có
if (!SalesInvoice.associations?.SalesInvoiceDetails) {
  SalesInvoice.hasMany(SalesInvoiceDetail, { foreignKey: "SalesInvoiceID" });
  SalesInvoiceDetail.belongsTo(SalesInvoice, { foreignKey: "SalesInvoiceID" });
}
if (!SalesInvoiceDetail.associations?.Product) {
  SalesInvoiceDetail.belongsTo(Product, { foreignKey: "ProductID", as: "Product" });
}

const getStats = async (req, res) => {
  try {
    const productsCount = await Product.count();
    const stockSum = await Product.sum("Quantity");
    const categoriesCount = await Category.count();
    const usersCount = await Account.count({ where: { Role: 0 } });

    // Tổng doanh thu (chỉ tính đơn đã thanh toán và không bị hủy)
    const revenueSum = await SalesInvoice.sum("TotalAmount", {
      where: {
        Status: { [Op.ne]: "cancelled" },
        PaymentStatus: "Đã thanh toán"
      },
    });

    // Tổng số đơn hàng
    const ordersCount = await SalesInvoice.count();

    // Đơn đang chờ xử lý
    const pendingOrders = await SalesInvoice.count({ where: { Status: "pending" } });

    return res.status(200).json({
      success: true,
      data: {
        products: productsCount || 0,
        stock: stockSum || 0,
        revenue: revenueSum || 0,
        categories: categoriesCount || 0,
        users: usersCount || 0,
        orders: ordersCount || 0,
        pendingOrders: pendingOrders || 0,
      },
    });
  } catch (error) {
    console.error("Error getting stats:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Doanh thu theo tháng trong năm hiện tại
const getRevenueByMonth = async (req, res) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();

    const rows = await SalesInvoice.findAll({
      attributes: [
        [fn("MONTH", col("EntryDate")), "month"],
        [fn("SUM", col("TotalAmount")), "revenue"],
        [fn("COUNT", col("SalesInvoiceID")), "orders"],
      ],
      where: {
        Status: { [Op.ne]: "cancelled" },
        PaymentStatus: "Đã thanh toán",
        EntryDate: {
          [Op.between]: [
            new Date(`${year}-01-01`),
            new Date(`${year}-12-31 23:59:59`),
          ],
        },
      },
      group: [fn("MONTH", col("EntryDate"))],
      order: [[fn("MONTH", col("EntryDate")), "ASC"]],
      raw: true,
    });

    // Đảm bảo đủ 12 tháng
    const monthly = Array.from({ length: 12 }, (_, i) => {
      const found = rows.find((r) => parseInt(r.month) === i + 1);
      return {
        name: `T${i + 1}`,
        revenue: found ? parseFloat(found.revenue) : 0,
        orders: found ? parseInt(found.orders) : 0,
      };
    });

    return res.status(200).json({ success: true, data: monthly });
  } catch (error) {
    console.error("Error getting revenue by month:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Top 5 sản phẩm bán chạy
const getTopProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    const rows = await sequelize.query(
      `SELECT
         sid.ProductID,
         p.ProductName,
         p.Price,
         SUM(sid.Quantity)   AS totalSold,
         SUM(sid.TotalPrice) AS totalRevenue
       FROM SalesInvoiceDetails sid
       JOIN SalesInvoice si ON si.SalesInvoiceID = sid.SalesInvoiceID
       LEFT JOIN Product p ON p.ProductID = sid.ProductID
       WHERE si.Status != 'cancelled' AND si.PaymentStatus = 'Đã thanh toán'
       GROUP BY sid.ProductID, p.ProductName, p.Price
       ORDER BY totalSold DESC
       LIMIT ${limit}`,
      { type: sequelize.QueryTypes.SELECT }
    );

    const data = (rows || []).map((r) => ({
      name: r.ProductName || `SP #${r.ProductID}`,
      value: parseInt(r.totalSold) || 0,
      revenue: parseFloat(r.totalRevenue) || 0,
    }));

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Error getting top products:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Tỉ lệ trạng thái đơn hàng
const getOrderStatusStats = async (req, res) => {
  try {
    const rows = await SalesInvoice.findAll({
      attributes: ["Status", [fn("COUNT", col("SalesInvoiceID")), "count"]],
      group: ["Status"],
      raw: true,
    });

    const STATUS_LABEL = {
      pending: "Chờ xác nhận",
      confirmed: "Đã xác nhận",
      shipping: "Đang giao",
      done: "Hoàn thành",
      cancelled: "Đã hủy",
    };

    const data = rows.map((r) => ({
      name: STATUS_LABEL[r.Status] || r.Status || "Khác",
      value: parseInt(r.count),
    }));

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Error getting order status stats:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = { getStats, getRevenueByMonth, getTopProducts, getOrderStatusStats };
