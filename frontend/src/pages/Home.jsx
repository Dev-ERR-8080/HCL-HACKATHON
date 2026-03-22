import React, { useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Hero from '../components/home/Hero';
import Offers from '../components/home/Offers';
import Footer from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const { login, isAuthenticated } = useAuth();

    useEffect(() => {
        // ✅ FIXED: OAuth2 redirect no longer carries ?token= in the URL.
        //    The backend sets an HttpOnly cookie and redirects to /.
        //    We just check /api/auth/me to get the logged-in user's email.
        //    AuthContext already does this on mount, so this effect only needs
        //    to handle the case where the user just arrived via OAuth2 redirect.
        const isOAuthRedirect = document.referrer.includes('accounts.google.com') ||
            window.location.search.includes('oauth');

        if (isOAuthRedirect && !isAuthenticated) {
            fetch('http://localhost:8080/api/auth/me', { credentials: 'include' })
                .then(res => res.ok ? res.text() : null)
                .then(email => { if (email) login(email); })
                .catch(() => {});
        }
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-background font-poppins">
            <Navbar />
            <main className="flex-grow">
                <Hero />
                <Offers />
            </main>
            <Footer />
        </div>
    );
};

export default Home;