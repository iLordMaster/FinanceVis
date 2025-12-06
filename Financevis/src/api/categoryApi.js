import Api from "./api";

export class CategoryApi extends Api {
  static api_url = Api.api_url + '/categories';

  // Create new category
  static async createCategory(categoryData) {
    return this.request(this.api_url, {
      method: "POST",
      body: JSON.stringify(categoryData),
    });
  }

  // Get all categories with optional type filter (INCOME/EXPENSE)
  static async getCategories(type = null) {
    const params = type ? { type } : {};
    const queryParams = new URLSearchParams(params).toString();
    const url = `${this.api_url}${queryParams ? `?${queryParams}` : ''}`;
    return this.request(url, {
      method: "GET",
    });
  }

  // Get single category
  static async getCategory(id) {
    return this.request(`${this.api_url}/${id}`, {
      method: "GET",
    });
  }

  // Update category
  static async updateCategory(id, categoryData) {
    return this.request(`${this.api_url}/${id}`, {
      method: "PUT",
      body: JSON.stringify(categoryData),
    });
  }

  // Delete category
  static async deleteCategory(id) {
    return this.request(`${this.api_url}/${id}`, {
      method: "DELETE",
    });
  }
}
