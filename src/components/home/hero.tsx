import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="relative bg-gray-900 text-white">
      {/* Hero background */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-50" 
        style={{ 
          backgroundColor: '#000',
          backgroundImage: `url(https://source.unsplash.com/random/1600x900/?kids,adventure)` 
        }}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20 md:py-28 lg:py-32">
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Unforgettable Adventures for Kids
          </h1>
          
          <p className="text-xl mb-8 text-white/90">
            Book exciting, safe, and educational activities for your children
          </p>
          
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Link 
              to="/activities"
              className="bg-pink-500 text-white px-6 py-3 rounded-lg font-bold text-center hover:bg-pink-600 transition-colors"
            >
              Explore Activities
            </Link>
            
            <Link 
              to="/resources"
              className="bg-teal-500 text-white px-6 py-3 rounded-lg font-bold text-center hover:bg-teal-600 transition-colors"
            >
              Resources
            </Link>
            
            <Link 
              to="/contact" 
              className="border-2 border-white text-white px-6 py-3 rounded-lg font-bold text-center hover:bg-white hover:text-gray-900 transition-colors"
            >
              Contact Us
            </Link>
          </div>
          
          <div className="mt-8 flex items-center">
            <div className="flex -space-x-2">
              {/* Testimonial avatars */}
              {[1, 2, 3].map(num => (
                <div 
                  key={num}
                  className="w-10 h-10 rounded-full border-2 border-white bg-gray-500"
                  style={{ 
                    backgroundImage: `url(https://i.pravatar.cc/40?img=${num})`,
                    backgroundSize: 'cover'
                  }}
                />
              ))}
            </div>
            <p className="ml-4 text-sm">
              <span className="font-bold">500+</span> happy families this month
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;