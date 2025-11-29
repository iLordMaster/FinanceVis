const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const authMiddleware = require("../middleware/authMiddleware");

// Create new category
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, type, icon, color } = req.body;

    // Validate required fields
    if (!name || !type) {
      return res.status(400).json({
        message: "name and type are required",
      });
    }

    // Validate type
    if (!["INCOME", "EXPENSE"].includes(type)) {
      return res.status(400).json({
        message: "type must be either INCOME or EXPENSE",
      });
    }

    // Create category
    const category = await Category.create({
      userId: req.user.id,
      name,
      type,
      icon,
      color,
    });

    res.status(201).json({
      message: "Category created successfully",
      category,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error creating category",
      error: err.message,
    });
  }
});

// Get all categories for authenticated user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { type } = req.query;

    // Build query
    const query = { userId: req.user.id };

    // Type filtering
    if (type && ["INCOME", "EXPENSE"].includes(type)) {
      query.type = type;
    }

    const categories = await Category.find(query).sort({ createdAt: -1 });

    res.json({
      count: categories.length,
      categories,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching categories",
      error: err.message,
    });
  }
});

// Get single category
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.json(category);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching category",
      error: err.message,
    });
  }
});

// Update category
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { name, type, icon, color } = req.body;

    const category = await Category.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    // Update fields
    if (name !== undefined) category.name = name;
    if (type !== undefined) {
      if (!["INCOME", "EXPENSE"].includes(type)) {
        return res.status(400).json({
          message: "type must be either INCOME or EXPENSE",
        });
      }
      category.type = type;
    }
    if (icon !== undefined) category.icon = icon;
    if (color !== undefined) category.color = color;

    await category.save();

    res.json({
      message: "Category updated successfully",
      category,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error updating category",
      error: err.message,
    });
  }
});

// Delete category
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const category = await Category.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.json({
      message: "Category deleted successfully",
      categoryId: req.params.id,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error deleting category",
      error: err.message,
    });
  }
});

module.exports = router;
