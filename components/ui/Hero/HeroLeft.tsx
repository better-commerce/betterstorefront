import React from 'react'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import SwiperCore, { Autoplay, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import Link from 'next/link'
import { IDeviceInfo } from '@components/ui/context'

interface HeroProps {
  banners?: []
  readonly deviceInfo: IDeviceInfo
  featureToggle: any
}

interface BannerProps {
  url: string
  link: string
  alt: string
}

// import Swiper core and required modules
import { Navigation } from 'swiper'
import { IMG_PLACEHOLDER } from '@components/utils/textVariables'
import { generateUri } from '@commerce/utils/uri-util'
import { useTranslation } from '@commerce/utils/use-translation'
import { ArrowRightIcon } from '@heroicons/react/24/outline';

// install Swiper modules
SwiperCore.use([Navigation, Autoplay, Pagination])
const HeroLeft: React.FC<HeroProps> = ({ banners = [], deviceInfo, featureToggle }: HeroProps) => {
  const { isOnlyMobile } = deviceInfo
  const css = { maxWidth: '100%', height: 'auto' }
  const translate = useTranslation()
  return (
    <>
      <h1 className="sr-only">{translate('label.home.HomePageText')}</h1>
      <Swiper
        pagination={{ clickable: true }}
        autoplay={{ delay: 500000, disableOnInteraction: false }}
        loop={true}
        className="relative bg-gray-900 mySwiper"
      >
        {banners?.sort((a: { displayOrder: number }, b: { displayOrder: number }) => a.displayOrder > b.displayOrder ? 1 : -1).map((banner: any, bid: number) => (
          <SwiperSlide key={bid}>
  <div className="relative w-full h-full">
    {/* Image */}
    <img
      src={
        isOnlyMobile
          ? generateUri(banner?.mobileUrl, 'h=500&fm=webp') || IMG_PLACEHOLDER
          : generateUri(banner?.url, 'h=700&fm=webp') || IMG_PLACEHOLDER
      }
      alt={banner?.alt || 'banner-image'}
      className={`w-full object-cover ${
        featureToggle?.features?.enableForPCSite
          ? '!object-left sm:min-h-[480px]'
          : 'sm:max-h-screen image banner-Image'
      }`}
      style={css}
      width={isOnlyMobile ? 690 : 1903}
      height={isOnlyMobile ? 500 : 700}
    />

    {/* Text Overlay - centered vertically, left aligned */}
    <div className="absolute left-16 top-1/2 -translate-y-1/2 z-10 text-left sm:max-w-[40%] flex flex-col gap-4">
      <span className="title-hero font-bold text-white uppercase">{banner?.title}</span>
      <span className="heading font-normal text-white">{banner?.description}</span>
    </div>

    {/* CTA Button - bottom center of banner */}
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
      <Link href={banner?.link || '#'} legacyBehavior>
        <a className="border inline-flex items-center gap-1 rounded font-normal text-body-small border-white px-4 py-2 bg-[#2D4D9C] text-white">
          Order Now <ArrowRightIcon className="w-4 h-4" />
        </a>
      </Link>
    </div>
  </div>
</SwiperSlide>


        ))}
      </Swiper>
    </>
  )
}
export default HeroLeft