const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const Account = require("../models/account.model");

exports.getAll = async (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const search = query.search || "";

  const offset = (page - 1) * limit;

  const whereCondition = search
    ? {
        [Op.or]: [
          { FullName: { [Op.like]: `%${search}%` } },
          { Username: { [Op.like]: `%${search}%` } },
          { Email: { [Op.like]: `%${search}%` } },
        ],
      }
    : {};

  const { count, rows } = await Account.findAndCountAll({
    where: whereCondition,
    offset,
    limit,
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

exports.create = async (data) => {
  const exist = await Account.findOne({
    where: {
      [Op.or]: [{ Username: data.Username }, { Email: data.Email }],
    },
  });
  if (exist) {
    if (exist.Username === data.Username) {
      throw new Error("Username đã tồn tại");
    }

    if (exist.Email === data.Email) {
      throw new Error("Email đã tồn tại");
    }
  }
  const hashedPassword = await bcrypt.hash(data.Password, 10);

  const newAccount = await Account.create({
    ...data,
    Password: hashedPassword,
  });

  return {
    success: true,
    message: "Tạo tài khoản thành công",
    data: newAccount,
  };
};

exports.update = async (id, data) => {
  const account = await Account.findByPk(id);
  if (!account) {
    return { success: false, message: "Không tìm thấy tài khoản" };
  }

  if (data.Password) {
    data.Password = await bcrypt.hash(data.Password, 10);
  }

  await account.update(data);

  return {
    success: true,
    message: "Cập nhật thành công",
    data: account,
  };
};

exports.remove = async (id) => {
  const account = await Account.findByPk(id);
  if (!account) {
    return { success: false, message: "Không tìm thấy tài khoản" };
  }

  await account.destroy();

  return {
    success: true,
    message: "Xóa thành công",
  };
};
