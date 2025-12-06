import Api from "./api";

export class AuthApi extends Api {
  static api_url = Api.api_url + "/auth";

  static async register(user) {
    // Api.request() already returns parsed JSON data, not a Response object
    const data = await this.request(`${this.api_url}/register`, {
      method: "POST",
      body: JSON.stringify(user),
    });
    return data;
  }

  static async login(user) {
    // Api.request() already returns parsed JSON data, not a Response object
    const data = await this.request(`${this.api_url}/login`, {
      method: "POST",
      body: JSON.stringify(user),
    });
    return data;
  }
}
