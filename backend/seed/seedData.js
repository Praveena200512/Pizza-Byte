const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Inventory = require("../models/Inventory");

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await User.deleteMany();
    await Inventory.deleteMany();

    const adminPassword = await bcrypt.hash("Admin@123", 10);

    await User.create({
      name: "Admin",
      email: "admin@pizza.com",
      password: adminPassword,
      role: "admin",
      isVerified: true
    });

    await Inventory.insertMany([
      { name: "Thin Crust", category: "base", stock: 50, threshold: 20, price: 80 },
      { name: "Cheese Burst", category: "base", stock: 50, threshold: 20, price: 120 },
      { name: "Whole Wheat", category: "base", stock: 50, threshold: 20, price: 90 },
      { name: "Pan Pizza", category: "base", stock: 50, threshold: 20, price: 100 },
      { name: "Stuffed Crust", category: "base", stock: 50, threshold: 20, price: 130 },

      { name: "Tomato Sauce", category: "sauce", stock: 50, threshold: 20, price: 30 },
      { name: "Barbeque Sauce", category: "sauce", stock: 50, threshold: 20, price: 40 },
      { name: "Pesto Sauce", category: "sauce", stock: 50, threshold: 20, price: 45 },
      { name: "Alfredo Sauce", category: "sauce", stock: 50, threshold: 20, price: 50 },
      { name: "Garlic Sauce", category: "sauce", stock: 50, threshold: 20, price: 35 },

      { name: "Mozzarella", category: "cheese", stock: 50, threshold: 20, price: 60 },
      { name: "Cheddar", category: "cheese", stock: 50, threshold: 20, price: 70 },
      { name: "Parmesan", category: "cheese", stock: 50, threshold: 20, price: 80 },

      { name: "Onion", category: "veggie", stock: 50, threshold: 20, price: 20 },
      { name: "Tomato", category: "veggie", stock: 50, threshold: 20, price: 20 },
      { name: "Capsicum", category: "veggie", stock: 50, threshold: 20, price: 25 },
      { name: "Corn", category: "veggie", stock: 50, threshold: 20, price: 25 },
      { name: "Olives", category: "veggie", stock: 50, threshold: 20, price: 35 },
      { name: "Jalapeno", category: "veggie", stock: 50, threshold: 20, price: 35 },
      { name: "Mushroom", category: "veggie", stock: 50, threshold: 20, price: 30 },

      { name: "Chicken", category: "meat", stock: 50, threshold: 20, price: 90 },
      { name: "Pepperoni", category: "meat", stock: 50, threshold: 20, price: 100 },

      { name: "Coca Cola", category: "drink", stock: 50, threshold: 20, price: 50 },
      { name: "Sprite", category: "drink", stock: 50, threshold: 20, price: 50 },
      { name: "Pepsi", category: "drink", stock: 50, threshold: 20, price: 50 },

      { name: "French Fries", category: "side", stock: 50, threshold: 20, price: 80 },
      { name: "Cheese Fries", category: "side", stock: 50, threshold: 20, price: 100 },
      { name: "Garlic Bread", category: "side", stock: 50, threshold: 20, price: 90 }
    ]);

    console.log("Admin and inventory seeded successfully");
    process.exit();
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

seedData();