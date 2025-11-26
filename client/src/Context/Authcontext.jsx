
import { createContext, useContext, useState, useEffect } from "react";
import api from "../Api/api";

 const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => {
    try {
      const saved = localStorage.getItem("token");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password }, { withCredentials: true });
      if (res.data.success) {
        setUser(res.data.user);
        setToken(res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem("token", JSON.stringify(res.data.token));
      }
      return res.data;
    } catch (err) {
      console.error(err.response?.data || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/register", { name, email, password });
      return res.data;
    } catch (err) {
      console.error(err.response?.data || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const sendVerifyOtp = async (email) => {
    try {
      const res = await api.post("/auth/send-verify-otp", { email });
      return res.data;
    } catch (err) {
      console.error(err.response?.data || err.message);
      throw err;
    }
  };

  const verifyEmail = async (otp) => {
    try {
      const res = await api.post("/auth/verify-account", { otp });
      return res.data;
    } catch (err) {
      console.error(err.response?.data || err.message);
      throw err;
    }
  };

  const sendResetOtp = async (email) => {
    try {
      const res = await api.post("/auth/send-resetotp", { email });
      return res.data;
    } catch (err) {
      console.error(err.response?.data || err.message);
      throw err;
    }
  };

  const resetPassword = async (email, otp, newPassword) => {
    try {
      const res = await api.post("/auth/reset-password", { email, otp, newPassword });
      return res.data;
    } catch (err) {
      console.error(err.response?.data || err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
      setUser(null);
      setToken(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    } catch (err) {
      console.error(err.response?.data || err.message);
      throw err;
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/auth/is-auth", { withCredentials: true });
        if (res.data.success) {
          setUser(res.data.user);
        } else {
          setUser(null);
          setToken(null);
        }
      } catch (err) {
        console.error(err.response?.data || err.message);
        setUser(null);
        setToken(null);
      }
    };
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        register,
        sendVerifyOtp,
        verifyEmail,
        sendResetOtp,
        resetPassword,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


