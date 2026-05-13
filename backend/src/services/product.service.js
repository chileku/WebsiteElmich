const { Op } = require("sequelize");
const slugify = require("slugify");
const Product = require("../models/product.models");
const ProductImage = require("../models/productImage.model");
const Discount = require("../models/discount.model");
const Category = require("../models/category.model");
const SalesInvoice = require("../models/salesInvoice.model");
const SalesInvoiceDetail = require("../models/salesInvoiceDetail.model");
const sequelize = require("../config/database");

// Helper tính giá sau giảm giá
const calculateDiscount = (product) => {
  const plain = product.toJSON();
  const price = parseFloat(plain.Price) || 0;
  let discountRate = 0;
  let discountAmount = 0;
  let finalPrice = price;
  const now = new Date();

  if (plain.Discount) {
    // DiscountRate có thể lưu 0.5 hoặc 50 → kiểm tra giá trị lớn hơn 1 thì coi là %
    discountRate = parseFloat(plain.Discount.DiscountRate) || 0;
    if (discountRate > 1) discountRate = discountRate / 100;

    // Chỉ áp dụng nếu chưa hết hạn
    if (
      !plain.Discount.ExpirationDate ||
      new Date(plain.Discount.ExpirationDate) > now
    ) {
      discountAmount = price * discountRate;
      finalPrice = price - discountAmount;
    }
  }

  return {
    ...plain,
    DiscountRate: discountRate,
    DiscountAmount: discountAmount,
    FinalPrice: finalPrice,
  };
};

// Helper tính AvailableQuantity cho danh sách sản phẩm
const injectAvailableQuantity = async (products) => {
  const productIds = products.map((p) => p.ProductID);
  if (productIds.length === 0) return products;

  const pendingDetails = await SalesInvoiceDetail.findAll({
    include: [
      {
        model: SalesInvoice,
        where: { Status: "pending" },
        attributes: [],
      },
    ],
    where: { ProductID: { [Op.in]: productIds } },
    attributes: [
      "ProductID",
      [sequelize.fn("SUM", sequelize.col("Quantity")), "totalPending"],
    ],
    group: ["ProductID"],
    raw: true,
  });

  const pendingMap = pendingDetails.reduce((acc, curr) => {
    acc[curr.ProductID] = parseInt(curr.totalPending) || 0;
    return acc;
  }, {});

  return products.map((p) => {
    const plain = p.toJSON ? p.toJSON() : p;
    const totalPending = pendingMap[plain.ProductID] || 0;
    const available = Math.max(0, (plain.Quantity || 0) - totalPending);
    
    // Nếu p là kết quả từ calculateDiscount thì đã là plain object
    return {
      ...plain,
      AvailableQuantity: available,
    };
  });
};

// Lấy tất cả sản phẩm (có search, phân trang)
const getAll = async (query) => {
  const where = {};
  if (query.keyword) {
    where.ProductName = { [Op.like]: `%${query.keyword}%` };
  }

  if (query.categoryID) {
    where.CategoryID = query.categoryID;
  }

  if (query.discountID) {
    where.DiscountID = query.discountID;
  }

  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const offset = (page - 1) * limit;

  const { count, rows } = await Product.findAndCountAll({
    where,
    limit,
    offset,
    distinct: true,
    include: [
      { model: Discount, required: false },
      { model: ProductImage, required: false },
      { model: Category, required: false },
    ],
    order: [["CreatedDate", "DESC"]],
  });

  const productsWithDiscount = rows.map(calculateDiscount);
  const productsWithAvailable = await injectAvailableQuantity(productsWithDiscount);

  return {
    data: productsWithAvailable,
    pagination: {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    },
  };
};

// Lấy sản phẩm theo ID
const getById = async (id) => {
  const product = await Product.findByPk(id, {
    include: [
      { model: Discount, required: false },
      { model: ProductImage, required: false },
      { model: Category, required: false },
    ],
  });
  if (!product) return null;
  const withDiscount = calculateDiscount(product);
  const [withAvailable] = await injectAvailableQuantity([withDiscount]);
  return withAvailable;
};

// Lấy sản phẩm theo slug
const getBySlug = async (slug) => {
  const product = await Product.findOne({
    where: { Slug: slug },
    include: [
      { model: Discount, required: false },
      { model: ProductImage, required: false },
      { model: Category, required: false },
    ],
  });
  if (!product) return null;
  const withDiscount = calculateDiscount(product);
  const [withAvailable] = await injectAvailableQuantity([withDiscount]);
  return withAvailable;
};

// Tạo sản phẩm
const create = async (data) => {
  if (!data.ProductName) {
    throw new Error("ProductName is required");
  }

  // Tạo baseSlug từ ProductName
  let baseSlug = slugify(data.ProductName, {
    lower: true,
    strict: true,
    locale: "vi",
  });

  let slug = baseSlug;
  let counter = 1;

  // Kiểm tra slug trùng trong bảng Product
  while (await Product.findOne({ where: { Slug: slug } })) {
    slug = `${baseSlug}-${counter++}`;
  }

  // Tạo product với slug đã kiểm tra
  const product = await Product.create({
    ...data,
    Slug: slug,
  });

  return {
    success: true,
    data: product,
  };
};

// Thêm ảnh sản phẩm
const createImage = async (data) => ProductImage.create(data);

// Cập nhật sản phẩm
const update = async (id, data) => {
  if (data.ProductName) {
    let baseSlug = slugify(data.ProductName, {
      lower: true,
      strict: true,
      locale: "vi",
    });

    let slug = baseSlug;
    let counter = 1;

    while (
      await Product.findOne({
        where: {
          Slug: slug,
          ProductID: { [Op.ne]: id },
        },
      })
    ) {
      slug = `${baseSlug}-${counter++}`;
    }

    data.Slug = slug;
  }

  await Product.update(data, { where: { ProductID: id } });
  return getById(id);
};

// Xóa sản phẩm
const remove = async (id) => Product.destroy({ where: { ProductID: id } });

module.exports = {
  getAll,
  getById,
  getBySlug,
  create,
  update,
  remove,
  createImage,
  injectAvailableQuantity,
};
