const productService = require("../services/product.service");

const path = require("path");
const fs = require("fs");
const slugify = require("slugify");
const sequelize = require("../config/database");
const Product = require("../models/product.models");
const ProductImage = require("../models/productImage.model");

exports.getAll = async (req, res) => {
  try {
    const result = await productService.getAll(req.query);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const result = await productService.getById(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getBySlug = async (req, res) => {
  try {
    const result = await productService.getBySlug(req.params.slug);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Tạo product + nhiều ảnh
exports.createProductWithImages = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const {
      ProductName,
      Slug,
      Price,
      Quantity,
      CategoryID,
      DiscountID,
      Description,
    } = req.body;

    // Debug upload: xem multer có nhận đúng số file không
    // (bạn có thể paste log này để mình chẩn đoán nếu vẫn chỉ lưu 1 ảnh)
    console.log("createProductWithImages.body", {
      ProductName,
      Slug,
      Price,
      Quantity,
      CategoryID,
      DiscountID,
    });
    console.log(
      "createProductWithImages.files",
      req.files?.length || 0,
      req.files?.map((f) => ({
        fieldname: f.fieldname,
        originalname: f.originalname,
        size: f.size,
      }))
    );

    // Tạo product
    const normalizedCategoryID =
      CategoryID === "" || CategoryID === undefined
        ? null
        : parseInt(CategoryID, 10);
    const normalizedDiscountID =
      DiscountID === "" || DiscountID === undefined
        ? null
        : parseInt(DiscountID, 10);

    const normalizedPrice =
      Price === "" || Price === undefined ? 0 : parseFloat(Price);
    const normalizedQuantity =
      Quantity === "" || Quantity === undefined ? 0 : parseInt(Quantity, 10);

    let baseSlug = slugify(ProductName, { lower: true, strict: true, locale: "vi" });
    let finalSlug = baseSlug;
    let counter = 1;
    while (await Product.findOne({ where: { Slug: finalSlug }, transaction: t })) {
      finalSlug = `${baseSlug}-${counter++}`;
    }

    const product = await Product.create(
      {
        ProductName,
        Slug: finalSlug,
        Price: normalizedPrice,
        Quantity: normalizedQuantity,
        CategoryID: normalizedCategoryID,
        DiscountID: normalizedDiscountID,
        Description: Description || null,
      },
      { transaction: t },
    );

    //  Xử lý nhiều ảnh
    if (req.files && req.files.length > 0) {
      const uploadDir = path.join(
        __dirname,
        "../../uploads/product",
        `${product.ProductID}`,
      );
      if (!fs.existsSync(uploadDir))
        fs.mkdirSync(uploadDir, { recursive: true });

      const imagesData = [];

      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        // Tránh trường hợp 2 file có cùng originalname -> bị ghi đè.
        const ext = path.extname(file.originalname);
        const baseName = path.basename(file.originalname, ext);
        const safeFileName = `${baseName}-${Date.now()}-${i}${ext}`;

        const targetPath = path.join(uploadDir, safeFileName);
        fs.renameSync(file.path, targetPath); // move từ temp vào folder đúng
        imagesData.push({
          ProductID: product.ProductID,
          ImagePath: `uploads/product/${product.ProductID}/${safeFileName}`,
        });
      }

      // bulk insert
      await ProductImage.bulkCreate(imagesData, { transaction: t });
    }

    await t.commit();
    return res.json({ success: true, data: product });
  } catch (err) {
    await t.rollback();
    return res.status(500).json({ success: false, message: err.message });
  }
};
exports.create = async (req, res) => {
  try {
    const result = await productService.create(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.createImage = async (req, res) => {
  try {
    const result = await productService.createImage(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.update = async (req, res) => {
  try {
    const result = await productService.update(req.params.id, req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const result = await productService.remove(req.params.id);
    res.json({ deleted: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
