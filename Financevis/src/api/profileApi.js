import Api from "./api";

export class ProfileApi extends Api {
  static api_url = Api.api_url + "/users";

  // Get user profile
  static async getUserProfile(userId) {
    try {
      const response = await this.request(`${this.api_url}/${userId}`, {
        method: "GET",
      });

      console.log(response);

      if (!response.id) {
        throw new Error("User ID not found");
      }

      return response;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  }

  // Update user profile (name, email)
  static async updateProfile(userId, data) {
    try {
      const response = await this.request(`${this.api_url}/${userId}/profile`, {
        method: "PUT",
        body: JSON.stringify(data),
      });

      console.log(response);

      if (!response.user || !response.user.id) {
        throw new Error("User ID not found");
      }

      return response;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  }

  // Upload profile picture
  static async uploadProfilePicture(userId, file) {
    try {
      const formData = new FormData();
      formData.append("profilePicture", file);

      const response = await this.request(
        `${this.api_url}/${userId}/profile-picture`,
        {
          method: "POST",
          body: formData,
        }
      );

      console.log(response);

      if (!response.profilePicture) {
        throw new Error("Profile picture URL not returned");
      }

      return response;
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      throw error;
    }
  }

  // Delete profile picture
  static async deleteProfilePicture(userId) {
    try {
      const response = await this.request(
        `${this.api_url}/${userId}/profile-picture`,
        {
          method: "DELETE",
        }
      );

      if (!response.id) {
        throw new Error("User ID not found");
      }

      return response;
    } catch (error) {
      console.error("Error deleting profile picture:", error);
      throw error;
    }
  }
}
