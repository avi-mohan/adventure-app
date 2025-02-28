// src/pages/Booking.tsx (update)
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import BookingForm from '../components/booking/bookingForm';

// Sample activity data - in a real app, this would come from an API
const activities = [
  {
    id: 1,
    title: "Nature Explorer Camp",
    description: "Discover wildlife, plants, and natural wonders in our guided outdoor adventure.",
    price: 45,
    ageRange: "6-12",
    imageUrl: "https://source.unsplash.com/random/600x400/?kids,nature",
  },
  {
    id: 2,
    title: "Junior Chefs Cooking Class",
    description: "Learn to prepare delicious and healthy meals in a fun, hands-on environment.",
    price: 35,
    ageRange: "8-14",
    imageUrl: "https://source.unsplash.com/random/600x400/?kids,cooking",
  },
  {
    id: 3,
    title: "Science Discovery Lab",
    description: "Explore fascinating experiments and learn about chemistry, physics, and biology.",
    price: 40,
    ageRange: "7-15",
    imageUrl: "https://source.unsplash.com/random/600x400/?kids,science",
  }
];

const Booking = () => {
  const { id } = useParams<{ id: string }>();
  
  // Find the activity based on the id parameter
  const activity = activities.find(a => a.id === parseInt(id || '0'));
  
  if (!activity) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Activity Not Found</h1>
        <p className="mb-8">Sorry, we couldn't find the activity you were looking for.</p>
        <Link to="/activities" className="bg-pink-500 text-white px-6 py-3 rounded-lg font-medium">
          Browse Activities
        </Link>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link to="/activities" className="text-pink-500 hover:text-pink-600 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Activities
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Activity Details */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{activity.title}</h1>
          <div 
            className="w-full h-64 rounded-lg mb-4"
            style={{ 
              backgroundImage: `url(${activity.imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center' 
            }}
          />
          <p className="text-gray-700 mb-4">{activity.description}</p>
          <div className="mb-4">
            <span className="text-sm bg-pink-100 text-pink-800 px-2 py-1 rounded-full font-medium">
              Ages {activity.ageRange}
            </span>
          </div>
        </div>
        
        {/* Booking Form */}
        <BookingForm 
          activityId={activity.id} 
          activityName={activity.title} 
          price={activity.price} 
        />
      </div>
    </div>
  );
};

export default Booking;