"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-creative";
import "swiper/css/autoplay";
import { Autoplay, EffectCreative, Pagination } from "swiper";

export default function Carousel({ images }: any) {
  const [selectedCategory, setSelectedCategory] = useState("cameras"); // Default Category
  const [selectedTab, setSelectedTab] = useState("front"); // Default Tab
  const [currentIndex, setCurrentIndex] = useState(0);
  const swiperRef = useRef<any>(null);

  let categoryTabs = ["front", "side", "back", "upper"];
  if (selectedCategory === "lenses") {
    categoryTabs = ["front", "down", "back"];
  }

  const imagesArray = images[selectedCategory]?.[selectedTab] || [];
  
  const handlePrev = () => {
    if (swiperRef.current) {
      swiperRef.current.swiper.slidePrev(700);
    }
  };

  const handleNext = () => {
    if (swiperRef.current) {
      swiperRef.current.swiper.slideNext(700);
    }
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
      <div className="flex items-center justify-center w-full mt-3 mb-2">
        <button onClick={handlePrev} className="p-1 border border-black rounded-full">
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
        <h1 className="mx-4 text-xl font-medium text-center min-w-[300px]">
          {imagesArray[currentIndex]?.title || "No Title Available"}
        </h1>
        <button onClick={handleNext} className="p-1 border border-black rounded-full">
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>
      <p className="mt-2 text-sm text-center text-gray-600">
        {imagesArray[currentIndex]?.description || "No Description Available"}
      </p>
      <div className="flex justify-center mt-4 space-x-4">
        {categoryTabs.map((tab) => (
          <button key={tab} onClick={() => { setSelectedTab(tab); setCurrentIndex(0); }} className={`w-8 h-8 border border-sky-700 rounded-full flex justify-center items-center ${selectedTab === tab ? "bg-sky-300" : "bg-white"}`} >
            <img src={`https://liveocxstorage.blob.core.windows.net/testpc/cms-media/icons/${selectedCategory === "cameras" ? 'cam' : 'lenses'}-${tab}.svg`} />
          </button>
        ))}
      </div>
      {/* Swiper Image Slider */}
      <div className="relative flex items-center justify-center overflow-hidden border-b border-[#2d4d9c] rounded-full mx-auto w-[392px] h-[392px]">
        {imagesArray.length > 0 ? (
          <Swiper
            ref={swiperRef}
            effect="creative"
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={1}
            loop={true}
            autoplay={{
              delay: 6000,
              disableOnInteraction: false,
            }}
            pagination={{ clickable: true }}
            creativeEffect={{
              prev: {
                shadow: false,
                translate: ["-150%", "0%", -200],
                rotate: [0, 0, -40],
                opacity: 0,
              },
              next: {
                shadow: false,
                translate: ["150%", "0%", -200],
                rotate: [0, 0, 40],
                opacity: 0,
              },
            }}
            modules={[EffectCreative, Pagination]}
            className="w-full max-w-lg"
            onSlideChange={(swiper) => setCurrentIndex(swiper.realIndex)}
          >
            {imagesArray.map((img: any, index: number) => (
              <SwiperSlide key={index} className="flex justify-center">
                <div className="relative">
                  <img
                    src={img.src}
                    alt={img.title}
                    className="object-cover !w-auto !h-[340px] !mx-auto"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <p className="text-center text-gray-500">No Images Available</p>
        )}
      </div>
    </div>
  );
}
