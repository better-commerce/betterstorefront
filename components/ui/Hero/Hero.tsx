import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
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
import SwiperCore, { Navigation } from 'swiper'
import { IMG_PLACEHOLDER } from '@components/utils/textVariables'
import { generateUri } from '@commerce/utils/uri-util'
import { useTranslation } from '@commerce/utils/use-translation'

// install Swiper modules
SwiperCore.use([Navigation])
const Hero: React.FC<HeroProps> = ({ banners = [], deviceInfo, featureToggle }: HeroProps) => {
  const { isOnlyMobile } = deviceInfo
  const css = { maxWidth: '100%', height: 'auto' }
  const translate = useTranslation()
  return (
    <>
      <h1 className="sr-only">{translate('label.home.HomePageText')}</h1>
      <Swiper navigation={true} loop={true} className="relative bg-gray-900 mySwiper" >
        {banners?.sort((a: { displayOrder: number }, b: { displayOrder: number }) => a.displayOrder > b.displayOrder ? 1 : -1).map((banner: any, bid: number) => (
          <SwiperSlide key={bid}>
            <Link href={banner?.link || '#'} className='relative'>
              <div className="image-container">
                {isOnlyMobile ? (
                  <>
                    {banner?.mobileUrl != '' ? (
                      <img src={generateUri(banner?.mobileUrl, 'h=500&fm=webp') || IMG_PLACEHOLDER} className={`object-cover object-center w-full ${featureToggle?.features?.enableForPCSite ? '' : ''}`} alt={banner?.alt} width={690} height={500} />
                    ) : (
                      <img src={generateUri(banner?.url, 'h=700&fm=webp') || IMG_PLACEHOLDER} alt={banner?.alt || 'banner-image'} style={css} width={1903} height={700} className="sm:max-h-screen image banner-Image mobile-banner banner-height-img" />
                    )}
                  </>
                ) : (
                  <img src={generateUri(banner?.url, 'h=700&fm=webp') || IMG_PLACEHOLDER} alt={banner?.alt || 'banner-image'} style={css} width={1903} height={700} className={`${featureToggle?.features?.enableForPCSite ? '!object-cover sm:min-h-[480px]' : 'sm:max-h-screen image banner-height-img banner-Image'}`} />
                )}
                <div className="sr-only">{translate('common.label.bannerImageText')}</div>
                <h2 className='absolute left-0 right-auto z-10 flex-col hidden w-full gap-0 text-center sm:flex sm:w-1/2 sm:text-left sm:left-auto sm:right-20 sm:top-1/3 top-2 bg-overlay'>
                  <span className='text-lg font-semibold text-white uppercase sm:text-3xl'>{banner?.title}</span>
                  {banner?.description && <span className='text-xs font-normal text-white sm:text-sm mt-3'>{banner?.description}</span>}
                </h2>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  )
}
export default Hero