class Notification {
  constructor({ id, userId, message, type, isRead, createdAt }) {
    this.id = id;
    this.userId = userId;
    this.message = message;
    this.type = type;
    this.isRead = isRead || false;
    this.createdAt = createdAt || new Date();
  }
}

module.exports = Notification;
