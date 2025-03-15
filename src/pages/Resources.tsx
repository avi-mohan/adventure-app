// src/pages/Resources.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllResources, getResourcesByCategory } from '../services/resourceService';
import { Resource } from '../models/Resource';

const Resources = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // List of available categories
  const categories = ['All', 'Development', 'Education', 'Nutrition', 'Social Skills', 'Wellness'];

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        let fetchedResources: Resource[];

        if (activeCategory === 'All') {
          fetchedResources = await getAllResources();
        } else {
          fetchedResources = await getResourcesByCategory(activeCategory);
        }

        setResources(fetchedResources);
      } catch (err) {
        console.error('Error fetching resources:', err);
        setError('Failed to load resources. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [activeCategory]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-2 mb-10 animate-pulse">
          {categories.map((category, index) => (
            <div key={index} className="h-10 bg-gray-200 rounded-full w-24"></div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Resources</h1>
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-8">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 text-sm underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

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
        {categories.map((category) => (
          <button 
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`${
              activeCategory === category 
                ? 'bg-pink-500 text-white' 
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            } px-4 py-2 rounded-full`}
          >
            {category}
          </button>
        ))}
      </div>
      
      {/* No results message */}
      {resources.length === 0 && (
        <div className="text-center py-8">
          <p className="text-xl text-gray-600">No resources found for this category.</p>
          <button
            onClick={() => setActiveCategory('All')}
            className="mt-4 bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition-colors"
          >
            View All Resources
          </button>
        </div>
      )}
      
      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {resources.map((article) => (
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