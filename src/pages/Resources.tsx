// src/pages/Resources.tsx
import React from 'react';
import { Link } from 'react-router-dom';

// Sample parenting articles data
const parentingArticles = [
  {
    id: 1,
    title: "How to Encourage Your Child's Creativity",
    description: "Discover practical ways to nurture your child's imagination and creative thinking.",
    category: "Development",
    readTime: "5 min read",
    imageUrl: "https://source.unsplash.com/random/600x400/?kids,creativity",
    externalLink: "https://www.pbs.org/parents/thrive/nurturing-creativity"
  },
  {
    id: 2,
    title: "Outdoor Activities That Boost Learning",
    description: "Learn how nature-based adventures can enhance your child's cognitive development.",
    category: "Education",
    readTime: "7 min read",
    imageUrl: "https://source.unsplash.com/random/600x400/?kids,outdoor",
    externalLink: "https://www.naeyc.org/our-work/families/playing-outdoors"
  },
  {
    id: 3,
    title: "Building Confidence in Shy Children",
    description: "Strategies to help introverted kids feel more comfortable in social situations.",
    category: "Social Skills",
    readTime: "6 min read",
    imageUrl: "https://source.unsplash.com/random/600x400/?child,shy",
    externalLink: "https://childmind.org/article/help-kids-who-are-shy-or-socially-anxious/"
  },
  {
    id: 4,
    title: "Healthy Snacks for Active Kids",
    description: "Nutritious and delicious snack ideas to fuel your child's adventures.",
    category: "Nutrition",
    readTime: "4 min read",
    imageUrl: "https://source.unsplash.com/random/600x400/?kids,food",
    externalLink: "https://www.healthychildren.org/English/healthy-living/nutrition/Pages/Snacks-and-Sugary-Foods-in-the-Diet-AAP-Policy-Explained.aspx"
  },
  {
    id: 5,
    title: "Screen Time Guidelines for Children",
    description: "Expert recommendations on managing technology use in a healthy way.",
    category: "Wellness",
    readTime: "8 min read",
    imageUrl: "https://source.unsplash.com/random/600x400/?child,technology",
    externalLink: "https://www.mayoclinic.org/healthy-lifestyle/childrens-health/in-depth/screen-time/art-20047952"
  },
  {
    id: 6,
    title: "Developing a Growth Mindset in Children",
    description: "Help your child embrace challenges and persist through difficulties.",
    category: "Development",
    readTime: "6 min read",
    imageUrl: "https://source.unsplash.com/random/600x400/?child,learning",
    externalLink: "https://www.mindsetworks.com/parents/growth-mindset-parenting"
  }
];

const Resources = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Parenting Resources</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Helpful articles, guides, and tips to support your parenting journey and enhance your child's development.
        </p>
      </div>
      
      {/* Filter Categories */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        <button className="bg-pink-500 text-white px-4 py-2 rounded-full">All Resources</button>
        <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-50">Development</button>
        <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-50">Education</button>
        <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-50">Nutrition</button>
        <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-50">Social Skills</button>
        <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-50">Wellness</button>
      </div>
      
      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {parentingArticles.map((article) => (
          <a 
            key={article.id} 
            href={article.externalLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div 
              className="h-48 bg-cover bg-center"
              style={{ backgroundImage: `url(${article.imageUrl})` }}
            />
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <span className="bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded-full font-medium">
                  {article.category}
                </span>
                <span className="text-gray-500 text-sm">{article.readTime}</span>
              </div>
              <h3 className="text-xl font-bold mb-2">{article.title}</h3>
              <p className="text-gray-600 mb-4">{article.description}</p>
              <div className="text-pink-500 font-medium flex items-center">
                Read Article
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </a>
        ))}
      </div>
      
      {/* Newsletter Signup */}
      <div className="mt-16 bg-gray-100 rounded-lg p-6 md:p-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Get Parenting Tips in Your Inbox</h2>
          <p className="text-gray-600 mb-6">
            Subscribe to our newsletter for the latest resources, activity ideas, and parenting advice.
          </p>
          <form className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
            <button
              type="submit"
              className="bg-pink-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-pink-600 transition-colors"
            >
              Subscribe
            </button>
          </form>
          <p className="text-sm text-gray-500 mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Resources;