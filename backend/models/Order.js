const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    items: [
      {
        itemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Inventory"
        },
        name: String,
        category: String,
        price: Number
      }
    ],

    totalPrice: {
      type: Number,
      required: true
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending"
    },

    razorpayOrderId: {
      type: String
    },

    razorpayPaymentId: {
      type: String
    },

    orderStatus: {
      type: String,
      enum: [
        "Order Received",
        "In the Kitchen",
        "Sent to Delivery",
        "Delivered"
      ],
      default: "Order Received"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);