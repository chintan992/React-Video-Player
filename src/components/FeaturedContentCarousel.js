import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import FeaturedContent from './common/FeaturedContent';

const FeaturedContentCarousel = ({ featuredContent, carouselSettings }) => {
  return (
    <section className="mb-12">
      <Slider {...carouselSettings}>
        {featuredContent.map((item, index) => (
          <div key={item.id} className="px-2 sm:px-4">
            <FeaturedContent item={item} />
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default FeaturedContentCarousel;
