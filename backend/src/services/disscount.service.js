const { Discount } = require("../models");

const getDiscounts = async (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;

  const offset = (page - 1) * limit;

  const whereCondition = {};

  const { count, rows } = await Discount.findAndCountAll({
    where: whereCondition,
    limit,
    offset,
    order: [["DiscountID", "DESC"]],
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

const getDiscountById = async (id) => {
  const discount = await Discount.findByPk(id);
  if (!discount) throw new Error("Discount not found");

  return {
    success: true,
    data: discount,
  };
};

const createDiscount = async (data) => {
  const discount = await Discount.create(data);

  return {
    success: true,
    data: discount,
  };
};

const updateDiscount = async (id, data) => {
  const discount = await Discount.findByPk(id);
  if (!discount) throw new Error("Discount not found");

  await discount.update(data);

  return {
    success: true,
    data: discount,
  };
};

const deleteDiscount = async (id) => {
  const discount = await Discount.findByPk(id);
  if (!discount) throw new Error("Discount not found");

  await discount.destroy();

  return {
    success: true,
    message: "Discount deleted successfully",
  };
};

module.exports = {
  getDiscounts,
  getDiscountById,
  createDiscount,
  updateDiscount,
  deleteDiscount,
};
