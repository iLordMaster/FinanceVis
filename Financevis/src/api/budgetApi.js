import Api from "./api";

export class BudgetApi extends Api {
  static api_url = Api.api_url + '/budgets';

  // Create new budget
  static async createBudget(budgetData) {
    return this.request(this.api_url, {
      method: "POST",
      body: JSON.stringify(budgetData),
    });
  }

  // Get all budgets with optional filters
  static async getBudgets(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const url = `${this.api_url}${queryParams ? `?${queryParams}` : ''}`;
    return this.request(url, {
      method: "GET",
    });
  }

  // Get single budget
  static async getBudget(id) {
    return this.request(`${this.api_url}/${id}`, {
      method: "GET",
    });
  }

  // Update budget
  static async updateBudget(id, budgetData) {
    return this.request(`${this.api_url}/${id}`, {
      method: "PUT",
      body: JSON.stringify(budgetData),
    });
  }

  // Delete budget
  static async deleteBudget(id) {
    return this.request(`${this.api_url}/${id}`, {
      method: "DELETE",
    });
  }
}
