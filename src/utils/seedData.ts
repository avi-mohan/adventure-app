// src/utils/seedData.ts
import { createActivity } from '../services/activityService';
import { createResource } from '../services/resourceService';

// Sample activity data
const sampleActivities = [
  {
    title: "Nature Explorer Camp",
    description: "Discover wildlife, plants, and natural wonders in our guided outdoor adventure.",
    price: 45,
    ageRange: "6-12",
    imageUrl: "https://source.unsplash.com/random/600x400/?kids,nature",
    location: "Accessible via shuttle bus from Seattle, situated on 200 acres of protected wilderness",
    programDetails: "Sessions: 2-week, 4-week, and full summer options available",
    activities: [
      "Outdoor Adventure: Hiking, nature identification, and overnight camping trips",
      "Wildlife Observation: Bird watching, animal tracking, and ecosystem exploration",
      "Hands-on Learning: Plant identification, environmental conservation, and wilderness survival skills",
      "Creative Nature: Nature-inspired art, journaling, and photography"
    ],
    featured: true
  },
  {
    title: "Junior Chefs Cooking Class",
    description: "Learn to prepare delicious and healthy meals in a fun, hands-on environment.",
    price: 35,
    ageRange: "8-14",
    imageUrl: "https://source.unsplash.com/random/600x400/?kids,cooking",
    location: "Downtown Culinary Center, 123 Main Street",
    programDetails: "Weekly classes available, with 8-week curriculum sessions",
    activities: [
      "Culinary Basics: Knife skills, food safety, and kitchen equipment",
      "International Cuisines: Explore recipes from around the world",
      "Baking & Pastry: Learn the science behind perfect baked goods",
      "Farm to Table: Understanding seasonal ingredients and sustainable cooking"
    ],
    featured: true
  },
  {
    title: "Science Discovery Lab",
    description: "Explore fascinating experiments and learn about chemistry, physics, and biology.",
    price: 40,
    ageRange: "7-15",
    imageUrl: "https://source.unsplash.com/random/600x400/?kids,science",
    location: "Innovation Center at Miller Science Museum",
    programDetails: "Single-day workshops and weekly camp options available",
    activities: [
      "Chemistry Exploration: Create reactions, understand molecules, and mix solutions",
      "Physics in Action: Build simple machines, understand forces, and explore magnetism",
      "Biology Discovery: Microscope investigations, DNA extraction, and ecosystem studies",
      "Engineering Challenges: Design, build, and test various structures and inventions"
    ],
    featured: true
  },
  {
    title: "Art & Painting Workshop",
    description: "Express creativity through various art mediums with professional guidance.",
    price: 38,
    ageRange: "5-16",
    imageUrl: "https://source.unsplash.com/random/600x400/?kids,art",
    featured: false
  },
  {
    title: "Robotics for Kids",
    description: "Build and program your own robots in this hands-on technology adventure.",
    price: 55,
    ageRange: "9-16",
    imageUrl: "https://source.unsplash.com/random/600x400/?kids,robotics",
    featured: false
  }
];

// Sample resource data
const sampleResources = [
  {
    title: "How to Encourage Your Child's Creativity",
    description: "Discover practical ways to nurture your child's imagination and creative thinking.",
    category: "Development",
    readTime: "5 min read",
    imageUrl: "https://source.unsplash.com/random/600x400/?kids,creativity",
    externalLink: "https://www.pbs.org/parents/thrive/nurturing-creativity",
    featured: true,
    tags: ["creativity", "development", "growth-mindset"]
  },
  {
    title: "Outdoor Activities That Boost Learning",
    description: "Learn how nature-based adventures can enhance your child's cognitive development.",
    category: "Education",
    readTime: "7 min read",
    imageUrl: "https://source.unsplash.com/random/600x400/?kids,outdoor",
    externalLink: "https://www.naeyc.org/our-work/families/playing-outdoors",
    featured: true,
    tags: ["outdoor", "learning", "nature", "development"]
  },
  {
    title: "Building Confidence in Shy Children",
    description: "Strategies to help introverted kids feel more comfortable in social situations.",
    category: "Social Skills",
    readTime: "6 min read",
    imageUrl: "https://source.unsplash.com/random/600x400/?child,shy",
    externalLink: "https://childmind.org/article/help-kids-who-are-shy-or-socially-anxious/",
    featured: false,
    tags: ["confidence", "social-skills", "shy-children"]
  }
];

// Function to seed activities data
export const seedActivities = async () => {
  try {
    console.log('Seeding activities...');
    
    for (const activity of sampleActivities) {
      await createActivity(activity);
      console.log(`Created activity: ${activity.title}`);
    }
    
    console.log('Successfully seeded activities!');
  } catch (error) {
    console.error('Error seeding activities:', error);
  }
};

// Function to seed resources data
export const seedResources = async () => {
  try {
    console.log('Seeding resources...');
    
    for (const resource of sampleResources) {
      await createResource(resource);
      console.log(`Created resource: ${resource.title}`);
    }
    
    console.log('Successfully seeded resources!');
  } catch (error) {
    console.error('Error seeding resources:', error);
  }
};

// Function to seed all data
export const seedAllData = async () => {
  await seedActivities();
  await seedResources();
  console.log('All data seeded successfully!');
};