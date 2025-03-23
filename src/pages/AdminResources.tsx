// src/pages/AdminResources.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllResources, deleteResource, createArticle } from '../services/resourceService';
import { Resource, ResourceFormData } from '../models/Resource';

const AdminResources: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<ResourceFormData>({
    title: '',
    category: 'Development',
    readTime: '5 min read',
    imageUrl: 'https://source.unsplash.com/random/600x400/?kids,learning',
    tags: [],
    content: '' // This is the content field for internal articles
  });
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const allResources = await getAllResources();
      setResources(allResources);
    } catch (err) {
      console.error('Error fetching resources:', err);
      setError('Failed to load resources. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteResource(id);
      // Update the list
      setResources(resources.filter(resource => resource.id !== id));
      setDeleteId(null);
    } catch (err) {
      console.error('Error deleting resource:', err);
      alert('Failed to delete resource. Please try again.');
    }
  };

  const toggleAddForm = () => {
    setShowAddForm(!showAddForm);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleAddTag = () => {
    if (tagInput.trim()) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
      setTagInput('');
    }
  };
  
  const handleRemoveTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter((_, i) => i !== index) || []
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);
    setFormSuccess(null);
    
    try {
      // Create article
      const result = await createArticle(formData);
      console.log('Resource created:', result);
      
      // Add to resources list
      setResources(prev => [result, ...prev]);
      
      // Show success message
      setFormSuccess(`"${formData.title}" has been created successfully!`);
      
      // Reset form
      setFormData({
        title: '',
        category: 'Development',
        readTime: '5 min read',
        imageUrl: 'https://source.unsplash.com/random/600x400/?kids,learning',
        tags: [],
        content: ''
      });
      
      // Auto-close form after 2 seconds
      setTimeout(() => {
        setShowAddForm(false);
        setFormSuccess(null);
      }, 2000);
    } catch (err) {
      console.error('Error creating resource:', err);
      setFormError('Failed to create resource. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Available categories
  const categories = ['Development', 'Education', 'Nutrition', 'Social Skills', 'Wellness'];
  
  // Read time options
  const readTimeOptions = ['3 min read', '5 min read', '7 min read', '10 min read', '15 min read'];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Resources</h1>
        <div className="flex space-x-4">
          <Link 
            to="/admin/dashboard"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded transition-colors"
          >
            Back to Dashboard
          </Link>
          <button 
            onClick={toggleAddForm}
            className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition-colors"
          >
            {showAddForm ? 'Hide Form' : 'Add New Resource'}
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">Add New Resource</h2>
          
          {formError && (
            <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-6">
              {formError}
            </div>
          )}
          
          {formSuccess && (
            <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-6">
              {formSuccess}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Resource Title */}
              <div className="col-span-full">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="title">
                  Resource Title*
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>
              
              {/* Category */}
              <div>
                <label className="block text-gray-700 font-medium mb-2" htmlFor="category">
                  Category*
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              {/* Read Time */}
              <div>
                <label className="block text-gray-700 font-medium mb-2" htmlFor="readTime">
                  Read Time*
                </label>
                <select
                  id="readTime"
                  name="readTime"
                  value={formData.readTime}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                >
                  {readTimeOptions.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
              
              {/* Image URL */}
              <div className="col-span-full">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="imageUrl">
                  Image URL
                </label>
                <input
                  type="url"
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="https://source.unsplash.com/random/600x400/?kids,learning"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Leave as is to use a random article image from Unsplash
                </p>
              </div>
              
              {/* Tags */}
              <div className="col-span-full">
                <label className="block text-gray-700 font-medium mb-2">
                  Tags
                </label>
                <div className="flex mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Add a tag"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="bg-pink-500 text-white px-4 py-2 rounded-r-md hover:bg-pink-600"
                  >
                    Add
                  </button>
                </div>
                {formData.tags && formData.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-2 bg-gray-50 p-3 rounded-md">
                    {formData.tags.map((tag, index) => (
                      <div key={index} className="flex items-center bg-gray-200 px-3 py-1 rounded-full text-sm">
                        <span>#{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(index)}
                          className="ml-2 text-gray-500 hover:text-gray-700"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No tags added yet</p>
                )}
              </div>
              
              {/* Content */}
              <div className="col-span-full">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="content">
                  Article Content (HTML)
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 font-mono"
                  placeholder="<h2>Your article content here</h2><p>Write your article using HTML...</p>"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Leave empty to create an external link resource. You can edit the content later.
                </p>
              </div>
              
              {/* External Link - Only shown if content is empty */}
              {!formData.content && (
                <div className="col-span-full">
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="externalLink">
                    External Link URL
                  </label>
                  <input
                    type="url"
                    id="externalLink"
                    name="externalLink"
                    value={formData.externalLink || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="https://example.com/article"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    URL to external article (when not providing content)
                  </p>
                </div>
              )}
            </div>
            
            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-pink-600 transition-colors disabled:bg-pink-300 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating...' : 'Create Resource'}
              </button>
            </div>
          </form>
        </div>
      )}

      {error && (
        <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-6">
          {error}
          <button 
            onClick={fetchResources}
            className="ml-4 underline"
          >
            Try Again
          </button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading resources...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resource
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Content Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Read Time
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {resources.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No resources found. Add your first resource using the form above.
                  </td>
                </tr>
              ) : (
                resources.map((resource) => (
                  <tr key={resource.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img 
                            className="h-10 w-10 rounded-full object-cover" 
                            src={resource.imageUrl || 'https://via.placeholder.com/40'} 
                            alt={resource.title} 
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {resource.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {resource.tags?.map(tag => `#${tag}`).join(', ')}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{resource.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${resource.content ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                        {resource.content ? 'Internal' : 'External Link'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{resource.readTime}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {resource.content ? (
                        <Link 
                          to={`/admin/resources/edit/${resource.id}`} 
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          Edit Content
                        </Link>
                      ) : (
                        <Link 
                          to={`/admin/resources/edit/${resource.id}`} 
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          Add Content
                        </Link>
                      )}
                      
                      <Link 
                        to={`/resources/${resource.id}`} 
                        target="_blank"
                        className="text-teal-600 hover:text-teal-900 mr-4"
                      >
                        View
                      </Link>
                      
                      {deleteId === resource.id ? (
                        <div className="inline-flex items-center">
                          <span className="text-red-600 mr-2">Confirm delete?</span>
                          <button 
                            onClick={() => handleDelete(resource.id)}
                            className="text-red-600 hover:text-red-900 mr-2"
                          >
                            Yes
                          </button>
                          <button 
                            onClick={() => setDeleteId(null)}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => setDeleteId(resource.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminResources;