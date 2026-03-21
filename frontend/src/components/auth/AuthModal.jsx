import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ForgotPasswordForm from './ForgotPasswordForm';
import ResetPasswordForm from './ResetPasswordForm';

const AuthModal = () => {
  const { isAuthModalOpen, closeAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register' | 'forgot' | 'reset'

  // Reset tab when modal closes
  useEffect(() => {
    if (!isAuthModalOpen) {
      setTimeout(() => setActiveTab('login'), 300); // Wait for transition
    }
  }, [isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const renderForm = () => {
    switch (activeTab) {
      case 'login': return <LoginForm setView={setActiveTab} />;
      case 'register': return <RegisterForm setView={setActiveTab} />;
      case 'forgot': return <ForgotPasswordForm setView={setActiveTab} />;
      case 'reset': return <ResetPasswordForm setView={setActiveTab} />;
      default: return <LoginForm setView={setActiveTab} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-300 px-4">
      {/* Absolute overlay for clicking to dismiss */}
      <div className="absolute inset-0" onClick={closeAuthModal}></div>
      
      <div 
        className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl relative shadow-slate-900/10 transform transition-all scale-100 opacity-100"
        role="dialog"
      >
        <button 
          onClick={closeAuthModal}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-slate-800">Welcome to QuickInn</h1>
        </div>

        {renderForm()}
      </div>
    </div>
  );
};

export default AuthModal;
