import React from 'react';
import Hero from '../components/home/hero';
import FeaturedActivities from '../components/home/featured_activities';
import Newsletter from '../components/common/newsletter';
import SearchBar from '../components/common/SearchBar';

const Home = () => {
  return (
    <div>
      <div className="relative">
        <Hero />
        
        {/* Position the search bar over the hero */}
        <div className="absolute left-0 right-0 bottom-0 transform translate-y-1/2">
          <SearchBar />
        </div>
      </div>
      
      {/* Space for the search bar overflow */}
      <div className="pt-24 md:pt-16"></div>
      
      <div className="py-8">
        <FeaturedActivities />
      </div>
      
      <Newsletter />
    </div>
  );
};

export default Home;