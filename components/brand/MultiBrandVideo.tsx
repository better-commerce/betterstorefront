import React, { useEffect, useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper.min.css'
import SwiperCore, { Navigation } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'
import dynamic from 'next/dynamic'
import Video from './Video'

const MultiBrandVideo = ({ array, heading, name }: any) => {
  const array2: any = ['R-l2uzAhi1Y', 'BTjJfA36Q2c', '']
  const [NameArray, setNameArray] = useState([])

  useEffect(() => {
    if (name !== undefined) {
      const newArr = name.split(',')
      setNameArray(newArr)
    } else {
      setNameArray(name)
    }
  }, [name])

  SwiperCore.use([Navigation])
  const swiperRef: any = useRef(null)
  return (
    <div className="mt-10 mb-10 gap-x-4">
      <Swiper
        slidesPerView={4.3}
        navigation={true}
        loop={false}
        ref={swiperRef}
        // navigation
        breakpoints={{
          320: {
            slidesPerView: 1.4,
            centeredSlides: true,
            centeredSlidesBounds: true,
            spaceBetween: 12,
          },
          640: {
            slidesPerView: 1.1,
          },
          768: {
            slidesPerView: 1.1,
          },
          1024: {
            slidesPerView: 2.4,
            centeredSlides: false,
            spaceBetween: 24,
          },
        }}
      >
        {NameArray?.map((val: any, productIdx: number) => (
          <SwiperSlide
            className="py-0 2xl:w-[300px] w-[25vw] h-full "
            key={val.name}
          >
            <Video key={productIdx} heading={heading || ''} name={val || ''} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default MultiBrandVideo
