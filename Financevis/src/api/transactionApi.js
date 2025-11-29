export class TransactionApi {
  static API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  static api_url = this.API_BASE_URL + '/transactions';

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

  // Create new transaction
  static async createTransaction(transactionData) {
    return this.request(this.api_url, {
      method: "POST",
      body: JSON.stringify(transactionData),
    });
  }

  // Get all transactions with optional filters
  static async getTransactions(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const url = `${this.api_url}${queryParams ? `?${queryParams}` : ''}`;
    return this.request(url, {
      method: "GET",
    });
  }

  // Get transaction summary (total income, expense, balance)
  static async getSummary(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const url = `${this.api_url}/summary${queryParams ? `?${queryParams}` : ''}`;
    return this.request(url, {
      method: "GET",
    });
  }

  // Get transactions grouped by category
  static async getByCategory(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const url = `${this.api_url}/by-category${queryParams ? `?${queryParams}` : ''}`;
    return this.request(url, {
      method: "GET",
    });
  }

  // Get single transaction
  static async getTransaction(id) {
    return this.request(`${this.api_url}/${id}`, {
      method: "GET",
    });
  }

  // Update transaction
  static async updateTransaction(id, transactionData) {
    return this.request(`${this.api_url}/${id}`, {
      method: "PUT",
      body: JSON.stringify(transactionData),
    });
  }

  // Delete transaction
  static async deleteTransaction(id) {
    return this.request(`${this.api_url}/${id}`, {
      method: "DELETE",
    });
  }
}
