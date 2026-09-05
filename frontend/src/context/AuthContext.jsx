import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const savedUsername = localStorage.getItem('username');
      if (token) {
        // Bypass the missing /auth/me route and trust the local token
        setUser({ username: savedUsername || 'User' });
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      const response = await api.post('/auth/login', formData);
      
      // Login successful! Save token and email locally
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('username', email);
      
      // Set the user in state to instantly trigger the Dashboard redirect
      setUser({ username: email });
    } catch (error) {
      if (error.response?.data?.detail) {
        const detail = error.response.data.detail;
        const errMsg = Array.isArray(detail) ? detail[0].msg : detail;
        throw new Error(errMsg);
      }
      throw error;
    }
  };

  const register = async (username, email, password, confirmPassword) => {
    try {
      await api.post('/auth/register', {
        name: username,
        username: username,
        email: email,
        password: password,
        confirm_password: confirmPassword
      });
    } catch (error) {
      if (error.response?.data?.detail && Array.isArray(error.response.data.detail)) {
        throw new Error(error.response.data.detail[0].msg + " (" + error.response.data.detail[0].loc[1] + ")");
      }
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};