import { createContext, useState, useEffect } from 'react';
import authAPI from '../api/auth';

// Make sure this is exported
export const AuthContext = createContext();

// This should be exported as default
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await authAPI.getMe();
          setUser(userData);
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (credentials) => {
  const { token, user } = await authAPI.login(credentials);
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify({ 
    ...user,
    name: credentials.name 
  }));
  setUser({ ...user, name: credentials.name });
};

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// No default export needed here unless you're using one