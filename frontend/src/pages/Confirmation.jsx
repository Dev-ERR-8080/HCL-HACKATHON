import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Button from '../components/common/Button';

const Confirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { hotel } = location.state || {};

  if (!hotel) {
    return (
      <div className="min-h-screen flex flex-col bg-background font-poppins">
        <Navbar />
        <main className="flex-grow flex flex-col items-center justify-center text-center p-6">
          <div className="bg-white p-10 rounded-xl shadow-md border border-slate-100 max-w-md w-full">
            <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">No booking found</h2>
            <p className="text-slate-500 mb-6">We couldn't find your booking details.</p>
            <Button onClick={() => navigate('/hotels')} className="w-full">Browse Hotels</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background font-poppins">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="max-w-xl w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
          
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="bg-green-100 p-6 rounded-full">
              <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* Messages */}
          <div className="space-y-3">
            <h1 className="text-4xl font-bold text-text">Booking Confirmed!</h1>
            <p className="text-lg text-slate-600">Your booking has been successfully confirmed.</p>
            <p className="text-sm text-slate-400">A confirmation email has been sent to your registered email address.</p>
          </div>

          {/* Booking Info Card */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100 text-left space-y-4">
            <div className="flex justify-between items-center border-b border-slate-50 pb-3">
              <span className="text-xs font-bold uppercase text-slate-400">Booking ID</span>
              <span className="text-sm font-mono font-bold text-primary">#QI-{Math.floor(Math.random() * 10000)}-2026</span>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Hotel Name</label>
              <p className="font-bold text-secondary text-lg text-text">{hotel.name}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Location</label>
                <p className="font-semibold text-slate-700">{hotel.location}</p>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Price</label>
                <p className="font-semibold text-slate-700">₹{hotel.price} / night</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button 
              className="flex-1 py-4 text-base"
              onClick={() => navigate('/my-bookings')}
            >
              View Bookings
            </Button>
            <button 
              className="flex-1 bg-white text-secondary border border-slate-200 py-3 rounded-xl font-bold shadow-md hover:bg-slate-50 transition-all active:scale-95 bg-white text-slate-800"
              onClick={() => navigate('/')}
            >
              Back to Home
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Confirmation;
