const express = require("express");
const router = express.Router();
const accountController = require("../controllers/account.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const { isAdmin } = require("../middlewares/role.middleware");

router.get("/", verifyToken, isAdmin, accountController.getAll);
router.post("/",  accountController.create);
router.put("/:id", verifyToken, isAdmin, accountController.update);
router.delete("/:id", verifyToken, isAdmin, accountController.remove);

module.exports = router;