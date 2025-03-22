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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
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
  
  // Activity tags for mobile view
  const activityTags = [
    { id: 'outdoor', name: 'Outdoor', icon: '🌿' },
    { id: 'camps', name: 'Camps', icon: '⛺' },
    { id: 'arts', name: 'Arts', icon: '🎨' },
    { id: 'sports', name: 'Sports', icon: '⚽' },
    { id: 'stem', name: 'STEM', icon: '🔬' }
  ];
  
  // Format selected age groups for display
  const getSelectedAgeGroupsText = () => {
    if (searchParams.ageGroups.length === 0) return 'Select age group';
    
    if (searchParams.ageGroups.length === ageGroups.length) return 'All age groups';
    
    return searchParams.ageGroups
      .map(value => ageGroups.find(group => group.value === value)?.label.split(' ')[0])
      .join(', ');
  };
  
  const renderMobileView = () => {
    return (
      <div className="px-4 py-3">
        <div 
          className="bg-white rounded-full shadow-md flex items-center p-4 border border-gray-300"
          onClick={() => navigate('/activities')}
        >
          <div className="text-gray-500 mr-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="text-gray-900 font-medium">Start your search</div>
          </div>
        </div>
        
        {/* Activity Tags */}
        <div className="mt-6 flex justify-between overflow-x-auto pb-2 no-scrollbar">
          {activityTags.map(tag => (
            <div 
              key={tag.id} 
              className="flex flex-col items-center justify-center mr-6 last:mr-0 cursor-pointer"
              onClick={() => navigate(`/activities?type=${tag.name}`)}
            >
              <div className="text-2xl mb-1">{tag.icon}</div>
              <div className="text-xs whitespace-nowrap">{tag.name}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  const renderDesktopView = () => {
    return (
      <div className="relative w-full max-w-5xl mx-auto px-4">
        <div className="bg-white rounded-full shadow-lg border border-gray-200">
          <form onSubmit={handleSearch} className="flex">
            {/* Where field */}
            <div className="flex-1 px-6 py-4">
              <div className="text-sm font-semibold mb-1">Where</div>
              <input
                type="text"
                name="location"
                placeholder="Search destinations"
                className="w-full bg-transparent border-none p-0 focus:outline-none focus:ring-0 text-gray-700"
                value={searchParams.location}
                onChange={handleInputChange}
              />
            </div>
            
            {/* Divider */}
            <div className="w-px bg-gray-300 self-center h-10"></div>
            
            {/* Activity Type field */}
            <div ref={typeDropdownRef} className="flex-1 px-6 py-4 relative">
              <div className="text-sm font-semibold mb-1">Activity Type</div>
              <div 
                className="w-full bg-transparent flex items-center cursor-pointer text-gray-700"
                onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
              >
                <span>{searchParams.activityType || 'All Types'}</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-4 w-4 text-gray-500 ml-2 transition-transform ${isTypeDropdownOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              
              {/* Activity Type dropdown */}
              {isTypeDropdownOpen && (
                <div className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-xl p-4 z-30 border border-gray-200">
                  <div className="max-h-60 overflow-y-auto">
                    {activityTypes.map((type) => (
                      <div 
                        key={type} 
                        className="p-3 hover:bg-gray-100 rounded-lg cursor-pointer text-gray-700"
                        onClick={() => handleActivityTypeSelect(type === 'All Types' ? '' : type)}
                      >
                        {type}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Divider */}
            <div className="w-px bg-gray-300 self-center h-10"></div>
            
            {/* Age Group field */}
            <div ref={ageDropdownRef} className="flex-1 px-6 py-4 relative">
              <div className="text-sm font-semibold mb-1">Age Group</div>
              <div 
                className="w-full bg-transparent flex items-center cursor-pointer text-gray-700"
                onClick={() => setIsAgeDropdownOpen(!isAgeDropdownOpen)}
              >
                <span>{getSelectedAgeGroupsText()}</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-4 w-4 text-gray-500 ml-2 transition-transform ${isAgeDropdownOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              
              {/* Age dropdown */}
              {isAgeDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl p-4 z-30 border border-gray-200">
                  <div className="space-y-2">
                    {ageGroups.map((ageGroup) => (
                      <label 
                        key={ageGroup.value} 
                        className="flex items-center p-3 hover:bg-gray-100 rounded-lg cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={searchParams.ageGroups.includes(ageGroup.value)}
                          onChange={() => handleAgeGroupToggle(ageGroup.value)}
                          className="mr-3 h-4 w-4 text-pink-500 focus:ring-pink-400 rounded"
                        />
                        <span className="text-gray-700">{ageGroup.label}</span>
                      </label>
                    ))}
                  </div>
                  
                  {searchParams.ageGroups.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between">
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
            
            {/* Search button */}
            <div className="p-2">
              <button 
                type="submit"
                className="bg-pink-500 hover:bg-pink-600 text-white p-4 rounded-full flex items-center justify-center transition-colors search-btn-hover"
                aria-label="Search"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  
  return (
    <div className="w-full z-20">
      {isMobile ? renderMobileView() : renderDesktopView()}
    </div>
  );
};

export default SearchBar;