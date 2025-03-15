import React, { useState } from 'react';

interface ImageCarouselProps {
  images: string[];
  fallbackImage?: string;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ 
  images, 
  fallbackImage = 'https://source.unsplash.com/random/600x400/?kids,activity' 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // If no images provided, use fallback
  const displayImages = images && images.length > 0 ? images : [fallbackImage];
  
  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? displayImages.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };
  
  const goToNext = () => {
    const isLastSlide = currentIndex === displayImages.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };
  
  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };
  
  return (
    <div className="relative w-full h-64 md:h-80">
      {/* Left Arrow */}
      <div 
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full cursor-pointer z-10"
        onClick={goToPrevious}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </div>
      
      {/* Current Slide */}
      <div 
        className="w-full h-full rounded-lg bg-cover bg-center transition-all duration-500 ease-in-out"
        style={{ backgroundImage: `url(${displayImages[currentIndex]})` }}
      />
      
      {/* Right Arrow */}
      <div 
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full cursor-pointer z-10"
        onClick={goToNext}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      </div>
      
      {/* Dots Navigation */}
      {displayImages.length > 1 && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {displayImages.map((_, slideIndex) => (
            <div
              key={slideIndex}
              onClick={() => goToSlide(slideIndex)}
              className={`w-2 h-2 rounded-full cursor-pointer transition-all ${
                currentIndex === slideIndex ? 'bg-white scale-125' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;