// src/pages/ThankYou.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const ThankYou = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 text-center">
      <div className="mb-8 text-green-500">
        <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
      
      <h1 className="text-4xl font-bold mb-4">Thank You for Your Booking!</h1>
      <p className="text-xl mb-8 max-w-md mx-auto">We've received your information and will be in touch shortly to confirm your adventure.</p>
      
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
        <Link to="/" className="bg-pink-500 text-white px-6 py-3 rounded-lg font-bold text-center hover:bg-pink-600 transition-colors">
          Return to Home
        </Link>
        <Link to="/activities" className="border-2 border-pink-500 text-pink-500 px-6 py-3 rounded-lg font-bold text-center hover:bg-pink-50 transition-colors">
          Explore More Activities
        </Link>
      </div>
    </div>
  );
};

export default ThankYou;