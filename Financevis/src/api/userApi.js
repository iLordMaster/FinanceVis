export class UserApi {
  static API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  static async register(user) {
    const response = await fetch(`${UserApi.API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    return response.json();
  }

  static async login(user) {
    const response = await fetch(`${UserApi.API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    return response.json()
  }
}
