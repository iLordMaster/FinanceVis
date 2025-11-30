class NotificationController {
  constructor(createNotification, getNotifications, markNotificationRead, deleteNotification) {
    this.createNotification = createNotification;
    this.getNotifications = getNotifications;
    this.markNotificationRead = markNotificationRead;
    this.deleteNotification = deleteNotification;
  }

  async create(req, res) {
    try {
      const notificationData = {
        userId: req.user.id,
        ...req.body
      };
      const result = await this.createNotification.execute(notificationData);
      res.status(201).json({
        message: "Notification created successfully",
        notification: result,
      });
    } catch (err) {
      if (err.message.includes('required') || err.message.includes('must be')) {
        res.status(400).json({ message: err.message });
      } else {
        console.error(err);
        res.status(500).json({ message: 'Error creating notification', error: err.message });
      }
    }
  }

  async getAll(req, res) {
    try {
      const filters = req.query;
      // Convert string 'true'/'false' to boolean if present
      if (filters.isRead !== undefined) {
        filters.isRead = filters.isRead === 'true';
      }
      const { notifications, unreadCount } = await this.getNotifications.execute(req.user.id, filters);
      res.json({
        count: notifications.length,
        unreadCount,
        notifications,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error fetching notifications', error: err.message });
    }
  }

  async markRead(req, res) {
    try {
      const result = await this.markNotificationRead.execute(req.params.id, req.user.id);
      res.json({
        message: "Notification marked as read",
        notification: result,
      });
    } catch (err) {
      if (err.message === 'Notification not found') {
        res.status(404).json({ message: err.message });
      } else if (err.message === 'Unauthorized') {
        res.status(403).json({ message: err.message });
      } else {
        console.error(err);
        res.status(500).json({ message: 'Error updating notification', error: err.message });
      }
    }
  }

  async markAllRead(req, res) {
    try {
      const modifiedCount = await this.markNotificationRead.executeAll(req.user.id);
      res.json({
        message: "All notifications marked as read",
        modifiedCount,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error updating notifications', error: err.message });
    }
  }

  async delete(req, res) {
    try {
      await this.deleteNotification.execute(req.params.id, req.user.id);
      res.json({
        message: "Notification deleted successfully",
        notificationId: req.params.id,
      });
    } catch (err) {
      if (err.message === 'Notification not found') {
        res.status(404).json({ message: err.message });
      } else if (err.message === 'Unauthorized') {
        res.status(403).json({ message: err.message });
      } else {
        console.error(err);
        res.status(500).json({ message: 'Error deleting notification', error: err.message });
      }
    }
  }
}

module.exports = NotificationController;
