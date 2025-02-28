import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchParams, setSearchParams] = useState({
    location: '',
    dateFrom: '',
    dateTo: '',
    children: 1,
    age: ''
  });
  
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
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
    if (searchParams.children) queryParams.append('children', searchParams.children.toString());
    if (searchParams.age) queryParams.append('age', searchParams.age);
    
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
                <div className="flex items-center">
                  <span className="text-gray-700">Children: </span>
                  <select
                    name="children"
                    className="ml-2 bg-transparent border-none focus:outline-none text-gray-700"
                    value={searchParams.children}
                    onChange={handleInputChange}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            {/* Search button */}
            <div className="p-2">
              <button 
                type="submit"
                className="bg-pink-500 hover:bg-pink-600 text-white p-4 rounded-full flex items-center justify-center transition-colors"
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
              <h3 className="font-medium mb-4">Children details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Number of children</label>
                  <select
                    name="children"
                    className="w-full p-2 border rounded"
                    value={searchParams.children}
                    onChange={handleInputChange}
                  >
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Age range</label>
                  <select
                    name="age"
                    className="w-full p-2 border rounded"
                    value={searchParams.age}
                    onChange={handleInputChange}
                  >
                    <option value="">All ages</option>
                    <option value="3-5">3-5 years</option>
                    <option value="6-8">6-8 years</option>
                    <option value="9-12">9-12 years</option>
                    <option value="13-17">13-17 years</option>
                  </select>
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