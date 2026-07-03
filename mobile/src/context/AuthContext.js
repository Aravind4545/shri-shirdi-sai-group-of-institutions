import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Note: Localhost does not work on physical phones. We use the actual computer's Wi-Fi IP address.
  const API_URL = 'http://localhost:5001/api';

  const checkLoggedIn = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        await fetchProfile(storedToken);
      }
    } catch (e) {
      console.log('Error checking token', e);
    }
    setIsLoading(false);
  };

  const fetchProfile = async (authToken) => {
    try {
      const response = await fetch(`${API_URL}/user/profile`, {
        method: 'GET',
        headers: { 'x-auth-token': authToken }
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        setToken(null);
        setUser(null);
        await AsyncStorage.removeItem('token');
      }
    } catch (error) {
      console.log('Fetch profile error:', error);
    }
  };

  useEffect(() => {
    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        await AsyncStorage.setItem('token', data.token);
        setToken(data.token);
        await fetchProfile(data.token);
        return { success: true };
      } else {
        return { success: false, message: data.msg || 'Login failed' };
      }
    } catch (error) {
      console.log('Login error:', error);
      return { success: false, message: 'Network error. Please check your connection to the server.' };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      setToken(null);
      setUser(null);
    } catch (e) {
      console.log('Logout error', e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, API_URL }}>
      {children}
    </AuthContext.Provider>
  );
};
