"use client";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useState, useRef } from "react";

export default function Carousel({ images }: any) {
  const [selectedCategory, setSelectedCategory] = useState("cameras"); // Default Category
  const [selectedTab, setSelectedTab] = useState("front"); // Default Tab
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const touchStartX = useRef<number | null>(null);

  let categoryTabs = ["front", "side", "back", "upper"];

  // Ensure we have a valid array to avoid TypeErrors
  const imagesArray = images[selectedCategory]?.[selectedTab] || [];
  const validIndex = imagesArray.length > 0 ? currentIndex : 0;
  const currentImage = imagesArray[validIndex] || {};
  if (selectedCategory == "lenses") {
    categoryTabs = ["front", "down", "back"];
  }
  const prevSlide = () => {
    if (isAnimating || imagesArray.length === 0) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev === 0 ? imagesArray.length - 1 : prev - 1));
      setIsAnimating(false);
    }, 300);
  };

  const nextSlide = () => {
    if (isAnimating || imagesArray.length === 0) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev === imagesArray.length - 1 ? 0 : prev + 1));
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div className="relative w-full px-4 mx-auto -top-10">
      <div className="flex w-[220px] px-0 pt-2 mx-auto bg-[#f4f5f5] rounded-full">
        <div className="w-11/12 mx-auto bg-white rounded-full shadow">
          {["cameras", "lenses"].map((category) => (
            <button key={category} className={`px-1 py-1 flex-1 capitalize group text-[13px] ${selectedCategory === category ? "font-medium" : "text-gray-500"}`} onClick={() => { setSelectedCategory(category); setCurrentIndex(0); }} >
              <img src={`https://liveocxstorage.blob.core.windows.net/testpc/cms-media/icons/tab-${category}.svg`} className={`inline-block w-8 h-8 p-2 ${selectedCategory === category ? 'bg-sky-300' : 'bg-gray-200'} rounded-full group-hover:bg-sky-300`} /> {category}
            </button>
          ))}
        </div>
      </div>
      {/* Image Title & Description */}
      <div className="flex items-center justify-center w-full mt-3 mb-2">
        <button onClick={prevSlide} className="p-1 border border-black rounded-full">
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
        <h1 className="mx-4 text-xl font-medium text-center min-w-[300px]">
          {currentImage.title || "No Title Available"}
        </h1>
        <button onClick={nextSlide} className="p-1 border border-black rounded-full">
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>
      <p className="mt-2 text-sm text-center text-gray-600">
        {currentImage.description || "No Description Available"}
      </p>
      <div className="flex justify-center mt-4 space-x-4">
        {categoryTabs.map((tab) => (
          <button key={tab} onClick={() => { setSelectedTab(tab); setCurrentIndex(0); }} className={`w-8 h-8 border border-sky-700 rounded-full flex justify-center items-center ${selectedTab === tab ? "bg-sky-300" : "bg-white"}`} >
            <img src={`https://liveocxstorage.blob.core.windows.net/testpc/cms-media/icons/${selectedCategory == "cameras" ? 'cam' : 'lenses'}-${tab}.svg`} />
          </button>
        ))}
      </div>
      {/* Image Display */}
      <div className="relative flex items-center justify-center overflow-hidden border-b border-[#2d4d9c] rounded-full mx-auto w-[372px] h-[372px]">
        {imagesArray.length > 0 ? (
          <img
            src={currentImage.src}
            alt={currentImage.title}
            className="object-contain w-full h-[320px]"
          />
        ) : (
          <p className="text-center text-gray-500">No Images Available</p>
        )}
      </div>


      {/* Dots Navigation */}
      <div className="flex justify-center mt-6 space-x-2">
        {imagesArray.map((_: any, index: number) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-colors ${index === currentIndex ? "bg-[#1a3067]" : "bg-gray-400"}`}
          />
        ))}
      </div>
    </div>
  );
}
