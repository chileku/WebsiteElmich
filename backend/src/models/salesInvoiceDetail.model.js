const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const SalesInvoiceDetail = sequelize.define("SalesInvoiceDetail", {
  DetailID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  SalesInvoiceID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  ProductID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  Quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  UnitPrice: DataTypes.DECIMAL(15,2),
  TotalPrice: DataTypes.DECIMAL(15,2),
}, {
  tableName: "SalesInvoiceDetails",
  timestamps: false,
});

module.exports = SalesInvoiceDetail;