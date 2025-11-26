import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../Api/api";
import "../style/signup.css";

export default function SignUp() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!name || !email || !password) {
      alert("All fields are required!");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/auth/register", { name, email, password });

      if (res.data.success) {
        setMessage("Registration successful! Please verify your email.");
        // Save email temporarily in localStorage for verification step
        localStorage.setItem("pendingEmail", email);
        setTimeout(() => navigate("/verify-email"), 1500);
      } else {
        setError(res.data.message || "Registration failed");
      }
    } catch (err) {
      setError("Registration failed. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="title">Create Account</h2>
        <p className="subtitle">Join us and explore amazing content</p>

        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="error">{error}</p>}
          {message && <p className="success">{message}</p>}

          <button type="submit" disabled={loading} className="btn">
            {loading ? "Signing up..." : "Sign Up"}
          </button>

          <p className="switch-text">
            Already have an account?{" "}
            <span onClick={() => navigate("/login")}>Login</span>
          </p>
        </form>
      </div>
    </div>
  );
}