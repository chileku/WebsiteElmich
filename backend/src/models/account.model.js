const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Account = sequelize.define("Account", {
  AccountID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  FullName: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  Address: DataTypes.STRING(500),
  Phone: DataTypes.STRING(20),
  Email: {
    type: DataTypes.STRING(255),
    unique: true,
  },
  Username: {
    type: DataTypes.STRING(100),
    unique: true,
  },
  Password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  Favourite: DataTypes.STRING(255),
  Role: {
    type: DataTypes.INTEGER,
    defaultValue: 0, // 0 user | 1 admin
  },
}, {
  tableName: "Account",
  timestamps: false,
});

module.exports = Account;