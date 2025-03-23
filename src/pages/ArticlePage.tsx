// src/pages/ArticlePage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getResourceById } from '../services/resourceService';
import { Resource } from '../models/Resource';
import { trackEvent } from '../services/firebase';

const ArticlePage = () => {
  const { id } = useParams<{ id: string }>();
  const [resource, setResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchResource = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const fetchedResource = await getResourceById(id);
        setResource(fetchedResource);
        
        // Track article view
        if (fetchedResource) {
          trackEvent('article_view', {
            article_id: fetchedResource.id,
            article_title: fetchedResource.title,
            article_category: fetchedResource.category
          });
        }
      } catch (err) {
        console.error('Error fetching resource article:', err);
        setError('Failed to load article. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchResource();
  }, [id]);
  
  // Handle external link redirect - moved outside conditional
  useEffect(() => {
    // Only redirect if resource exists, has external link, and no content
    if (resource && resource.externalLink && !resource.content) {
      window.location.href = resource.externalLink;
    }
  }, [resource]);
  
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-8"></div>
        <div className="h-64 bg-gray-200 rounded-lg mb-8"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }
  
  if (error || !resource) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
        <p className="mb-8">{error || "Sorry, we couldn't find the article you were looking for."}</p>
        <Link to="/resources" className="bg-pink-500 text-white px-6 py-3 rounded-lg font-medium">
          Browse Resources
        </Link>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <div className="mb-8">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link to="/" className="text-gray-700 hover:text-pink-500">
                Home
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
                <Link to="/resources" className="ml-1 text-gray-700 hover:text-pink-500 md:ml-2">
                  Resources
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
                <span className="ml-1 text-gray-500 md:ml-2">{resource.title}</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>
      
      {/* Article Header */}
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{resource.title}</h1>
        
        <div className="flex flex-wrap items-center text-gray-600 mb-6">
          <span className="bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded-full font-medium mr-3">
            {resource.category}
          </span>
          <span className="mr-3">|</span>
          <span>{resource.readTime}</span>
        </div>
        
        {/* Tags */}
        {resource.tags && resource.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 my-3">
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
      </header>
      
      {/* Feature Image */}
      {resource.imageUrl && (
        <div className="mb-8">
          <img
            src={resource.imageUrl}
            alt={resource.title}
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>
      )}
      
      {/* Article Content */}
      <div className="prose max-w-none">
        {resource.content ? (
          <div dangerouslySetInnerHTML={{ __html: resource.content }} />
        ) : (
          <div className="text-center py-8">
            <p className="text-xl text-gray-600 mb-6">This article is available on an external site.</p>
            <a 
              href={resource.externalLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-pink-600 transition-colors"
            >
              Read Full Article
            </a>
          </div>
        )}
      </div>
      
      {/* Share Buttons */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <h3 className="text-lg font-bold mb-4">Share this article</h3>
        <div className="flex space-x-4">
          <button 
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(resource.title)}`, '_blank');
              }
            }}
            className="bg-blue-400 text-white p-2 rounded-full hover:bg-blue-500"
          >
            <span className="sr-only">Share on Twitter</span>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482 13.986 13.986 0 01-10.15-5.145 4.92 4.92 0 001.522 6.57 4.924 4.924 0 01-2.227-.616v.06a4.92 4.92 0 003.944 4.827 4.885 4.885 0 01-2.221.085 4.92 4.92 0 004.6 3.417 9.873 9.873 0 01-6.113 2.106c-.39 0-.78-.023-1.17-.067a13.952 13.952 0 007.548 2.213c9.057 0 14.01-7.5 14.01-14.005 0-.21-.005-.422-.014-.63A10.022 10.022 0 0024 4.57" />
            </svg>
          </button>
          <button 
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
              }
            }}
            className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700"
          >
            <span className="sr-only">Share on Facebook</span>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
            </svg>
          </button>
          <button 
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.open(`mailto:?subject=${encodeURIComponent(resource.title)}&body=${encodeURIComponent(`Check out this article: ${window.location.href}`)}`, '_blank');
              }
            }}
            className="bg-gray-600 text-white p-2 rounded-full hover:bg-gray-700"
          >
            <span className="sr-only">Share via Email</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Related Articles - This would require additional implementation */}
      <div className="mt-12">
        <h3 className="text-2xl font-bold mb-6">Related Articles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* You would add related articles here */}
          <div className="bg-gray-100 p-8 rounded-lg text-center">
            <p className="text-gray-600">More articles coming soon!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticlePage;