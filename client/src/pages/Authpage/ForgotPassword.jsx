import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../Api/api";
import "../Style/forgotpassword.css";
import { toast } from "react-toastify";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email.trim()) {
      toast.warning("Please enter your registered email.");
      setLoading(false);
      return;
    }

    try {
      const res = await api.post("/auth/send-resetotp", { email });

      if (res.data.success) {
        toast.success("OTP sent successfully! Check your email inbox.");
        
        setTimeout(() => {
          navigate("/reset-password", { state: { email } });
        }, 2000);
      } else {
        toast.error(res.data?.message || "This email is not registered!");
      }
    } catch (err) {
      toast.error("This email is not registered. Please enter a valid one.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-card">
        <h2>Forgot Password</h2>
        <p className="instructions">
          Enter your registered email. If found, we’ll send you a 6-digit OTP to reset your password.
        </p>

        <form onSubmit={handleSendOtp}>
          <input
            type="email"
            placeholder="Enter registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}