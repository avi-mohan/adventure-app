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
  
  // Close dropdown when clicking outside
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
      <div className="bg-white rounded-lg shadow-lg">
        <form onSubmit={handleSearch}>
          {/* Switch between mobile and desktop layouts */}
          <div className="flex flex-col md:flex-row">
            {/* On mobile, input fields stack vertically with full width */}
            {/* On desktop, input fields are in a row with dividers */}
            
            {/* Where field */}
            <div className="w-full md:flex-1 p-3">
              <label className="block text-sm font-medium mb-1 md:hidden">Where</label>
              <div className="md:px-2 md:py-1">
                <div className="hidden md:block text-sm font-medium">Where</div>
                <input
                  type="text"
                  name="location"
                  placeholder="Search activities"
                  className="w-full bg-transparent border md:border-none rounded-lg md:rounded-none px-3 py-2 md:p-0 focus:outline-none focus:ring-2 focus:ring-pink-500 md:focus:ring-0"
                  value={searchParams.location}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            {/* Divider for desktop */}
            <div className="hidden md:block w-px h-10 bg-gray-300 self-center"></div>
            
            {/* Activity Type field */}
            <div ref={typeDropdownRef} className="w-full md:flex-1 p-3">
              <label className="block text-sm font-medium mb-1 md:hidden">Activity Type</label>
              <div className="relative md:px-2 md:py-1">
                <div className="hidden md:block text-sm font-medium">Activity Type</div>
                <div 
                  className="w-full bg-transparent border md:border-none rounded-lg md:rounded-none px-3 py-2 md:p-0 flex items-center justify-between cursor-pointer"
                  onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                >
                  <span className="text-gray-700">{searchParams.activityType || 'All Types'}</span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-4 w-4 text-gray-500 transition-transform ${isTypeDropdownOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                
                {/* Activity Type dropdown */}
                {isTypeDropdownOpen && (
                  <div className="absolute left-0 right-0 mt-1 bg-white rounded-lg shadow-lg p-2 z-30">
                    <div className="max-h-60 overflow-y-auto">
                      {activityTypes.map((type) => (
                        <div 
                          key={type} 
                          className="p-2 hover:bg-gray-50 rounded cursor-pointer"
                          onClick={() => handleActivityTypeSelect(type === 'All Types' ? '' : type)}
                        >
                          {type}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Divider for desktop */}
            <div className="hidden md:block w-px h-10 bg-gray-300 self-center"></div>
            
            {/* Age Group field */}
            <div ref={ageDropdownRef} className="w-full md:flex-1 p-3">
              <label className="block text-sm font-medium mb-1 md:hidden">Age Group</label>
              <div className="relative md:px-2 md:py-1">
                <div className="hidden md:block text-sm font-medium">Age Group</div>
                <div 
                  className="w-full bg-transparent border md:border-none rounded-lg md:rounded-none px-3 py-2 md:p-0 flex items-center justify-between cursor-pointer"
                  onClick={() => setIsAgeDropdownOpen(!isAgeDropdownOpen)}
                >
                  <span className="text-gray-700">{getSelectedAgeGroupsText()}</span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-4 w-4 text-gray-500 transition-transform ${isAgeDropdownOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                
                {/* Age dropdown */}
                {isAgeDropdownOpen && (
                  <div className="absolute right-0 mt-1 w-64 bg-white rounded-lg shadow-lg p-3 z-30">
                    <div className="space-y-2">
                      {ageGroups.map((ageGroup) => (
                        <label 
                          key={ageGroup.value} 
                          className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={searchParams.ageGroups.includes(ageGroup.value)}
                            onChange={() => handleAgeGroupToggle(ageGroup.value)}
                            className="mr-3 h-4 w-4 text-pink-500 focus:ring-pink-400 rounded"
                          />
                          <span>{ageGroup.label}</span>
                        </label>
                      ))}
                    </div>
                    
                    {searchParams.ageGroups.length > 0 && (
                      <div className="mt-3 pt-2 border-t border-gray-100 flex justify-between">
                        <button 
                          type="button"
                          className="text-sm text-gray-500 hover:text-gray-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSearchParams(prev => ({ ...prev, ageGroups: [] }));
                          }}
                        >
                          Clear selection
                        </button>
                        
                        <button
                          type="button" 
                          className="text-sm text-pink-500 font-medium hover:text-pink-600"
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
            
            {/* Search button */}
            <div className="p-3 md:p-0 md:self-center">
              <button 
                type="submit"
                className="w-full md:w-auto bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-lg md:rounded-full md:p-4 flex items-center justify-center transition-colors"
                aria-label="Search"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-5 md:w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
                <span className="ml-2 md:hidden">Search</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchBar;