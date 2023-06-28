import Image from 'next/image'
import React, { useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper.min.css'
import SwiperCore, { Navigation } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'
import { Button } from '@components/ui'
import { BTN_FIND_MORE } from '@components/utils/textVariables'
type data = {
  images: Array<string>
}

const Slider = ({ images }: data) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  SwiperCore.use([Navigation])
  const swiperRef: any = useRef(null)

  const handlePrevClick = () => {
    setCurrentImageIndex((index) =>
      index === 0 ? images.length - 1 : index - 1
    )
  }

  const handleNextClick = () => {
    setCurrentImageIndex((index) =>
      index === images.length - 1 ? 0 : index + 1
    )
  }

  return (
    <div className="relative w-full">
      <div className="flex justify-center">
        {/* <Image
          height={1280}
          width={1280}
          src={images[currentImageIndex]}
          alt={`Slide ${currentImageIndex}`}
        /> */}
        <Swiper
          slidesPerView={4.3}
          // navigation={false}
          loop={false}
          ref={swiperRef}
          // navigation
          breakpoints={{
            320: {
              slidesPerView: 1,
              spaceBetween: 2,
            },
            640: {
              slidesPerView: 1.1,
            },
            768: {
              slidesPerView: 1.1,
            },
            1024: {
              slidesPerView: 1,
            },
          }}
        >
          {images?.map((val: any, productIdx: number) => {
            return (
              <>
                <SwiperSlide
                  className="py-0 2xl:w-[300px] w-[25vw] h-full "
                  key={val.name}
                >
                  <Image
                    key={productIdx}
                    height={1280}
                    width={1280}
                    src={val.url}
                    alt={`Slide ${currentImageIndex}`}
                  />
                  <p className="absolute hover:bg-gray-200 2xl:left-12 pt-2 2xl:pt-4 md:pt-4 2xl:bottom-64 md:left-8 md:bottom-48 h-12 w-48 uppercase cursor-pointer bg-white rounded-md p-1 z-50 md:text-lg text-sm font-semibold">
                    {BTN_FIND_MORE}
                  </p>
                </SwiperSlide>
              </>
            )
          })}
        </Swiper>

        <div
          className="absolute right-24 top-12 z-999 bg-white  text-gray-400 cursor-pointer border-2  border-gray-400 rounded-sm p-1 hover:text-gray-700 /hover:border-gray-700"
          onClick={handlePrevClick}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-12 h-10 rounded-md"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
            />
          </svg>
        </div>
        <div
          className="absolute right-10 top-12 z-999 bg-white text-gray-400 cursor-pointer border-2 border-gray-400 rounded-sm p-1 hover:text-gray-700 /hover:border-gray-700"
          onClick={handleNextClick}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-12 h-10 rounded-md"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
            />
          </svg>
        </div>
      </div>
      <div className="slider-active-bar">
        {images.map((_, index) => (
          <div
            key={index}
            className={`slider-active-bar-dot ${
              currentImageIndex === index ? 'active' : ''
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default Slider
