import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Activity } from '../models/Activity';

// Debuggable version with properly typed state
const ActivityListing = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState('No info yet');

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        setDebugInfo('Fetching from Firestore...');
        
        // Direct Firestore query to get all activities
        const activitiesCollection = collection(db, 'activities');
        const snapshot = await getDocs(activitiesCollection);
        
        if (snapshot.empty) {
          setDebugInfo('No activities found in Firestore');
          setActivities([]);
          return;
        }
        
        setDebugInfo(`Found ${snapshot.docs.length} activities`);
        
        // Convert Firestore data to Activity objects with proper typing
        const activitiesData = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title || '',
            description: data.description || '',
            price: data.price || 0,
            ageRange: data.ageRange || '',
            imageUrl: data.imageUrl || '',
            location: data.location || '',
            programDetails: data.programDetails || '',
            activities: data.activities || [],
            featured: data.featured || false,
            category: data.category || '',
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
          } as Activity;
        });
        
        setDebugInfo(`Processed ${activitiesData.length} activities`);
        setActivities(activitiesData);
      } catch (err: any) {
        console.error('Error fetching activities:', err);
        setError(`Error: ${err.message}`);
        setDebugInfo(`Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchActivities();
  }, []);
  
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Loading Activities...</h1>
        <div className="bg-blue-50 p-4 rounded text-blue-800">
          {debugInfo}
        </div>
        <div className="mt-4 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
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
          <div className="mt-4 p-4 bg-gray-100 text-left overflow-auto rounded">
            <pre>{debugInfo}</pre>
          </div>
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
        <div className="bg-yellow-50 p-4 rounded text-yellow-800 mb-8">
          Debug Info: {debugInfo}
        </div>
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
      <h1 className="text-3xl font-bold mb-4">Explore Adventures</h1>
      <div className="bg-green-50 p-4 rounded text-green-800 mb-8">
        Found {activities.length} activities | {debugInfo}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {activities.map((activity) => {
          // Get first image from images array, or use imageUrl, or use placeholder
          let imageToDisplay = 'https://source.unsplash.com/random/600x400/?kids,activity';
          
          // Only try to access images if the property exists
          const hasImages = 'images' in activity && Array.isArray(activity.images) && activity.images.length > 0;
          if (hasImages) {
            imageToDisplay = activity.images![0];
          } else if (activity.imageUrl) {
            imageToDisplay = activity.imageUrl;
          }
          
          return (
            <div key={activity.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div 
                className="h-48 bg-gray-200 bg-cover bg-center"
                style={{ 
                  backgroundImage: `url(${imageToDisplay})`,
                }}
              />
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold">{activity.title || 'No Title'}</h3>
                  <span className="bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded-full font-medium">
                    Ages {activity.ageRange || 'All Ages'}
                  </span>
                </div>
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
    </div>
  );
};

export default ActivityListing;