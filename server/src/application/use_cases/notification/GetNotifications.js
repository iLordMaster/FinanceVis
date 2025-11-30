class GetNotifications {
  constructor(notificationRepository) {
    this.notificationRepository = notificationRepository;
  }

  async execute(userId, filters) {
    const notifications = await this.notificationRepository.findByUserId(userId, filters);
    const unreadCount = await this.notificationRepository.countUnread(userId);
    return { notifications, unreadCount };
  }
}

module.exports = GetNotifications;
