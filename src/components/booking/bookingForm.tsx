import React, { useState } from 'react';

interface BookingFormProps {
  activityId: number;
  activityName: string;
  price: number;
}

const BookingForm = ({ activityId, activityName, price }: BookingFormProps) => {
  const [date, setDate] = useState('');
  const [participants, setParticipants] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('');
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [newsletter, setNewsletter] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const totalPrice = price * participants;
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreeToTerms) {
      alert('Please agree to the terms and conditions.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, you would submit this data to your backend
      console.log('Booking data:', {
        activityId,
        activityName,
        date,
        participants,
        name,
        email,
        phone,
        childName,
        childAge,
        specialRequirements,
        newsletter,
        totalPrice
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Booking submitted successfully!');
      
      // Reset form or redirect to confirmation page
      // window.location.href = '/confirmation';
    } catch (error) {
      console.error('Error submitting booking:', error);
      alert('There was an error processing your booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Book Your Adventure</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Select Date</label>
            <input
              type="date"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Number of Children</label>
            <select
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              value={participants}
              onChange={(e) => setParticipants(parseInt(e.target.value))}
            >
              {[1, 2, 3, 4, 5, 6].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Your Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Your Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Your Phone</label>
            <input
              type="tel"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Child's Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Child's Age</label>
            <select
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              value={childAge}
              onChange={(e) => setChildAge(e.target.value)}
              required
            >
              <option value="">Select age</option>
              {Array.from({ length: 15 }, (_, i) => i + 3).map(age => (
                <option key={age} value={age}>{age} years</option>
              ))}
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Special Requirements</label>
            <textarea
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              rows={3}
              value={specialRequirements}
              onChange={(e) => setSpecialRequirements(e.target.value)}
            />
          </div>
        </div>
        
        <div className="mb-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between mb-2">
              <span>Price per child</span>
              <span>${price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Number of children</span>
              <span>{participants}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="flex items-start">
            <input
              type="checkbox"
              className="mt-1 mr-2"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              required
            />
            <span className="text-sm">
              I agree to the <a href="/terms" className="text-pink-500 hover:underline">Terms & Conditions</a> and <a href="/privacy" className="text-pink-500 hover:underline">Privacy Policy</a>
            </span>
          </label>
        </div>
        
        <div className="mb-6">
          <label className="flex items-start">
            <input
              type="checkbox"
              className="mt-1 mr-2"
              checked={newsletter}
              onChange={(e) => setNewsletter(e.target.checked)}
            />
            <span className="text-sm">
              I'd like to receive updates about new adventures and special offers
            </span>
          </label>
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