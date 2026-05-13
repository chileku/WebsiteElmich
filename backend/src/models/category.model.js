const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Category = sequelize.define(
  "Category",
  {
    CategoryID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    CategoryName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    ParentID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "Category",
    timestamps: false,
  },
);
Category.hasMany(Category, {
  as: "children",
  foreignKey: "ParentID",
});

Category.belongsTo(Category, {
  as: "parent",
  foreignKey: "ParentID",
});
module.exports = Category;
