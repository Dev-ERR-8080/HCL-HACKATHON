import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { createBooking, validateCoupon } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, openAuthModal } = useAuth();
  const { hotel, checkIn: stateCheckIn, checkOut: stateCheckOut, guests: stateGuests } = location.state || {};

  const today    = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const dayAfter = new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0];

  // ── Stay ──────────────────────────────────────────────────
  const [checkIn,  setCheckIn]  = useState(stateCheckIn  || tomorrow);
  const [checkOut, setCheckOut] = useState(stateCheckOut || dayAfter);
  const [guests,   setGuests]   = useState(stateGuests   || '1 Room, 2 Guests');
  const [nights,   setNights]   = useState(1);

  // ── Room ──────────────────────────────────────────────────
  const [selectedRoomId,    setSelectedRoomId]    = useState(null);
  const [selectedRoomPrice, setSelectedRoomPrice] = useState(hotel?.price || 0);

  // ── Coupon ────────────────────────────────────────────────
  const [couponCode,         setCouponCode]         = useState('');
  const [couponResult,       setCouponResult]       = useState(null);
  const [couponError,        setCouponError]        = useState('');
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  // ── Form / booking ────────────────────────────────────────
  const [formData,  setFormData]  = useState({ name: '', email: '', phone: '' });
  const [errors,    setErrors]    = useState({});
  const [isBooking, setIsBooking] = useState(false);

  // ── Effects ───────────────────────────────────────────────
  useEffect(() => {
    if (!isAuthenticated) openAuthModal();
  }, [isAuthenticated]);

  useEffect(() => {
    if (!hotel) return;
    if (hotel.roomId) {
      setSelectedRoomId(hotel.roomId);
      setSelectedRoomPrice(hotel.price || 0);
    } else if (hotel.roomTypes?.[0]?.rooms?.[0]) {
      const first = hotel.roomTypes[0].rooms[0];
      setSelectedRoomId(first.roomId);
      setSelectedRoomPrice(first.pricePerNight || 0);
    }
  }, [hotel]);

  useEffect(() => {
    if (checkIn && checkOut) {
      const diff = Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000);
      setNights(diff > 0 ? diff : 1);
    }
  }, [checkIn, checkOut]);

  // Reset coupon when nights or room price changes
  useEffect(() => {
    setCouponResult(null);
    setCouponError('');
  }, [selectedRoomPrice, nights]);

  // ── Coupon handlers ───────────────────────────────────────
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsValidatingCoupon(true);
    setCouponError('');
    try {
      const result = await validateCoupon(couponCode.trim(), selectedRoomPrice * nights);
      setCouponResult(result);
    } catch (err) {
      setCouponResult(null);
      setCouponError(err.message || 'Invalid or expired coupon');
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponResult(null);
    setCouponCode('');
    setCouponError('');
  };

  // ── No hotel guard ────────────────────────────────────────
  if (!hotel) {
    return (
        <div className="min-h-screen flex flex-col bg-background font-poppins">
          <Navbar />
          <main className="flex-grow flex flex-col items-center justify-center text-center p-6">
            <div className="bg-white p-10 rounded-xl shadow-md border border-slate-100 max-w-md w-full">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">No booking selected</h2>
              <p className="text-slate-500 mb-6">Please go back and select a hotel to continue.</p>
              <Button onClick={() => navigate('/hotels')} className="w-full">Browse Hotels</Button>
            </div>
          </main>
          <Footer />
        </div>
    );
  }

  // ── Book handler ──────────────────────────────────────────
  const handleBooking = async () => {
    const newErrors = {};
    if (!formData.name.trim())  newErrors.name  = 'Full name is required';
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = 'Valid email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (checkIn <= today)       newErrors.checkIn  = 'Check-in must be a future date';
    if (checkOut <= checkIn)    newErrors.checkOut = 'Check-out must be after check-in';
    if (!selectedRoomId)        newErrors.submit   = 'No room selected. Please go back and choose a hotel with rooms.';

    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    setErrors({});
    setIsBooking(true);

    try {
      await createBooking({
        hotelId:    hotel.hotelId || hotel.id,
        roomId:     selectedRoomId,
        checkIn,
        checkOut,
        baseAmount: selectedRoomPrice * nights,
        couponCode: couponResult ? couponCode.trim() : undefined,
      });
      navigate('/confirmation', { state: { hotel, checkIn, checkOut, nights } });
    } catch (err) {
      setErrors({ submit: err.message || 'Booking failed. Please try again.' });
    } finally {
      setIsBooking(false);
    }
  };

  // ── Price calculations ────────────────────────────────────
  const subtotal  = selectedRoomPrice * nights;
  const discount  = couponResult?.discount ?? 0;
  const afterDisc = subtotal - discount;
  const taxes     = Math.round(afterDisc * 0.10);
  const total     = afterDisc + taxes;

  return (
      <div className="min-h-screen flex flex-col bg-background font-poppins">
        <Navbar />
        <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-8">Complete Your Booking</h1>

          {errors.submit && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">
                {errors.submit}
              </div>
          )}

          <div className="flex flex-col lg:flex-row gap-8">

            {/* ── LEFT 70% ── */}
            <div className="lg:w-[70%] flex flex-col gap-6">

              {/* Hotel summary */}
              <div className="bg-white rounded-xl shadow-md p-4 md:p-6 border border-slate-100 flex flex-col sm:flex-row gap-6">
                <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full sm:w-40 h-40 object-cover rounded-xl"
                    onError={e => { e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'; }}
                />
                <div className="flex flex-col justify-between py-1">
                  <h2 className="text-xl font-bold text-slate-900">{hotel.name}</h2>
                  <p className="text-blue-600 font-medium text-sm mt-1 mb-2">{hotel.location || hotel.city}</p>
                  <p className="text-slate-500 text-sm line-clamp-2 max-w-xl">{hotel.description}</p>
                </div>
              </div>

              {/* Room selector */}
              {hotel.roomTypes?.length > 0 && (
                  <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3">Select Room</h3>
                    <div className="flex flex-col gap-3">
                      {hotel.roomTypes.map(rt =>
                          rt.rooms?.map(room => (
                              <label
                                  key={room.roomId}
                                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                                      selectedRoomId === room.roomId
                                          ? 'border-blue-500 bg-blue-50'
                                          : 'border-slate-200 hover:border-blue-300'
                                  }`}
                              >
                                <div className="flex items-center gap-3">
                                  <input
                                      type="radio"
                                      name="room"
                                      value={room.roomId}
                                      checked={selectedRoomId === room.roomId}
                                      onChange={() => {
                                        setSelectedRoomId(room.roomId);
                                        setSelectedRoomPrice(room.pricePerNight);
                                      }}
                                      className="accent-blue-600"
                                  />
                                  <div>
                                    <p className="font-semibold text-slate-800">{rt.typeName}</p>
                                    <p className="text-xs text-slate-500">Room #{room.roomNumber} · Max {rt.maxOccupancy} guests</p>
                                  </div>
                                </div>
                                <span className="font-bold text-blue-600">₹{room.pricePerNight}/night</span>
                              </label>
                          ))
                      )}
                    </div>
                  </div>
              )}

              {/* Stay details */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3">Your Stay Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Check-in</label>
                    <input
                        type="date" value={checkIn} min={tomorrow}
                        onChange={e => setCheckIn(e.target.value)}
                        className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:border-blue-500 outline-none"
                    />
                    {errors.checkIn && <p className="text-red-500 text-xs mt-1">{errors.checkIn}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Check-out</label>
                    <input
                        type="date" value={checkOut} min={checkIn}
                        onChange={e => setCheckOut(e.target.value)}
                        className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:border-blue-500 outline-none"
                    />
                    {errors.checkOut && <p className="text-red-500 text-xs mt-1">{errors.checkOut}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Guests</label>
                    <select
                        value={guests}
                        onChange={e => setGuests(e.target.value)}
                        className="w-full border border-slate-300 rounded-xl p-3 text-sm outline-none appearance-none bg-white"
                    >
                      <option>1 Room, 1 Guest</option>
                      <option>1 Room, 2 Guests</option>
                      <option>2 Rooms, 4 Guests</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4 bg-blue-50 text-blue-800 text-sm font-medium px-4 py-2 rounded-lg inline-block">
                  Total Stay: {nights} {nights === 1 ? 'Night' : 'Nights'}
                </div>
              </div>

              {/* Guest info */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3">Guest Information</h3>
                <div className="grid grid-cols-1 gap-4 max-w-xl">
                  <Input
                      label="Full Name" value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe" error={errors.name} required
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Email Address" type="email" value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com" error={errors.email} required
                    />
                    <Input
                        label="Phone Number" type="tel" value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210" error={errors.phone} required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ── RIGHT 30% ── */}
            <div className="lg:w-[30%]">
              <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100 sticky top-24">
                <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3">Price Breakdown</h3>

                {/* Price rows */}
                <div className="flex flex-col gap-3 text-slate-600 mb-4">
                  <div className="flex justify-between items-center">
                    <span>₹{selectedRoomPrice} × {nights} {nights === 1 ? 'night' : 'nights'}</span>
                    <span className="font-medium text-slate-800">₹{subtotal.toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                      <div className="flex justify-between items-center text-green-600 font-medium">
                        <span>Coupon ({couponCode})</span>
                        <span>− ₹{discount.toLocaleString()}</span>
                      </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span>Taxes & Fees (10%)</span>
                    <span className="font-medium text-slate-800">₹{taxes.toLocaleString()}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center border-t border-slate-100 pt-4 mb-5">
                  <span className="text-lg font-bold text-slate-900">Total</span>
                  <span className="text-2xl font-bold text-blue-600">₹{total.toLocaleString()}</span>
                </div>

                {/* Coupon input */}
                <div className="mb-5 border-t border-slate-100 pt-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Have a coupon?</p>
                  {!couponResult ? (
                      <div className="flex gap-2">
                        <input
                            value={couponCode}
                            onChange={e => { setCouponCode(e.target.value.toUpperCase()); setCouponError(''); }}
                            onKeyDown={e => { if (e.key === 'Enter') handleApplyCoupon(); }}
                            placeholder="e.g. WELCOME20"
                            className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 tracking-widest"
                        />
                        <button
                            onClick={handleApplyCoupon}
                            disabled={isValidatingCoupon || !couponCode.trim()}
                            className="bg-slate-800 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 transition disabled:opacity-50"
                        >
                          {isValidatingCoupon ? '...' : 'Apply'}
                        </button>
                      </div>
                  ) : (
                      <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                        <div>
                          <p className="text-green-700 text-sm font-bold">{couponCode}</p>
                          <p className="text-green-600 text-xs">₹{discount.toLocaleString()} saved!</p>
                        </div>
                        <button
                            onClick={handleRemoveCoupon}
                            className="text-slate-400 hover:text-red-500 transition ml-2"
                            title="Remove coupon"
                        >
                          ✕
                        </button>
                      </div>
                  )}
                  {couponError && <p className="text-red-500 text-xs mt-1">{couponError}</p>}
                </div>

                {/* Book Now */}
                <Button
                    onClick={handleBooking}
                    isLoading={isBooking}
                    disabled={!selectedRoomId || isBooking}
                    className="w-full py-4 text-lg"
                >
                  {selectedRoomId ? 'Book Now' : 'No Room Available'}
                </Button>
                {!selectedRoomId && (
                    <p className="text-xs text-red-500 text-center mt-2">
                      Please view hotel details to select a room first.
                    </p>
                )}
              </div>
            </div>

          </div>
        </main>
        <Footer />
      </div>
  );
};

export default Checkout;