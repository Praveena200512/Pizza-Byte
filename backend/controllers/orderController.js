const Order = require("../models/Order");
const Inventory = require("../models/Inventory");
const razorpay = require("../config/razorpay");
const sendEmail = require("../utils/sendEmail");

const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const checkLowStockAndSendEmail = async () => {
  const lowStockItems = await Inventory.find({
    $expr: { $lte: ["$stock", "$threshold"] }
  });

  if (lowStockItems.length > 0) {
    const itemList = lowStockItems
      .map((item) => `${item.name} (${item.category}) - Stock: ${item.stock}`)
      .join("\n");

    await sendEmail(
      process.env.ADMIN_EMAIL,
      "Low Stock Alert - Pizza Builder",
      `The following items are below threshold:\n\n${itemList}`
    );
  }
};

const placeOrder = async (req, res) => {
  try {
    const {
  items,
  totalPrice,
  deliveryAddress,
  razorpayOrderId,
  razorpayPaymentId
} = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No pizza items selected" });
    }

    for (const item of items) {
      const inventoryItem = await Inventory.findById(item.itemId);

      if (!inventoryItem) {
        return res.status(404).json({
          message: `${item.name} not found in inventory`
        });
      }

      if (inventoryItem.stock <= 0) {
        return res.status(400).json({
          message: `${inventoryItem.name} is out of stock`
        });
      }

      inventoryItem.stock = inventoryItem.stock - 1;
      await inventoryItem.save();
    }

    const order = await Order.create({
      user: req.user._id,
      items,
      totalPrice,
      deliveryAddress,
      paymentStatus: "paid",
      razorpayOrderId,
      razorpayPaymentId
    });

    await checkLowStockAndSendEmail();

    res.status(201).json({
      message: "Order placed successfully",
      order
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({
      message: "Order status updated",
      order
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createRazorpayOrder,
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus
};