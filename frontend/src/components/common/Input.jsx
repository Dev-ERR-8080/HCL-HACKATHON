import React from 'react';

const Input = ({ label, type = "text", value, onChange, error, placeholder, required = false }) => {
  return (
    <div className="flex flex-col mb-4">
      {label && (
        <label className="mb-1 text-sm font-medium text-slate-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input 
        type={type} 
        value={value} 
        onChange={onChange} 
        placeholder={placeholder}
        className={`border rounded-xl p-3 outline-none transition-all duration-200 
          ${error 
            ? 'border-red-500 focus:ring-1 focus:ring-red-500 bg-red-50' 
            : 'border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-white'
          }
        `}
      />
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
};

export default Input;
