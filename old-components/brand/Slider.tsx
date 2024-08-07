import React, { useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper.min.css'
import SwiperCore, { Navigation } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'
import { IMG_PLACEHOLDER } from '@components/utils/textVariables'
import Router from 'next/router'
import { generateUri } from '@commerce/utils/uri-util'
import { useTranslation } from '@commerce/utils/use-translation'
type data = {
  images: Array<string>
  isBanner: Boolean
}

const Slider = ({ images, isBanner }: data) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const translate = useTranslation()
  SwiperCore.use([Navigation])
  const swiperRef: any = useRef(null)

  const handlePrevClick = () => {
    setCurrentImageIndex((index) =>
      index === 0 ? images?.length - 1 : index - 1
    )
  }

  const handleNextClick = () => {
    setCurrentImageIndex((index) =>
      index === images?.length - 1 ? 0 : index + 1
    )
  }

  return (
    <div className="relative w-full">
      <div className="flex justify-center">
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
              <SwiperSlide
                className="py-0 2xl:w-[300px] w-[25vw] h-full"
                key={productIdx}
              >
                <img
                  key={productIdx}
                  height={1280}
                  width={1280}
                  src={generateUri(val.url,'h=1280&fm=webp')||IMG_PLACEHOLDER}
                  alt={`Slide ${currentImageIndex}`}
                />
                {isBanner && (
                  <p
                    className="absolute flex hover:bg-gray-200 m-auto justify-center 2xl:left-12 pt-2 2xl:pt-4 md:pt-4 2xl:bottom-64 md:left-8 md:bottom-48 h-12 w-48 uppercase cursor-pointer bg-white rounded-md p-1 z-50 md:text-lg text-sm font-semibold"
                    onClick={() => {
                      Router.push(val.link ? val.link : '#')
                    }}
                  >
                   {translate('common.label.findOutMoreText')}
                  </p>
                )}
                {!isBanner && (
                  <p
                    className="flex items-center text-[#212530] justify-center text-sm font-semibold sm:hidden border h-10 -mt-0 border-orange-300 bg-gray-50"
                    onClick={() => {
                      Router.push(val.link ? val.link : '#')
                    }}
                  >
                    {val.title}
                  </p>
                )}
              </SwiperSlide>
            )
          })}
        </Swiper>

        {images?.length > 0 && (
          <div
            className="absolute right-20 top-10 z-99 hidden sm:block text-gray-300 cursor-pointer border-2  border-gray-300 rounded-sm p-1 hover:text-gray-500 hover:border-gray-500"
            onClick={handlePrevClick}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-7 h-7 rounded-md"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
              />
            </svg>
          </div>
        )}
        {images?.length > 0 && (
          <div
            className="absolute right-10 top-10 z-99 hidden sm:block text-gray-300 cursor-pointer border-2 border-gray-300 rounded-sm p-1 hover:text-gray-500 hover:border-gray-500"
            onClick={handleNextClick}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-7 h-7 rounded-md"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
              />
            </svg>
          </div>
        )}
      </div>
      <div className="slider-active-bar">
        {images?.map((_, index) => (
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
