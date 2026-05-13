const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Supplier = sequelize.define("Supplier", {
  SupplierID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  SupplierName: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  Address: DataTypes.STRING(500),
  Phone: DataTypes.STRING(20),
  Email: DataTypes.STRING(255),
}, {
  tableName: "Supplier",
  timestamps: false,
});

module.exports = Supplier;