import React, { useState } from 'react';
import LoginForm from './LoginForm';

const AuthModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl relative">
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
        >
          X
        </button>
        <h2 className="text-2xl font-bold mb-4">Authentication</h2>
        <div className="p-4">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
