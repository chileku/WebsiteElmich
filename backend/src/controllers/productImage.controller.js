const ProductImage = require("../models/productImage.model");
const fs = require("fs");
const path = require("path");

// Thêm ảnh
exports.create = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const image = await ProductImage.create({
      ProductID: productId,
      ImagePath: `uploads/product/${productId}/${req.file.filename}`,
    });

    return res.json({
      success: true,
      message: "Upload success",
      data: image,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Lấy tất cả ảnh theo ProductID
exports.getByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const images = await ProductImage.findAll({
      where: { ProductID: productId },
    });

    return res.json({
      success: true,
      data: images,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Xóa ảnh
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const image = await ProductImage.findByPk(id);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    // Xóa file vật lý
    const filePath = path.join(__dirname, "../../", image.ImagePath);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await image.destroy();

    return res.json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
