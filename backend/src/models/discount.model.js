const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Discount = sequelize.define(
  "Discount",
  {
    DiscountID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    DiscountRate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    EntryDate: DataTypes.DATE,
    ExpirationDate: DataTypes.DATE,
  },
  {
    tableName: "Discount",
    timestamps: false,
  },
);

module.exports = Discount;
