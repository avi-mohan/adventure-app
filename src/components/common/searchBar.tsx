// src/components/common/searchBar.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const navigate = useNavigate();
  const ageDropdownRef = useRef<HTMLDivElement>(null);
  const typeDropdownRef = useRef<HTMLDivElement>(null);
  
  const [searchParams, setSearchParams] = useState({
    location: '',
    activityType: '',
    ageGroups: [] as string[]
  });
  
  const [isAgeDropdownOpen, setIsAgeDropdownOpen] = useState(false);
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ageDropdownRef.current && !ageDropdownRef.current.contains(event.target as Node)) {
        setIsAgeDropdownOpen(false);
      }
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target as Node)) {
        setIsTypeDropdownOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ageDropdownRef, typeDropdownRef]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleActivityTypeSelect = (type: string) => {
    setSearchParams(prev => ({
      ...prev,
      activityType: type
    }));
    setIsTypeDropdownOpen(false);
  };
  
  const handleAgeGroupToggle = (ageGroup: string) => {
    setSearchParams(prev => {
      const currentAgeGroups = [...prev.ageGroups];
      
      if (currentAgeGroups.includes(ageGroup)) {
        // Remove age group if already selected
        return {
          ...prev,
          ageGroups: currentAgeGroups.filter(group => group !== ageGroup)
        };
      } else {
        // Add age group if not selected
        return {
          ...prev,
          ageGroups: [...currentAgeGroups, ageGroup]
        };
      }
    });
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search params:', searchParams);
    
    // Build query string
    const queryParams = new URLSearchParams();
    if (searchParams.location) queryParams.append('location', searchParams.location);
    if (searchParams.activityType) queryParams.append('type', searchParams.activityType);
    searchParams.ageGroups.forEach(age => queryParams.append('age', age));
    
    // Navigate to activities page with search params
    navigate(`/activities?${queryParams.toString()}`);
  };
  
  // Activity type options
  const activityTypes = [
    'All Types',
    'Camp',
    'Class',
    'Workshop',
    'Adventure',
    'Sport',
    'Arts & Crafts',
    'STEM',
    'Special Event'
  ];
  
  // Age group options
  const ageGroups = [
    { value: '0-3', label: 'Toddlers (0-3 years)' },
    { value: '3-12', label: 'Children (3-12 years)' },
    { value: '12+', label: 'Teens (12+ years)' }
  ];
  
  // Format selected age groups for display
  const getSelectedAgeGroupsText = () => {
    if (searchParams.ageGroups.length === 0) return 'Select age group';
    
    if (searchParams.ageGroups.length === ageGroups.length) return 'All age groups';
    
    return searchParams.ageGroups
      .map(value => ageGroups.find(group => group.value === value)?.label.split(' ')[0])
      .join(', ');
  };
  
  return (
    <div className="relative z-20 w-full max-w-5xl mx-auto px-4">
      {/* Mobile-friendly search form */}
      <div className="bg-white rounded-lg shadow-lg">
        <form onSubmit={handleSearch} className="w-full">
          {/* Desktop layout - horizontal */}
          <div className="hidden md:grid md:grid-cols-3 md:gap-4 md:p-4">
            {/* Where filter */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Where</label>
              <input
                type="text"
                name="location"
                placeholder="Search activities"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                value={searchParams.location}
                onChange={handleInputChange}
              />
            </div>
            
            {/* Activity Type filter */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Activity Type</label>
              <div className="relative">
                <button
                  type="button"
                  className="w-full px-3 py-2 text-left border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 flex justify-between items-center"
                  onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                >
                  <span>{searchParams.activityType || 'All Types'}</span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 text-gray-400" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                </button>
                {isTypeDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                    {activityTypes.map(type => (
                      <button
                        key={type}
                        type="button"
                        className="w-full px-3 py-2 text-left hover:bg-gray-100"
                        onClick={() => handleActivityTypeSelect(type === 'All Types' ? '' : type)}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Age Group filter */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Age Group</label>
              <div className="relative">
                <button
                  type="button"
                  className="w-full px-3 py-2 text-left border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 flex justify-between items-center"
                  onClick={() => setIsAgeDropdownOpen(!isAgeDropdownOpen)}
                >
                  <span>{getSelectedAgeGroupsText()}</span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 text-gray-400" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                </button>
                {isAgeDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-2">
                    {ageGroups.map(group => (
                      <label key={group.value} className="flex items-center p-2 hover:bg-gray-100">
                        <input
                          type="checkbox"
                          className="mr-2 h-4 w-4 text-pink-500 rounded"
                          checked={searchParams.ageGroups.includes(group.value)}
                          onChange={() => handleAgeGroupToggle(group.value)}
                        />
                        <span>{group.label}</span>
                      </label>
                    ))}
                    {searchParams.ageGroups.length > 0 && (
                      <div className="flex justify-between mt-2 pt-2 border-t border-gray-200">
                        <button
                          type="button"
                          className="text-sm text-gray-500"
                          onClick={() => setSearchParams(prev => ({ ...prev, ageGroups: [] }))}
                        >
                          Clear
                        </button>
                        <button
                          type="button"
                          className="text-sm text-pink-600 font-medium"
                          onClick={() => setIsAgeDropdownOpen(false)}
                        >
                          Apply
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Mobile layout - vertical */}
          <div className="md:hidden p-4 space-y-4">
            {/* Where input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Where</label>
              <input
                type="text"
                name="location"
                placeholder="Search activities"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                value={searchParams.location}
                onChange={handleInputChange}
              />
            </div>
            
            {/* Activity Type dropdown */}
            <div ref={typeDropdownRef}>
              <label className="block text-sm font-medium text-gray-700 mb-1">Activity Type</label>
              <div className="relative">
                <button
                  type="button"
                  className="w-full px-3 py-2 text-left border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 flex justify-between items-center"
                  onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                >
                  <span>{searchParams.activityType || 'All Types'}</span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-5 w-5 text-gray-400 transition-transform ${isTypeDropdownOpen ? 'rotate-180' : ''}`}
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                </button>
                {isTypeDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {activityTypes.map(type => (
                      <button
                        key={type}
                        type="button"
                        className="w-full px-3 py-2 text-left hover:bg-gray-100"
                        onClick={() => handleActivityTypeSelect(type === 'All Types' ? '' : type)}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Age Group dropdown */}
            <div ref={ageDropdownRef}>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age Group</label>
              <div className="relative">
                <button
                  type="button"
                  className="w-full px-3 py-2 text-left border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 flex justify-between items-center"
                  onClick={() => setIsAgeDropdownOpen(!isAgeDropdownOpen)}
                >
                  <span>{getSelectedAgeGroupsText()}</span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-5 w-5 text-gray-400 transition-transform ${isAgeDropdownOpen ? 'rotate-180' : ''}`}
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                </button>
                {isAgeDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-2">
                    {ageGroups.map(group => (
                      <label key={group.value} className="flex items-center p-2 hover:bg-gray-100">
                        <input
                          type="checkbox"
                          className="mr-2 h-4 w-4 text-pink-500 rounded"
                          checked={searchParams.ageGroups.includes(group.value)}
                          onChange={() => handleAgeGroupToggle(group.value)}
                        />
                        <span>{group.label}</span>
                      </label>
                    ))}
                    {searchParams.ageGroups.length > 0 && (
                      <div className="flex justify-between mt-2 pt-2 border-t border-gray-200">
                        <button
                          type="button"
                          className="text-sm text-gray-500"
                          onClick={() => setSearchParams(prev => ({ ...prev, ageGroups: [] }))}
                        >
                          Clear
                        </button>
                        <button
                          type="button"
                          className="text-sm text-pink-600 font-medium"
                          onClick={() => setIsAgeDropdownOpen(false)}
                        >
                          Apply
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Search button for both layouts */}
          <div className="px-4 pb-4">
            <button
              type="submit"
              className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-lg font-bold transition-colors flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
              Search
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchBar;