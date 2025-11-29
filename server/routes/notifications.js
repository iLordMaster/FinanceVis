const express = require("express");
const router = express.Router();
const Notification = require("../models/Notifications");
const authMiddleware = require("../middleware/authMiddleware");

// Create new notification (typically for system/admin use)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { message, type } = req.body;

    // Validate required fields
    if (!message) {
      return res.status(400).json({
        message: "message is required",
      });
    }

    // Validate type if provided
    if (type && !["INFO", "WARNING", "ALERT"].includes(type)) {
      return res.status(400).json({
        message: "type must be INFO, WARNING, or ALERT",
      });
    }

    // Create notification
    const notification = await Notification.create({
      userId: req.user.id,
      message,
      type: type || "INFO",
    });

    res.status(201).json({
      message: "Notification created successfully",
      notification,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error creating notification",
      error: err.message,
    });
  }
});

// Get all notifications for authenticated user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { isRead, type } = req.query;

    // Build query
    const query = { userId: req.user.id };

    // Filter by read status
    if (isRead !== undefined) {
      query.isRead = isRead === "true";
    }

    // Filter by type
    if (type && ["INFO", "WARNING", "ALERT"].includes(type)) {
      query.type = type;
    }

    const notifications = await Notification.find(query).sort({
      createdAt: -1,
    });

    // Count unread notifications
    const unreadCount = await Notification.countDocuments({
      userId: req.user.id,
      isRead: false,
    });

    res.json({
      count: notifications.length,
      unreadCount,
      notifications,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching notifications",
      error: err.message,
    });
  }
});

// Get single notification
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    res.json(notification);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching notification",
      error: err.message,
    });
  }
});

// Mark notification as read
router.put("/:id/read", authMiddleware, async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    notification.isRead = true;
    await notification.save();

    res.json({
      message: "Notification marked as read",
      notification,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error updating notification",
      error: err.message,
    });
  }
});

// Mark all notifications as read
router.put("/read-all", authMiddleware, async (req, res) => {
  try {
    const result = await Notification.updateMany(
      { userId: req.user.id, isRead: false },
      { isRead: true }
    );

    res.json({
      message: "All notifications marked as read",
      modifiedCount: result.modifiedCount,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error updating notifications",
      error: err.message,
    });
  }
});

// Delete notification
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    res.json({
      message: "Notification deleted successfully",
      notificationId: req.params.id,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error deleting notification",
      error: err.message,
    });
  }
});

module.exports = router;
