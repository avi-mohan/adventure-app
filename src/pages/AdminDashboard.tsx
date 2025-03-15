// src/pages/AdminDashboard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';

const AdminDashboard = () => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button 
          onClick={handleLogout}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded transition-colors"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Data Management</h2>
          <ul className="space-y-2">
            <li>
              <Link 
                to="/admin/seed" 
                className="text-pink-500 hover:text-pink-700 transition-colors"
              >
                Seed Database
              </Link>
            </li>
            {/* Add more admin links here as needed */}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Quick Stats</h2>
          <p className="text-gray-600">View detailed statistics in Firebase Analytics.</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Help</h2>
          <p className="text-gray-600">
            This admin panel provides tools to manage your Kidobee application.
            Use the Seed Database tool to populate your Firebase database with sample data.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;