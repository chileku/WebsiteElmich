const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

router.post("/login", authController.login);
router.get("/me", verifyToken, authController.getInfo);
router.put("/me", verifyToken, authController.updateProfile);
router.post("/change-password", verifyToken, authController.changePassword);

module.exports = router;