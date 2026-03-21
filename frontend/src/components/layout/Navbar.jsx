import React from 'react';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, openAuthModal, logout } = useAuth();

  return (
    <nav className="flex justify-between items-center px-6 py-4 shadow-sm bg-white border-b border-slate-100">
      <div className="text-2xl font-bold text-blue-600 tracking-tight">QuickInn</div>
      
      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <span className="text-slate-700 font-medium">Hi, User</span>
            <Button variant="secondary" onClick={logout} className="px-4 py-2 border border-slate-200 shadow-none hover:bg-slate-50">Log out</Button>
          </>
        ) : (
          <Button onClick={openAuthModal} className="shadow-sm hover:shadow-md">Sign In</Button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
