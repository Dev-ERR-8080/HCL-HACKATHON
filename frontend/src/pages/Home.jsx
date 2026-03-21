import React, { useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Hero from '../components/home/Hero';
import Offers from '../components/home/Offers';
import Footer from '../components/layout/Footer';
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

  return (
    <div className="min-h-screen flex flex-col bg-background font-poppins">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <div className="max-w-7xl mx-auto px-6 mb-8 text-center lg:text-left">
           {/* You can add more localized section here if needed */}
        </div>
        <Offers />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
