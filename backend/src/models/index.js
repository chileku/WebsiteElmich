const Category = require("./category.model");
const Product = require("./product.models");
const Discount = require("./discount.model");
const ProductImage = require("./productImage.model");
const Supplier = require("./supplier.model");
const Account = require("./account.model");
const SalesInvoice = require("./salesInvoice.model");
const SalesInvoiceDetail = require("./salesInvoiceDetail.model");
const PurchaseInvoice = require("./purchaseInvoice.model");
const PurchaseInvoiceDetail = require("./purchaseInvoiceDetail.model");

/* Category self reference */
Category.hasMany(Category, { foreignKey: "ParentID" });

/* Product */
Category.hasMany(Product, { foreignKey: "CategoryID" });
Product.belongsTo(Category, { foreignKey: "CategoryID" });

Discount.hasMany(Product, { foreignKey: "DiscountID" });
Product.belongsTo(Discount, { foreignKey: "DiscountID" });

Product.hasMany(ProductImage, { foreignKey: "ProductID" });
ProductImage.belongsTo(Product, { foreignKey: "ProductID" });

/* Sales */
Account.hasMany(SalesInvoice, { foreignKey: "AccountID" });
SalesInvoice.belongsTo(Account, { foreignKey: "AccountID" });

SalesInvoice.hasMany(SalesInvoiceDetail, { foreignKey: "SalesInvoiceID" });
SalesInvoiceDetail.belongsTo(SalesInvoice, { foreignKey: "SalesInvoiceID" });

Product.hasMany(SalesInvoiceDetail, { foreignKey: "ProductID" });
SalesInvoiceDetail.belongsTo(Product, { foreignKey: "ProductID" });

/* Purchase */
Supplier.hasMany(PurchaseInvoice, { foreignKey: "SupplierID" });
PurchaseInvoice.belongsTo(Supplier, { foreignKey: "SupplierID" });

PurchaseInvoice.hasMany(PurchaseInvoiceDetail, { foreignKey: "InvoiceID" });
PurchaseInvoiceDetail.belongsTo(PurchaseInvoice, { foreignKey: "InvoiceID" });

Product.hasMany(PurchaseInvoiceDetail, { foreignKey: "ProductID" });
PurchaseInvoiceDetail.belongsTo(Product, { foreignKey: "ProductID" });

module.exports = {
  Category,
  Discount,
  Product,
  ProductImage,
  Supplier,
  Account,
  SalesInvoice,
  SalesInvoiceDetail,
  PurchaseInvoice,
  PurchaseInvoiceDetail,
};
