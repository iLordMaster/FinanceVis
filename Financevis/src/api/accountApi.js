import Api from "./api";

export class AccountApi extends Api {
  static api_url = Api.api_url + "/accounts";

  static async getAccounts() {
    return this.request(this.api_url, {
      method: "GET",
    });
  }

  static async getAccount(id) {
    return this.request(`${this.api_url}/${id}`, {
      method: "GET",
    });
  }

  static async createAccount(accountData) {
    return this.request(this.api_url, {
      method: "POST",
      body: JSON.stringify(accountData),
    });
  }

  static async updateAccount(id, updates) {
    return this.request(`${this.api_url}/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  }

  static async deleteAccount(id) {
    return this.request(`${this.api_url}/${id}`, {
      method: "DELETE",
    });
  }
}
