const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const SalesInvoice = sequelize.define(
  "SalesInvoice",
  {
    SalesInvoiceID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    EntryDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    TotalAmount: DataTypes.DECIMAL(15, 2),
    AccountID: DataTypes.INTEGER,
    Address: DataTypes.STRING(500),
    PaymentMethod: DataTypes.STRING(255),
    Status: DataTypes.STRING(255),
    PaymentStatus: DataTypes.STRING(255),
  },
  {
    tableName: "SalesInvoice",
    timestamps: false,
  },
);

module.exports = SalesInvoice;
