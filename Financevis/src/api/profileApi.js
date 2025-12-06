import Api from "./api";

export class ProfileApi extends Api {
  static api_url = Api.api_url + "/users";

  // Get user profile
  static async getUserProfile(userId) {
    return this.request(`${this.api_url}/${userId}`, {
      method: "GET",
    });
  }

  // Update user profile (name, email)
  static async updateProfile(userId, data) {
    const response = await this.request(`${this.api_url}/${userId}/profile`, {
      method: "PUT",
      body: JSON.stringify(data),
    });

    if (!response.user || !response.user.id) {
      throw new Error("User ID not found");
    }

    return response;
  }

  // Upload profile picture
  static async uploadProfilePicture(userId, file) {
    const formData = new FormData();
    formData.append("profilePicture", file);

    const response = await this.request(
      `${this.api_url}/${userId}/profile-picture`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.profilePicture) {
      throw new Error("Profile picture URL not returned");
    }

    return response;
  }

  // Delete profile picture
  static async deleteProfilePicture(userId) {
    return this.request(`${this.api_url}/${userId}/profile-picture`, {
      method: "DELETE",
    });
  }
}
