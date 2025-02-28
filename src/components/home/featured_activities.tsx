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

const FeaturedActivities = () => {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Popular Adventures</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activities.map((activity) => (
            <div key={activity.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div 
                className="h-48 bg-gray-200 bg-cover bg-center"
                style={{ backgroundImage: `url(${activity.imageUrl})` }}
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
          ))}
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