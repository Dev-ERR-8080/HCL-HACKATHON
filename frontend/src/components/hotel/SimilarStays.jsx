import React from 'react';

const HotelCard = ({ name, price, rating, image }) => (
  <div className="group cursor-pointer">
    <div className="relative aspect-square overflow-hidden rounded-2xl mb-3 shadow-sm group-hover:shadow-md transition-shadow">
      <img 
        src={image} 
        alt={name} 
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
      <button className="absolute top-3 right-3 p-2 bg-white/70 backdrop-blur-md rounded-full hover:bg-white transition-colors">
        <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>
    </div>
    <div className="flex justify-between items-start">
      <h3 className="font-bold text-text group-hover:text-primary transition-colors">{name}</h3>
      <div className="flex items-center gap-1 text-sm font-bold">
        <svg className="w-4 h-4 text-accent fill-current" viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
        {rating}
      </div>
    </div>
    <p className="text-sm text-slate-500">Luxury Stay</p>
    <p className="mt-1">
      <span className="font-bold">₹{price}</span>
      <span className="text-slate-500 text-sm"> / night</span>
    </p>
  </div>
);

const SimilarStays = () => {
  const stays = [
    { name: "Ocean Breeze Resort", price: 4500, rating: 4.8, image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=400&q=400" },
    { name: "Mountain High Inn", price: 3200, rating: 4.5, image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=400&q=400" },
    { name: "Urban Chic Boutique", price: 5800, rating: 4.9, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=400" },
    { name: "Desert Rose Oasis", price: 7200, rating: 4.7, image: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=400&q=400" }
  ];

  return (
    <div className="py-12 border-t border-slate-100 font-poppins">
      <h2 className="text-2xl font-bold text-secondary mb-8">Similar Stays</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {stays.map((stay, idx) => (
          <HotelCard key={idx} {...stay} />
        ))}
      </div>
    </div>
  );
};

export default SimilarStays;
