const express = require("express");
const router = express.Router();

const categoryController = require("../controllers/category.controller");
const { verifyToken, isAdmin } = require("../middlewares/auth.middleware");

// Public (có thể bỏ verifyToken nếu muốn public hoàn toàn)
router.get("/", categoryController.getCategories);
router.get(
  "/getAllParentsWithChildren",
  categoryController.getAllParentsWithChildren,
);
router.get("/slug/:slug", categoryController.getCategoryBySlug);
router.get(
  "/slug/:slug/products",
  categoryController.getProductsByCategorySlug,
);

// Admin only
router.post("/", verifyToken, isAdmin, categoryController.createCategory);
router.put("/:id", verifyToken, isAdmin, categoryController.updateCategory);
router.delete("/:id", verifyToken, isAdmin, categoryController.deleteCategory);

module.exports = router;
