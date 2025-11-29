const express = require("express");
const router = express.Router();
const Account = require("../models/Account");
const authMiddleware = require("../middleware/authMiddleware");

// Create new account
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, balance, currency } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({
        message: "name is required",
      });
    }

    // Create account
    const account = await Account.create({
      userId: req.user.id,
      name,
      balance: balance || 0,
      currency: currency || "USD",
    });

    res.status(201).json({
      message: "Account created successfully",
      account,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error creating account",
      error: err.message,
    });
  }
});

// Get all accounts for authenticated user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const accounts = await Account.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });

    // Calculate total balance
    const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

    res.json({
      count: accounts.length,
      totalBalance,
      accounts,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching accounts",
      error: err.message,
    });
  }
});

// Get single account
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const account = await Account.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!account) {
      return res.status(404).json({
        message: "Account not found",
      });
    }

    res.json(account);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching account",
      error: err.message,
    });
  }
});

// Update account
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { name, balance, currency } = req.body;

    const account = await Account.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!account) {
      return res.status(404).json({
        message: "Account not found",
      });
    }

    // Update fields
    if (name !== undefined) account.name = name;
    if (balance !== undefined) account.balance = balance;
    if (currency !== undefined) account.currency = currency;

    await account.save();

    res.json({
      message: "Account updated successfully",
      account,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error updating account",
      error: err.message,
    });
  }
});

// Delete account
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const account = await Account.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!account) {
      return res.status(404).json({
        message: "Account not found",
      });
    }

    res.json({
      message: "Account deleted successfully",
      accountId: req.params.id,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error deleting account",
      error: err.message,
    });
  }
});

module.exports = router;
