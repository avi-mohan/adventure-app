import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFeaturedActivities } from '../../services/activityService';
import { Activity } from '../../models/Activity';

const FeaturedActivities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const featuredActivities = await getFeaturedActivities(8); // Get top 8 featured activities
        setActivities(featuredActivities);
      } catch (err) {
        console.error('Error fetching featured activities:', err);
        setError('Failed to load featured activities');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (loading) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto mb-12"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-8 bg-teal-200 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-12">Popular Adventures</h2>
          <p className="text-red-500 mb-4">{error}</p>
          <p>We're working on fixing this issue. Please check back later.</p>
        </div>
      </section>
    );
  }

  // If no featured activities, show a message
  if (activities.length === 0) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-8">Popular Adventures</h2>
          <p className="mb-8">No featured activities available at the moment.</p>
          <Link 
            to="/activities"
            className="bg-pink-500 text-white px-8 py-3 rounded-lg font-bold inline-block hover:bg-pink-600 transition-colors"
          >
            View All Activities
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Popular Adventures</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {activities.map((activity) => {
            // Get first image from images array, or use imageUrl, or use placeholder
            const imageToDisplay = (activity as any).images && (activity as any).images.length > 0 
              ? (activity as any).images[0] 
              : (activity.imageUrl || 'https://source.unsplash.com/random/600x400/?kids,activity');
              
            return (
              <div key={activity.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div 
                  className="h-48 bg-gray-200 bg-cover bg-center"
                  style={{ backgroundImage: `url(${imageToDisplay})` }}
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
                      className="bg-teal-500 text-white px-4 py-2 rounded font-medium hover:bg-teal-600 transition-colors"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="text-center mt-12">
          <Link 
            to="/activities"
            className="bg-pink-500 text-white px-8 py-3 rounded-lg font-bold inline-block hover:bg-pink-600 transition-colors"
          >
            View All Adventures
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedActivities;