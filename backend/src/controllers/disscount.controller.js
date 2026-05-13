// controllers/discountController.js
const discountService = require("../services/disscount.service");

// Lấy danh sách discount
const getDiscounts = async (req, res) => {
  try {
    const result = await discountService.getDiscounts(req.query);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Lấy chi tiết discount
const getDiscountById = async (req, res) => {
  try {
    const result = await discountService.getDiscountById(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};

// Tạo discount mới
const createDiscount = async (req, res) => {
  try {
    const result = await discountService.createDiscount(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Cập nhật discount
const updateDiscount = async (req, res) => {
  try {
    const result = await discountService.updateDiscount(
      req.params.id,
      req.body,
    );
    res.json(result);
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};

// Xóa discount
const deleteDiscount = async (req, res) => {
  try {
    const result = await discountService.deleteDiscount(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};

module.exports = {
  getDiscounts,
  getDiscountById,
  createDiscount,
  updateDiscount,
  deleteDiscount,
};
