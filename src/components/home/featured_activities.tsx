import React from 'react';
import { Link } from 'react-router-dom';

// Extended sample activity data with more options
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
  },
  {
    id: 4,
    title: "Art & Painting Workshop",
    description: "Express creativity through various art mediums with professional guidance.",
    price: 38,
    ageRange: "5-16",
    imageUrl: "https://source.unsplash.com/random/600x400/?kids,art",
  },
  {
    id: 5,
    title: "Robotics for Kids",
    description: "Build and program your own robots in this hands-on technology adventure.",
    price: 55,
    ageRange: "9-16",
    imageUrl: "https://source.unsplash.com/random/600x400/?kids,robotics",
  },
  {
    id: 6,
    title: "Sports Camp Extravaganza",
    description: "Try different sports activities in a fun, non-competitive environment.",
    price: 42,
    ageRange: "6-14",
    imageUrl: "https://source.unsplash.com/random/600x400/?kids,sports",
  },
  {
    id: 7,
    title: "Music & Rhythm Workshop",
    description: "Discover various instruments and create music in an encouraging setting.",
    price: 40,
    ageRange: "4-12",
    imageUrl: "https://source.unsplash.com/random/600x400/?kids,music",
  },
  {
    id: 8,
    title: "Toddler Adventure Play",
    description: "Supervised play activities designed specifically for our youngest adventurers.",
    price: 30,
    ageRange: "2-4",
    imageUrl: "https://source.unsplash.com/random/600x400/?toddler,play",
  },
  {
    id: 9,
    title: "Teen Photography Expedition",
    description: "Learn photography skills while exploring beautiful locations with professional equipment.",
    price: 60,
    ageRange: "12-17",
    imageUrl: "https://source.unsplash.com/random/600x400/?teen,photography",
  },
  {
    id: 10,
    title: "Little Gardeners Club",
    description: "Plant, grow, and learn about nature in our specially designed children's garden.",
    price: 35,
    ageRange: "4-10",
    imageUrl: "https://source.unsplash.com/random/600x400/?kids,gardening",
  },
  {
    id: 11,
    title: "Adventure Obstacle Course",
    description: "Challenge yourself on our exciting obstacle course designed for all skill levels.",
    price: 38,
    ageRange: "6-15",
    imageUrl: "https://source.unsplash.com/random/600x400/?kids,obstacle",
  },
  {
    id: 12,
    title: "Story & Theater Camp",
    description: "Create characters, write stories, and perform in our culminating theater showcase.",
    price: 45,
    ageRange: "7-14",
    imageUrl: "https://source.unsplash.com/random/600x400/?kids,theater",
  }
];

const FeaturedActivities = () => {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Popular Adventures</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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