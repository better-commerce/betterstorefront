"use client";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useState, useRef } from "react";


export default function Carousel({images}:any) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      setIsAnimating(false);
    }, 300);
  };

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      setIsAnimating(false);
    }, 300);
  };

  const goToSlide = (index: number) => {
    if (isAnimating) return;
    setCurrentIndex(index);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartX.current) return;
    const diff = touchStartX.current - e.touches[0].clientX;
    if (diff > 50) {
      nextSlide();
      touchStartX.current = null;
    } else if (diff < -50) {
      prevSlide();
      touchStartX.current = null;
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    touchStartX.current = e.clientX;
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!touchStartX.current) return;
    const diff = touchStartX.current - e.clientX;
    if (diff > 50) {
      nextSlide();
    } else if (diff < -50) {
      prevSlide();
    }
    touchStartX.current = null;
  };

  return (
    <div className="relative w-full px-4 mx-auto">
      {/* Header with Arrows */}
      <div className="flex items-center justify-center w-full mb-4 sm:mb-4">
        <button onClick={prevSlide} className="flex items-center justify-center w-6 h-6 border border-black rounded-full">
          <ChevronLeftIcon className="w-4 h-4" />
        </button>
        <h1 className="mx-4 text-xl font-medium text-center min-w-[300px]">
          {images[currentIndex].title}
        </h1>
        <button onClick={nextSlide} className="flex items-center justify-center w-6 h-6 border border-black rounded-full">
          <ChevronRightIcon className="w-4 h-4" />
        </button>
      </div>

      <p className="mt-2 text-sm font-normal text-center text-gray-600">
        {images[currentIndex].description}
      </p>

      {/* Image Slider */}
      <div
        className="relative flex items-center justify-center overflow-hidden bg-transparent border-b border-[#2d4d9c] rounded-full mx-auto w-[372px] h-[372px]"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image:any, index:number) => (
            <img key={index} src={image.src} alt={image.title} className="flex-shrink-0 object-contain w-full h-[320px]" style={{ minWidth: "100%" }} />
          ))}
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center mt-6 space-x-2">
        {images.map((_:any, index:number) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${index === currentIndex ? "bg-[#1a3067]" : "bg-gray-400 hover:bg-red-600"}`}
          />
        ))}
      </div>
    </div>
  );
}
