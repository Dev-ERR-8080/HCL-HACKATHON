import React from 'react';
import Button from '../common/Button';

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center p-4 shadow-md bg-white">
      <div className="text-xl font-bold text-blue-600">Logo</div>
      <Button onClick={() => console.log('Sign in clicked')}>Sign In</Button>
    </nav>
  );
};

export default Navbar;
