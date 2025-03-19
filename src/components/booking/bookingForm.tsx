// src/components/booking/bookingForm.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createLead } from '../../services/leadService';
import { subscribeEmail } from '../../services/subscriptionService';
import { LeadFormData } from '../../models/Lead';
import { Activity } from '../../models/Activity';
import { getActivityById } from '../../services/activityService';
import { trackBookingConversion } from '../../services/analytics';

interface BookingFormProps {
  activityId: string;
  activityName: string;
  price: number;
  websiteUrl?: string;
}

const BookingForm = ({ activityId, activityName, price, websiteUrl }: BookingFormProps) => {
  const navigate = useNavigate();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loadingActivity, setLoadingActivity] = useState(true);
  
  const [formData, setFormData] = useState<LeadFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    activityId: activityId.toString(),
    activityName,
    agreeToTerms: false,
    newsletter: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch activity details if websiteUrl is not provided in props
  useEffect(() => {
    const fetchActivityDetails = async () => {
      if (websiteUrl) {
        // No need to fetch if websiteUrl is already provided in props
        setLoadingActivity(false);
        return;
      }
      
      try {
        setLoadingActivity(true);
        const fetchedActivity = await getActivityById(activityId);
        setActivity(fetchedActivity);
      } catch (err) {
        console.error('Error fetching activity details:', err);
        setError('Failed to load activity details. Please try again later.');
      } finally {
        setLoadingActivity(false);
      }
    };
    
    fetchActivityDetails();
  }, [activityId, websiteUrl]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreeToTerms) {
      setError('Please agree to the terms and conditions.');
      return;
    }
    
    setIsSubmitting(true);
    setError(null); // Clear any previous errors
    
    try {
      // Save lead data to Firebase - ignore any errors in the console if the operation succeeds
      const savedLead = await createLead(formData);
      console.log('Lead data saved successfully:', savedLead);
      
      // Track the booking conversion in GA4
      try {
        trackBookingConversion(activityId, price);
      } catch (analyticsError) {
        // Don't let analytics errors affect the user experience
        console.error('Error tracking conversion:', analyticsError);
      }
      
      // If user opted in for newsletter, save subscription
      if (formData.newsletter) {
        try {
          await subscribeEmail({
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            subscriptionSource: 'lead'
          });
          console.log('Newsletter subscription saved');
        } catch (subscribeErr) {
          console.error('Error with newsletter subscription, but lead was captured:', subscribeErr);
          // Don't set the main error here since the lead was still captured
        }
      }
      
      // Show success state regardless of console errors
      setLeadCaptured(true);
      
      // Determine target website URL
      const targetUrl = websiteUrl || activity?.websiteUrl || 'https://www.kidobee.com';
      
      // Redirect to external site after a short delay
      setTimeout(() => {
        window.open(targetUrl, '_blank', 'noopener,noreferrer');
        // Navigate to thank you page
        navigate('/thank-you');
      }, 1500);
    } catch (err: any) {
      console.error('Error capturing lead:', err);
      // Check if the lead is already saved despite the error
      
      // Add an automatic retry once in case of transient error
      try {
        console.log('Retrying lead creation...');
        const savedLead = await createLead(formData);
        console.log('Lead data saved successfully on retry:', savedLead);
        setLeadCaptured(true);
        
        // Track conversion on retry as well
        try {
          trackBookingConversion(activityId, price);
        } catch (analyticsError) {
          console.error('Error tracking conversion after retry:', analyticsError);
        }
        
        // Determine target website URL
        const targetUrl = websiteUrl || activity?.websiteUrl || 'https://www.kidobee.com';
        
        // Redirect to external site after a short delay
        setTimeout(() => {
          window.open(targetUrl, '_blank', 'noopener,noreferrer');
          // Navigate to thank you page
          navigate('/thank-you');
        }, 1500);
        
        return; // Exit early since retry succeeded
      } catch (retryErr) {
        console.error('Retry also failed:', retryErr);
        setError('There was an error saving your information. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (loadingActivity && !websiteUrl) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-6"></div>
          <div className="h-4 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
          <div className="h-12 bg-pink-200 rounded"></div>
        </div>
      </div>
    );
  }
  
  if (leadCaptured) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <div className="text-green-500 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-4">Thank You!</h2>
        <p className="mb-4">We've saved your information. Opening the registration page for {activityName} now...</p>
        
        {/* Use either passed websiteUrl or the one from the activity object */}
        <p className="text-sm text-gray-600">
          If the page doesn't open automatically, <a 
            href={websiteUrl || activity?.websiteUrl || '#'} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-pink-500 hover:underline"
          >
            click here
          </a>
        </p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Sign Up for {activityName}</h2>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {/* Lead Capture Fields */}
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">First Name*</label>
              <input
                type="text"
                name="firstName"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Last Name*</label>
              <input
                type="text"
                name="lastName"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Email Address*</label>
              <input
                type="email"
                name="email"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number*</label>
              <input
                type="tel"
                name="phone"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>
        
        {/* Price Display */}
        <div className="mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between font-bold text-lg">
              <span>Price</span>
              <span>${price.toFixed(2)}/child</span>
            </div>
          </div>
        </div>
        
        {/* Terms and Marketing */}
        <div className="mb-6">
          <div className="mb-4">
            <label className="flex items-start">
              <input
                type="checkbox"
                name="agreeToTerms"
                className="mt-1 mr-2"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                required
              />
              <span className="text-sm">
                I agree to the <a href="/terms" className="text-pink-500 hover:underline">Terms & Conditions</a> and <a href="/privacy" className="text-pink-500 hover:underline">Privacy Policy</a>
              </span>
            </label>
          </div>
          
          <div>
            <label className="flex items-start">
              <input
                type="checkbox"
                name="newsletter"
                className="mt-1 mr-2"
                checked={formData.newsletter}
                onChange={handleChange}
              />
              <span className="text-sm">
                I'd like to receive updates about new adventures and special offers
              </span>
            </label>
          </div>
        </div>
        
        <button
          type="submit"
          className="w-full bg-pink-500 text-white py-3 rounded-lg font-bold hover:bg-pink-600 transition-colors disabled:bg-pink-300 disabled:cursor-not-allowed flex justify-center items-center"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : 'Continue to Registration'}
          {!isSubmitting && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          )}
        </button>
        
        <p className="text-sm text-gray-500 mt-4 text-center">
          You'll be redirected to the provider's website to complete your registration.
        </p>
      </form>
    </div>
  );
};

export default BookingForm;