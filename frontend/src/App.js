import logo from './logo.svg';
import './App.css';
import Navbar from './components/layout/Navbar';

function App() {
  return (
    <div className="App font-poppins text-slate-900 bg-slate-50 min-h-screen">
      <Navbar />
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
  );
}

export default App;
