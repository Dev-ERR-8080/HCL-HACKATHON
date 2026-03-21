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
    <div className="min-h-screen flex flex-col bg-background font-poppins text-text selection:bg-primary/10">
      <Navbar />
      
      <main className="max-w-7xl mx-auto p-6 md:p-8 flex-grow w-full mt-4">
        {/* Gallery Section */}
        <div className="mb-10">
          <Gallery images={hotel.images || [
            hotel.image, 
            "https://images.unsplash.com/photo-1582719478250-c89cae4df85b?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=400&q=80"
          ].filter(Boolean)} />
        </div>

        {/* Content Section: Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 mb-16 items-start">
          {/* Left Column: Info & Amenities */}
          <div className="lg:col-span-2 text-left">
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
            <div className="sticky top-28">
              <BookingCard 
                price={hotel.price}
                rating={hotel.rating}
                onBook={handleBookNow}
              />
            </div>
          </div>
        </div>

        {/* Similar Stays Section */}
        <div className="border-t border-slate-100 pt-16">
          <SimilarStays />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HotelDetails;
