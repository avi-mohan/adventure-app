// src/pages/AdminSeed.tsx
import React, { useState } from 'react';
import { seedActivities, seedResources, seedAllData } from '../utils/seedData';

const AdminSeed = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const handleSeedActivities = async () => {
    setLoading(true);
    setMessage(null);
    setError(null);
    
    try {
      await seedActivities();
      setMessage('Activities seeded successfully!');
    } catch (err) {
      console.error('Error seeding activities:', err);
      setError('Failed to seed activities. Check console for details.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSeedResources = async () => {
    setLoading(true);
    setMessage(null);
    setError(null);
    
    try {
      await seedResources();
      setMessage('Resources seeded successfully!');
    } catch (err) {
      console.error('Error seeding resources:', err);
      setError('Failed to seed resources. Check console for details.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSeedAll = async () => {
    setLoading(true);
    setMessage(null);
    setError(null);
    
    try {
      await seedAllData();
      setMessage('All data seeded successfully!');
    } catch (err) {
      console.error('Error seeding data:', err);
      setError('Failed to seed data. Check console for details.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Admin Tools - Seed Database</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold mb-4">Database Seeding</h2>
        <p className="mb-6 text-gray-600">
          Use these tools to populate your Firebase database with sample data for development and testing.
        </p>
        
        {message && (
          <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6">
            {message}
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={handleSeedActivities}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Seed Activities'}
          </button>
          
          <button
            onClick={handleSeedResources}
            disabled={loading}
            className="bg-teal-500 text-white px-4 py-3 rounded-lg hover:bg-teal-600 transition-colors disabled:bg-teal-300 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Seed Resources'}
          </button>
          
          <button
            onClick={handleSeedAll}
            disabled={loading}
            className="bg-pink-500 text-white px-4 py-3 rounded-lg hover:bg-pink-600 transition-colors disabled:bg-pink-300 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Seed All Data'}
          </button>
        </div>
      </div>
      
      <div className="text-center mt-8">
        <p className="text-sm text-gray-500">
          Note: Seeding may take a few moments. Check browser console for detailed progress.
        </p>
      </div>
    </div>
  );
};

export default AdminSeed;