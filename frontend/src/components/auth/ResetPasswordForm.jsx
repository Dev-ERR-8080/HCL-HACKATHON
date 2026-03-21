import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';

const ResetPasswordForm = ({ setView }) => {
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!token || !newPassword || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError('');
    setIsLoading(true);

    // Mock reset success -> back to login
    setTimeout(() => {
      setIsLoading(false);
      setView('login');
    }, 1500);
  };

  return (
    <div className="flex flex-col animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Reset Password</h2>
      <p className="text-slate-500 mb-6 text-sm">Check your email for the OTP and enter your new password below.</p>
      
      {error && <div className="p-3 mb-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">{error}</div>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-1">
        <Input 
          label="Reset Token (OTP)" 
          type="text" 
          placeholder="123456"
          value={token} 
          onChange={e => setToken(e.target.value)} 
          required 
        />
        <Input 
          label="New Password" 
          type="password" 
          placeholder="••••••••"
          value={newPassword} 
          onChange={e => setNewPassword(e.target.value)} 
          required 
        />
        <Input 
          label="Confirm New Password" 
          type="password" 
          placeholder="••••••••"
          value={confirmPassword} 
          onChange={e => setConfirmPassword(e.target.value)}
          error={confirmPassword && newPassword !== confirmPassword ? "Passwords don't match" : ""}
          required 
        />

        <Button 
          type="submit" 
          isLoading={isLoading} 
          disabled={!token || !newPassword || !confirmPassword || newPassword !== confirmPassword} 
          className="mt-4"
        >
          Reset Password
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-600">
        <button type="button" onClick={() => setView('login')} className="text-blue-600 font-semibold hover:underline">
          Back to login
        </button>
      </p>
    </div>
  );
};

export default ResetPasswordForm;
