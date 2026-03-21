import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="relative py-16 px-6 lg:py-24 bg-background font-poppins">
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h1 className="text-4xl lg:text-6xl font-bold text-text mb-4">
          Find your perfect stay
        </h1>
        <p className="text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto">
          Search hotels, compare prices, and book easily
        </p>
      </div>

      {/* Search Bar Container */}
      <div className="max-w-6xl mx-auto bg-white p-2 lg:p-4 rounded-3xl shadow-xl border border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-2 items-end">

          <div className="p-3 lg:col-span-2">
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1 ml-1">City</label>
            <input
              type="text"
              placeholder="Mumbai, Delhi, Bengaluru..."
              className={`w-full px-4 py-3 bg-slate-50 rounded-xl focus:ring-2 focus:ring-primary outline-none text-text ${errors.city ? 'border border-red-500' : 'border-none'}`}
            />
            {errors.city && <div className="text-red-500 text-sm mt-1 ml-1">{errors.city}</div>}
          </div>

          <div className="p-3">
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1 ml-1">Check-in</label>
            <input
              type="date"
              className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-primary outline-none text-text"
            />
            {errors.checkIn && <div className="text-red-500 text-sm mt-1 ml-1">{errors.checkIn}</div>}
          </div>

          <div className="p-3">
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1 ml-1">Check-out</label>
            <input
              type="date"
              className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-primary outline-none text-text"
            />
            {errors.checkOut && <div className="text-red-500 text-sm mt-1 ml-1">{errors.checkOut}</div>}
          </div>

          <div className="p-3">
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1 ml-1">Guests</label>
            <select
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-primary outline-none text-text appearance-none"
            >
              <option value="1 Room, 2 Guests">1 Room, 2 Guests</option>
              <option value="1 Room, 1 Guest">1 Room, 1 Guest</option>
              <option value="2 Rooms, 4 Guests">2 Rooms, 4 Guests</option>
            </select>
          </div>

          <div className="p-3 flex items-center lg:items-end">
            <button
              onClick={handleSearch}
              className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-md hover:bg-blue-700 transition-all active:scale-95 text-lg"
            >
              Search
            </button>
          </div>

        </div>

        {/* Additional Filters (Price Range) */}
        <div className="px-5 pb-3 flex items-center gap-4 border-t border-slate-50 mt-2 pt-3">
          <span className="text-xs font-semibold text-slate-400 uppercase">Filters:</span>
          <select className="bg-transparent text-sm font-medium text-slate-600 focus:outline-none">
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>₹0 - ₹2,000</option>
            <option>₹2,000 - ₹5,000</option>
            <option>₹5,000+</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Hero;
