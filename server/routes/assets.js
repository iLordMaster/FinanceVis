const express = require("express");
const router = express.Router();
const Asset = require("../models/Assets");
const authMiddleware = require("../middleware/authMiddleware");

// Create new asset
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, value, color } = req.body;

    // Validate required fields
    if (!name || value === undefined) {
      return res.status(400).json({
        message: "name and value are required",
      });
    }

    // Create asset
    const asset = await Asset.create({
      userId: req.user.id,
      name,
      value,
      color,
    });

    res.status(201).json({
      message: "Asset created successfully",
      asset,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error creating asset",
      error: err.message,
    });
  }
});

// Get all assets for authenticated user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const assets = await Asset.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });

    // Calculate total value
    const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);

    res.json({
      count: assets.length,
      totalValue,
      assets,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching assets",
      error: err.message,
    });
  }
});

// Get single asset
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const asset = await Asset.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!asset) {
      return res.status(404).json({
        message: "Asset not found",
      });
    }

    res.json(asset);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching asset",
      error: err.message,
    });
  }
});

// Update asset
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { name, value, color } = req.body;

    const asset = await Asset.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!asset) {
      return res.status(404).json({
        message: "Asset not found",
      });
    }

    // Update fields
    if (name !== undefined) asset.name = name;
    if (value !== undefined) asset.value = value;
    if (color !== undefined) asset.color = color;

    await asset.save();

    res.json({
      message: "Asset updated successfully",
      asset,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error updating asset",
      error: err.message,
    });
  }
});

// Delete asset
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const asset = await Asset.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!asset) {
      return res.status(404).json({
        message: "Asset not found",
      });
    }

    res.json({
      message: "Asset deleted successfully",
      assetId: req.params.id,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error deleting asset",
      error: err.message,
    });
  }
});

module.exports = router;
