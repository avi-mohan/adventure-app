// src/pages/ActivityListing.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Activity } from '../models/Activity';
import { trackEvent } from '../services/firebase';

const ActivityListing = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<{
    category: string | null;
    ageRange: string | null;
    priceRange: string | null;
  }>({
    category: null,
    ageRange: null,
    priceRange: null,
  });
  
  const location = useLocation();
  const navigate = useNavigate();

  // Extract query params on initial load
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    
    setActiveFilters({
      category: params.get('type'),
      ageRange: params.get('age'),
      priceRange: params.get('price'),
    });
  }, [location.search]);
  
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        
        // Get all activities from Firebase
        const activitiesCollection = collection(db, 'activities');
        const snapshot = await getDocs(activitiesCollection);
        
        if (snapshot.empty) {
          setActivities([]);
          return;
        }
        
        // Convert Firestore data to Activity objects
        const activitiesData = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title || '',
            description: data.description || '',
            price: data.price || 0,
            ageRange: data.ageRange || '',
            imageUrl: data.imageUrl || '',
            images: Array.isArray(data.images) ? data.images : [],
            location: data.location || '',
            programDetails: data.programDetails || '',
            activities: data.activities || [],
            featured: data.featured || false,
            category: data.category || '',
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
          } as Activity;
        });
        
        // Track page view with activity count
        trackEvent('view_activity_listing', {
          activity_count: activitiesData.length,
          has_filters: Object.values(activeFilters).some(Boolean)
        });
        
        setActivities(activitiesData);
      } catch (err: any) {
        console.error('Error fetching activities:', err);
        setError(`Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchActivities();
  }, []);
  
  // Get unique categories from activities for filtering
  const categories = useMemo(() => {
    const categoriesSet = new Set<string>();
    
    activities.forEach(activity => {
      if (activity.category) {
        categoriesSet.add(activity.category);
      }
    });
    
    return Array.from(categoriesSet).sort();
  }, [activities]);
  
  // Get unique age ranges from activities for filtering
  const ageRanges = useMemo(() => {
    const ageRangesSet = new Set<string>();
    
    activities.forEach(activity => {
      if (activity.ageRange) {
        ageRangesSet.add(activity.ageRange);
      }
    });
    
    return Array.from(ageRangesSet);
  }, [activities]);
  
  // Price ranges for filtering
  const priceRanges = [
    { label: 'Under $25', value: 'under-25', min: 0, max: 25 },
    { label: '$25 - $50', value: '25-50', min: 25, max: 50 },
    { label: '$50 - $100', value: '50-100', min: 50, max: 100 },
    { label: 'Over $100', value: 'over-100', min: 100, max: Infinity }
  ];
  
  // Filter activities based on active filters
  const filteredActivities = useMemo(() => {
    return activities.filter(activity => {
      // Category filter
      if (activeFilters.category && activity.category !== activeFilters.category) {
        return false;
      }
      
      // Age range filter (simplified for MVP)
      if (activeFilters.ageRange && activity.ageRange !== activeFilters.ageRange) {
        return false;
      }
      
      // Price range filter
      if (activeFilters.priceRange) {
        const priceRange = priceRanges.find(range => range.value === activeFilters.priceRange);
        if (priceRange && (activity.price < priceRange.min || activity.price > priceRange.max)) {
          return false;
        }
      }
      
      return true;
    });
  }, [activities, activeFilters]);
  
  // Helper function for image URLs
  const getImageUrl = (activity: Activity): string => {
    // Try to get image from images array first
    if (activity.images && activity.images.length > 0) {
      return activity.images[0];
    }
    
    // Fall back to imageUrl if available
    if (activity.imageUrl) {
      return activity.imageUrl;
    }
    
    // Default fallback
    return 'https://source.unsplash.com/random/600x400/?kids,activity';
  };
  
  // Handle category filter - with fixed type
  const handleCategoryChange = (category: string | undefined) => {
    if (!category) return;
    
    // Track filter usage
    trackEvent('apply_filter', { filter_type: 'category', filter_value: category });
    
    // Update URL with filters
    const params = new URLSearchParams(location.search);
    params.set('type', category);
    
    navigate({ pathname: location.pathname, search: params.toString() });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Explore Adventures</h1>
        </div>
        
        {/* Loading skeleton UI */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-6">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="flex justify-between items-center">
                  <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-8 bg-pink-200 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Error Loading Activities</h1>
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-8">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  if (activities.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">No Activities Found</h1>
        <p className="text-gray-600 mb-8">No activities are currently available.</p>
        <Link 
          to="/"
          className="bg-pink-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-pink-600 transition-colors"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Explore Adventures</h1>
        
        {/* Applied filters */}
        {activeFilters.category && (
          <div className="flex items-center">
            <span className="text-sm text-gray-600 mr-2">Filtered by:</span>
            <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
              {activeFilters.category}
              <button 
                onClick={() => {
                  const params = new URLSearchParams(location.search);
                  params.delete('type');
                  navigate({ pathname: location.pathname, search: params.toString() });
                }}
                className="ml-2 text-pink-600 hover:text-pink-800"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </span>
          </div>
        )}
      </div>
      
      {/* Category filters */}
      {categories.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-4">Categories</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  activeFilters.category === category
                    ? 'bg-pink-500 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Activities grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredActivities.map((activity) => {
          // Get image URL for this activity
          const imageUrl = getImageUrl(activity);
            
          return (
            <div key={activity.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div 
                className="h-48 bg-cover bg-center"
                style={{ 
                  backgroundImage: `url(${imageUrl})`,
                }}
              />
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold">{activity.title || 'No Title'}</h3>
                  <span className="bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded-full font-medium">
                    Ages {activity.ageRange || 'All Ages'}
                  </span>
                </div>
                
                {activity.category && (
                  <div className="mb-2">
                    <button 
                      onClick={() => handleCategoryChange(activity.category)}
                      className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded"
                    >
                      {activity.category}
                    </button>
                  </div>
                )}
                
                <p className="text-gray-600 mb-4">{activity.description || 'No description available'}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">${activity.price || 0}/child</span>
                  <Link 
                    to={`/booking/${activity.id}`}
                    className="bg-pink-500 text-white px-4 py-2 rounded font-medium hover:bg-pink-600 transition-colors"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Show "no results" message if filters return empty */}
      {activities.length > 0 && filteredActivities.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-bold mb-2">No activities match your filters</h3>
          <p className="text-gray-600 mb-6">Try changing your search criteria or explore all activities.</p>
          <button 
            onClick={() => {
              navigate(location.pathname);
            }}
            className="bg-pink-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-pink-600 transition-colors"
          >
            View All Activities
          </button>
        </div>
      )}
    </div>
  );
};

export default ActivityListing;