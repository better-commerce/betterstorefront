import React, { FC } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import Link from 'next/link'
import Image from 'next/image'

interface HeroProps {
  banners?: []
}

interface BannerProps {
  url: string
  link: string
  alt: string
}

// import Swiper core and required modules
import SwiperCore, { Navigation } from 'swiper'
import { IMG_PLACEHOLDER } from '@components/utils/textVariables'
import { generateUri } from '@commerce/utils/uri-util'

// install Swiper modules
SwiperCore.use([Navigation])

const Hero: FC<HeroProps> = ({ banners = [] }) => {

  return (
    <div className="relative bg-gray-900">
      <Swiper navigation={true} loop={true} className="mySwiper">
        {banners.map((banner: BannerProps, idx: number) => {
          return (
            <SwiperSlide key={idx}>
              <Link href={banner?.link || '#'}>
                <div className='image-container'>
                  <Link rel='preload' href={banner?.url} />
                  <Image
                    priority
                    src={generateUri(banner?.url, "h=1200&fm=webp") || IMG_PLACEHOLDER}                      
                    alt={banner?.alt}
                    layout="fill"
                    placeholder="blur"
                    className='sm:max-h-screen sm:min-h-screen image banner-Image'></Image>
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
