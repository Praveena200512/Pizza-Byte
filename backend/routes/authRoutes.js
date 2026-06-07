const express = require("express");
const {
  registerUser,
  verifyEmail,
  googleLogin,
  loginUser,
  forgotPassword,
  resetPassword,
  getProfile
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.get("/verify-email/:token", verifyEmail);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/profile", protect, getProfile);
router.post("/google-login", googleLogin);

module.exports = router;