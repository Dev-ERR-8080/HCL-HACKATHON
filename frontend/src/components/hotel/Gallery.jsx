import React from 'react';

const Gallery = ({ images }) => {
  // Ensure we have at least 5 images for the grid, otherwise pad with the first one
  const displayImages = [...images];
  while (displayImages.length < 5) displayImages.push(images[0]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[400px] md:h-[500px]">
      {/* Main Large Image */}
      <div className="md:col-span-2 md:row-span-2 rounded-2xl overflow-hidden shadow-md group h-full">
        <img 
          src={displayImages[0]} 
          alt="Main Hotel" 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 cursor-pointer"
        />
      </div>

      {/* 4 Small Images in a 2x2 grid on the right side of the main one */}
      <div className="hidden md:grid grid-cols-2 grid-rows-2 col-span-2 gap-4 h-full">
        {displayImages.slice(1, 5).map((img, idx) => (
          <div key={idx} className="rounded-2xl overflow-hidden shadow-sm group h-full">
            <img 
              src={img} 
              alt={`Hotel Thumbnail ${idx + 1}`} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 cursor-pointer"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
