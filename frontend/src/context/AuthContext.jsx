// frontend/src/context/AuthContext.jsx
import { createContext, useState } from 'react';
import { loginUser, registerUser, checkAuth, logout } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(checkAuth());

  const login = async (credentials) => {
    try {
      const userData = await loginUser(credentials);
      setUser(userData);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      await registerUser(userData);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        register,
        logout: handleLogout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};