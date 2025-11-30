class DeleteNotification {
  constructor(notificationRepository) {
    this.notificationRepository = notificationRepository;
  }

  async execute(id, userId) {
    const notification = await this.notificationRepository.findById(id);
    if (!notification) {
      throw new Error('Notification not found');
    }
    if (notification.userId !== userId) {
      throw new Error('Unauthorized');
    }
    return await this.notificationRepository.deleteById(id);
  }
}

module.exports = DeleteNotification;
