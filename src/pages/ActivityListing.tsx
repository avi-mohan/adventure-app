import React from 'react';
import { Link } from 'react-router-dom';

// Sample activity data
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

const ActivityListing = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Explore Adventures</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {activities.map((activity) => (
          <div key={activity.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div 
              className="h-48 bg-gray-200"
              style={{ 
                backgroundImage: `url(${activity.imageUrl})`,
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