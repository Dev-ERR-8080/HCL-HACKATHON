import React, { useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { login, isAuthenticated, openAuthModal } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      login(token);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [login]);

  const handleBookNow = () => {
    if (!isAuthenticated) {
      openAuthModal();
    } else {
      console.log('Proceed to booking...');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="p-8 flex-grow flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">Find your perfect stay with QuickInn</h1>
        <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl text-center">Book smarter. Stay better.</p>
        <Button onClick={handleBookNow} className="px-8 py-3 text-lg shadow-lg hover:-translate-y-1 transition-transform">
          Book Now
        </Button>
      </main>
    </div>
  );
};

export default Home;
