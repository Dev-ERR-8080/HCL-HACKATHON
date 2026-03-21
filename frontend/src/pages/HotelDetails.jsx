import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
<<<<<<< HEAD
import Button from '../components/common/Button';
import HotelCard from '../components/hotel/HotelCard';
import { mockHotels } from '../data/mockHotels';

const HotelDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { hotel, checkIn, checkOut, guests } = location.state || {};

  if (!hotel) {
    return (
      <div className="min-h-screen flex flex-col bg-background font-poppins">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-6">
          <div className="bg-white p-10 rounded-xl shadow-md text-center max-w-md w-full border border-slate-100">
            <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Hotel not found</h2>
            <p className="text-slate-500 mb-6">Looks like the hotel details you are looking for are unavailable or invalid.</p>
            <Button onClick={() => navigate('/hotels')} className="w-full">Back to Hotels</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Similar stays excluding the current hotel
  const similarStays = mockHotels.filter(h => h.id !== hotel.id).slice(0, 3);
=======
import Gallery from '../components/hotel/Gallery';
import HotelInfo from '../components/hotel/HotelInfo';
import BookingCard from '../components/hotel/BookingCard';
import SimilarStays from '../components/hotel/SimilarStays';

const HotelDetails = () => {
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
>>>>>>> c160f4e (feat: Implement hotel details page with gallery, info, and booking card components, and enhance the booking confirmation UI.)

  return (
    <div className="min-h-screen flex flex-col bg-background font-poppins">
      <Navbar />
      
<<<<<<< HEAD
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        {/* HEADER SECTION */}
        <div className="mb-6 flex flex-col md:flex-row justify-between md:items-end gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2 tracking-tight">{hotel.name}</h1>
            <div className="flex items-center gap-4 text-sm font-medium">
              <span className="flex items-center gap-1 text-accent bg-accent/10 px-2 py-1 rounded-md">
                <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                {hotel.rating} Rating
              </span>
              <span className="text-blue-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                {hotel.location}
              </span>
            </div>
          </div>
        </div>

        {/* IMAGE GALLERY */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 h-[400px] md:h-[500px]">
          <div className="md:col-span-3 h-full">
            <img src={hotel.image} alt="Main view" className="w-full h-full object-cover rounded-xl shadow-sm" onError={(e) => { e.target.src = 'https://via.placeholder.com/800x500?text=No+Image'; }} />
          </div>
          <div className="hidden md:flex flex-col gap-4 h-full">
            <img src={hotel.image} alt="Room view 1" className="w-full h-1/3 object-cover rounded-xl shadow-sm opacity-90 hover:opacity-100 transition-opacity cursor-pointer" />
            <img src={hotel.image} alt="Room view 2" className="w-full h-1/3 object-cover rounded-xl shadow-sm opacity-90 hover:opacity-100 transition-opacity cursor-pointer" />
            <img src={hotel.image} alt="Room view 3" className="w-full h-1/3 object-cover rounded-xl shadow-sm opacity-90 hover:opacity-100 transition-opacity cursor-pointer" />
          </div>
        </div>

        {/* MAIN CONTENT SPLIT */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT: HOTEL INFO */}
          <div className="lg:w-[70%] flex flex-col gap-8">
            <section className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-4 border-b border-slate-50 pb-2">About this hotel</h3>
              <p className="text-slate-600 leading-relaxed">
                {hotel.description}
                <br /><br />
                Whether you're traveling for business or leisure, {hotel.name} provides comfort, world-class amenities, and close neighborhood access to the top city attractions in {hotel.location}. Enjoy modern aesthetics alongside pristine hospitality services dedicated specifically inside our premium property lines designed just for your needs.
              </p>
            </section>

            <section className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-4 border-b border-slate-50 pb-2">Top Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {hotel.amenities.map(amenity => (
                  <div key={amenity} className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl text-center shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] border border-slate-100 hover:-translate-y-1 transition-transform">
                    <span className="text-blue-600 mb-2">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7"></path></svg>
                    </span>
                    <span className="text-sm font-medium text-slate-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* RIGHT: BOOKING CARD */}
          <div className="lg:w-[30%]">
            <div className="bg-white rounded-xl shadow-md border border-slate-100 p-6 sticky top-24">
              <div className="flex items-end gap-1 mb-2">
                <span className="text-3xl font-bold text-slate-900">₹{hotel.price}</span>
                <span className="text-slate-500 font-medium pb-1">/ night</span>
              </div>
              
              <div className="flex items-center gap-2 mb-6 text-sm">
                <span className="bg-accent/10 text-accent font-bold px-2 py-0.5 rounded flex items-center gap-1">
                  <svg className="w-3 h-3 fill-currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  {hotel.rating}
                </span>
                <span className="text-slate-500 underline cursor-pointer">Excellent reviews</span>
              </div>

              <hr className="border-slate-100 mb-6" />

              <Button 
                onClick={() => navigate("/checkout", { state: { hotel, checkIn, checkOut, guests } })} 
                className="w-full py-4 text-lg font-bold shadow-md hover:-translate-y-0.5 transition-transform"
              >
                Book Now
              </Button>
              <p className="text-xs text-slate-400 text-center mt-4">You won't be charged yet</p>
            </div>
          </div>

        </div>

        {/* SIMILAR STAYS SECTION */}
        <section className="mt-16 pt-8 border-t border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Similar Stays</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {similarStays.map(similarHotel => (
              <div key={similarHotel.id}>
                <HotelCard hotel={similarHotel} compact={true} />
              </div>
            ))}
          </div>
        </section>

=======
      <main className="max-w-7xl mx-auto p-6 md:p-8 flex-grow w-full">
        {/* Gallery Section */}
        <Gallery images={hotelMock.images} />

        {/* Content Section: Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
          {/* Left Column: Info & Amenities */}
          <div className="lg:col-span-2">
            <HotelInfo 
              name={hotelMock.name}
              rating={hotelMock.rating}
              location={hotelMock.location}
              description={hotelMock.description}
              amenities={hotelMock.amenities}
            />
          </div>

          {/* Right Column: Sticky Booking Card */}
          <div className="lg:col-span-1">
            <BookingCard 
              price={hotelMock.price}
              rating={hotelMock.rating}
            />
          </div>
        </div>

        {/* Similar Stays Section */}
        <SimilarStays />
>>>>>>> c160f4e (feat: Implement hotel details page with gallery, info, and booking card components, and enhance the booking confirmation UI.)
      </main>

      <Footer />
    </div>
  );
};

export default HotelDetails;
