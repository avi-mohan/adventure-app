// src/pages/AdminActivities.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllActivities, deleteActivity } from '../services/activityService';
import { Activity } from '../models/Activity';
import ActivityEntryForm from '../components/admin/ActivityEntryForm';

const AdminActivities: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const allActivities = await getAllActivities();
      setActivities(allActivities);
    } catch (err) {
      console.error('Error fetching activities:', err);
      setError('Failed to load activities. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteActivity(id);
      // Update the list
      setActivities(activities.filter(activity => activity.id !== id));
      setDeleteId(null);
    } catch (err) {
      console.error('Error deleting activity:', err);
      alert('Failed to delete activity. Please try again.');
    }
  };

  const toggleAddForm = () => {
    setShowAddForm(!showAddForm);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Activities</h1>
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
            {showAddForm ? 'Hide Form' : 'Add New Activity'}
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="mb-8">
          <ActivityEntryForm />
        </div>
      )}

      {error && (
        <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-6">
          {error}
          <button 
            onClick={fetchActivities}
            className="ml-4 underline"
          >
            Try Again
          </button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading activities...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activity
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Age Range
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Featured
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {activities.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No activities found. Add your first activity using the form above.
                  </td>
                </tr>
              ) : (
                activities.map((activity) => (
                  <tr key={activity.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img 
                            className="h-10 w-10 rounded-full object-cover" 
                            src={activity.imageUrl || 'https://via.placeholder.com/40'} 
                            alt={activity.title} 
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {activity.title}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{activity.category || 'Uncategorized'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${activity.price.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{activity.ageRange}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${activity.featured ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {activity.featured ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link 
                        to={`/booking/${activity.id}`} 
                        target="_blank"
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        View
                      </Link>
                      
                      {deleteId === activity.id ? (
                        <div className="inline-flex items-center">
                          <span className="text-red-600 mr-2">Confirm delete?</span>
                          <button 
                            onClick={() => handleDelete(activity.id)}
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
                          onClick={() => setDeleteId(activity.id)}
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

export default AdminActivities;