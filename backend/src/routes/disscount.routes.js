// routes/discountRoutes.js
const express = require("express");
const router = express.Router();
const discountController = require("../controllers/disscount.controller.js");

// Lấy danh sách discount (có pagination)
router.get("/", discountController.getDiscounts);

// Lấy chi tiết discount theo ID
router.get("/:id", discountController.getDiscountById);

// Tạo discount mới
router.post("/", discountController.createDiscount);

// Cập nhật discount theo ID
router.put("/:id", discountController.updateDiscount);

// Xóa discount theo ID
router.delete("/:id", discountController.deleteDiscount);

module.exports = router;
