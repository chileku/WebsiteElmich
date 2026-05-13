const express = require("express");
const router = express.Router();
const statsController = require("../controllers/stats.controller");

router.get("/", statsController.getStats);
router.get("/revenue-by-month", statsController.getRevenueByMonth);
router.get("/top-products", statsController.getTopProducts);
router.get("/order-status", statsController.getOrderStatusStats);

module.exports = router;
