import logo from './logo.svg';
import './App.css';
import Navbar from './components/layout/Navbar';
import AuthModal from './components/auth/AuthModal';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <div className="App font-poppins text-slate-900 bg-slate-50 min-h-screen">
        <Navbar />
        <AuthModal />
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    </AuthProvider>
  );
}

export default App;
