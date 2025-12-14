class Api {
  static api_url =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";

  static async request(url, options = {}) {
    const token = this.getToken();

    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // Don't set Content-Type for FormData (browser will set it with boundary)
    if (options.body instanceof FormData) {
      delete headers["Content-Type"];
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Handle 401 Unauthorized - token expired or invalid
      if (response.status === 401) {
        // Clear auth data
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Redirect to login
        window.location.href = "/login";
        throw new Error("Session expired. Please login again.");
      }

      // Handle other error responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      // Parse and return JSON response
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  static getToken() {
    try {
      const tokenData = localStorage.getItem("token");
      if (!tokenData) return null;

      const parsed = JSON.parse(tokenData);
      return parsed.token || null;
    } catch (error) {
      console.error("Error getting token:", error);
      return null;
    }
  }
}

export default Api;
