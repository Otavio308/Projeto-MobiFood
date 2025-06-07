import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '@env';

export const AuthContext = createContext({
  userToken: null,
  isLoading: true,
  login: () => {},
  logout: () => {}
});

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    userToken: null,
    isLoading: true
  });

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      await AsyncStorage.setItem('userToken', response.data.token);
      setAuthState({ userToken: response.data.token, isLoading: false });
      return true;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      return false;
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('userToken');
    setAuthState({ userToken: null, isLoading: false });
  };

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        setAuthState({ userToken: token, isLoading: false });
      } catch (error) {
        console.error('Token check error:', error);
        setAuthState({ userToken: null, isLoading: false });
      }
    };
    checkToken();
  }, []);

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};