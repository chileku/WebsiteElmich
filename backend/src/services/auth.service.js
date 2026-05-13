const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Account = require("../models/account.model");

exports.login = async (username, password) => {
  const user = await Account.findOne({ where: { Username: username } });

  if (!user) {
    throw new Error("Tài khoản không tồn tại");
  }

  const isMatch = await bcrypt.compare(password, user.Password);

  if (!isMatch) {
    throw new Error("Sai mật khẩu");
  }

  const token = jwt.sign(
    {
      id: user.AccountID,
      role: user.Role
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    token,
    user
  };
};

/** Thông tin user theo AccountID (không trả Password) */
exports.getInfo = async (accountId) => {
  const user = await Account.findByPk(accountId);

  if (!user) {
    throw new Error("Không tìm thấy tài khoản");
  }

  const u = user.toJSON ? user.toJSON() : user;
  const { Password, ...safeUser } = u;
  return safeUser;
};

/** Đổi mật khẩu */
exports.changePassword = async (accountId, oldPassword, newPassword) => {
  const user = await Account.findByPk(accountId);
  if (!user) throw new Error("Không tìm thấy tài khoản");

  const isMatch = await bcrypt.compare(oldPassword, user.Password);
  if (!isMatch) throw new Error("Mật khẩu hiện tại không đúng");

  const hashed = await bcrypt.hash(newPassword, 10);
  await user.update({ Password: hashed });
  return { success: true };
};

/** Cập nhật thông tin cá nhân */
exports.updateProfile = async (accountId, data) => {
  const user = await Account.findByPk(accountId);
  if (!user) throw new Error("Không tìm thấy tài khoản");
  const allowed = {};
  if (data.FullName !== undefined) allowed.FullName = data.FullName;
  if (data.Phone !== undefined) allowed.Phone = data.Phone;
  if (data.Email !== undefined) allowed.Email = data.Email;
  await user.update(allowed);
  const u = user.toJSON ? user.toJSON() : user;
  const { Password, ...safeUser } = u;
  return safeUser;
};