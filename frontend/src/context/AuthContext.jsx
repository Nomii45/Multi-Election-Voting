import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('voterUser');
    const savedToken = localStorage.getItem('voterToken');
    
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
      
      // Set default authorization header for axios
      axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
    }
    setLoading(false);
  }, []);

  // Login Voter or Admin
  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      
      if (response.data.success) {
        const { token: userToken, user: userData } = response.data;
        
        setUser(userData);
        setToken(userToken);
        
        localStorage.setItem('voterUser', JSON.stringify(userData));
        localStorage.setItem('voterToken', userToken);
        
        // Apply token to global axios requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
        
        return { success: true, role: userData.role };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please check credentials.'
      };
    }
  };

  // Register a new Voter or Admin user
  const register = async (name, email, password, voterId, age, role) => {
    try {
      const response = await axios.post('/api/auth/register', {
        name,
        email,
        password,
        voterId,
        age: Number(age),
        role
      });

      if (response.data.success) {
        const { token: userToken, user: userData } = response.data;

        setUser(userData);
        setToken(userToken);

        localStorage.setItem('voterUser', JSON.stringify(userData));
        localStorage.setItem('voterToken', userToken);

        axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;

        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed.'
      };
    }
  };

  // Logout current user
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('voterUser');
    localStorage.removeItem('voterToken');
    delete axios.defaults.headers.common['Authorization'];
  };

  // Update user status in state & storage (e.g. after casting a vote)
  const updateUserData = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('voterUser', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, isAdmin: user?.role === 'admin', loading, login, register, logout, updateUserData }}>
      {children}
    </AuthContext.Provider>
  );
};
