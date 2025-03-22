// src/pages/Resources.tsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getAllResources, getResourcesByCategory } from '../services/resourceService';
import { Resource } from '../models/Resource';
import ResourceCard from '../components/resources/ResourceCard';
import { trackEvent } from '../services/firebase';

const Resources = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get active category from URL params
  const query = new URLSearchParams(location.search);
  const categoryParam = query.get('category');
  
  // Set active category from URL or default to 'All'
  const [activeCategory, setActiveCategory] = useState(categoryParam || 'All');
  
  // Update activeCategory when URL params change
  useEffect(() => {
    setActiveCategory(categoryParam || 'All');
  }, [categoryParam]);
  
  // List of available categories - in a real app, you might fetch these dynamically
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
        
        // Track page view with resource count and filter
        trackEvent('view_resources_page', {
          resource_count: fetchedResources.length,
          filter_category: activeCategory
        });
        
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
  
  // Handle category change with URL update
  const handleCategoryChange = (category: string) => {
    const newCategory = category === 'All' ? null : category;
    
    // Track filter usage
    trackEvent('apply_resource_filter', { 
      filter_type: 'category', 
      filter_value: category 
    });
    
    // Update URL with the selected category
    if (newCategory) {
      navigate({ pathname: location.pathname, search: `?category=${newCategory}` });
    } else {
      navigate({ pathname: location.pathname });
    }
  };
  
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
      
      {/* Category filters with active indicator */}
      <div className="mb-10">
        {/* Applied filter indicator */}
        {activeCategory !== 'All' && (
          <div className="flex justify-center mb-4">
            <div className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
              Filtered by: {activeCategory}
              <button 
                onClick={() => handleCategoryChange('All')}
                className="ml-2 text-pink-600 hover:text-pink-800"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}
        
        {/* Filter Categories */}
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <button 
              key={category}
              onClick={() => handleCategoryChange(category)}
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
      </div>
      
      {/* No results message */}
      {resources.length === 0 && (
        <div className="text-center py-8">
          <p className="text-xl text-gray-600">No resources found for this category.</p>
          <button
            onClick={() => handleCategoryChange('All')}
            className="mt-4 bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition-colors"
          >
            View All Resources
          </button>
        </div>
      )}
      
      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {resources.map((resource) => (
          <ResourceCard key={resource.id} resource={resource} />
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