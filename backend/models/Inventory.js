const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    category: {
      type: String,
      enum: ["base", "sauce", "cheese", "veggie", "meat", "drink", "side", "readyPizza"],
      required: true
    },

    stock: {
      type: Number,
      required: true,
      default: 0
    },

    threshold: {
      type: Number,
      required: true,
      default: 20
    },

    price: {
      type: Number,
      required: true,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Inventory", inventorySchema);