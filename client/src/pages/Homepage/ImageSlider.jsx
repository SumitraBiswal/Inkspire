import { useEffect, useState, useRef } from "react";
import "../Style/imageslider.css";

export default function ImageSlider({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef(null);

  useEffect(() => {
    const auto = setInterval(() => nextSlide(), 4000);
    return () => clearInterval(auto);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  // Mobile swipe scroll
  const onTouchMove = (e) => {
    sliderRef.current.scrollLeft += e.touches[0].clientX / 20;
  };

  return (
    <div className="slider-container">
      {/* Arrows hidden on mobile */}
      <button className="arrow left" onClick={prevSlide}>❮</button>

      <div className="slider-wrapper" ref={sliderRef} onTouchMove={onTouchMove}>
        <div
          className="slider-content"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {images.map((img, idx) => (
            <div className="slider-item" key={idx}>
              <img src={img} alt="banner" />
            </div>
          ))}
        </div>
      </div>

      <button className="arrow right" onClick={nextSlide}>❯</button>

      {/* Dots */}
      <div className="dots">
        {images.map((_, i) => (
          <span
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`dot ${i === currentIndex ? "active" : ""}`}
          ></span>
        ))}
      </div>
    </div>
  );
}