import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


import hr1 from "../assets/images/hero1.jpg";
import hr2 from "../assets/images/hero2.jpg";
import hr3 from "../assets/images/hero3.jpg";
import hr4 from "../assets/images/hero4.jpg";

const images = [hr1, hr2, hr3, hr4];

const HeroSlider = () => {
  const settings = {
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 4000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    dots: false,
  };

  return (
    <div className="relative w-full h-[300px] md:h-[500px] overflow-hidden z-0">
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
