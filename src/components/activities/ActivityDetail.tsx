// src/components/activities/ActivityDetail.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import BookingForm from '../booking/bookingForm';
import { Activity } from '../../models/Activity';
import ImageCarousel from './ImageCarousel';

interface ActivityDetailProps {
  activity: Activity;
}

const ActivityDetail = ({ activity }: ActivityDetailProps) => {
  const [expanded, setExpanded] = useState(true);
  
  // Get images array, or create array with single imageUrl, or use empty array (carousel will use fallback)
  const displayImages = activity.images || (activity.imageUrl ? [activity.imageUrl] : []);
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Back Button */}
      <div className="mb-8">
        <Link to="/activities" className="text-pink-500 hover:text-pink-600 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Activities
        </Link>
      </div>
      
      {/* Activity Title */}
      <h1 className="text-3xl font-bold mb-6">{activity.title}</h1>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Activity Details - Left column */}
        <div>
          {/* Image Carousel */}
          <div className="mb-6">
            <ImageCarousel images={displayImages} />
          </div>
          
          {/* Overview Section */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div 
              className="bg-gray-50 px-6 py-4 flex justify-between items-center cursor-pointer"
              onClick={() => setExpanded(!expanded)}
            >
              <h2 className="text-xl font-bold">Overview of {activity.title}</h2>
              <svg 
                className={`w-6 h-6 transform transition-transform ${expanded ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            
            <div className={`px-6 py-4 ${expanded ? 'block' : 'hidden'}`}>
              <p className="text-gray-800 mb-4">
                {activity.description}
              </p>
              
              {/* Program Details */}
              <div className="mb-4">
                <div className="border-b border-gray-200 pb-2 mb-4">
                  <h3 className="font-bold">Program Details</h3>
                </div>
                <p className="mb-2">
                  <span className="font-medium">Ages:</span> {activity.ageRange} years old
                </p>
                {activity.programDetails && (
                  <p className="mb-2">
                    {activity.programDetails}
                  </p>
                )}
              </div>
              
              {/* Activities List */}
              {activity.activities && activity.activities.length > 0 && (
                <div className="mb-4">
                  <div className="border-b border-gray-200 pb-2 mb-4">
                    <h3 className="font-bold">Activities:</h3>
                  </div>
                  <ul className="list-none space-y-2">
                    {activity.activities.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-teal-600 mr-2">- </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Location */}
              {activity.location && (
                <div className="mb-4">
                  <div className="border-b border-gray-200 pb-2 mb-4">
                    <h3 className="font-bold">Location:</h3>
                  </div>
                  <p>{activity.location}</p>
                </div>
              )}
              
              {/* Website Link if available */}
              {activity.websiteUrl && (
                <div className="mb-4">
                  <div className="border-b border-gray-200 pb-2 mb-4">
                    <h3 className="font-bold">Provider Website:</h3>
                  </div>
                  <a 
                    href={activity.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-500 hover:underline flex items-center"
                  >
                    Visit Provider Website
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                      <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                    </svg>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Booking Form Section - Right column */}
        <div>
          <BookingForm 
            activityId={activity.id} 
            activityName={activity.title} 
            price={activity.price}
            websiteUrl={activity.websiteUrl}
          />
        </div>
      </div>
    </div>
  );
};

export default ActivityDetail;