import { useState } from "react";

const carouselItems = [
  {
    title: "Like new",
    description: "As if your item(s) were brand new out of the box. Little to no sign of wear.",
    image: "https://www.mpb.com/assets/0.215.1674/_next/static/images/generated/front--small-47f15cf152042869.png",
  },
  {
    title: "Excellent",
    description: "Minor signs of wear to the body or casing.",
    image: "https://www.mpb.com/assets/0.215.1674/_next/static/images/generated/front--small-c63ad7605b482e7b.png",
  },
  {
    title: "Good",
    description: "Noticeable signs of wear, scuffs, and marks.",
    image: "https://www.mpb.com/assets/0.215.1674/_next/static/images/generated/front--small-c52becdfd1ab305c.png",
  },
  {
    title: "Well used",
    description: "Distinct signs of wear and scuffs.",
    image: "https://www.mpb.com/assets/0.215.1674/_next/static/images/generated/front--small-371c13e04a6aaefb.png",
  },
  {
    title: "Heavily used",
    description: "Significant signs of wear, heavy marks or scuffs.",
    image: "https://www.mpb.com/assets/0.215.1674/_next/static/images/generated/front--small-2cce3aa3e2c4329d.png",
  },
];

const ConditionCarousal = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + carouselItems.length) % carouselItems.length
    );
  };

  return (
    <div className="conditions-modal-body">
      <div className="conditions-modal-carousel">
        <div className="carousel-content">
          {carouselItems.map((item, index) => (
            <div
              key={index}
              className={`carousel-item ${
                index === currentIndex ? "active" : ""
              }`}
              style={{
                transform: `translateY(${300 - index * 60}%)`,
                zIndex: index === currentIndex ? 1 : 0,
              }}
            >
              <div className="condition-title">{item.title}</div>
              <p className="condition-description">{item.description}</p>
              <img
                className="condition-image"
                src={item.image}
                alt={item.title}
              />
            </div>
          ))}
        </div>

        <div className="carousel-navigation">
          <button
            onClick={prevSlide}
            className="navigation-button prev-button"
            aria-label="Previous"
          >
            &lt;
          </button>
          <button
            onClick={nextSlide}
            className="navigation-button next-button"
            aria-label="Next"
          >
            &gt;
          </button>
        </div>

        <div className="carousel-pagination">
          {carouselItems.map((_, index) => (
            <button
              key={index}
              className={`pagination-dot ${index === currentIndex ? "active" : ""}`}
              aria-label={`${index + 1}`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>

      <div className="disclaimer-text">
        Not sure which cosmetic condition to choose? Don’t worry - a product
        specialist will inspect your gear and confirm its cosmetic condition once
        it arrives at our Circular Commerce Center.
      </div>
    </div>
  );
};

export default ConditionCarousal;
