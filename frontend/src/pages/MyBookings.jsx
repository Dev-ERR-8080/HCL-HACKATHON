import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';

const mockBookings = [
  {
    id: "BKG-1001",
    hotelName: "Sea View Resort",
    city: "Goa",
    checkIn: "2026-04-10",
    checkOut: "2026-04-12",
    status: "upcoming",
    price: 6000
  },
  {
    id: "BKG-1002",
    hotelName: "Grand Plaza",
    city: "Delhi",
    checkIn: "2026-01-15",
    checkOut: "2026-01-17",
    status: "completed",
    price: 9000
  },
  {
    id: "BKG-1003",
    hotelName: "City Center Suites",
    city: "Mumbai",
    checkIn: "2025-12-05",
    checkOut: "2025-12-07",
    status: "cancelled",
    price: 11000
  }
];

const MyBookings = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('upcoming');

  // Simple unauthenticated guard
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-background font-poppins">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-6 text-center">
          <div className="bg-white p-10 rounded-xl shadow-md border border-slate-100 max-w-md w-full">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Not Logged In</h2>
            <p className="text-slate-500 mb-6">Please log in to view your bookings.</p>
            <button 
              onClick={() => navigate('/')} 
              className="bg-primary text-white w-full py-3 rounded-xl font-bold hover:bg-blue-700 transition"
            >
              Go to Home
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const filteredBookings = mockBookings.filter(b => b.status === activeTab);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'upcoming':
        return <span className="text-xs font-bold bg-blue-100 text-blue-700 px-3 py-1 rounded-full uppercase tracking-wide">Upcoming</span>;
      case 'completed':
        return <span className="text-xs font-bold bg-green-100 text-green-700 px-3 py-1 rounded-full uppercase tracking-wide">Completed</span>;
      case 'cancelled':
        return <span className="text-xs font-bold bg-red-100 text-red-700 px-3 py-1 rounded-full uppercase tracking-wide">Cancelled</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-poppins">
      <Navbar />
      
      <main className="flex-grow max-w-4xl mx-auto w-full px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">My Bookings</h1>

        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-slate-200 mb-6">
          {['upcoming', 'completed', 'cancelled'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-semibold capitalize transition-colors ${activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        <div className="flex flex-col gap-4">
          {filteredBookings.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 text-center">
              <svg className="w-12 h-12 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
              <h3 className="text-lg font-bold text-slate-800 mb-1">No bookings found</h3>
              <p className="text-slate-500 text-sm">You have no {activeTab} bookings at the moment.</p>
            </div>
          ) : (
            filteredBookings.map(booking => (
              <div key={booking.id} className="bg-white rounded-xl shadow-md border border-slate-100 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-lg transition-shadow">
                
                {/* LEFT INFO */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-slate-900">{booking.hotelName}</h3>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                    {booking.city}
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-700 bg-slate-50 px-3 py-2 rounded-lg inline-flex">
                    <div className="flex items-center gap-1">
                      <span className="text-slate-400">In:</span> {booking.checkIn}
                    </div>
                    <span className="text-slate-300">|</span>
                    <div className="flex items-center gap-1">
                      <span className="text-slate-400">Out:</span> {booking.checkOut}
                    </div>
                  </div>
                </div>

                {/* RIGHT INFO */}
                <div className="flex flex-col items-start sm:items-end gap-3 w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="text-2xl font-bold text-slate-800">
                    ₹{booking.price.toLocaleString()}
                  </div>
                  {getStatusBadge(booking.status)}
                </div>

              </div>
            ))
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MyBookings;
