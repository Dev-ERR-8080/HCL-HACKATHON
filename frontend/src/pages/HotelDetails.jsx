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
  
  // Use data from navigation state or fallback to a default mock for testing
  const hotelMock = {
    name: "The Grand Heritage Resort",
    rating: 4.8,
    location: "Udaipur, Rajasthan, India",
    price: 8500,
    description: "Experience royal luxury at The Grand Heritage Resort, overlooking the serene Lake Pichola. Our resort offers a perfect blend of traditional Rajput architecture and modern comforts. Enjoy spacious suites, a world-class spa, and fine dining at our rooftop restaurant. Whether you are here for a romantic getaway or a family vacation, we ensure an unforgettable experience of Rajasthani hospitality.",
    images: [
      "/images/hotel/main.png",
      "/images/hotel/room.png",
      "/images/hotel/bathroom.png",
      "/images/hotel/dining.png",
      "/images/hotel/spa.png"
    ],
    amenities: [
      { label: "Free WiFi", icon: "📶" },
      { label: "AC Room", icon: "❄️" },
      { label: "Parking", icon: "🅿️" },
      { label: "Swimming Pool", icon: "🏊" },
      { label: "Rooftop Dining", icon: "🍽️" },
      { label: "Full Spa", icon: "💆" }
    ]
  };

  const hotel = location.state?.hotel || hotelMock;

  return (
    <div className="min-h-screen flex flex-col bg-background font-poppins">
      <Navbar />
      
      <main className="max-w-7xl mx-auto p-6 md:p-8 flex-grow w-full">
        {/* Gallery Section */}
        <Gallery images={hotel.images || hotelMock.images} />

        {/* Content Section: Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
          {/* Left Column: Info & Amenities */}
          <div className="lg:col-span-2">
            <HotelInfo 
              name={hotel.name}
              rating={hotel.rating}
              location={hotel.location}
              description={hotel.description}
              amenities={hotel.amenities || hotelMock.amenities}
            />
          </div>

          {/* Right Column: Sticky Booking Card */}
          <div className="lg:col-span-1">
            <BookingCard 
              price={hotel.price}
              rating={hotel.rating}
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
