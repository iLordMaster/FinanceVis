import Api from "./api";

export class TransactionApi extends Api {
  static api_url = Api.api_url + '/transactions';

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
