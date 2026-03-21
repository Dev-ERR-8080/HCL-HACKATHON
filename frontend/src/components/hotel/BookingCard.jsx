import React from 'react';

const BookingCard = ({ price, rating, onBook }) => {
  return (
    <div className="sticky top-24 bg-white p-6 rounded-xl shadow-md border border-slate-100 font-poppins">
      <div className="flex justify-between items-end mb-6">
        <div>
          <span className="text-3xl font-bold text-text">₹{price}</span>
          <span className="text-slate-500 font-medium"> / night</span>
        </div>
        <div className="flex items-center gap-1 text-sm font-bold text-slate-700">
          <svg className="w-4 h-4 text-accent fill-current" viewBox="0 0 20 20">
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
          {rating}
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="grid grid-cols-2 border border-slate-200 rounded-xl overflow-hidden">
          <div className="p-3 border-r border-slate-200">
            <label className="block text-[10px] font-bold uppercase text-slate-400">Check-in</label>
            <input type="date" disabled className="bg-transparent text-sm w-full focus:outline-none" defaultValue="2026-04-15" />
          </div>
          <div className="p-3">
            <label className="block text-[10px] font-bold uppercase text-slate-400">Check-out</label>
            <input type="date" disabled className="bg-transparent text-sm w-full focus:outline-none" defaultValue="2026-04-18" />
          </div>
        </div>
        <div className="border border-slate-200 rounded-xl p-3">
          <label className="block text-[10px] font-bold uppercase text-slate-400">Guests</label>
          <select disabled className="bg-transparent text-sm w-full focus:outline-none appearance-none">
            <option>2 adults, 1 child</option>
          </select>
        </div>
      </div>

      <button 
        className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg shadow-md hover:bg-blue-700 transition-all active:scale-95 mb-4"
        onClick={onBook}
      >
        Book Now
      </button>

      <p className="text-center text-xs text-slate-400">You won't be charged yet</p>
      
      <div className="mt-6 space-y-3 border-t border-slate-50 pt-6">
        <div className="flex justify-between text-slate-600 underline">
          <span>₹{price} x 3 nights</span>
          <span>₹{price * 3}</span>
        </div>
        <div className="flex justify-between text-slate-600 underline">
          <span>Cleaning fee</span>
          <span>₹500</span>
        </div>
        <div className="flex justify-between text-slate-600 underline">
          <span>Common service fee</span>
          <span>₹250</span>
        </div>
        <div className="flex justify-between font-bold text-lg text-text border-t border-slate-100 pt-4 mt-2">
          <span>Total</span>
          <span>₹{price * 3 + 750}</span>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
