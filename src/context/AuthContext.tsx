import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/src/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  register: (data: any) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateProfile: (data: any) => Promise<{ success: boolean; message?: string }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; message?: string }>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('agri_invest_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password?: string) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.success) {
        setUser(data.user);
        localStorage.setItem('agri_invest_user', JSON.stringify(data.user));
        return { success: true };
      }
      return { success: false, message: data.message || 'Login failed' };
    } catch (error) {
      return { success: false, message: 'An error occurred during login' };
    }
  };

  const register = async (data: any) => {
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.success) {
        setUser(result.user);
        localStorage.setItem('agri_invest_user', JSON.stringify(result.user));
        return { success: true };
      }
      return { success: false, message: result.message || 'Registration failed' };
    } catch (error) {
      return { success: false, message: 'An error occurred during registration' };
    }
  };

  const updateProfile = async (data: any) => {
    if (!user) return { success: false, message: 'Not logged in' };
    try {
      const response = await fetch('/api/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, ...data }),
      });
      const result = await response.json();
      if (result.success) {
        setUser(result.user);
        localStorage.setItem('agri_invest_user', JSON.stringify(result.user));
        return { success: true };
      }
      return { success: false, message: result.message || 'Update failed' };
    } catch (error) {
      return { success: false, message: 'An error occurred during profile update' };
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!user) return { success: false, message: 'Not logged in' };
    try {
      const response = await fetch('/api/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, currentPassword, newPassword }),
      });
      const data = await response.json();
      return { success: data.success, message: data.message };
    } catch (error) {
      return { success: false, message: 'An error occurred during password change' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('agri_invest_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, changePassword, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
