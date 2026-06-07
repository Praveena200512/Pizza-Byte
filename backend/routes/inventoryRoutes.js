const express = require("express");

const {
  addItem,
  getItems,
  getItemsByCategory,
  updateItem,
  deleteItem
} = require("../controllers/inventoryController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getItems);
router.get("/category/:category", protect, getItemsByCategory);

router.post("/", protect, adminOnly, addItem);
router.put("/:id", protect, adminOnly, updateItem);
router.delete("/:id", protect, adminOnly, deleteItem);

module.exports = router;