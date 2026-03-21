import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
      <h3 className="text-lg font-bold text-slate-800">Forgot Password</h3>
      <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
      <Button type="submit">Submit</Button>
    </form>
  );
};

export default ForgotPasswordForm;
