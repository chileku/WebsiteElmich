const categoryService = require("../services/category.service");

const getCategories = async (req, res, next) => {
  try {
    const result = await categoryService.getCategories(req.query);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
const getAllParentsWithChildren = async (req, res, next) => {
  try {
    const result = await categoryService.getAllParentsWithChildren(req.query);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
const getProductsByCategorySlug = async (req, res) => {
  try {
    const result = await categoryService.getProductsByCategorySlug(
      req.params.slug,
      req.query,
    );
    res.json(result);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
const getCategoryById = async (req, res, next) => {
  try {
    const result = await categoryService.getCategoryById(req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getCategoryBySlug = async (req, res, next) => {
  try {
    const result = await categoryService.getCategoryBySlug(req.params.slug);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const result = await categoryService.createCategory(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const result = await categoryService.updateCategory(
      req.params.id,
      req.body,
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const result = await categoryService.deleteCategory(req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
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
