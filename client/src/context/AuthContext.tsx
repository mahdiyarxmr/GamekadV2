import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types';
import { api } from '../api/client';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (identifier: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  quickLogin: (identifierOrRole: string, customPassword?: string) => Promise<void>;
  refreshMe: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('gamekad_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshMe = async () => {
    const curToken = localStorage.getItem('gamekad_token');
    if (!curToken) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const data = await api.getMe();
      setUser(data);
    } catch {
      localStorage.removeItem('gamekad_token');
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshMe();
  }, []);

  const login = async (identifier: string, password: string, rememberMe = true) => {
    setIsLoading(true);
    try {
      const res = await api.login({ identifier, password, rememberMe });
      localStorage.setItem('gamekad_token', res.accessToken);
      setToken(res.accessToken);
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: any) => {
    setIsLoading(true);
    try {
      const res = await api.register(data);
      localStorage.setItem('gamekad_token', res.accessToken);
      setToken(res.accessToken);
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = async (identifierOrRole: string, customPassword?: string) => {
    let identifier = identifierOrRole;
    let password = customPassword || '123456';

    if (identifierOrRole === 'admin') {
      identifier = 'admin';
      password = customPassword || 'admin123';
    } else if (identifierOrRole === 'player') {
      identifier = 'player';
      password = customPassword || '123456';
    } else if (identifierOrRole === 'host') {
      identifier = 'host';
      password = customPassword || '123456';
    }

    await login(identifier, password, true);
  };

  const logout = () => {
    localStorage.removeItem('gamekad_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        quickLogin,
        refreshMe,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
