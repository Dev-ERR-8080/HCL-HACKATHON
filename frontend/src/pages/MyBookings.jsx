import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';
import { getMyBookings, cancelBooking, getHotelDetails } from '../services/api';

const MyBookings = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('CONFIRMED');
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) return;
    const load = async () => {
      try {
        setIsLoading(true);
        const data = await getMyBookings();
        setBookings(data);
      } catch (err) {
        setError(err.message || "Failed to load bookings");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
        <div className="min-h-screen flex flex-col bg-background font-poppins">
          <Navbar />
          <main className="flex-grow flex items-center justify-center p-6 text-center">
            <div className="bg-white p-10 rounded-xl shadow-md border border-slate-100 max-w-md w-full">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Not Logged In</h2>
              <p className="text-slate-500 mb-6">Please log in to view your bookings.</p>
              <button onClick={() => navigate('/')} className="bg-primary text-white w-full py-3 rounded-xl font-bold hover:bg-blue-700 transition">
                Go to Home
              </button>
            </div>
          </main>
          <Footer />
        </div>
    );
  }

  const filteredBookings = bookings.filter(b => b.status === activeTab);

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await cancelBooking(bookingId);
      setBookings(prev => prev.map(b =>
          b.bookingId === bookingId ? { ...b, status: 'CANCELLED' } : b
      ));
    } catch (err) {
      alert(err.message || "Failed to cancel booking");
    }
  };

  // ✅ ADDED: Rebook navigates to HotelDetails with pre-filled dates
  const handleRebook = async (booking) => {
    try {
      const hotel = await getHotelDetails(booking.hotelId);
      const normalised = {
        hotelId: hotel.hotelId, id: hotel.hotelId,
        name: hotel.name, city: hotel.city, location: hotel.city,
        rating: hotel.rating ?? 0, description: hotel.description ?? '',
        amenities: hotel.amenities ?? [], roomTypes: hotel.roomTypes ?? [],
        price: hotel.roomTypes?.[0]?.rooms?.[0]?.pricePerNight ?? 0,
        roomId: hotel.roomTypes?.[0]?.rooms?.[0]?.roomId,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
      };
      // Pre-fill with original booking dates
      navigate('/checkout', { state: { hotel: normalised, checkIn: booking.checkIn, checkOut: booking.checkOut } });
    } catch (err) {
      alert("Could not load hotel details. Please try again.");
    }
  };

  const getStatusBadge = (status) => {
    const styles = { CONFIRMED: "bg-blue-100 text-blue-700", COMPLETED: "bg-green-100 text-green-700", CANCELLED: "bg-red-100 text-red-700" };
    return <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide ${styles[status] || 'bg-slate-100 text-slate-600'}`}>{status}</span>;
  };

  return (
      <div className="min-h-screen flex flex-col bg-background font-poppins">
        <Navbar />
        <main className="flex-grow max-w-4xl mx-auto w-full px-4 sm:px-6 py-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-8">My Bookings</h1>

          <div className="flex items-center gap-6 border-b border-slate-200 mb-6">
            {['CONFIRMED', 'COMPLETED', 'CANCELLED'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                        className={`pb-3 text-sm font-semibold capitalize transition-colors ${activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-800'}`}>
                  {tab.charAt(0) + tab.slice(1).toLowerCase()}
                </button>
            ))}
          </div>

          {isLoading ? (
              <div className="text-center py-12 text-slate-400">Loading bookings...</div>
          ) : error ? (
              <div className="text-center py-12 text-red-500">{error}</div>
          ) : (
              <div className="flex flex-col gap-4">
                {filteredBookings.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 text-center">
                      <h3 className="text-lg font-bold text-slate-800 mb-1">No bookings found</h3>
                      <p className="text-slate-500 text-sm mb-4">You have no {activeTab.toLowerCase()} bookings.</p>
                      {activeTab === 'CANCELLED' && (
                          <button onClick={() => navigate('/hotels')}
                                  className="bg-primary text-white px-6 py-2 rounded-xl font-medium hover:bg-blue-700 transition">
                            Browse Hotels
                          </button>
                      )}
                    </div>
                ) : (
                    filteredBookings.map(booking => (
                        <div key={booking.bookingId} className="bg-white rounded-xl shadow-md border border-slate-100 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-lg transition-shadow">
                          <div>
                            <h3 className="text-lg font-bold text-slate-900 mb-1">Booking #{booking.bookingId}</h3>
                            <p className="text-sm text-slate-500 mb-2">Hotel ID: {booking.hotelId} · Room: {booking.roomId}</p>
                            <div className="flex items-center gap-3 text-sm font-medium text-slate-700 bg-slate-50 px-3 py-2 rounded-lg inline-flex">
                              <span><span className="text-slate-400">In:</span> {booking.checkIn}</span>
                              <span className="text-slate-300">|</span>
                              <span><span className="text-slate-400">Out:</span> {booking.checkOut}</span>
                            </div>
                            {booking.couponCode && (
                                <p className="text-xs text-green-600 mt-1">Coupon applied: {booking.couponCode}</p>
                            )}
                            {booking.discountAmount > 0 && (
                                <p className="text-xs text-green-600">Saved: ₹{booking.discountAmount?.toLocaleString()}</p>
                            )}
                          </div>
                          <div className="flex flex-col items-start sm:items-end gap-2">
                            {booking.discountAmount > 0 && (
                                <span className="text-sm text-slate-400 line-through">₹{booking.baseAmount?.toLocaleString()}</span>
                            )}
                            <div className="text-2xl font-bold text-slate-800">₹{booking.finalAmount?.toLocaleString()}</div>
                            {getStatusBadge(booking.status)}
                            {booking.status === 'CONFIRMED' && (
                                <button onClick={() => handleCancel(booking.bookingId)}
                                        className="text-xs text-red-500 hover:text-red-700 font-medium underline">
                                  Cancel Booking
                                </button>
                            )}
                            {/* ✅ ADDED: Rebook button for cancelled bookings */}
                            {booking.status === 'CANCELLED' && (
                                <button onClick={() => handleRebook(booking)}
                                        className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-blue-700 transition">
                                  🔁 Rebook
                                </button>
                            )}
                          </div>
                        </div>
                    ))
                )}
              </div>
          )}
        </main>
        <Footer />
      </div>
  );
};

export default MyBookings;