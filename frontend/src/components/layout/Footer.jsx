import React from 'react';

const Footer = () => {
  return (
    <footer className="p-4 text-center text-slate-500 text-sm mt-auto">
      &copy; {new Date().getFullYear()} Hotel Booking. All rights reserved.
    </footer>
  );
};

export default Footer;
