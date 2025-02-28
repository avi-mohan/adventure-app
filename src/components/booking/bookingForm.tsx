// src/components/booking/bookingForm.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface BookingFormProps {
  activityId: number;
  activityName: string;
  price: number;
}

const BookingForm = ({ activityId, activityName, price }: BookingFormProps) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    participants: 1,
    specialRequirements: '',
    agreeToTerms: false,
    newsletter: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };
  
  const totalPrice = price * formData.participants;
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreeToTerms) {
      alert('Please agree to the terms and conditions.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, you would send this data to your backend
      console.log('Lead captured:', {
        activityId,
        activityName,
        ...formData,
        totalPrice
      });
      
      // Store lead data in localStorage for demonstration
      const leads = JSON.parse(localStorage.getItem('leads') || '[]');
      leads.push({
        id: Date.now(),
        activityId,
        activityName,
        ...formData,
        totalPrice,
        capturedAt: new Date().toISOString()
      });
      localStorage.setItem('leads', JSON.stringify(leads));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success state
      setSubmitted(true);
      
      // Reset form after 3 seconds and redirect
      setTimeout(() => {
        navigate('/thank-you');
      }, 3000);
    } catch (error) {
      console.error('Error submitting booking:', error);
      alert('There was an error processing your booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (submitted) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <div className="text-green-500 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-4">Booking Successfully Submitted!</h2>
        <p className="mb-4">Thank you for booking {activityName}. We've received your information and will contact you shortly.</p>
        <p className="text-sm text-gray-600">Redirecting you to the confirmation page...</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Book Your Adventure</h2>
      
      <form onSubmit={handleSubmit}>
        {/* Lead Capture Fields */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 border-b pb-2">Your Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name*</label>
              <input
                type="text"
                name="name"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                value={formData.name}
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
        
        {/* Booking Details */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 border-b pb-2">Booking Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Select Date*</label>
              <input
                type="date"
                name="date"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Number of Children*</label>
              <select
                name="participants"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                value={formData.participants}
                onChange={handleChange}
              >
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Special Requirements</label>
              <textarea
                name="specialRequirements"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                rows={3}
                value={formData.specialRequirements}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        
        {/* Price Summary */}
        <div className="mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between mb-2">
              <span>Price per child</span>
              <span>${price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Number of children</span>
              <span>{formData.participants}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
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
          className="w-full bg-pink-500 text-white py-3 rounded-lg font-bold hover:bg-pink-600 transition-colors disabled:bg-pink-300 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : 'Complete Booking'}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;