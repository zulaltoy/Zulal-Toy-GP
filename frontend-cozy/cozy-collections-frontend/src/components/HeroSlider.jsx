import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import bg1 from "../assets/images/hero-1.jpg";
import bg2 from "../assets/images/hero-2.jpg";
import bg3 from "../assets/images/hero-3.jpg";
import bg4 from "../assets/images/hero-4.jpg";
import bg5 from "../assets/images/hero-5.jpg";
import bg6 from "../assets/images/hero-6.jpg";

const images = [bg1, bg2, bg3, bg4, bg5, bg6];

const HeroSlider = () => {
  const settings = {
    infinite: true,
    speed: 12000,
    autoplay: true,
    autoplaySpeed: 15000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    dots: false,
  };

  return (
    <div className="w-full h-48 md:h-72 lg:h-96 rounded-lg overflow-hidden shadow">
      <Slider {...settings} className="w-full h-full">
        {images.map((img, index) => (
          <div key={index} className="w-full h-full">
            <img
              src={img}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HeroSlider;
