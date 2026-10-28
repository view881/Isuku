import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from '../types';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: AdminUser | null;
  token: string | null;
  login: (user: AdminUser, token: string) => void;
  logout: () => void;
  hasPermission: (requiredRole: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Role hierarchy: owner > admin > sales_manager > sales_agent
const ROLE_WEIGHT: Record<UserRole, number> = {
  owner: 4,
  admin: 3,
  sales_manager: 2,
  sales_agent: 1
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem('isuku_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('isuku_admin_token');
  });

  const login = (userData: AdminUser, tokenString: string) => {
    setUser(userData);
    setToken(tokenString);
    localStorage.setItem('isuku_admin_user', JSON.stringify(userData));
    localStorage.setItem('isuku_admin_token', tokenString);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('isuku_admin_user');
    localStorage.removeItem('isuku_admin_token');
  };

  const hasPermission = (requiredRole: UserRole): boolean => {
    if (!user) return false;
    return ROLE_WEIGHT[user.role] >= ROLE_WEIGHT[requiredRole];
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
