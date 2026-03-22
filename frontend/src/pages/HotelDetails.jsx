import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Gallery from '../components/hotel/Gallery';
import HotelInfo from '../components/hotel/HotelInfo';
import BookingCard from '../components/hotel/BookingCard';
import SimilarStays from '../components/hotel/SimilarStays';
import { getHotelDetails } from '../services/api';

const HotelDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ hotel passed via router state (from HotelCard click) for instant display
  //    while the full details load from the backend
  const { hotel: stateHotel, checkIn, checkOut, guests } = location.state || {};

  const [hotel, setHotel] = useState(stateHotel || null);
  const [isLoading, setIsLoading] = useState(!stateHotel);
  const [error, setError] = useState('');

  useEffect(() => {
    // ✅ Fetch full hotel details from backend using the hotelId
    //    This replaces any incomplete mock/state data with real DB data
    const hotelId = stateHotel?.hotelId || stateHotel?.id;
    if (!hotelId) return;

    const load = async () => {
      try {
        setIsLoading(true);
        const data = await getHotelDetails(hotelId);
        // ✅ Normalise backend HotelDetailsResponse to the shape our components expect
        setHotel({
          hotelId: data.hotelId,
          id: data.hotelId,
          name: data.name,
          city: data.city,
          location: data.city,
          rating: data.rating ?? 0,
          description: data.description ?? '',
          amenities: data.amenities ?? [],
          roomTypes: data.roomTypes ?? [],
          // Use first available room's price for the BookingCard
          price: data.roomTypes?.[0]?.rooms?.[0]?.pricePerNight ?? stateHotel?.price ?? 0,
          // Use first available room's roomId for booking
          roomId: data.roomTypes?.[0]?.rooms?.[0]?.roomId ?? stateHotel?.id,
          image: stateHotel?.image ?? 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
        });
      } catch (err) {
        setError(err.message || 'Failed to load hotel details');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [stateHotel?.hotelId, stateHotel?.id]);

  const handleBookNow = () => {
    navigate('/checkout', { state: { hotel, checkIn, checkOut, guests } });
  };

  if (isLoading) {
    return (
        <div className="min-h-screen flex flex-col bg-background font-poppins">
          <Navbar />
          <main className="max-w-7xl mx-auto p-6 md:p-8 flex-grow w-full mt-4">
            <div className="h-96 bg-slate-100 rounded-2xl animate-pulse mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-8 bg-slate-100 rounded animate-pulse w-2/3" />
                <div className="h-4 bg-slate-100 rounded animate-pulse w-1/3" />
                <div className="h-24 bg-slate-100 rounded animate-pulse" />
              </div>
              <div className="h-64 bg-slate-100 rounded-xl animate-pulse" />
            </div>
          </main>
          <Footer />
        </div>
    );
  }

  if (error || !hotel) {
    return (
        <div className="min-h-screen flex flex-col bg-background font-poppins">
          <Navbar />
          <main className="flex-grow flex items-center justify-center p-6 text-center">
            <div className="bg-white p-10 rounded-xl shadow-md border border-slate-100 max-w-md w-full">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Hotel not found</h2>
              <p className="text-slate-500 mb-6">{error || 'Could not load hotel details.'}</p>
              <button onClick={() => navigate('/hotels')} className="bg-primary text-white w-full py-3 rounded-xl font-bold hover:bg-blue-700 transition">
                Browse Hotels
              </button>
            </div>
          </main>
          <Footer />
        </div>
    );
  }

  return (
      <div className="min-h-screen flex flex-col bg-background font-poppins text-text">
        <Navbar />

        <main className="max-w-7xl mx-auto p-6 md:p-8 flex-grow w-full mt-4">
          {/* Gallery */}
          <div className="mb-10">
            <Gallery images={[
              hotel.image,
              'https://images.unsplash.com/photo-1582719478250-c89cae4df85b?auto=format&fit=crop&w=400&q=80',
              'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=400&q=80',
              'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=400&q=80',
              'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=400&q=80',
            ].filter(Boolean)} />
          </div>

          {/* Info + Booking Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 mb-16 items-start">
            <div className="lg:col-span-2 text-left">
              <HotelInfo
                  name={hotel.name}
                  rating={hotel.rating}
                  location={hotel.location}
                  description={hotel.description}
                  amenities={hotel.amenities.map(a => typeof a === 'string' ? { label: a, icon: '✨' } : a)}
              />

              {/* ✅ Room Types from real backend data */}
              {hotel.roomTypes?.length > 0 && (
                  <div className="mt-8 border-t border-slate-100 pt-6">
                    <h2 className="text-xl font-bold mb-4 text-slate-800">Available Room Types</h2>
                    <div className="flex flex-col gap-4">
                      {hotel.roomTypes.map(rt => (
                          <div key={rt.roomTypeId} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="font-bold text-slate-800">{rt.typeName}</h3>
                                <p className="text-sm text-slate-500">Max occupancy: {rt.maxOccupancy}</p>
                              </div>
                              <span className="text-sm font-bold text-blue-600">
                          ₹{rt.rooms?.[0]?.pricePerNight ?? '—'} / night
                        </span>
                            </div>
                            <p className="text-xs text-slate-400">{rt.rooms?.length ?? 0} room(s) available</p>
                          </div>
                      ))}
                    </div>
                  </div>
              )}
            </div>

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

          <div className="border-t border-slate-100 pt-16">
            <SimilarStays />
          </div>
        </main>

        <Footer />
      </div>
  );
};

export default HotelDetails;