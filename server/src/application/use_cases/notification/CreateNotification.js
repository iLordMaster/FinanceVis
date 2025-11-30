const Notification = require('../../../domain/entities/Notification');

class CreateNotification {
  constructor(notificationRepository) {
    this.notificationRepository = notificationRepository;
  }

  async execute(notificationData) {
    const { userId, message, type } = notificationData;

    if (!message) {
      throw new Error('message is required');
    }

    if (type && !['INFO', 'WARNING', 'ALERT'].includes(type)) {
      throw new Error('type must be INFO, WARNING, or ALERT');
    }

    const notification = new Notification({
      userId,
      message,
      type: type || 'INFO',
    });

    return await this.notificationRepository.create(notification);
  }
}

module.exports = CreateNotification;
