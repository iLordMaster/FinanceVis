export class CategoryApi {
  static API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  static api_url = this.API_BASE_URL + '/categories';

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
