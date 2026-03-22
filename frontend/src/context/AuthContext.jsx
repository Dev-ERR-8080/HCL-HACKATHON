import React, { createContext, useState, useContext, useEffect } from 'react';
import { logoutUser } from '../services/api';

const AuthContext = createContext();

const getNameFromEmail = (email) => {
    if (!email) return 'User';
    const localPart = email.split('@')[0];
    return localPart
        .replace(/[._\-]/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    // ✅ ADDED: loading state — prevents UI flash of "not logged in" before session check completes
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkSession = async () => {
            try {
                const res = await fetch('http://localhost:8080/api/auth/me', {
                    credentials: 'include',
                });
                if (res.ok) {
                    const email = await res.text();
                    setIsAuthenticated(true);
                    setUser({ email, name: getNameFromEmail(email) });
                }
                // ✅ 401 = not logged in (normal), 503 = service starting up
                // Both are expected — silently ignore, don't log to console
            } catch {
                // Network error — service may not be up yet, ignore silently
            } finally {
                setIsLoading(false); // ✅ always clear loading state
            }
        };
        checkSession();
    }, []);

    const login = (email) => {
        setIsAuthenticated(true);
        setUser({ email, name: getNameFromEmail(email) });
        setIsAuthModalOpen(false);
    };

    const logout = async () => {
        try {
            await logoutUser();
        } catch { /* ignore */ }
        setUser(null);
        setIsAuthenticated(false);
    };

    const openAuthModal = () => setIsAuthModalOpen(true);
    const closeAuthModal = () => setIsAuthModalOpen(false);

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            isLoading,  // ✅ expose so pages can show spinner while checking session
            login,
            logout,
            isAuthModalOpen,
            openAuthModal,
            closeAuthModal
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;