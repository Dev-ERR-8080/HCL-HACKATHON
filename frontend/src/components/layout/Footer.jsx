import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 py-12 px-6 font-poppins">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <div className="text-2xl font-bold text-primary mb-6">QuickInn</div>
        <div className="flex gap-8 mb-8">
          <button className="text-slate-500 hover:text-primary transition-colors font-medium">About</button>
          <button className="text-slate-500 hover:text-primary transition-colors font-medium">Contact</button>
          <button className="text-slate-500 hover:text-primary transition-colors font-medium">Terms</button>
          <button className="text-slate-500 hover:text-primary transition-colors font-medium">Privacy</button>
        </div>
        <div className="text-slate-400 text-sm">
          QuickInn © 2026. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
