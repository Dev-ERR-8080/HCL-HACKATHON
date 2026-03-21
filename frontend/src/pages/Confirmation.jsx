import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const Confirmation = () => {
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
          <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-100 text-left space-y-4">
            <div className="flex justify-between items-center border-b border-slate-50 pb-3">
              <span className="text-xs font-bold uppercase text-slate-400">Booking ID</span>
              <span className="text-sm font-mono font-bold text-primary">#QI-8293-2026</span>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Hotel Name</label>
              <p className="font-bold text-secondary text-lg text-text">The Grand Heritage Resort</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Check-in</label>
                <p className="font-semibold text-slate-700">Apr 15, 2026</p>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Check-out</label>
                <p className="font-semibold text-slate-700">Apr 18, 2026</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button 
              className="flex-1 bg-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
              onClick={() => window.location.href = '/bookings'}
            >
              View Bookings
            </button>
            <button 
              className="flex-1 bg-white text-secondary border border-slate-200 py-4 rounded-2xl font-bold shadow-sm hover:bg-slate-50 transition-all active:scale-95"
              onClick={() => window.location.href = '/'}
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
