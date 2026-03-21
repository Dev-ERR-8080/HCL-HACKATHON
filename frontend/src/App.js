import './App.css';
import { AuthProvider } from './context/AuthContext';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Hotels from './pages/Hotels';
import HotelDetails from './pages/HotelDetails';
import Checkout from './pages/Checkout';
import MyBookings from './pages/MyBookings';
import AuthModal from './components/auth/AuthModal';

function App() {
  return (
    <AuthProvider>
      <div className="App font-poppins text-slate-900 bg-background min-h-screen">
        <AuthModal />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/hotel-details" element={<HotelDetails />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/my-bookings" element={<MyBookings />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
