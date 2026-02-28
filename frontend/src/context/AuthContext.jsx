import { createContext, useState, useEffect } from 'react';
import apiClient from '../services/apiClient';

// Export context wrapper to wrap around entire app flow
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Determine initial state straight from Local Storage (sync operation)
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [token, setToken] = useState(() => localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);

    // Effect: Every time token/user changes, keep localStorage perfectly synced
    useEffect(() => {
        if (token && user) {
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
        setLoading(false); // Quick init complete
    }, [token, user]);

    // Action: Login Engine
    const login = async (email, password) => {
        try {
            const response = await apiClient.post('auth/login', { email, password });
            if (response.status === 200) {
                setToken(response.data.token);
                // In production, we assume response.data returns user metadata. 
                // Using email as placeholder for UI display if needed.
                setUser({ email });
                return { success: true };
            }
            return { success: false, error: response.data.message };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.message || 'A network error occurred during login.'
            };
        }
    };

    // Action: Register Engine
    const register = async (email, password, companyName, industryCategory) => {
        try {
            const response = await apiClient.post('auth/register', {
                email, password, companyName, industryCategory
            });
            if (response.status === 201) {
                setToken(response.data.token);
                setUser({ email });
                return { success: true };
            }
            return { success: false, error: response.data.message };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.message || 'A network error occurred during registration.'
            };
        }
    };

    // Action: Logout Engine
    const logout = () => {
        setUser(null);
        setToken(null);
        // The effect above will naturally strip localStorage
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
