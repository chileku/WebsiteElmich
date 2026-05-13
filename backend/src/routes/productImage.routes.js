const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadProductImage");
const controller = require("../controllers/productImage.controller");

// Upload ảnh
router.post(
  "/products/:productId/images",
  upload.single("image"),
  controller.create,
);

// Lấy ảnh theo sản phẩm
router.get("/products/:productId/images", controller.getByProduct);

// Xóa ảnh
router.delete("/images/:id", controller.delete);

module.exports = router;
