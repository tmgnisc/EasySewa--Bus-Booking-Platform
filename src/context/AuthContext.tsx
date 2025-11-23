import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { api } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (formData: FormData) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('easysewa_token');
    const storedUser = localStorage.getItem('easysewa_user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      // Verify token is still valid
      refreshUser();
    }
  }, []);

  const refreshUser = async () => {
    const storedToken = localStorage.getItem('easysewa_token');
    if (!storedToken) return;

    try {
      const response = await api.auth.getMe(storedToken);
      setUser(response.user);
      localStorage.setItem('easysewa_user', JSON.stringify(response.user));
    } catch (error) {
      // Token invalid, logout
      logout();
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await api.auth.login(email, password);
      
      setUser(response.user);
      setToken(response.token);
      localStorage.setItem('easysewa_token', response.token);
      localStorage.setItem('easysewa_user', JSON.stringify(response.user));
      
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (formData: FormData): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await api.auth.register(formData);
      
      // If registration successful, set user and token
      if (response.token) {
        setUser(response.user);
        setToken(response.token);
        localStorage.setItem('easysewa_token', response.token);
        localStorage.setItem('easysewa_user', JSON.stringify(response.user));
      }
      
      return {
        success: true,
        message: response.message || 'Account created successfully!'
      };
    } catch (error: any) {
      console.error('Signup error:', error);
      return {
        success: false,
        message: error.message || 'Failed to create account'
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('easysewa_token');
    localStorage.removeItem('easysewa_user');
  };

  const value = {
    user,
    token,
    login,
    signup,
    logout,
    isAuthenticated: !!user && !!token,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
