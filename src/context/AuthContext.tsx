import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { dummyUsers } from '@/data/dummyData';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, phone: string, role: 'user' | 'owner') => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('busease_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    const foundUser = dummyUsers.find(u => u.email === email);
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('busease_user', JSON.stringify(foundUser));
      return true;
    }
    
    return false;
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
    phone: string,
    role: 'user' | 'owner'
  ): Promise<boolean> => {
    // Simulate API call
    const newUser: User = {
      id: `${role}-${Date.now()}`,
      name,
      email,
      phone,
      role,
      createdAt: new Date().toISOString(),
      ...(role === 'owner' && { isApproved: false }),
    };
    
    setUser(newUser);
    localStorage.setItem('busease_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('busease_user');
  };

  const value = {
    user,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
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
