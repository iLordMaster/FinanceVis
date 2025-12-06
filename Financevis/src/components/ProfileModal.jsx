import { useState, useEffect, useRef } from "react";
import { ProfileApi } from "../api/profileApi";
import { useUser } from "../context/UserContext";
import "./ProfileModal.css";

function ProfileModal({ isOpen, onClose }) {
  const { user: contextUser, updateUser } = useUser();
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
    if (isOpen && contextUser?.id) {
      fetchUserProfile(contextUser.id);
    }
  }, [isOpen, contextUser]);

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
      updateUser(updatedUser);
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
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);

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
      updateUser(updatedUser);
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
      updateUser({ ...user, profilePicture: "" });
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

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="profile-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>Profile Settings</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading profile...</div>
        ) : (
          <div className="profile-modal-body">
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            {/* Profile Picture Section */}
            <div className="profile-picture-section">
              <h3>Profile Picture</h3>
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
                  {uploading && (
                    <div className="upload-overlay">Uploading...</div>
                  )}
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
              <h3>Profile Information</h3>
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

                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-submit"
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileModal;
