
import React, { useState } from "react";
import { useAuth } from "../../Context/Authcontext.jsx";
import { useNavigate } from "react-router-dom";
import api from "../../Api/api";
import "../Style/EditProfile.css";

const EditProfile = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/auth/update-profile", { name, email });
      if (res.data.success) {
        setUser({ ...user, name, email });
        setMessage("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Update error:", error);
      setMessage("Failed to update profile.");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/auth/change-password", {
        oldPassword,
        newPassword,
      });
      if (res.data.success) {
        setMessage("Password changed successfully!");
        setOldPassword("");
        setNewPassword("");
      }
    } catch (error) {
      console.error("Password change error:", error);
      setMessage("Failed to change password.");
    }
  };

  return (
    <div className="edit-profile-container">
      <h2>Edit Profile</h2>

      {message && <p className="message">{message}</p>}

      <form onSubmit={handleUpdateProfile} className="profile-form">
        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit" className="save-btn">Save Changes</button>
      </form>

      <hr />

      <h3>Change Password</h3>
      <form onSubmit={handleChangePassword} className="profile-form">
        <label>Old Password</label>
        <input
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
        />

        <label>New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <button type="submit" className="save-btn">Update Password</button>
      </form>

      <button onClick={() => navigate("/profile")} className="back-btn">
        ← Back to Profile
      </button>
    </div>
  );
};

export default EditProfile;