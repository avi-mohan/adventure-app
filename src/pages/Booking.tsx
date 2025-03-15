// src/pages/Booking.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ActivityDetail from '../components/activities/ActivityDetail';
import { getActivityById } from '../services/activityService';
import { Activity } from '../models/Activity';

const Booking = () => {
  const { id } = useParams<{ id: string }>();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchActivity = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const fetchedActivity = await getActivityById(id);
        setActivity(fetchedActivity);
      } catch (err) {
        console.error('Error fetching activity:', err);
        setError('Failed to load activity details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchActivity();
  }, [id]);
  
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="h-64 bg-gray-200 rounded-lg mb-6"></div>
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="h-8 bg-gray-200 rounded mb-6"></div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
            <div className="h-20 bg-gray-200 rounded mb-6"></div>
            <div className="h-10 bg-pink-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !activity) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Activity Not Found</h1>
        <p className="mb-8">{error || "Sorry, we couldn't find the activity you were looking for."}</p>
        <Link to="/activities" className="bg-pink-500 text-white px-6 py-3 rounded-lg font-medium">
          Browse Activities
        </Link>
      </div>
    );
  }
  
  return <ActivityDetail activity={activity} />;
};

export default Booking;