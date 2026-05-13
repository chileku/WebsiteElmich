const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const PurchaseInvoice = sequelize.define("PurchaseInvoice", {
  InvoiceID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  EntryDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  TotalAmount: DataTypes.DECIMAL(15,2),
  SupplierID: DataTypes.INTEGER,
  PaymentMethod: DataTypes.STRING(255),
}, {
  tableName: "PurchaseInvoice",
  timestamps: false,
});

module.exports = PurchaseInvoice;