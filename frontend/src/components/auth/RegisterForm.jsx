import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';

const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
      <h3 className="text-lg font-bold text-slate-800">Register</h3>
      <Input label="Name" type="text" value={name} onChange={e => setName(e.target.value)} />
      <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
      <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <Input label="Confirm Password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
      <Button type="submit">Register</Button>
    </form>
  );
};

export default RegisterForm;
