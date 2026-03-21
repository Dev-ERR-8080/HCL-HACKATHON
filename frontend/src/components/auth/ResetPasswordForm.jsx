import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';

const ResetPasswordForm = () => {
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
      <h3 className="text-lg font-bold text-slate-800">Reset Password</h3>
      <Input label="Token" type="text" value={token} onChange={e => setToken(e.target.value)} />
      <Input label="New Password" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
      <Input label="Confirm Password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
      <Button type="submit">Reset Password</Button>
    </form>
  );
};

export default ResetPasswordForm;
