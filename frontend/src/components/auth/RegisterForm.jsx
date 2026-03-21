import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import { registerUser } from '../../services/api';

const RegisterForm = ({ setView }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      await registerUser({ name, email, password });
      setSuccess("Account created! Redirecting to login...");
      setTimeout(() => setView('login'), 1500);
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="flex flex-col animate-fade-in">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Create Account</h2>
        <p className="text-slate-500 mb-6 text-sm">Join us for the best QuickInn experience.</p>

        {error && <div className="p-3 mb-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">{error}</div>}
        {success && <div className="p-3 mb-4 bg-green-50 text-green-600 rounded-xl text-sm border border-green-100">{success}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-1">
          <Input
              label="Full Name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={e => setName(e.target.value)}
              required
          />
          <Input
              label="Email address"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
          />
          <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
          />
          <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              error={confirmPassword && password !== confirmPassword ? "Passwords don't match" : ""}
              required
          />

          <Button
              type="submit"
              isLoading={isLoading}
              disabled={!name || !email || !password || !confirmPassword || password !== confirmPassword}
              className="mt-4"
          >
            Create Account
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <button type="button" onClick={() => setView('login')} className="text-blue-600 font-semibold hover:underline">
            Sign In
          </button>
        </p>
      </div>
  );
};

export default RegisterForm;