import React from 'react';
import Button from '../common/Button';

const HotelCard = ({ hotel }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col md:flex-row group">
      {/* LEFT: Image */}
      <div className="md:w-1/3 relative overflow-hidden">
        <img 
          src={hotel.image} 
          alt={hotel.name} 
          className="w-full h-48 md:h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'; }}
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
            <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
            {hotel.rating}
          </span>
        </div>
      </div>

      {/* CENTER: Details */}
      <div className="p-6 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{hotel.name}</h3>
          <p className="text-blue-600 font-medium text-sm mt-1 mb-3 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            {hotel.location}
          </p>
          <p className="text-slate-600 text-sm line-clamp-2 md:line-clamp-3 leading-relaxed">
            {hotel.description}
          </p>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2">
          {hotel.amenities.map(amenity => (
            <span key={amenity} className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-medium">
              {amenity}
            </span>
          ))}
        </div>
      </div>

      {/* RIGHT: Pricing & Action */}
      <div className="p-6 md:border-l border-slate-100 bg-slate-50/50 flex flex-col justify-between md:min-w-[200px] shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1 justify-end md:justify-start">
            {hotel.oldPrice && <span className="text-slate-400 line-through text-sm">₹{hotel.oldPrice}</span>}
          </div>
          <div className="flex items-baseline gap-1 justify-end md:justify-start">
            <span className="text-2xl font-bold text-slate-800">₹{hotel.price}</span>
            <span className="text-slate-500 text-sm">/ night</span>
          </div>
          <p className="text-xs text-slate-500 mt-1 text-right md:text-left">+ Taxes & fees</p>
        </div>
        
        <Button className="mt-6 w-full py-3 shadow-md hover:-translate-y-0.5 transition-transform" onClick={() => console.log('Book', hotel.id)}>
          Book Now
        </Button>
      </div>
    </div>
  );
};

export default HotelCard;
