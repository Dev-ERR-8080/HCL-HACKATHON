import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';

const ForgotPasswordForm = ({ setView }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email.");
      return;
    }
    setError('');
    setIsLoading(true);

    // Simulate OTP sent
    setTimeout(() => {
      setIsLoading(false);
      setView('reset');
    }, 1200);
  };

  return (
    <div className="flex flex-col animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Forgot Password</h2>
      <p className="text-slate-500 mb-6 text-sm">Enter the email associated with your account and we'll send an instruction to reset your password.</p>
      
      {error && <div className="p-3 mb-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">{error}</div>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-1">
        <Input 
          label="Email address" 
          type="email" 
          placeholder="name@example.com"
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          required 
        />

        <Button 
          type="submit" 
          isLoading={isLoading} 
          disabled={!email} 
          className="mt-4"
        >
          Send Instructions
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-600">
        Remember your password?{' '}
        <button type="button" onClick={() => setView('login')} className="text-blue-600 font-semibold hover:underline">
          Back to logic
        </button>
      </p>
    </div>
  );
};

export default ForgotPasswordForm;
