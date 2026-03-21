import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
      <h3 className="text-lg font-bold text-slate-800">Login</h3>
      <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
      <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <Button type="submit">Login</Button>
    </form>
  );
};

export default LoginForm;
