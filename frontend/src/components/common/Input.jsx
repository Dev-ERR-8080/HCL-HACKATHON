import React from 'react';

const Input = ({ label, type = "text", value, onChange }) => {
  return (
    <div className="flex flex-col mb-4">
      {label && <label className="mb-1 text-sm font-medium text-slate-700">{label}</label>}
      <input 
        type={type} 
        value={value} 
        onChange={onChange} 
        className="border border-slate-300 rounded-xl p-2 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
      />
    </div>
  );
};

export default Input;
