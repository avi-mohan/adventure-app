// src/components/common/MobileSearch.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { trackEvent } from '../../services/firebase';

const MobileSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) return;
    
    // Track search event for analytics
    trackEvent('mobile_search', { 
      search_term: searchTerm 
    });
    
    // Navigate to activities with search parameter
    navigate(`/activities?search=${encodeURIComponent(searchTerm.trim())}`);
    
    // Reset search and close input
    setSearchTerm('');
    setIsActive(false);
  };
  
  // Simple view when not active
  if (!isActive) {
    return (
      <div 
        className="bg-white rounded-full shadow-md flex items-center p-4 border border-gray-300 mx-4 my-2"
        onClick={() => setIsActive(true)}
      >
        <div className="text-gray-500 mr-3">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div className="flex-1 text-gray-500">
          Start your search
        </div>
      </div>
    );
  }
  
  // Expanded view when active
  return (
    <div className="fixed inset-0 bg-black/80 z-50 p-4 flex flex-col">
      <form onSubmit={handleSearch} className="w-full">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search activities, classes & more..."
            className="w-full bg-white rounded-full py-4 pl-12 pr-12 text-gray-800 focus:outline-none"
            autoFocus
          />
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button
            type="button"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
            onClick={() => setIsActive(false)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </form>
      
      <div className="mt-4 text-white">
        <h3 className="text-lg font-medium mb-3">Popular searches</h3>
        <div className="flex flex-wrap gap-2">
          {['Adventure', 'Camp', 'Swimming', 'STEM', 'Art'].map((term) => (
            <button
              key={term}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full text-sm"
              onClick={() => {
                navigate(`/activities?search=${encodeURIComponent(term)}`);
                setIsActive(false);
              }}
            >
              {term}
            </button>
          ))}
        </div>
      </div>
      
      <button 
        className="mt-auto mb-10 text-white font-medium text-center"
        onClick={() => setIsActive(false)}
      >
        Cancel
      </button>
    </div>
  );
};

export default MobileSearch;