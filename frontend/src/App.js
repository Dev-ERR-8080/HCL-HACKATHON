import './App.css';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import AuthModal from './components/auth/AuthModal';

function App() {
  return (
    <AuthProvider>
      <div className="App font-poppins">
        <AuthModal />
        <Home />
      </div>
    </AuthProvider>
  );
}

export default App;
