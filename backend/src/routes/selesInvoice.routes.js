const express = require("express");
const router = express.Router();
const controller = require("../controllers/salesInvoice.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

// Route lấy đơn hàng của user đang đăng nhập
router.get("/my", verifyToken, controller.getMyOrders);

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

module.exports = router;
