import Api from "./api";

export class RecurringTransactionApi extends Api {
  static api_url = Api.api_url + "/recurring-transactions";

  // Create new recurring transaction
  static async createRecurringTransaction(data) {
    return this.request(this.api_url, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Get all recurring transactions
  static async getRecurringTransactions() {
    return this.request(this.api_url, {
      method: "GET",
    });
  }

  // Update recurring transaction
  static async updateRecurringTransaction(id, data) {
    return this.request(`${this.api_url}/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // Delete recurring transaction
  static async deleteRecurringTransaction(id) {
    return this.request(`${this.api_url}/${id}`, {
      method: "DELETE",
    });
  }
}
