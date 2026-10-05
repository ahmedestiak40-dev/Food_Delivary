import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Define API base URL
  const API_URL = 'http://localhost:5000/api';

  // Configure axios defaults
  if (token) {
    axios.defaults.headers.common['x-auth-token'] = token;
  }

  const fetchUser = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/auth/me`);
      setUser(res.data);
    } catch (err) {
      console.error('Fetch user error:', err);
      logout();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token, fetchUser]);

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['x-auth-token'] = token;
      setToken(token);
      setUser(user);
      return { success: true };
    } catch (err) {
      console.error('Login error:', err.response?.data);
      return { 
        success: false, 
        error: err.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (name, email, password, phone) => {
    try {
      console.log('Attempting registration with:', { name, email, phone });
      const res = await axios.post(`${API_URL}/auth/register`, { 
        name, 
        email, 
        password, 
        phone 
      });
      console.log('Registration response:', res.data);
      
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['x-auth-token'] = token;
      setToken(token);
      setUser(user);
      return { success: true };
    } catch (err) {
      console.error('Registration error:', err);
      console.error('Error response:', err.response?.data);
      return { 
        success: false, 
        error: err.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['x-auth-token'];
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};