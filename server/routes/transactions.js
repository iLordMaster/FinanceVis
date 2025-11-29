const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const authMiddleware = require("../middleware/authMiddleware");

// Create new transaction
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { accountId, categoryId, type, amount, date, description } = req.body;

    // Validate required fields
    if (!categoryId || !type || !amount || !date) {
      return res.status(400).json({
        message: "categoryId, type, amount, and date are required",
      });
    }

    // Validate type
    if (!["INCOME", "EXPENSE"].includes(type)) {
      return res.status(400).json({
        message: "type must be either INCOME or EXPENSE",
      });
    }

    // Create transaction
    const transaction = await Transaction.create({
      userId: req.user.id,
      accountId,
      categoryId,
      type,
      amount,
      date,
      description,
    });

    // Populate category and account info
    await transaction.populate("categoryId accountId");

    res.status(201).json({
      message: "Transaction created successfully",
      transaction,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error creating transaction",
      error: err.message,
    });
  }
});

// Get all transactions for authenticated user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { startDate, endDate, type, categoryId, accountId } = req.query;

    // Build query
    const query = { userId: req.user.id };

    // Date filtering
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        // Include the full day
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    // Type filtering
    if (type && ["INCOME", "EXPENSE"].includes(type)) {
      query.type = type;
    }

    // Category filtering
    if (categoryId) {
      query.categoryId = categoryId;
    }

    // Account filtering
    if (accountId) {
      query.accountId = accountId;
    }

    const transactions = await Transaction.find(query)
      .populate("categoryId accountId")
      .sort({ date: -1 });

    res.json({
      count: transactions.length,
      transactions,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching transactions",
      error: err.message,
    });
  }
});

// Get transaction summary (total income, total expense, balance)
router.get("/summary", authMiddleware, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Build query
    const query = { userId: req.user.id };

    // Date filtering
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    // Get all transactions
    const transactions = await Transaction.find(query);

    // Calculate totals
    const summary = transactions.reduce(
      (acc, transaction) => {
        if (transaction.type === "INCOME") {
          acc.totalIncome += transaction.amount;
        } else if (transaction.type === "EXPENSE") {
          acc.totalExpense += transaction.amount;
        }
        return acc;
      },
      { totalIncome: 0, totalExpense: 0 }
    );

    summary.balance = summary.totalIncome - summary.totalExpense;

    res.json(summary);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching summary",
      error: err.message,
    });
  }
});

// Get transactions grouped by category
router.get("/by-category", authMiddleware, async (req, res) => {
  try {
    const { startDate, endDate, type } = req.query;

    // Build match query
    const matchQuery = { userId: req.user.id };

    // Date filtering
    if (startDate || endDate) {
      matchQuery.date = {};
      if (startDate) {
        matchQuery.date.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        matchQuery.date.$lte = end;
      }
    }

    // Type filtering
    if (type && ["INCOME", "EXPENSE"].includes(type)) {
      matchQuery.type = type;
    }

    const categoryData = await Transaction.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: "$categoryId",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $project: {
          categoryId: "$_id",
          categoryName: "$category.name",
          categoryColor: "$category.color",
          categoryIcon: "$category.icon",
          total: 1,
          count: 1,
        },
      },
      { $sort: { total: -1 } },
    ]);

    res.json({
      count: categoryData.length,
      data: categoryData,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching category data",
      error: err.message,
    });
  }
});

// Get single transaction
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user.id,
    }).populate("categoryId accountId");

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    res.json(transaction);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching transaction",
      error: err.message,
    });
  }
});

// Update transaction
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { accountId, categoryId, type, amount, date, description } = req.body;

    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    // Update fields
    if (accountId !== undefined) transaction.accountId = accountId;
    if (categoryId !== undefined) transaction.categoryId = categoryId;
    if (type !== undefined) {
      if (!["INCOME", "EXPENSE"].includes(type)) {
        return res.status(400).json({
          message: "type must be either INCOME or EXPENSE",
        });
      }
      transaction.type = type;
    }
    if (amount !== undefined) transaction.amount = amount;
    if (date !== undefined) transaction.date = date;
    if (description !== undefined) transaction.description = description;

    await transaction.save();
    await transaction.populate("categoryId accountId");

    res.json({
      message: "Transaction updated successfully",
      transaction,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error updating transaction",
      error: err.message,
    });
  }
});

// Delete transaction
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    res.json({
      message: "Transaction deleted successfully",
      transactionId: req.params.id,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error deleting transaction",
      error: err.message,
    });
  }
});

module.exports = router;
