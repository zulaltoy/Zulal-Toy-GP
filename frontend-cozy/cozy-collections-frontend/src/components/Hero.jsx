import React, { useState } from "react";
import HeroSlider from './HeroSlider'
import SearchBar from './SearchBar'

const Hero = () => {
  const [currentSlide] = useState(0);

  return (
    <div  className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-6 py-12">
      <HeroSlider setCurrentSlide={currentSlide} />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center bg-black bg-opacity-40 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Welcome to <span className="text-yellow-400">Cozycollections</span>.com
        </h1>

        <SearchBar />

       
      </div>
    </div>
  );
};

export default Hero;
