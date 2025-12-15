import Api from "./api";

export class UserApi extends Api {
  static api_url = Api.api_url + "/users";

  // Get user profile
  static async getUser(id) {
    return this.request(`${this.api_url}/${id}`, {
      method: "GET",
    });
  }

  // Update user profile
  static async updateProfile(id, data) {
    return this.request(`${this.api_url}/${id}/profile`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }
}
