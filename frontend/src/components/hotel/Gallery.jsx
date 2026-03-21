import React from 'react';

const Gallery = ({ images }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div className="md:col-span-3 rounded-2xl overflow-hidden shadow-md h-[400px] md:h-[500px]">
        <img 
          src={images[0]} 
          alt="Main Hotel" 
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
        />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
        {images.slice(1, 5).map((img, idx) => (
          <div key={idx} className="rounded-2xl overflow-hidden shadow-sm h-[130px] md:h-[155px]">
            <img 
              src={img} 
              alt={`Hotel Thumbnail ${idx + 1}`} 
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-500 cursor-pointer"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
