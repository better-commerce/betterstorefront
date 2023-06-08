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
    <>
      <h2 className="sr-only">Hero</h2>
      <h2 className="sr-only">Hero 2</h2>
      <Swiper navigation={true} loop={true} className="relative bg-gray-900 mySwiper">
        {banners && banners?.map((banner: BannerProps, idx: number) => {
          return (
            <SwiperSlide key={idx}>
              <Link href={banner?.link || '#'}>
                <div className='image-container'>
                  <Image
                    priority
                    src={
                      generateUri(banner?.url, 'h=600&fm=webp') || IMG_PLACEHOLDER
                    }
                    alt={banner?.alt}
                    style={css}
                    width={1903}
                    height={761}
                    quality="60"
                    className='sm:max-h-screen image banner-Image'></Image>
                  <div className='sr-only'>Banner Image</div>
                </div>
              </Link>
            </SwiperSlide>
          )
        })}
      </Swiper>
    </>
  )
}

export default Hero
