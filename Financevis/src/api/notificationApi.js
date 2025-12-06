import Api from "./api";

export class NotificationApi extends Api {
  static api_url = Api.api_url + '/notifications';

  // Create new notification
  static async createNotification(notificationData) {
    return this.request(this.api_url, {
      method: "POST",
      body: JSON.stringify(notificationData),
    });
  }

  // Get all notifications with optional filters
  static async getNotifications(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const url = `${this.api_url}${queryParams ? `?${queryParams}` : ''}`;
    return this.request(url, {
      method: "GET",
    });
  }

  // Get single notification
  static async getNotification(id) {
    return this.request(`${this.api_url}/${id}`, {
      method: "GET",
    });
  }

  // Mark notification as read
  static async markAsRead(id) {
    return this.request(`${this.api_url}/${id}/read`, {
      method: "PUT",
    });
  }

  // Mark all notifications as read
  static async markAllAsRead() {
    return this.request(`${this.api_url}/read-all`, {
      method: "PUT",
    });
  }

  // Delete notification
  static async deleteNotification(id) {
    return this.request(`${this.api_url}/${id}`, {
      method: "DELETE",
    });
  }
}
