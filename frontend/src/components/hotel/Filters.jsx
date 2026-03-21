import React, { useState } from 'react';

const Filters = ({
  searchQuery,
  setSearchQuery,
  selectedRatings,
  setSelectedRatings,
  selectedPriceRange,
  setSelectedPriceRange,
  selectedAmenities,
  setSelectedAmenities,
  isMobileOpen,
  setIsMobileOpen
}) => {

  const handleRatingToggle = (val) => {
    setSelectedRatings(prev => 
      prev.includes(val) ? prev.filter(r => r !== val) : [...prev, val]
    );
  };

  const handlePriceToggle = (val) => {
    setSelectedPriceRange(prev => 
      prev.includes(val) ? prev.filter(p => p !== val) : [...prev, val]
    );
  };

  const handleAmenityToggle = (val) => {
    setSelectedAmenities(prev => 
      prev.includes(val) ? prev.filter(a => a !== val) : [...prev, val]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedRatings([]);
    setSelectedPriceRange([]);
    setSelectedAmenities([]);
  };

  return (
    <div className={`bg-white rounded-xl shadow-md p-6 border border-slate-100 ${!isMobileOpen ? 'hidden md:block' : 'block'}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Filters</h2>
        <button onClick={clearFilters} className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">Clear All</button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-slate-700 mb-2">Search</label>
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search location or hotel"
          className="w-full border border-slate-300 rounded-xl p-3 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm transition-all"
        />
      </div>

      <hr className="my-6 border-slate-100" />

      {/* Star Rating */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-slate-700 mb-3">Star Rating</label>
        <div className="flex flex-col gap-3">
          {[5, 4, 3].map(star => (
            <label key={star} className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={selectedRatings.includes(star)}
                onChange={() => handleRatingToggle(star)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
              />
              <span className="text-slate-600 text-sm group-hover:text-slate-900 transition-colors">{star} Star</span>
            </label>
          ))}
        </div>
      </div>

      <hr className="my-6 border-slate-100" />

      {/* Price Range */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-slate-700 mb-3">Price Range</label>
        <div className="flex flex-col gap-3">
          {[
            { label: "₹0 - ₹2500", val: "0-2500" },
            { label: "₹2500 - ₹6000", val: "2500-6000" },
            { label: "₹6000 - ₹9000", val: "6000-9000" }
          ].map(range => (
            <label key={range.val} className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={selectedPriceRange.includes(range.val)}
                onChange={() => handlePriceToggle(range.val)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
              />
              <span className="text-slate-600 text-sm group-hover:text-slate-900 transition-colors">{range.label}</span>
            </label>
          ))}
        </div>
      </div>

      <hr className="my-6 border-slate-100" />

      {/* Amenities */}
      <div className="mb-2">
        <label className="block text-sm font-semibold text-slate-700 mb-3">Amenities</label>
        <div className="flex flex-col gap-3">
          {["Free WiFi", "Pool", "AC", "Parking"].map(amenity => (
            <label key={amenity} className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={selectedAmenities.includes(amenity)}
                onChange={() => handleAmenityToggle(amenity)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
              />
              <span className="text-slate-600 text-sm group-hover:text-slate-900 transition-colors">{amenity}</span>
            </label>
          ))}
        </div>
      </div>
      
      {/* Mobile Close Button */}
      {isMobileOpen && (
        <button 
          onClick={() => setIsMobileOpen(false)}
          className="md:hidden mt-6 w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 active:bg-blue-800 transition-colors"
        >
          Apply Filters
        </button>
      )}
    </div>
  );
};

export default Filters;
