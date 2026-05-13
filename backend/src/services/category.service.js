const { Category, Product, Discount, ProductImage } = require("../models");
const { Op } = require("sequelize");
const slugify = require("slugify");

/* ================= GET LIST ================= */
const getCategories = async (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const search = query.search || "";

  const offset = (page - 1) * limit;
  const whereCondition = {};

  if (search) {
    whereCondition.CategoryName = {
      [Op.like]: `%${search}%`,
    };
  }

  const { count, rows } = await Category.findAndCountAll({
    where: whereCondition,
    limit,
    offset,
    order: [["CategoryID", "DESC"]],
  });

  return {
    success: true,
    pagination: {
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      limit,
    },
    data: rows,
  };
};
/* ================= GET LIST ================= */
const getAllParentsWithChildren = async () => {
  const parents = await Category.findAll({
    where: { ParentID: null },
    include: [
      {
        model: Category,
        as: "children",
        required: false,
      },
    ],
    order: [
      ["CategoryID", "ASC"],
      [{ model: Category, as: "children" }, "CategoryID", "ASC"],
    ],
  });

  return {
    success: true,
    total: parents.length,
    data: parents,
  };
};
/* ================= RECURSIVE: LẤY TẤT CẢ ID CON ================= */
const getAllChildCategoryIds = async (parentId) => {
  const children = await Category.findAll({
    where: { ParentID: parentId },
  });

  let ids = [];

  for (const child of children) {
    ids.push(child.CategoryID);

    // đệ quy lấy tiếp con của nó
    const subIds = await getAllChildCategoryIds(child.CategoryID);
    ids = ids.concat(subIds);
  }

  return ids;
};

/* ================= GET CATEGORY BY SLUG ================= */
const getCategoryBySlug = async (slug) => {
  if (slug === "all") {
    const parents = await Category.findAll({
      where: { ParentID: null },
      order: [["CategoryID", "ASC"]],
    });
    return {
      success: true,
      data: {
        CategoryID: "all",
        CategoryName: "Tất cả sản phẩm",
        Slug: "all",
        ParentID: null,
        children: parents.map(p => p.toJSON()),
        siblings: [],
      }
    };
  }

  const category = await Category.findOne({
    where: { Slug: slug },
    include: [
      { model: Category, as: "children", required: false },
      { model: Category, as: "parent", required: false },
    ],
  });

  if (!category) throw new Error("Category not found");

  const plain = category.toJSON();

  // Nếu là danh mục con -> lấy anh em (siblings)
  let siblings = [];
  if (plain.ParentID) {
    siblings = await Category.findAll({
      where: { ParentID: plain.ParentID },
      order: [["CategoryID", "ASC"]],
    });
  }

  return {
    success: true,
    data: {
      ...plain,
      siblings: siblings.map((s) => s.toJSON()),
    },
  };
};

/* ================= GET PRODUCTS BY CATEGORY SLUG ================= */
const getProductsByCategorySlug = async (slug, query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 12;
  const offset = (page - 1) * limit;
  const sortBy = query.sortBy || "ProductID";
  const order = query.order === "ASC" ? "ASC" : "DESC";

  let whereProduct = {};
  let categoryIdsUsed = [];
  let categoryObj = null;

  if (slug === "all") {
    categoryObj = { CategoryID: "all", CategoryName: "Tất cả sản phẩm", Slug: "all" };
    // Không lọc theo CategoryID
  } else {
    //  Tìm category theo slug
    const category = await Category.findOne({
      where: { Slug: slug },
    });

    if (!category) {
      throw new Error("Category not found");
    }

    categoryObj = category;

    //  Lấy toàn bộ ID con
    const childIds = await getAllChildCategoryIds(category.CategoryID);
    categoryIdsUsed = [category.CategoryID, ...childIds];

    whereProduct.CategoryID = { [Op.in]: categoryIdsUsed };
  }

  if (query.minPrice) whereProduct.Price = { ...(whereProduct.Price || {}), [Op.gte]: parseFloat(query.minPrice) };
  if (query.maxPrice) whereProduct.Price = { ...(whereProduct.Price || {}), [Op.lte]: parseFloat(query.maxPrice) };

  // Query Product
  const { count, rows } = await Product.findAndCountAll({
    where: whereProduct,
    distinct: true,
    include: [
      { model: Discount, required: false },
      { model: ProductImage, required: false },
    ],
    limit,
    offset,
    order: [[sortBy, order]],
  });


  //  TÍNH GIÁ SAU KHI GIẢM
  const now = new Date();

  const productsWithDiscount = rows.map((product) => {
    const plain = product.toJSON();
    const price = parseFloat(plain.Price) || 0;

    let discountRate = 0;
    let discountAmount = 0;
    let finalPrice = price;

    if (
      plain.Discount &&
      (!plain.Discount.ExpirationDate ||
        new Date(plain.Discount.ExpirationDate) > now)
    ) {
      discountRate = parseFloat(plain.Discount.DiscountRate);
      discountAmount = (price * discountRate) / 100;
      finalPrice = price - discountAmount;
    }

    return {
      ...plain,
      DiscountRate: discountRate,
      DiscountAmount: discountAmount,
      FinalPrice: finalPrice,
    };
  });

  const productService = require("./product.service");
  const productsWithAvailable = await productService.injectAvailableQuantity(productsWithDiscount);

  // Return
  return {
    success: true,
    category: categoryObj,
    categoryIdsUsed,
    pagination: {
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      limit,
    },
    data: productsWithAvailable,
  };
};
/* ================= GET BY ID ================= */
const getCategoryById = async (id) => {
  const category = await Category.findByPk(id);
  if (!category) throw new Error("Category not found");

  return {
    success: true,
    data: category,
  };
};

/* ================= CREATE ================= */
const createCategory = async (data) => {
  if (!data.CategoryName) {
    throw new Error("CategoryName is required");
  }

  // Tạo slug
  let baseSlug = slugify(data.CategoryName, {
    lower: true,
    strict: true,
    locale: "vi",
  });

  let slug = baseSlug;
  let counter = 1;

  // Kiểm tra slug trùng
  while (await Category.findOne({ where: { Slug: slug } })) {
    slug = `${baseSlug}-${counter++}`;
  }

  const category = await Category.create({
    ...data,
    Slug: slug,
  });

  return {
    success: true,
    data: category,
  };
};

/* ================= UPDATE ================= */
const updateCategory = async (id, data) => {
  const category = await Category.findByPk(id);
  if (!category) throw new Error("Category not found");

  if (data.CategoryName) {
    let baseSlug = slugify(data.CategoryName, {
      lower: true,
      strict: true,
      locale: "vi",
    });

    let slug = baseSlug;
    let counter = 1;

    while (
      await Category.findOne({
        where: {
          Slug: slug,
          CategoryID: { [Op.ne]: id },
        },
      })
    ) {
      slug = `${baseSlug}-${counter++}`;
    }

    data.Slug = slug;
  }

  await category.update(data);

  return {
    success: true,
    data: category,
  };
};

/* ================= DELETE ================= */
const deleteCategory = async (id) => {
  const category = await Category.findByPk(id);
  if (!category) throw new Error("Category not found");

  await category.destroy();

  return {
    success: true,
    message: "Category deleted successfully",
  };
};

module.exports = {
  getCategories,
  getCategoryById,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllParentsWithChildren,
  getProductsByCategorySlug,
};
