import React from 'react';

const Button = ({ children, onClick, type = "button", variant = "primary", isLoading = false, disabled = false, className = "" }) => {
  const baseStyles = "rounded-xl px-4 py-3 font-medium transition-all duration-200 flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-md",
    secondary: "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 active:bg-slate-100",
  };

  // If disabled or loading, use disabled styling
  const isDisabled = disabled || isLoading;

  return (
    <button 
      type={type}
      onClick={onClick} 
      disabled={isDisabled}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {isLoading ? (
        <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
      ) : children}
    </button>
  );
};

export default Button;
