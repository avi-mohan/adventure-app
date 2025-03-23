// src/components/admin/ArticleEditor.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getResourceById, updateArticleContent } from '../../services/resourceService';
import { Resource } from '../../models/Resource';

const ArticleEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [resource, setResource] = useState<Resource | null>(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchResource = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const fetchedResource = await getResourceById(id);
        setResource(fetchedResource);
        setContent(fetchedResource?.content || '');
      } catch (err) {
        console.error('Error fetching resource for editing:', err);
        setError('Failed to load article. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchResource();
  }, [id]);
  
  const handleSave = async () => {
    if (!id) return;
    
    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);
      
      await updateArticleContent(id, content);
      setSuccessMessage('Article saved successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error('Error saving article content:', err);
      setError('Failed to save article. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  
  const handlePreview = () => {
    if (id) {
      window.open(`/resources/${id}`, '_blank');
    }
  };
  
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded-lg mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    );
  }
  
  if (error && !resource) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-4">
          {error}
        </div>
        <button
          onClick={() => navigate('/admin/resources')}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
        >
          Back to Resources
        </button>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Editing: {resource?.title}</h1>
        <div className="flex space-x-3">
          <button
            onClick={() => navigate('/admin/resources')}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handlePreview}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
          >
            Preview
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded transition-colors disabled:bg-pink-300 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Article'}
          </button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-4">
          {successMessage}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">Article Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Title</p>
              <p className="font-medium">{resource?.title}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Category</p>
              <p className="font-medium">{resource?.category}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Read Time</p>
              <p className="font-medium">{resource?.readTime}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Tags</p>
              <p className="font-medium">
                {resource?.tags?.join(', ') || 'No tags'}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Article Content (HTML)</h2>
        <p className="text-sm text-gray-500 mb-4">
          Use HTML to format your article. You can include headings, paragraphs, lists, and more.
        </p>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-96 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 font-mono"
          placeholder="<h2>Your article content here</h2><p>Write your article using HTML...</p>"
        ></textarea>
        
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-bold mb-2">HTML Tips:</h3>
          <ul className="list-disc pl-5 text-sm space-y-1">
            <li><code>&lt;h2&gt;Heading&lt;/h2&gt;</code> - For section headings</li>
            <li><code>&lt;p&gt;Paragraph text&lt;/p&gt;</code> - For paragraphs</li>
            <li><code>&lt;ul&gt;&lt;li&gt;List item&lt;/li&gt;&lt;/ul&gt;</code> - For bullet lists</li>
            <li><code>&lt;ol&gt;&lt;li&gt;List item&lt;/li&gt;&lt;/ol&gt;</code> - For numbered lists</li>
            <li><code>&lt;strong&gt;Bold text&lt;/strong&gt;</code> - For bold text</li>
            <li><code>&lt;em&gt;Italic text&lt;/em&gt;</code> - For italic text</li>
            <li><code>&lt;a href="https://example.com"&gt;Link text&lt;/a&gt;</code> - For links</li>
            <li><code>&lt;img src="image-url.jpg" alt="Description"&gt;</code> - For images</li>
          </ul>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:bg-pink-300 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : 'Save Article'}
        </button>
      </div>
    </div>
  );
};

export default ArticleEditor;