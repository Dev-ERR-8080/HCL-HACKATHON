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
    // ✅ FIXED: removed all token/localStorage logic.
    //    Auth is now cookie-based — the browser handles the JWT cookie automatically.
    //    We only store the user display info (email + name) in state.
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    // ✅ On mount, check if user is already logged in by calling /api/auth/me
    //    If the cookie is valid the backend returns the user's email.
    useEffect(() => {
        const checkSession = async () => {
            try {
                const res = await fetch('http://localhost:8080/api/auth/me', {
                    credentials: 'include', // send the JWT cookie
                });
                if (res.ok) {
                    const email = await res.text();
                    setIsAuthenticated(true);
                    setUser({ email, name: getNameFromEmail(email) });
                }
            } catch {
                // Not logged in — silently ignore
            }
        };
        checkSession();
    }, []);

    // ✅ FIXED: login no longer takes a token — it just sets user state.
    //    The cookie was already set by the backend /api/auth/login response.
    const login = (email) => {
        setIsAuthenticated(true);
        setUser({ email, name: getNameFromEmail(email) });
        setIsAuthModalOpen(false);
    };

    const logout = async () => {
        try {
            await logoutUser(); // calls POST /api/auth/logout to clear the cookie
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