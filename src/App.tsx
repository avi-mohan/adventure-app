// Update to App.tsx to add the new admin routes

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Pages
import Home from './pages/Home';
import ActivityListing from './pages/ActivityListing';
import Booking from './pages/Booking';
import ThankYou from './pages/ThankYou';
import Resources from './pages/Resources';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import AdminActivities from './pages/AdminActivities'; // Add this import

// Components
import Header from './components/common/header';
import Footer from './components/common/footer';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Initialize Firebase analytics tracking
import { trackEvent } from './services/firebase';
import { trackPageView } from './services/analytics';

// RouteChangeTracker component to handle route changes
const RouteChangeTracker = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Track page view in Firebase Analytics
    trackEvent('page_view', { page_path: location.pathname });
    
    // Also track in GA4
    trackPageView(location.pathname);
    
    // Send to console during development
    console.log('Page view tracked:', location.pathname);
  }, [location]);
  
  return null;
};

function App() {
  return (
    <Router>
      <RouteChangeTracker />
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/activities" element={<ActivityListing />} />
            <Route path="/booking/:id" element={<Booking />} />
            <Route path="/thank-you" element={<ThankYou />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/admin/login" element={<Login />} />
            
            {/* Protected Admin Routes */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            
            {/* Add the new admin activities route */}
            <Route path="/admin/activities" element={
              <ProtectedRoute>
                <AdminActivities />
              </ProtectedRoute>
            } />
          
            {/* 404 Route */}
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