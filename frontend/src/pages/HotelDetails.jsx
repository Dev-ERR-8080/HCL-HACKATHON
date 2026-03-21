import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Gallery from '../components/hotel/Gallery';
import HotelInfo from '../components/hotel/HotelInfo';
import BookingCard from '../components/hotel/BookingCard';
import SimilarStays from '../components/hotel/SimilarStays';
import { mockHotels } from '../data/mockHotels';

const HotelDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { hotel, checkIn, checkOut, guests } = location.state || {};

  if (!hotel) {
    return <div className="p-6">Hotel not found</div>;
  }

  const handleBookNow = () => {
    navigate("/checkout", {
      state: { hotel, checkIn, checkOut, guests }
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-poppins">
      <Navbar />
      
      <main className="max-w-7xl mx-auto p-6 md:p-8 flex-grow w-full">
        {/* Gallery Section */}
        <Gallery images={hotel.images || [hotel.image, hotel.image, hotel.image, hotel.image, hotel.image].filter(Boolean)} />

        {/* Content Section: Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
          {/* Left Column: Info & Amenities */}
          <div className="lg:col-span-2">
            <HotelInfo 
              name={hotel.name}
              rating={hotel.rating}
              location={hotel.location}
              description={hotel.description}
              amenities={hotel.amenities ? hotel.amenities.map(a => typeof a === 'string' ? { label: a, icon: "✨" } : a) : []}
            />
          </div>

          {/* Right Column: Sticky Booking Card */}
          <div className="lg:col-span-1">
            <BookingCard 
              price={hotel.price}
              rating={hotel.rating}
              onBook={handleBookNow}
            />
          </div>
        </div>

        {/* Similar Stays Section */}
        <SimilarStays />
      </main>

      <Footer />
    </div>
  );
};

export default HotelDetails;
