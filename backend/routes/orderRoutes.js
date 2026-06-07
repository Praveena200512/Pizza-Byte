const express = require("express");

const {
  createRazorpayOrder,
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus
} = require("../controllers/orderController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create-razorpay-order", protect, createRazorpayOrder);
router.post("/place-order", protect, placeOrder);

router.get("/my-orders", protect, getMyOrders);

router.get("/admin/all", protect, adminOnly, getAllOrders);
router.put("/admin/status/:id", protect, adminOnly, updateOrderStatus);

module.exports = router;