import React, { useState } from 'react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send this to your backend or email service
    console.log('Email submitted:', email);
    
    // For now, just simulate a successful subscription
    setSubmitted(true);
    setEmail('');
  };
  
  return (
    <div className="bg-teal-500 py-16 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold mb-6">Join Kidobee Club</h2>
        <p className="max-w-xl mx-auto mb-8">
          Subscribe to our newsletter for exclusive offers and upcoming adventures for your kids.
        </p>
        
        {submitted ? (
          <div className="max-w-md mx-auto bg-white/10 p-6 rounded-lg">
            <svg 
              className="w-12 h-12 text-white mx-auto mb-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            <h3 className="text-xl font-bold mb-2">Thank You!</h3>
            <p>You've been added to our newsletter. Get ready for amazing adventures!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-grow px-4 py-3 rounded-l-lg focus:outline-none text-gray-800"
            />
            <button
              type="submit"
              className="bg-yellow-400 text-gray-800 px-6 py-3 rounded-r-lg font-bold hover:bg-yellow-300 transition-colors"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Newsletter;