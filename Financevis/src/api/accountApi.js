import api from "./api";

export const AccountApi = {
  async getAccounts() {
    const response = await api.get("/accounts");
    return response.data;
  },

  async getAccount(id) {
    const response = await api.get(`/accounts/${id}`);
    return response.data;
  },

  async createAccount(accountData) {
    const response = await api.post("/accounts", accountData);
    return response.data;
  },

  async updateAccount(id, updates) {
    const response = await api.put(`/accounts/${id}`, updates);
    return response.data;
  },

  async deleteAccount(id) {
    const response = await api.delete(`/accounts/${id}`);
    return response.data;
  },
};
