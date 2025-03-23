// src/pages/ArticlePage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getResourceById } from '../services/resourceService';
import { Resource } from '../models/Resource';
import { trackEvent } from '../services/firebase';
import '../styles/article.css'; // Import new article-specific styles

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
  
  // Handle external link redirect
  useEffect(() => {
    // Only redirect if resource exists, has external link, and no content
    if (resource && resource.externalLink && !resource.content) {
      window.location.href = resource.externalLink;
    }
  }, [resource]);
  
  if (loading) {
    return (
      <div className="article-container article-loading">
        <div className="article-header-skeleton"></div>
        <div className="article-image-skeleton"></div>
        <div className="article-content-skeleton">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }
  
  if (error || !resource) {
    return (
      <div className="article-container article-error">
        <h1>Article Not Found</h1>
        <p>{error || "Sorry, we couldn't find the article you were looking for."}</p>
        <Link to="/resources" className="btn-primary">
          Browse Resources
        </Link>
      </div>
    );
  }
  
  // Format date if available
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    } catch (e) {
      return '';
    }
  };
  
  return (
    <div className="article-page">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <span className="separator">&gt;</span>
        <Link to="/resources">Resources</Link>
        <span className="separator">&gt;</span>
        <span className="current">{resource.title}</span>
      </div>
      
      <article className="article-container">
        {/* Article Header */}
        <header className="article-header">
          <h1>{resource.title}</h1>
          
          <div className="article-meta">
            <div className="category-tag">{resource.category}</div>
            <div className="dot-separator">•</div>
            <div className="read-time">{resource.readTime}</div>
          </div>
          
          {resource.tags && resource.tags.length > 0 && (
            <div className="article-tags">
              {resource.tags.map((tag, index) => (
                <span key={index} className="tag">#{tag}</span>
              ))}
            </div>
          )}
        </header>
        
        {/* Feature Image */}
        {resource.imageUrl && (
          <div className="article-feature-image">
            <img
              src={resource.imageUrl}
              alt={resource.title}
            />
          </div>
        )}
        
        {/* Author Info - Simple version without Medium buttons */}
        <div className="article-author">
          <div className="author-avatar">
            <img src="/kidobee-avatar.png" alt="Kidobee" />
          </div>
          <div className="author-details">
            <div className="author-name">Kidobee</div>
            <div className="article-date">{formatDate(resource.createdAt?.toString())}</div>
          </div>
        </div>
        
        {/* Article Content */}
        <div className="article-content">
          {resource.content ? (
            <div dangerouslySetInnerHTML={{ __html: resource.content }} />
          ) : (
            <div className="external-link">
              <p>This article is available on an external site.</p>
              <a 
                href={resource.externalLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-primary"
              >
                Read Full Article
              </a>
            </div>
          )}
        </div>
        
        {/* Share Section */}
        <div className="article-share">
          <h3>Share this article</h3>
          <div className="share-buttons">
            <button 
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(resource.title)}`, '_blank');
                }
              }}
              className="share-button twitter-share"
              aria-label="Share on Twitter"
            >
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482 13.986 13.986 0 01-10.15-5.145 4.92 4.92 0 001.522 6.57 4.924 4.924 0 01-2.227-.616v.06a4.92 4.92 0 003.944 4.827 4.885 4.885 0 01-2.221.085 4.92 4.92 0 004.6 3.417 9.873 9.873 0 01-6.113 2.106c-.39 0-.78-.023-1.17-.067a13.952 13.952 0 007.548 2.213c9.057 0 14.01-7.5 14.01-14.005 0-.21-.005-.422-.014-.63A10.022 10.022 0 0024 4.57" />
              </svg>
            </button>
            <button 
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
                }
              }}
              className="share-button facebook-share"
              aria-label="Share on Facebook"
            >
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
            </button>
            <button 
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.open(`mailto:?subject=${encodeURIComponent(resource.title)}&body=${encodeURIComponent(`Check out this article: ${window.location.href}`)}`, '_blank');
                }
              }}
              className="share-button email-share"
              aria-label="Share via Email"
            >
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>
      </article>
    </div>
  );
};

export default ArticlePage;