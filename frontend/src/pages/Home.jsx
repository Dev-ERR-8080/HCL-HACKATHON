import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Hero from '../components/home/Hero';
import Offers from '../components/home/Offers';
import Footer from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // OAuth2 cookie is now set server-side — no token in URL needed
        // AuthContext.checkSession() handles session restore on mount
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-background font-poppins">
            <Navbar />
            <main className="flex-grow">
                <Hero />
                <Offers onViewAll={() => navigate('/hotels')} />
            </main>
            <Footer />
        </div>
    );
};

export default Home;