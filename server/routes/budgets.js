const express = require("express");
const router = express.Router();
const Budget = require("../models/Budget");
const authMiddleware = require("../middleware/authMiddleware");

// Create new budget
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { categoryId, amount, month, year } = req.body;

    // Validate required fields
    if (!categoryId || !amount || !month || !year) {
      return res.status(400).json({
        message: "categoryId, amount, month, and year are required",
      });
    }

    // Validate month (1-12)
    if (month < 1 || month > 12) {
      return res.status(400).json({
        message: "month must be between 1 and 12",
      });
    }

    // Check if budget already exists for this category/month/year
    const existingBudget = await Budget.findOne({
      userId: req.user.id,
      categoryId,
      month,
      year,
    });

    if (existingBudget) {
      return res.status(400).json({
        message: "Budget already exists for this category and period",
      });
    }

    // Create budget
    const budget = await Budget.create({
      userId: req.user.id,
      categoryId,
      amount,
      month,
      year,
    });

    await budget.populate("categoryId");

    res.status(201).json({
      message: "Budget created successfully",
      budget,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error creating budget",
      error: err.message,
    });
  }
});

// Get all budgets for authenticated user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { month, year, categoryId } = req.query;

    // Build query
    const query = { userId: req.user.id };

    // Month filtering
    if (month) {
      query.month = parseInt(month);
    }

    // Year filtering
    if (year) {
      query.year = parseInt(year);
    }

    // Category filtering
    if (categoryId) {
      query.categoryId = categoryId;
    }

    const budgets = await Budget.find(query)
      .populate("categoryId")
      .sort({ year: -1, month: -1 });

    res.json({
      count: budgets.length,
      budgets,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching budgets",
      error: err.message,
    });
  }
});

// Get single budget
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const budget = await Budget.findOne({
      _id: req.params.id,
      userId: req.user.id,
    }).populate("categoryId");

    if (!budget) {
      return res.status(404).json({
        message: "Budget not found",
      });
    }

    res.json(budget);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching budget",
      error: err.message,
    });
  }
});

// Update budget
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { categoryId, amount, month, year } = req.body;

    const budget = await Budget.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!budget) {
      return res.status(404).json({
        message: "Budget not found",
      });
    }

    // Update fields
    if (categoryId !== undefined) budget.categoryId = categoryId;
    if (amount !== undefined) budget.amount = amount;
    if (month !== undefined) {
      if (month < 1 || month > 12) {
        return res.status(400).json({
          message: "month must be between 1 and 12",
        });
      }
      budget.month = month;
    }
    if (year !== undefined) budget.year = year;

    await budget.save();
    await budget.populate("categoryId");

    res.json({
      message: "Budget updated successfully",
      budget,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error updating budget",
      error: err.message,
    });
  }
});

// Delete budget
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!budget) {
      return res.status(404).json({
        message: "Budget not found",
      });
    }

    res.json({
      message: "Budget deleted successfully",
      budgetId: req.params.id,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error deleting budget",
      error: err.message,
    });
  }
});

module.exports = router;
