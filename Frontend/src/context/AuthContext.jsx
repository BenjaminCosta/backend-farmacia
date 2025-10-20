import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '@/lib/axios';
import { toast } from 'sonner';
const AuthContext = createContext(undefined);
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
    }, []);
    const login = async (email, password) => {
        try {
            const response = await apiClient.post('/auth/authenticate', { email, password });
            const { token, role, email: userEmail, name } = response.data;
            const userInfo = {
                email: userEmail || email,
                name: name,
                role: role,
            };
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userInfo));
            setToken(token);
            setUser(userInfo);
            toast.success('¡Bienvenido a Farmacia Russo!');
        }
        catch (error) {
            const message = error?.response?.data?.message || 'Email o contraseña incorrectos';
            toast.error(message);
            throw error;
        }
    };
    const register = async (email, password, name) => {
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
            const userInfo = {
                email: userEmail || email,
                name: userName || name,
                role: role,
            };
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userInfo));
            setToken(token);
            setUser(userInfo);
            toast.success('¡Registro exitoso!');
        }
        catch (error) {
            const message = error?.response?.data?.message || 'Error al registrarse';
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
