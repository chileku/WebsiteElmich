const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ProductImage = sequelize.define("ProductImage", {
  ProductImageID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  ProductID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  ImagePath: DataTypes.STRING(500),
}, {
  tableName: "ProductImage",
  timestamps: false,
});

module.exports = ProductImage;