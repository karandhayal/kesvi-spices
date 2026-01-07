import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// ✅ CENTRALIZED BASE URL (Easy to change later)
export const BASE_URL = "https://parosa-755646660410.asia-south2.run.app/api"; 

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
      if (typeof error.response.data === 'string') return error.response.data;
      if (typeof error.response.data === 'object') return error.response.data.message || JSON.stringify(error.response.data);
    }
    return error.message || "An unexpected error occurred";
  };

  // ✅ FIXED: Route matches Backend (/login-email)
  const login = async (email, password) => {
    try {
      const res = await axios.post(`${BASE_URL}/auth/login-email`, { email, password });
      setUser(res.data.user); // Ensure backend returns { user: ... }
      localStorage.setItem("parosa_user", JSON.stringify(res.data.user));
      if(res.data.token) localStorage.setItem("parosa_token", res.data.token);
      return { success: true };
    } catch (error) {
      return { success: false, message: getErrorMessage(error) };
    }
  };

  const register = async (name, email, phone, password) => {
    try {
      await axios.post(`${BASE_URL}/auth/register`, { name, email, phone, password });
      return { success: true };
    } catch (error) {
      return { success: false, message: getErrorMessage(error) };
    }
  };

  // ✅ FIXED: Route matches Backend (/verify-email)
  const verifyOTP = async (email, otp) => {
    try {
      const res = await axios.post(`${BASE_URL}/auth/verify-email`, { email, otp });
      setUser(res.data.user);
      localStorage.setItem("parosa_user", JSON.stringify(res.data.user));
      if(res.data.token) localStorage.setItem("parosa_token", res.data.token);
      return { success: true };
    } catch (error) {
      return { success: false, message: getErrorMessage(error) };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("parosa_user");
    localStorage.removeItem("parosa_token");
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, login, register, verifyOTP, logout }}>
      {children}
    </AuthContext.Provider>
  );
};