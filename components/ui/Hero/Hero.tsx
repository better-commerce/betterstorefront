import React, { FC } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import Link from 'next/link'

interface HeroProps {
  banners?: []
}

interface BannerProps {
  url: string
  link: string
}

// import Swiper core and required modules
import SwiperCore, { Navigation } from 'swiper'

// install Swiper modules
SwiperCore.use([Navigation])

const Hero: FC<HeroProps> = ({ banners = [] }) => {
  return (
    <div className="relative bg-gray-900">
      <Swiper navigation={true} className="mySwiper">
        {banners.map((banner: BannerProps, idx: number) => {
          return (
            <SwiperSlide key={idx}>
              <Link href={banner.link || '#'}>
                <img
                  src={banner.url}
                  alt=""
                  className="cursor-pointer w-full h-full object-center object-cover"
                />
              </Link>
            </SwiperSlide>
          )
        })}
        ;
      </Swiper>

      {/* Decorative image and overlay */}
      {/* <img
        src={img.url}
        alt=""
        className="w-full h-full object-center object-cover"
      /> */}
    </div>
  )
}

export default Hero
