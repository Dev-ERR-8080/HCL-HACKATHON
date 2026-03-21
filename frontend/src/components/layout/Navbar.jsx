import React from 'react';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const { isAuthenticated, user, openAuthModal, logout } = useAuth();

    return (
        <nav className="sticky top-0 z-50 flex justify-between items-center px-6 py-4 bg-white/80 backdrop-blur-md border-b border-slate-200 font-poppins">
            <div className="text-2xl font-bold text-primary tracking-tight">
                QuickInn
            </div>

            <div className="flex items-center gap-4">
                {isAuthenticated ? (
                    <div className="flex items-center gap-6">
            <span className="text-secondary font-medium">
              Hi, {user?.name || 'User'} {/* ✅ real name from JWT */}
            </span>
                        <button
                            onClick={logout}
                            className="text-secondary font-medium hover:text-primary transition-colors"
                        >
                            Log out
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={openAuthModal}
                        className="bg-primary text-white px-6 py-2 rounded-xl font-medium shadow-md hover:bg-blue-700 transition-all active:scale-95"
                    >
                        Sign In
                    </button>
                )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden hidden items-center">
                <button className="text-primary p-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;