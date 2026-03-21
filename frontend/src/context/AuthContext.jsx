import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

// Decode JWT payload without any library (JWT is base64 encoded)
const decodeToken = (token) => {
    try {
        const payload = token.split('.')[1];
        const decoded = JSON.parse(atob(payload));
        return decoded;
    } catch {
        return null;
    }
};

// Extract a display name from email e.g. "vishnu.reddy@gmail.com" → "Vishnu Reddy"
const getNameFromEmail = (email) => {
    if (!email) return 'User';
    const localPart = email.split('@')[0];           // "vishnu.reddy" or "vishnureddy"
    return localPart
        .replace(/[._\-]/g, ' ')                        // replace dots/underscores/dashes with space
        .replace(/\b\w/g, c => c.toUpperCase());        // capitalize each word
};

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null); // { email, name }
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    // Load token from localStorage on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            const decoded = decodeToken(storedToken);
            if (decoded) {
                setToken(storedToken);
                setIsAuthenticated(true);
                setUser({
                    email: decoded.sub,
                    name: getNameFromEmail(decoded.sub),
                });
            }
        }
    }, []);

    const login = (newToken) => {
        const decoded = decodeToken(newToken);
        setToken(newToken);
        setIsAuthenticated(true);
        setUser({
            email: decoded?.sub || '',
            name: getNameFromEmail(decoded?.sub),
        });
        localStorage.setItem('token', newToken);
        setIsAuthModalOpen(false);
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
    };

    const openAuthModal = () => setIsAuthModalOpen(true);
    const closeAuthModal = () => setIsAuthModalOpen(false);

    return (
        <AuthContext.Provider value={{
            token,
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