import React, { useState } from "react";
import api from "../../Api/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "../Style/emailverify.css";

export default function EmailVerify() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  
  const handleSendOtp = async () => {
    setLoading(true);
    try {
      const res = await api.post("/auth/send-verify-otp");

      if (res.data?.success) {
        toast.success("OTP sent to your registered email!");
      } else {
        toast.error(res.data?.message || "Failed to send OTP.");
      }
    } catch (error) {
      toast.error("Unable to send OTP. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/verify-account", { otp });

      if (res.data?.success) {
        toast.success("Account verified successfully! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        toast.error(res.data?.message || "Invalid OTP, please try again.");
      }
    } catch (error) {
      toast.error("Verification failed. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verify-container">
      <div className="verify-card">
        <h2>Verify Your Account</h2>
        <p className="verify-text">
          Click the button below to send a verification OTP to your email. Then
          enter it to verify your account.
        </p>

        <button
          className="send-btn"
          onClick={handleSendOtp}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send OTP"}
        </button>

        <form onSubmit={handleVerify}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Verifying..." : "Verify"}
          </button>
        </form>
      </div>
    </div>
  );
}