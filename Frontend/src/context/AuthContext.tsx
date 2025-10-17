import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiClient from '@/lib/axios';
import { toast } from 'sonner';

interface User {
  email: string;
  role: 'USER' | 'ADMIN' | 'PHARMACIST';
  id?: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isPharmacist: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.post('/auth/authenticate', { email, password });
      const { token, role, email: userEmail, name } = response.data;
      
      const userInfo: User = {
        email: userEmail || email,
        name: name,
        role: role as 'USER' | 'ADMIN' | 'PHARMACIST',
      };
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userInfo));
      
      setToken(token);
      setUser(userInfo);
      
      toast.success('¡Bienvenido a Farmacia Russo!');
    } catch (error: unknown) {
      const message = (error as any)?.response?.data?.message || 'Email o contraseña incorrectos';
      toast.error(message);
      throw error;
    }
  };

  const register = async (email: string, password: string, name?: string) => {
    try {
      // Separar nombre completo en firstname y lastname
      const nameParts = (name || 'Usuario Anónimo').split(' ');
      const firstname = nameParts[0];
      const lastname = nameParts.slice(1).join(' ') || 'Usuario';
      
      const response = await apiClient.post('/auth/register', { 
        email, 
        password, 
        firstname,
        lastname
      });
      const { token, role, email: userEmail, name: userName } = response.data;
      
      const userInfo: User = {
        email: userEmail || email,
        name: userName || name,
        role: role as 'USER' | 'ADMIN' | 'PHARMACIST',
      };
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userInfo));
      
      setToken(token);
      setUser(userInfo);
      
      toast.success('¡Registro exitoso!');
    } catch (error: unknown) {
      const message = (error as any)?.response?.data?.message || 'Error al registrarse';
      toast.error(message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    toast.info('Sesión cerrada');
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'ADMIN',
    isPharmacist: user?.role === 'PHARMACIST',
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
