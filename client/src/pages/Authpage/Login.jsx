import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/Authcontext.jsx";
import "../style/login.css"




export default function Login() {
  const {login , loading}=useAuth();
  const navigate = useNavigate();

  const [email , setEmail]= useState("");
  const [password, setPassword]= useState("");
  const [error,setError]= useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await login(email , password)

      if (res.success) {
        navigate("/home");
      } else {
        setError(res.message || "invelid credentials")
      }
    } catch (error) {
    setError("please check your credentials");
    }
  };



  return (
  
    <div className="login-container">
      
      <div className="login-card">
        <h2 className="login-title">Hi! <br /> Welcome back 👋</h2>
        <p className="login-subtitle">
          I’m waiting for you, please enter your details
        </p>

        <form onSubmit={handleLogin}>
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

          <div className="login-option">
            <label>
              <input type="checkbox" /> Remember Me
            </label>
            <a href="#" className="forgot-text" onClick={()=>navigate("/forgot-password")}>Forgot Password?</a>
          </div>

          <button type="submit" disabled={loading} className="login-btn">{loading?"Logging in...":"Login"}</button>
          
        </form>
        <p className="switch-text">
          Don't have an accout?{""}
          <span onClick={()=>navigate("/signup")}>SignUp</span>
        </p>
      </div>
    </div>
  );
}