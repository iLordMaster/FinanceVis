export class NotificationApi {
  static API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  static api_url = this.API_BASE_URL + '/notifications';

  static async request(endpoint, options = {}) {
    const tokenStr = localStorage.getItem("token");
    let token = null;
    if (tokenStr) {
      try {
        const tokenObj = JSON.parse(tokenStr);
        token = tokenObj.token;
      } catch (e) {
        console.error("Failed to parse token:", e);
      }
    }

    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers,
    };

    const response = await fetch(endpoint, config);
    const data = await response.json();

    if (response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
      throw new Error("Session expired. Please login again.");
    }

    if (!response.ok) {
      throw new Error(data.message || "API request failed");
    }

    return data;
  }

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
