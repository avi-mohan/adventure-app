import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getAllActivities, searchActivities } from '../services/activityService';
import { Activity } from '../models/Activity';

const ActivityListing = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const locationParam = searchParams.get('location');
  const fromDate = searchParams.get('from');
  const toDate = searchParams.get('to');
  const ageParams = searchParams.getAll('age');
  
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        
        // If we have search parameters, use the search function
        if (locationParam || fromDate || toDate || ageParams.length > 0) {
          const searchTerm = locationParam || '';
          const filters: Record<string, any> = {};
          
          if (ageParams.length > 0) {
            filters.ageRange = ageParams;
          }
          
          if (fromDate) {
            filters.fromDate = fromDate;
          }
          
          if (toDate) {
            filters.toDate = toDate;
          }
          
          const results = await searchActivities(searchTerm, filters);
          setActivities(results);
        } else {
          // Otherwise, get all activities
          const allActivities = await getAllActivities();
          setActivities(allActivities);
        }
      } catch (err) {
        console.error('Error fetching activities:', err);
        setError('Failed to load activities. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchActivities();
  }, [locationParam, fromDate, toDate, ageParams]);
  
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-10 bg-pink-200 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-8">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 text-sm underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }
  
  if (activities.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">No Activities Found</h1>
        <p className="text-gray-600 mb-8">Try adjusting your search criteria or explore all of our activities.</p>
        <Link 
          to="/activities"
          className="bg-pink-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-pink-600 transition-colors"
        >
          View All Activities
        </Link>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Explore Adventures</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {activities.map((activity) => (
          <div key={activity.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div 
              className="h-48 bg-gray-200"
              style={{ 
                backgroundImage: `url(${(activity as any).images && (activity as any).images.length > 0 
                  ? (activity as any).images[0] 
                  : (activity.imageUrl || 'https://source.unsplash.com/random/600x400/?kids,activity')})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center' 
              }}
            />
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold">{activity.title}</h3>
                <span className="bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded-full font-medium">
                  Ages {activity.ageRange}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{activity.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">${activity.price}/child</span>
                <Link 
                  to={`/booking/${activity.id}`}
                  className="bg-pink-500 text-white px-4 py-2 rounded font-medium hover:bg-pink-600 transition-colors"
                >
                  Book Now
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityListing;