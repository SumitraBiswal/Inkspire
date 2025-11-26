import React, { useState } from "react";
import "../Style/resetpassword.css";
import api from "../../Api/api";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";

function ResetPassword() {
  const { state } = useLocation();
  const [email, setEmail] = useState(state?.email || ""); 
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/reset-password", {
        email,
        otp,
        newPassword,
      });

      if (res.data?.success) {
        toast.success("Password reset successful! Redirecting to Login...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        toast.error(res.data?.message || "Invalid OTP or expired link.");
      }
    } catch (error) {
      toast.error("Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-container">
      <div className="reset-card">
        <h2 className="title">Reset Password</h2>
        <p className="instructions">
          Enter the OTP sent to <strong>{email}</strong> and your new password.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={loading} className="btn">
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;