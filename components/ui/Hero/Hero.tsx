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

const Hero: FC<React.PropsWithChildren<HeroProps>> = ({ banners = [] }) => {

  const css = { maxWidth: '100%', height: 'auto' }
  return (
    <div className="relative bg-gray-900">
      <Swiper navigation={true} loop={true} className="mySwiper">
        {banners.map((banner: BannerProps, idx: number) => {
          return (
            <SwiperSlide key={idx}>              
              <Link href={banner?.link || '#'}>
                <div className='image-container'>
                  <Image
                    priority
                    src={
                      generateUri(banner?.url, 'h=800&fm=webp') ||
                      IMG_PLACEHOLDER
                    }
                    alt={banner?.alt}
                    style={css}
                    width={2000}
                    height={1000}
                    className='sm:max-h-screen image banner-Image'></Image>
                    <div className='sr-only'>Banner Image</div>
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
