
import React from "react";
import HeroSlider from "./HeroSlider";
import SearchBar from "./SearchBar";

const Hero = () => {
  return (
    <div className="relative w-full h-[300px] md:h-[500px]">
     
      <div className="absolute inset-0 z-0">
        <HeroSlider />
      </div>

      
      <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-center px-4 z-10">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
           <span className="text-yellow-400">CozyCollections</span>.com
        </h1>
        <SearchBar />
      </div>
    </div>
  );
};

export default Hero;
