import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const { isAuthenticated, user, openAuthModal, logout } = useAuth();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        setIsDropdownOpen(false);
        logout();
        navigate('/');
    };

    return (
        <nav className="sticky top-0 z-50 flex justify-between items-center px-6 py-4 bg-white/80 backdrop-blur-md border-b border-slate-200 font-poppins">
            <div className="text-2xl font-bold text-primary tracking-tight">
                QuickInn
            </div>

            <div className="flex items-center gap-4">
                 {isAuthenticated ? (
                    <div className="relative flex items-center gap-6" ref={dropdownRef}>
                        <button 
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="text-secondary font-medium hover:text-primary transition-colors flex items-center gap-1 focus:outline-none"
                        >
                            Hi, {user?.name || 'User'}
                            <svg className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </button>

                        {/* DROPDOWN MENU */}
                        {isDropdownOpen && (
                            <div className="absolute top-10 right-0 w-48 bg-white rounded-xl shadow-md border border-slate-100 py-2 z-50">
                                <button 
                                    onClick={() => {
                                        setIsDropdownOpen(false);
                                        navigate('/my-bookings');
                                    }}
                                    className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors font-medium border-b border-slate-50"
                                >
                                    My Bookings
                                </button>
                                <button 
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-slate-50 hover:text-red-700 transition-colors font-medium"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
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