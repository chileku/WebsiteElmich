const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define(
  "account",
  {
    AccountID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    FullName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    Address: {
      type: DataTypes.STRING(500),
    },

    Phone: {
      type: DataTypes.STRING(20),
    },

    Email: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: false,
    },

    Username: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
    },

    Password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    IsActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    Role: {
      type: DataTypes.STRING(50),
      defaultValue: "user", // admin | user
    },
  },
  {
    tableName: "Users", // đúng tên bảng trong MySQL
    timestamps: false, // vì bảng bạn không có createdAt updatedAt
  }
);

module.exports = User;