const express = require("express");
const router = express.Router();

const authController = require("../controllers/con_user");
router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);

const { protect } = require("../middleware/middleware");
router.post("/logout", protect, authController.logoutUser);
router.get("/session", protect, authController.getSession);

module.exports = router;
