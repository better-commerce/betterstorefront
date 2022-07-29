import React, { FC } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import Link from 'next/link'
import Image from 'next/image'

// import Swiper core and required modules
import SwiperCore, { Navigation } from 'swiper'

// install Swiper modules
SwiperCore.use([Navigation])

const Hero = ({ data }: any) => {

  return (
    <div className="relative bg-gray-900">
      <Swiper navigation={true} loop={true} className="mySwiper">
        {data["imageCollection"].map((banner:any, idx: number) => {
          return (
            <SwiperSlide key={idx}>
              <Link href={banner?.link || '#'}>
                <div className='image-container'>
                  <Image
                    priority
                    src={banner?.url}
                    alt={banner?.alt}
                    layout="fill"
                    className='sm:max-h-screen image banner-Image'></Image>
                </div>
              </Link>
            </SwiperSlide>
          )
        })}
      </Swiper>
    </div>
  )
}

export default Hero
