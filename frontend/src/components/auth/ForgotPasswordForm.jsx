import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import { forgotPassword, verifyOtp, resetPassword } from '../../services/api';

// Steps: 1 = enter email, 2 = enter OTP, 3 = enter new password, 4 = success
const ForgotPasswordForm = ({ setView }) => {
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // ── Step 1: Send OTP ──────────────────────────────────────
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) { setError("Please enter your email."); return; }
    setError('');
    setIsLoading(true);
    try {
      await forgotPassword(email);
      setStep(2);
    } catch (err) {
      setError(err.message || "Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Step 2: Verify OTP ────────────────────────────────────
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) { setError("Please enter the 6-digit OTP."); return; }
    setError('');
    setIsLoading(true);
    try {
      await verifyOtp(email, otp);
      setStep(3);
    } catch (err) {
      setError(err.message || "Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Step 3: Reset Password ────────────────────────────────
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) { setError("Please fill in all fields."); return; }
    if (newPassword !== confirmPassword) { setError("Passwords do not match."); return; }
    if (newPassword.length < 6) { setError("Password must be at least 6 characters."); return; }
    setError('');
    setIsLoading(true);
    try {
      await resetPassword({ email, otp, password: newPassword });
      setStep(4);
    } catch (err) {
      setError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Step indicator ────────────────────────────────────────
  const StepIndicator = () => (
      <div className="flex items-center justify-center gap-2 mb-6">
        {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
            ${step > s ? 'bg-green-500 text-white' : step === s ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
                {step > s ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                ) : s}
              </div>
              {s < 3 && <div className={`h-0.5 w-8 rounded transition-all ${step > s ? 'bg-green-500' : 'bg-slate-200'}`} />}
            </React.Fragment>
        ))}
      </div>
  );

  // ── Step 1 UI ─────────────────────────────────────────────
  if (step === 1) return (
      <div className="flex flex-col animate-fade-in">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Forgot Password</h2>
        <p className="text-slate-500 mb-4 text-sm">Enter your email and we'll send a 6-digit OTP to reset your password.</p>
        <StepIndicator />
        {error && <div className="p-3 mb-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">{error}</div>}
        <form onSubmit={handleSendOtp} className="flex flex-col gap-1">
          <Input
              label="Email address"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
          />
          <Button type="submit" isLoading={isLoading} disabled={!email} className="mt-4">
            Send OTP
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">
          Remember your password?{' '}
          <button type="button" onClick={() => setView('login')} className="text-blue-600 font-semibold hover:underline">
            Back to login
          </button>
        </p>
      </div>
  );

  // ── Step 2 UI ─────────────────────────────────────────────
  if (step === 2) return (
      <div className="flex flex-col animate-fade-in">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Enter OTP</h2>
        <p className="text-slate-500 mb-4 text-sm">
          We sent a 6-digit code to <span className="font-semibold text-slate-700">{email}</span>. It expires in 10 minutes.
        </p>
        <StepIndicator />
        {error && <div className="p-3 mb-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">{error}</div>}
        <form onSubmit={handleVerifyOtp} className="flex flex-col gap-1">
          <Input
              label="6-Digit OTP"
              type="text"
              placeholder="123456"
              value={otp}
              onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              required
          />
          <Button type="submit" isLoading={isLoading} disabled={otp.length !== 6} className="mt-4">
            Verify OTP
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-500">
          Didn't receive it?{' '}
          <button
              type="button"
              onClick={() => { setStep(1); setOtp(''); setError(''); }}
              className="text-blue-600 font-semibold hover:underline"
          >
            Resend OTP
          </button>
        </p>
      </div>
  );

  // ── Step 3 UI ─────────────────────────────────────────────
  if (step === 3) return (
      <div className="flex flex-col animate-fade-in">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">New Password</h2>
        <p className="text-slate-500 mb-4 text-sm">OTP verified! Enter your new password below.</p>
        <StepIndicator />
        {error && <div className="p-3 mb-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">{error}</div>}
        <form onSubmit={handleResetPassword} className="flex flex-col gap-1">
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
              disabled={!newPassword || !confirmPassword || newPassword !== confirmPassword}
              className="mt-4"
          >
            Reset Password
          </Button>
        </form>
      </div>
  );

  // ── Step 4: Success ───────────────────────────────────────
  if (step === 4) return (
      <div className="flex flex-col items-center animate-fade-in py-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Password Changed!</h2>
        <p className="text-slate-500 text-sm text-center mb-6">
          Your password has been reset successfully. You can now sign in with your new password.
        </p>
        <Button onClick={() => setView('login')} className="w-full">
          Back to Login
        </Button>
      </div>
  );
};

export default ForgotPasswordForm;