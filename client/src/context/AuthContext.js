import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("parosa_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // --- HELPER TO EXTRACT ERROR MESSAGE ---
  const getErrorMessage = (error) => {
    if (error.response && error.response.data) {
      // If server sent a text message
      if (typeof error.response.data === 'string') return error.response.data;
      // If server sent an object (like the Nodemailer error), stringify it or show generic
      if (typeof error.response.data === 'object') return "Server Error: " + JSON.stringify(error.response.data);
    }
    return error.message || "An unexpected error occurred";
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      setUser(res.data);
      localStorage.setItem("parosa_user", JSON.stringify(res.data));
      localStorage.setItem("parosa_user_id", res.data._id);
      return { success: true };
    } catch (error) {
      return { success: false, message: getErrorMessage(error) }; // <--- Use Helper
    }
  };

  const register = async (name, email, phone, password) => {
    try {
      await axios.post("http://localhost:5000/api/auth/register", { name, email, phone, password });
      return { success: true };
    } catch (error) {
      return { success: false, message: getErrorMessage(error) }; // <--- Use Helper
    }
  };

  const verifyOTP = async (email, otp) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/verify", { email, otp });
      setUser(res.data);
      localStorage.setItem("parosa_user", JSON.stringify(res.data));
      localStorage.setItem("parosa_user_id", res.data._id);
      return { success: true };
    } catch (error) {
      return { success: false, message: getErrorMessage(error) }; // <--- Use Helper
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("parosa_user");
    localStorage.removeItem("parosa_user_id");
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, login, register, verifyOTP, logout }}>
      {children}
    </AuthContext.Provider>
  );
};