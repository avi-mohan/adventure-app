// src/components/resources/ResourceCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Resource } from '../../models/Resource';

interface ResourceCardProps {
  resource: Resource;
}

const ResourceCard = ({ resource }: ResourceCardProps) => {
  // Determine if we should link internally or externally
  // Link internally if we have content, externally if externalLink and no content
  const useInternalLink = resource.content || !resource.externalLink;
  
  // Card wrapper - either Link or a element
  const CardWrapper = ({ children }: { children: React.ReactNode }) => {
    if (useInternalLink) {
      return (
        <Link 
          to={`/resources/${resource.id}`}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow block"
        >
          {children}
        </Link>
      );
    }
    
    return (
      <a 
        href={resource.externalLink}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow block"
      >
        {children}
      </a>
    );
  };
  
  return (
    <CardWrapper>
      <div 
        className="h-48 bg-cover bg-center"
        style={{ backgroundImage: `url(${resource.imageUrl})` }}
      />
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <span className="bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded-full font-medium">
            {resource.category}
          </span>
          <span className="text-gray-500 text-sm">{resource.readTime}</span>
        </div>
        <h3 className="text-xl font-bold mb-2">{resource.title}</h3>
        <p className="text-gray-600 mb-4">{resource.description}</p>
        <div className="text-pink-500 font-medium flex items-center">
          {useInternalLink ? "Read Article" : "Read on External Site"}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
        
        {/* Display tags if available */}
        {resource.tags && Array.isArray(resource.tags) && resource.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {resource.tags.map((tag, index) => (
              <span 
                key={index} 
                className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </CardWrapper>
  );
};

export default ResourceCard;