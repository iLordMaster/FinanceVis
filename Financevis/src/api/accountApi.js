export class AccountApi {
  static API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  static api_url = this.API_BASE_URL + '/accounts';

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

  // Create new account
  static async createAccount(accountData) {
    return this.request(this.api_url, {
      method: "POST",
      body: JSON.stringify(accountData),
    });
  }

  // Get all accounts
  static async getAccounts() {
    return this.request(this.api_url, {
      method: "GET",
    });
  }

  // Get single account
  static async getAccount(id) {
    return this.request(`${this.api_url}/${id}`, {
      method: "GET",
    });
  }

  // Update account
  static async updateAccount(id, accountData) {
    return this.request(`${this.api_url}/${id}`, {
      method: "PUT",
      body: JSON.stringify(accountData),
    });
  }

  // Delete account
  static async deleteAccount(id) {
    return this.request(`${this.api_url}/${id}`, {
      method: "DELETE",
    });
  }
}
