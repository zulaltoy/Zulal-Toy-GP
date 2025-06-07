
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import bg1 from "../assets/images/hero1.jpg";
import bg2 from "../assets/images/hero2.jpg";
import bg3 from "../assets/images/hero3.jpg";
import bg4 from "../assets/images/hero4.jpg";

const images = [bg1, bg2, bg3, bg4];

const HeroSlider = () => {
  const settings = {
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    dots: false,
  };

  return (
    <div className="w-full h-full">
      <Slider {...settings}>
        {images.map((img, index) => (
          <div key={index}>
            <img
              src={img}
              alt={`Slide ${index + 1}`}
              className="w-full h-[300px] md:h-[500px] object-cover"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HeroSlider;
