// src/components/common/searchBar.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchParams, setSearchParams] = useState({
    location: '',
    dateFrom: '',
    dateTo: '',
    adults: 0,
    children: 0,
    infants: 0
  });
  
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleGuestCountChange = (type: 'adults' | 'children' | 'infants', operation: 'add' | 'subtract') => {
    setSearchParams(prev => {
      const currentValue = prev[type];
      let newValue = operation === 'add' ? currentValue + 1 : currentValue - 1;
      
      // Ensure counts don't go below 0
      if (newValue < 0) newValue = 0;
      
      return {
        ...prev,
        [type]: newValue
      };
    });
  };
  
  const handleFilterClick = (filter: string) => {
    setActiveFilter(activeFilter === filter ? null : filter);
    setIsExpanded(true);
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search params:', searchParams);
    
    // Build query string
    const queryParams = new URLSearchParams();
    if (searchParams.location) queryParams.append('location', searchParams.location);
    if (searchParams.dateFrom) queryParams.append('from', searchParams.dateFrom);
    if (searchParams.dateTo) queryParams.append('to', searchParams.dateTo);
    if (searchParams.adults > 0) queryParams.append('adults', searchParams.adults.toString());
    if (searchParams.children > 0) queryParams.append('children', searchParams.children.toString());
    if (searchParams.infants > 0) queryParams.append('infants', searchParams.infants.toString());
    
    // Navigate to activities page with search params
    navigate(`/activities?${queryParams.toString()}`);
    
    // Reset active filter
    setActiveFilter(null);
    setIsExpanded(false);
  };
  
  const closeFilters = () => {
    setActiveFilter(null);
    setIsExpanded(false);
  };
  
  // Calculate total guests for display
  const totalGuests = searchParams.adults + searchParams.children + searchParams.infants;
  
  return (
    <div className="relative z-20 w-full max-w-5xl mx-auto">
      <div className={`bg-white rounded-full shadow-lg transition-all duration-300 ${isExpanded ? 'rounded-2xl' : ''}`}>
        <form onSubmit={handleSearch}>
          {/* Main search bar */}
          <div className="flex flex-col md:flex-row md:items-center">
            {/* Where filter */}
            <div 
              className={`relative flex-1 p-2 cursor-pointer ${activeFilter === 'where' ? 'bg-gray-100 rounded-t-2xl md:rounded-l-full md:rounded-tr-none' : ''}`}
              onClick={() => handleFilterClick('where')}
            >
              <div className="px-4 py-2">
                <div className="text-sm font-medium">Where</div>
                <input
                  type="text"
                  name="location"
                  placeholder="Search activities"
                  className="w-full bg-transparent border-none focus:outline-none text-gray-700"
                  value={searchParams.location}
                  onChange={handleInputChange}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
            
            {/* Divider */}
            <div className="hidden md:block w-px h-10 bg-gray-300 mx-1"></div>
            
            {/* When filter */}
            <div 
              className={`relative flex-1 p-2 cursor-pointer ${activeFilter === 'when' ? 'bg-gray-100' : ''}`}
              onClick={() => handleFilterClick('when')}
            >
              <div className="px-4 py-2">
                <div className="text-sm font-medium">When</div>
                <div className="flex space-x-2">
                  <input
                    type="date"
                    name="dateFrom"
                    placeholder="From"
                    className="w-full bg-transparent border-none focus:outline-none text-gray-700"
                    value={searchParams.dateFrom}
                    onChange={handleInputChange}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span className="text-gray-400">-</span>
                  <input
                    type="date"
                    name="dateTo"
                    placeholder="To"
                    className="w-full bg-transparent border-none focus:outline-none text-gray-700"
                    value={searchParams.dateTo}
                    onChange={handleInputChange}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            </div>
            
            {/* Divider */}
            <div className="hidden md:block w-px h-10 bg-gray-300 mx-1"></div>
            
            {/* Who filter */}
            <div 
              className={`relative flex-1 p-2 cursor-pointer ${activeFilter === 'who' ? 'bg-gray-100 rounded-b-2xl md:rounded-b-none md:rounded-r-full' : ''}`}
              onClick={() => handleFilterClick('who')}
            >
              <div className="px-4 py-2">
                <div className="text-sm font-medium">Who</div>
                <div className="text-gray-700">
                  {totalGuests > 0 ? (
                    <span>{totalGuests} guest{totalGuests !== 1 ? 's' : ''}</span>
                  ) : (
                    <span>Add guests</span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Search button */}
            <div className="p-2">
              <button 
                type="submit"
                className="bg-pink-500 hover:bg-pink-600 text-white p-4 rounded-full flex items-center justify-center transition-colors"
                aria-label="Search"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Expanded filter panels */}
          {activeFilter === 'where' && (
            <div className="p-6 border-t">
              <h3 className="font-medium mb-4">Popular activities</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Nature Explorer', 'Cooking Class', 'Science Lab', 'Art Workshop'].map((activity) => (
                  <div 
                    key={activity} 
                    className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      setSearchParams(prev => ({ ...prev, location: activity }));
                      setActiveFilter(null);
                    }}
                  >
                    {activity}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeFilter === 'when' && (
            <div className="p-6 border-t">
              <h3 className="font-medium mb-4">Select dates</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">From</label>
                  <input
                    type="date"
                    name="dateFrom"
                    className="w-full p-2 border rounded"
                    value={searchParams.dateFrom}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">To</label>
                  <input
                    type="date"
                    name="dateTo"
                    className="w-full p-2 border rounded"
                    value={searchParams.dateTo}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          )}
          
          {activeFilter === 'who' && (
            <div className="p-6 border-t">
              {/* Adults */}
              <div className="flex items-center justify-between py-4 border-b">
                <div>
                  <h3 className="font-medium">Adults</h3>
                  <p className="text-sm text-gray-500">Ages 13 or above</p>
                </div>
                <div className="flex items-center">
                  <button 
                    type="button"
                    className={`w-8 h-8 rounded-full border flex items-center justify-center ${searchParams.adults > 0 ? 'border-gray-400 text-gray-500' : 'border-gray-200 text-gray-300'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGuestCountChange('adults', 'subtract');
                    }}
                    disabled={searchParams.adults === 0}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="mx-4 w-5 text-center">{searchParams.adults}</span>
                  <button 
                    type="button"
                    className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center text-gray-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGuestCountChange('adults', 'add');
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Children */}
              <div className="flex items-center justify-between py-4 border-b">
                <div>
                  <h3 className="font-medium">Children</h3>
                  <p className="text-sm text-gray-500">Ages 2-12</p>
                </div>
                <div className="flex items-center">
                  <button 
                    type="button"
                    className={`w-8 h-8 rounded-full border flex items-center justify-center ${searchParams.children > 0 ? 'border-gray-400 text-gray-500' : 'border-gray-200 text-gray-300'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGuestCountChange('children', 'subtract');
                    }}
                    disabled={searchParams.children === 0}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="mx-4 w-5 text-center">{searchParams.children}</span>
                  <button 
                    type="button"
                    className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center text-gray-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGuestCountChange('children', 'add');
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Infants */}
              <div className="flex items-center justify-between py-4">
                <div>
                  <h3 className="font-medium">Infants</h3>
                  <p className="text-sm text-gray-500">Under 2</p>
                </div>
                <div className="flex items-center">
                  <button 
                    type="button"
                    className={`w-8 h-8 rounded-full border flex items-center justify-center ${searchParams.infants > 0 ? 'border-gray-400 text-gray-500' : 'border-gray-200 text-gray-300'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGuestCountChange('infants', 'subtract');
                    }}
                    disabled={searchParams.infants === 0}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="mx-4 w-5 text-center">{searchParams.infants}</span>
                  <button 
                    type="button"
                    className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center text-gray-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGuestCountChange('infants', 'add');
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
      
      {/* Backdrop when filters are expanded */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 z-10"
          onClick={closeFilters}
        ></div>
      )}
    </div>
  );
};

export default SearchBar;