import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await api.get('/auth/me');
          setUser(response.data);
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      // FastAPI strictly requires Form Data for logins, not JSON
      const formData = new URLSearchParams();
      formData.append('username', email); // FastAPI expects the field to be named 'username'
      formData.append('password', password);

      const response = await api.post('/auth/login', formData);
      localStorage.setItem('token', response.data.access_token);
      
      const userResponse = await api.get('/auth/me');
      setUser(userResponse.data);
    } catch (error) {
      if (error.response?.data?.detail) {
        // Handle both string errors ("Incorrect password") and array validation errors
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
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};