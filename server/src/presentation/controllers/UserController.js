const logger = require("../../../config/logger");

class UserController {
  constructor(
    getUserProfile,
    updateUserProfile,
    uploadProfilePicture,
    deleteProfilePicture
  ) {
    this.getUserProfile = getUserProfile;
    this.updateUserProfile = updateUserProfile;
    this.uploadProfilePicture = uploadProfilePicture;
    this.deleteProfilePicture = deleteProfilePicture;
  }

  async getProfile(req, res) {
    try {
      const user = await this.getUserProfile.execute(req.params.id);
      res.json(user);
    } catch (err) {
      if (err.message === "User not found") {
        res.status(404).json({ message: err.message });
      } else {
        console.error(err);
        res
          .status(500)
          .json({ message: "Error fetching user", error: err.message });
      }
    }
  }

  async updateProfile(req, res) {
    try {
      if (req.user.id !== req.params.id) {
        return res
          .status(403)
          .json({ message: "You can only update your own profile" });
      }
      const result = await this.updateUserProfile.execute(
        req.params.id,
        req.body
      );
      logger.info("User profile updated successfully", {
        userId: req.params.id,
        updatedFields: Object.keys(req.body),
      });
      res.json({
        message: "Profile updated successfully",
        user: result,
      });
    } catch (err) {
      if (err.message === "User not found") {
        res.status(404).json({ message: err.message });
      } else if (err.message === "Email already in use") {
        res.status(400).json({ message: err.message });
      } else {
        console.error(err);
        logger.error("Error updating profile", {
          userId: req.params.id,
          error: err.message,
        });
        res
          .status(500)
          .json({ message: "Error updating profile", error: err.message });
      }
    }
  }

  async uploadPicture(req, res) {
    try {
      if (req.user.id !== req.params.id) {
        return res
          .status(403)
          .json({ message: "You can only update your own profile picture" });
      }
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const result = await this.uploadProfilePicture.execute(
        req.params.id,
        req.file.path
      );
      res.json({
        message: "Profile picture uploaded successfully",
        profilePicture: result.profilePicture,
      });
    } catch (err) {
      if (err.message === "User not found") {
        res.status(404).json({ message: err.message });
      } else {
        console.error(err);
        res.status(500).json({
          message: "Error uploading profile picture",
          error: err.message,
        });
      }
    }
  }

  async deletePicture(req, res) {
    try {
      if (req.user.id !== req.params.id) {
        return res
          .status(403)
          .json({ message: "You can only update your own profile picture" });
      }
      const result = await this.deleteProfilePicture.execute(req.params.id);
      res.json({
        message: "Profile picture deleted successfully",
        profilePicture: result.profilePicture,
      });
    } catch (err) {
      if (err.message === "User not found") {
        res.status(404).json({ message: err.message });
      } else {
        console.error(err);
        res.status(500).json({
          message: "Error deleting profile picture",
          error: err.message,
        });
      }
    }
  }
}

module.exports = UserController;
