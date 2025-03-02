import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold">
            <span className="text-pink-500">Adventure</span>
            <span>Kids</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                isActive ? "font-medium text-pink-500" : "font-medium text-gray-700 hover:text-pink-500 transition-colors"
              }
            >
              Home
            </NavLink>
            <NavLink 
              to="/activities" 
              className={({ isActive }) => 
                isActive ? "font-medium text-pink-500" : "font-medium text-gray-700 hover:text-pink-500 transition-colors"
              }
            >
              Activities
            </NavLink>
            <NavLink 
              to="/activities?sort=popular" 
              className={({ isActive }) => 
                isActive ? "font-medium text-pink-500" : "font-medium text-gray-700 hover:text-pink-500 transition-colors"
              }
            >
              <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full font-bold flex items-center">
                Hot!
                <span className="ml-1 animate-pulse">
                  🔥
                </span>
              </span>
            </NavLink>
            <NavLink 
              to="/resources" 
              className={({ isActive }) => 
                isActive ? "font-medium text-pink-500" : "font-medium text-gray-700 hover:text-pink-500 transition-colors"
              }
            >
              Resources
            </NavLink>
            <Link 
              to="/contact" 
              className="font-medium text-gray-700 hover:text-pink-500 transition-colors"
            >
              Contact
            </Link>
            <Link 
              to="/activities" 
              className="bg-pink-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-pink-600 transition-colors"
            >
              Book Now
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-700"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              className="w-6 h-6"
            >
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden px-4 py-4 bg-white border-t">
          <nav className="flex flex-col space-y-4">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                isActive ? "font-medium text-pink-500" : "font-medium text-gray-700 hover:text-pink-500 transition-colors"
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </NavLink>
            <NavLink 
              to="/activities" 
              className={({ isActive }) => 
                isActive ? "font-medium text-pink-500" : "font-medium text-gray-700 hover:text-pink-500 transition-colors"
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Activities
            </NavLink>
            <NavLink 
              to="/activities?sort=popular" 
              className={({ isActive }) => 
                isActive ? "font-medium text-pink-500" : "font-medium text-gray-700 hover:text-pink-500 transition-colors"
              }
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full font-bold flex items-center">
                Hot!
                <span className="ml-1 animate-pulse">
                  🔥
                </span>
              </span>
            </NavLink>
            <NavLink 
              to="/resources" 
              className={({ isActive }) => 
                isActive ? "font-medium text-pink-500" : "font-medium text-gray-700 hover:text-pink-500 transition-colors"
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Resources
            </NavLink>
            <Link 
              to="/contact" 
              className="font-medium text-gray-700 hover:text-pink-500 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <Link 
              to="/activities" 
              className="bg-pink-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-pink-600 transition-colors text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Book Now
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;