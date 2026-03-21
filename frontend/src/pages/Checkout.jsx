import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { hotel, checkIn: stateCheckIn, checkOut: stateCheckOut, guests: stateGuests } = location.state || {};

  const [checkIn, setCheckIn] = useState(stateCheckIn || '');
  const [checkOut, setCheckOut] = useState(stateCheckOut || '');
  const [guests, setGuests] = useState(stateGuests || '1 Room, 2 Guests');
  const [nights, setNights] = useState(1);

  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!stateCheckIn || !stateCheckOut) {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      if (!stateCheckIn) setCheckIn(today.toISOString().split('T')[0]);
      if (!stateCheckOut) setCheckOut(tomorrow.toISOString().split('T')[0]);
    }
    
    // Check if guests was passed via search params previously as fallback
    const params = new URLSearchParams(window.location.search);
    if (!stateGuests && params.get('guests')) {
      setGuests(params.get('guests'));
    }
  }, [stateCheckIn, stateCheckOut, stateGuests]);

  // Calculate nights
  useEffect(() => {
    if (checkIn && checkOut) {
      const d1 = new Date(checkIn);
      const d2 = new Date(checkOut);
      const diffTime = Math.abs(d2 - d1);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setNights(diffDays > 0 ? diffDays : 1);
    }
  }, [checkIn, checkOut]);

  if (!hotel) {
    return (
      <div className="min-h-screen flex flex-col bg-background font-poppins">
        <Navbar />
        <main className="flex-grow flex flex-col items-center justify-center text-center p-6">
          <div className="bg-white p-10 rounded-xl shadow-md border border-slate-100 max-w-md w-full">
            <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">No booking selected</h2>
            <p className="text-slate-500 mb-6">Please go back and select a hotel to continue with your booking.</p>
            <Button onClick={() => navigate('/hotels')} className="w-full">Browse Hotels</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleBooking = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Valid email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    // Success flow
    console.log("Booking proceeding...", { hotel, formData, checkIn, checkOut, nights });
    // Navigate to confirmation
    navigate('/confirmation', { state: { hotel } });
  };

  const subtotal = hotel.price * nights;
  const taxes = Math.round(subtotal * 0.10); // 10% tax
  const total = subtotal + taxes;

  return (
    <div className="min-h-screen flex flex-col bg-background font-poppins">
      <Navbar />
      
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-8">Complete Your Booking</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT 70% */}
          <div className="lg:w-[70%] flex flex-col gap-6">
            
            {/* BOOKING SUMMARY */}
            <div className="bg-white rounded-xl shadow-md p-4 md:p-6 border border-slate-100 flex flex-col sm:flex-row gap-6">
              <img 
                src={hotel.image} 
                alt={hotel.name} 
                className="w-full sm:w-40 h-40 object-cover rounded-xl"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'; }}
              />
              <div className="flex flex-col justify-between py-1">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900">{hotel.name}</h2>
                  <p className="text-blue-600 font-medium text-sm mt-1 mb-2 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                    {hotel.location}
                  </p>
                  <p className="text-slate-500 text-sm line-clamp-2 md:line-clamp-none max-w-xl mb-3">
                    {hotel.description}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold bg-accent/10 text-accent px-2 py-1 rounded-md flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    {hotel.rating}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {hotel.amenities.slice(0, 3).map(amenity => (
                      <span key={amenity} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* STAY DETAILS */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3">Your Stay Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Check-in</label>
                  <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"/>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Check-out</label>
                  <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"/>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Guests / Rooms</label>
                  <select value={guests} onChange={e => setGuests(e.target.value)} className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none appearance-none bg-white">
                    <option value="1 Room, 1 Guest">1 Room, 1 Guest</option>
                    <option value="1 Room, 2 Guests">1 Room, 2 Guests</option>
                    <option value="2 Rooms, 4 Guests">2 Rooms, 4 Guests</option>
                  </select>
                </div>
              </div>
              <div className="mt-4 bg-blue-50 text-blue-800 text-sm font-medium px-4 py-2 rounded-lg inline-block">
                Total Stay: {nights} {nights === 1 ? 'Night' : 'Nights'}
              </div>
            </div>

            {/* GUEST DETAILS FORM */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3">Guest Information</h3>
              <div className="grid grid-cols-1 gap-4 max-w-xl">
                <Input 
                  label="Full Name" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  placeholder="John Doe"
                  error={errors.name}
                  required
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input 
                    label="Email Address" 
                    type="email"
                    value={formData.email} 
                    onChange={e => setFormData({...formData, email: e.target.value})} 
                    placeholder="john@example.com"
                    error={errors.email}
                    required
                  />
                  <Input 
                    label="Phone Number" 
                    type="tel"
                    value={formData.phone} 
                    onChange={e => setFormData({...formData, phone: e.target.value})} 
                    placeholder="+91 98765 43210"
                    error={errors.phone}
                    required
                  />
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT 30% PRICE BREAKDOWN */}
          <div className="lg:w-[30%]">
            <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100 sticky top-24">
              <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3">Price Breakdown</h3>
              
              <div className="flex flex-col gap-3 text-slate-600 mb-6">
                <div className="flex justify-between items-center">
                  <span>₹{hotel.price} x {nights} {nights === 1 ? 'night' : 'nights'}</span>
                  <span className="font-medium text-slate-800">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Taxes & Fees (10%)</span>
                  <span className="font-medium text-slate-800">₹{taxes.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-slate-100 pt-4 mb-6">
                <span className="text-lg font-bold text-slate-900">Total Price</span>
                <span className="text-2xl font-bold text-blue-600">₹{total.toLocaleString()}</span>
              </div>

              <Button onClick={handleBooking} className="w-full py-4 text-lg">
                Book Now
              </Button>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
