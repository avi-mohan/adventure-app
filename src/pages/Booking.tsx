// src/pages/Booking.tsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import ActivityDetail from '../components/activities/ActivityDetail';

// Extended sample activity data with structured information
const activities = [
  {
    id: 1,
    title: "Nature Explorer Camp",
    description: "Nature Explorer Camp is a sleepaway adventure experience for children located in the beautiful forests of the Pacific Northwest. Our camp provides a unique opportunity for kids to connect with nature, learn outdoor skills, and make lifelong friendships in a safe and supervised environment.",
    price: 45,
    ageRange: "6-12",
    imageUrl: "https://source.unsplash.com/random/600x400/?kids,nature",
    websiteUrl: "https://natureexplorers.com/register",
    programDetails: "Sessions: 2-week, 4-week, and full summer options available",
    location: "Accessible via shuttle bus from Seattle, situated on 200 acres of protected wilderness",
    activities: [
      "Outdoor Adventure: Hiking, nature identification, and overnight camping trips",
      "Wildlife Observation: Bird watching, animal tracking, and ecosystem exploration",
      "Hands-on Learning: Plant identification, environmental conservation, and wilderness survival skills",
      "Creative Nature: Nature-inspired art, journaling, and photography"
    ]
  },
  {
    id: 2,
    title: "Junior Chefs Cooking Class",
    description: "Junior Chefs Cooking Class is a hands-on culinary program where children learn to prepare delicious and healthy meals in a fun, educational environment. Our professional chefs guide participants through age-appropriate recipes while teaching kitchen safety, nutrition, and food science.",
    price: 35,
    ageRange: "8-14",
    imageUrl: "https://source.unsplash.com/random/600x400/?kids,cooking",
    websiteUrl: "https://juniorchefsclub.com/register",
    programDetails: "Weekly classes available, with 8-week curriculum sessions",
    location: "Downtown Culinary Center, 123 Main Street",
    activities: [
      "Culinary Basics: Knife skills, food safety, and kitchen equipment",
      "International Cuisines: Explore recipes from around the world",
      "Baking & Pastry: Learn the science behind perfect baked goods",
      "Farm to Table: Understanding seasonal ingredients and sustainable cooking"
    ]
  },
  {
    id: 3,
    title: "Science Discovery Lab",
    description: "Science Discovery Lab offers hands-on STEM exploration where children can conduct fascinating experiments and learn about chemistry, physics, and biology through interactive activities. Our lab provides a safe environment for curious minds to explore scientific concepts with professional guidance.",
    price: 40,
    ageRange: "7-15",
    imageUrl: "https://source.unsplash.com/random/600x400/?kids,science",
    websiteUrl: "https://sciencediscoverylab.org/register",
    programDetails: "Single-day workshops and weekly camp options available",
    location: "Innovation Center at Miller Science Museum",
    activities: [
      "Chemistry Exploration: Create reactions, understand molecules, and mix solutions",
      "Physics in Action: Build simple machines, understand forces, and explore magnetism",
      "Biology Discovery: Microscope investigations, DNA extraction, and ecosystem studies",
      "Engineering Challenges: Design, build, and test various structures and inventions"
    ]
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
    <ActivityDetail activity={activity} />
  );
};

export default Booking;