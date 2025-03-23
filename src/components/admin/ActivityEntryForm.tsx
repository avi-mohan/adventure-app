// src/components/admin/ActivityEntryForm.tsx
import React, { useState } from 'react';
import { createActivity } from '../../services/activityService';
import { ActivityFormData } from '../../models/Activity';

const ActivityEntryForm: React.FC = () => {
  const initialFormState: ActivityFormData = {
    title: '',
    description: '',
    price: 0,
    ageRange: '5-12',
    imageUrl: 'https://source.unsplash.com/random/600x400/?kids,activity',
    location: '',
    programDetails: '',
    activities: [],
    featured: false,
    category: ''
  };

  const [formData, setFormData] = useState<ActivityFormData>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [activityInput, setActivityInput] = useState('');
  
  // Category options - you can customize this list
  const categoryOptions = [
    'Adventure',
    'Arts & Crafts',
    'Camp',
    'Class',
    'Indoor Play',
    'STEM',
    'Sport',
    'Workshop'
  ];

  // Age range options
  const ageRangeOptions = [
    '0-3',
    '3-5',
    '5-8',
    '8-12',
    '12-16',
    '5-12',
    'All Ages'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value)
    }));
  };

  const handleAddActivity = () => {
    if (activityInput.trim()) {
      setFormData(prev => ({
        ...prev,
        activities: [...(prev.activities || []), activityInput.trim()]
      }));
      setActivityInput('');
    }
  };

  const handleRemoveActivity = (index: number) => {
    setFormData(prev => ({
      ...prev,
      activities: prev.activities?.filter((_, i) => i !== index) || []
    }));
  };

  const handleSubmit = async (e: React.FormEvent, saveAndAddAnother: boolean = false) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const result = await createActivity(formData);
      console.log('Activity created:', result);
      
      setMessage({
        text: `Success! Activity "${formData.title}" has been added to the database.`,
        type: 'success'
      });

      if (saveAndAddAnother) {
        // Keep certain fields like category and ageRange, but clear others
        const categoryToKeep = formData.category;
        const ageRangeToKeep = formData.ageRange;
        
        setFormData({
          ...initialFormState,
          category: categoryToKeep,
          ageRange: ageRangeToKeep
        });
      } else {
        // Clear the form entirely
        setFormData(initialFormState);
      }
    } catch (error) {
      console.error('Error creating activity:', error);
      setMessage({
        text: 'Error: Failed to create activity. Please try again.',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Add New Activity</h2>
      
      {message && (
        <div className={`p-4 mb-6 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={(e) => handleSubmit(e, false)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Activity Title */}
          <div className="col-span-full">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="title">
              Activity Title*
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
          
          {/* Price */}
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="price">
              Price ($ per child)*
            </label>
            <input
              type="number"
              id="price"
              name="price"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleNumberChange}
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
              <option value="">Select a category</option>
              {categoryOptions.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          {/* Age Range */}
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="ageRange">
              Age Range*
            </label>
            <select
              id="ageRange"
              name="ageRange"
              value={formData.ageRange}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            >
              {ageRangeOptions.map(range => (
                <option key={range} value={range}>{range}</option>
              ))}
            </select>
          </div>
          
          {/* Featured */}
          <div>
            <div className="flex items-center mt-6">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-pink-500 focus:ring-pink-400 rounded"
              />
              <label className="block text-gray-700 font-medium ml-2" htmlFor="featured">
                Featured Activity (shown on homepage)
              </label>
            </div>
          </div>
          
          {/* Description */}
          <div className="col-span-full">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="description">
              Description*
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
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
              placeholder="https://source.unsplash.com/random/600x400/?kids,activity"
            />
            <p className="text-sm text-gray-500 mt-1">
              Leave as is to use a random activity image from Unsplash
            </p>
          </div>
          
          {/* Location */}
          <div className="col-span-full">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="location">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          
          {/* Program Details */}
          <div className="col-span-full">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="programDetails">
              Program Details
            </label>
            <textarea
              id="programDetails"
              name="programDetails"
              value={formData.programDetails}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Sessions: Weekly, Duration: 2 hours, etc."
            />
          </div>
          
          {/* Activities List */}
          <div className="col-span-full">
            <label className="block text-gray-700 font-medium mb-2">
              Activities Included
            </label>
            <div className="flex mb-2">
              <input
                type="text"
                value={activityInput}
                onChange={(e) => setActivityInput(e.target.value)}
                className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Add an activity included in this program"
              />
              <button
                type="button"
                onClick={handleAddActivity}
                className="bg-pink-500 text-white px-4 py-2 rounded-r-md hover:bg-pink-600"
              >
                Add
              </button>
            </div>
            {formData.activities && formData.activities.length > 0 ? (
              <ul className="bg-gray-50 p-3 rounded-md">
                {formData.activities.map((activity, index) => (
                  <li key={index} className="flex justify-between items-center py-2 px-3 hover:bg-gray-100 rounded">
                    <span>{activity}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveActivity(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No activities added yet</p>
            )}
          </div>
        </div>
        
        {/* Submit Buttons */}
        <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
          <button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            disabled={isSubmitting}
            className="bg-teal-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-600 transition-colors disabled:bg-teal-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : 'Save & Add Another'}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-pink-600 transition-colors disabled:bg-pink-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : 'Save Activity'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ActivityEntryForm;