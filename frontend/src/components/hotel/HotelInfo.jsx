import React from 'react';

const HotelInfo = ({ name, rating, location, description, amenities }) => {
  return (
    <div className="space-y-6 font-poppins">
      <div>
        <h1 className="text-4xl font-bold text-text mb-2">{name}</h1>
        <div className="flex items-center gap-2">
          <div className="flex text-accent">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className={`w-5 h-5 ${i < Math.floor(rating) ? 'fill-current' : 'text-slate-300'}`} viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
            ))}
          </div>
          <span className="text-sm font-semibold text-slate-600">{rating} (250 Reviews)</span>
          <span className="text-slate-400">•</span>
          <span className="text-sm text-slate-500">{location}</span>
        </div>
      </div>

      <div className="border-t border-slate-100 pt-6">
        <h2 className="text-xl font-bold mb-3 text-secondary">Description</h2>
        <p className="text-slate-600 leading-relaxed max-w-3xl">
          {description}
        </p>
      </div>

      <div className="border-t border-slate-100 pt-6">
        <h2 className="text-xl font-bold mb-4 text-secondary">What this place offers</h2>
        <div className="grid grid-cols-2 gap-4">
          {amenities.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 text-slate-600">
              <span className="p-2 bg-slate-50 rounded-lg text-primary">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HotelInfo;
