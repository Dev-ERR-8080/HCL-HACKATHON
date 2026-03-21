import React from 'react';
import Navbar from '../components/layout/Navbar';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="p-4 flex-grow">
        <h1 className="text-2xl font-bold text-slate-800">Home Page</h1>
      </main>
    </div>
  );
};

export default Home;
