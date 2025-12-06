import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import "./ProfileSettings.css";
import { ProfileApi } from "../api/profileApi";

const ProfileSettings = () => {
  const navigate = useNavigate();
  const { user: contextUser, updateUser } = useUser(); // Get user from context
  const fileInputRef = useRef(null);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    // If context user is available, use it to fetch full profile
    if (contextUser?.id) {
      fetchUserProfile(contextUser.id);
    } else if (!contextUser) {
      // If no user in context, we might be loading or not logged in.
      // ProtectedRoute handles the "not logged in" case, so we just wait.
    }
  }, [contextUser]);

  const fetchUserProfile = async (userId) => {
    try {
      const userData = await ProfileApi.getUserProfile(userId);
      setUser(userData);
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
      });
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      if (!user?.id) throw new Error("User ID not found");

      const result = await ProfileApi.updateProfile(user.id, formData);

      // Backend returns { message, user }
      const updatedUser = result.user;
      setUser(updatedUser);
      updateUser(updatedUser); // Update context
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);

      // Upload immediately
      handleImageUpload(file);
    }
  };

  const handleImageUpload = async (file) => {
    setError("");
    setSuccess("");
    setUploading(true);

    try {
      if (!user?.id) throw new Error("User ID not found");

      const result = await ProfileApi.uploadProfilePicture(user.id, file);

      // Backend returns { message, profilePicture }
      const updatedUser = { ...user, profilePicture: result.profilePicture };
      setUser(updatedUser);
      updateUser(updatedUser); // Update context
      setPreviewImage(null);
      setSuccess("Profile picture updated successfully!");
    } catch (err) {
      setError(err.message);
      setPreviewImage(null);
    } finally {
      setUploading(false);
    }
  };

  const handleImageDelete = async () => {
    if (
      !window.confirm("Are you sure you want to delete your profile picture?")
    ) {
      return;
    }

    setError("");
    setSuccess("");
    setUploading(true);

    try {
      if (!user?.id) throw new Error("User ID not found");

      await ProfileApi.deleteProfilePicture(user.id);

      setUser((prev) => ({
        ...prev,
        profilePicture: "",
      }));
      updateUser({ ...user, profilePicture: "" }); // Update context
      setSuccess("Profile picture deleted successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (loading) {
    return (
      <div className="profile-settings">
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="profile-settings">
      <div className="profile-container">
        <h1>Profile Settings</h1>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {/* Profile Picture Section */}
        <div className="profile-picture-section">
          <h2>Profile Picture</h2>
          <div className="picture-container">
            <div className="picture-preview">
              {previewImage ? (
                <img src={previewImage} alt="Preview" />
              ) : user?.profilePicture ? (
                <img src={user.profilePicture} alt="Profile" />
              ) : (
                <div className="picture-placeholder">
                  <span>{user?.name?.charAt(0)?.toUpperCase() || "?"}</span>
                </div>
              )}
              {uploading && <div className="upload-overlay">Uploading...</div>}
            </div>

            <div className="picture-actions">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                style={{ display: "none" }}
              />
              <button
                onClick={triggerFileInput}
                className="btn-upload"
                disabled={uploading}
              >
                {user?.profilePicture ? "Change Picture" : "Upload Picture"}
              </button>
              {user?.profilePicture && (
                <button
                  onClick={handleImageDelete}
                  className="btn-delete"
                  disabled={uploading}
                >
                  Delete Picture
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Profile Information Section */}
        <div className="profile-info-section">
          <h2>Profile Information</h2>
          <form onSubmit={handleProfileUpdate}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
              />
            </div>

            <button type="submit" className="btn-save" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>

        <button onClick={() => navigate(-1)} className="btn-back">
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default ProfileSettings;
