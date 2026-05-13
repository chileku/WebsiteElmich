const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Product = sequelize.define(
  "Product",
  {
    ProductID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ProductName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    Quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Price: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    SalePrice: DataTypes.DECIMAL(15, 2),
    Description: DataTypes.TEXT,
    CategoryID: DataTypes.INTEGER,
    DiscountID: DataTypes.INTEGER,
    CreatedDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    Slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "Product",
    timestamps: false,
  },
);

module.exports = Product;
