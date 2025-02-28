import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import Home from './pages/Home';
import ActivityListing from './pages/ActivityListing';
import Booking from './pages/Booking';
import ThankYou from './pages/ThankYou';

// Components
import Header from './components/common/header';
import Footer from './components/common/footer';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/activities" element={<ActivityListing />} />
            <Route path="/booking/:id" element={<Booking />} />
            <Route path="/thank-you" element={<ThankYou />} />
            <Route path="*" element={<div className="text-center py-20">
              <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
              <p>The page you were looking for doesn't exist.</p>
            </div>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;