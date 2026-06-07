const Inventory = require("../models/Inventory");

const addItem = async (req, res) => {
  try {
    const { name, category, stock, threshold, price } = req.body;

    const item = await Inventory.create({
      name,
      category,
      stock,
      threshold,
      price
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getItems = async (req, res) => {
  try {
    const items = await Inventory.find().sort({ category: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getItemsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const items = await Inventory.find({
      category,
      stock: { $gt: 0 }
    });

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateItem = async (req, res) => {
  try {
    const item = await Inventory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!item) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteItem = async (req, res) => {
  try {
    const item = await Inventory.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    res.json({ message: "Inventory item deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addItem,
  getItems,
  getItemsByCategory,
  updateItem,
  deleteItem
};