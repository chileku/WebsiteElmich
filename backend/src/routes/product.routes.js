const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const productController = require("../controllers/product.controller");

// Multer config: lưu tạm trước khi move vào folder sản phẩm
const upload = multer({ dest: path.join(__dirname, "../../uploads/temp") });

// ================== Public routes ==================
router.get("/", productController.getAll);
router.get("/slug/:slug", productController.getBySlug);
router.get("/:id", productController.getById);

// ================== Admin routes ==================

// 1️⃣ Tạo product + nhiều ảnh cùng lúc
router.post(
  "/",
  upload.array("images", 10), // field name = images, tối đa 10 ảnh
  productController.createProductWithImages,
);

// 2️⃣ Cập nhật product
router.put("/:id", productController.update);

// 3️⃣ Xóa product
router.delete("/:id", productController.remove);

// 4️⃣ Thêm ảnh riêng lẻ (nếu cần)
router.post(
  "/image/:productId",
  upload.single("image"), // nếu muốn upload từng ảnh riêng
  productController.createImage,
);

module.exports = router;
