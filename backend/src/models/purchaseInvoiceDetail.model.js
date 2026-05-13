const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const PurchaseInvoiceDetail = sequelize.define("PurchaseInvoiceDetail", {
  DetailID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  InvoiceID: {
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
  tableName: "PurchaseInvoiceDetail",
  timestamps: false,
});

module.exports = PurchaseInvoiceDetail;