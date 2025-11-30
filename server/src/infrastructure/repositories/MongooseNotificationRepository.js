const NotificationRepository = require('../../domain/repositories/NotificationRepository');
const NotificationModel = require('../database/models/NotificationModel');
const Notification = require('../../domain/entities/Notification');

class MongooseNotificationRepository extends NotificationRepository {
  async create(notification) {
    const newNotification = new NotificationModel({
      userId: notification.userId,
      message: notification.message,
      type: notification.type,
      isRead: notification.isRead,
    });
    const savedNotification = await newNotification.save();
    return this._toEntity(savedNotification);
  }

  async findByUserId(userId, filters = {}) {
    const query = { userId };
    if (filters.isRead !== undefined) query.isRead = filters.isRead;
    if (filters.type) query.type = filters.type;

    const notifications = await NotificationModel.find(query).sort({ createdAt: -1 });
    return notifications.map(this._toEntity);
  }

  async countUnread(userId) {
    return await NotificationModel.countDocuments({ userId, isRead: false });
  }

  async findById(id) {
    const notification = await NotificationModel.findById(id);
    if (!notification) return null;
    return this._toEntity(notification);
  }

  async markAsRead(id) {
    const notification = await NotificationModel.findByIdAndUpdate(id, { isRead: true }, { new: true });
    if (!notification) return null;
    return this._toEntity(notification);
  }

  async markAllAsRead(userId) {
    const result = await NotificationModel.updateMany({ userId, isRead: false }, { isRead: true });
    return result.modifiedCount;
  }

  async deleteById(id) {
    const notification = await NotificationModel.findByIdAndDelete(id);
    return !!notification;
  }

  _toEntity(mongoNotification) {
    return new Notification({
      id: mongoNotification._id.toString(),
      userId: mongoNotification.userId.toString(),
      message: mongoNotification.message,
      type: mongoNotification.type,
      isRead: mongoNotification.isRead,
      createdAt: mongoNotification.createdAt,
    });
  }
}

module.exports = MongooseNotificationRepository;
