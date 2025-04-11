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
const HeroLeft: React.FC<HeroProps> = ({ banners = [], deviceInfo, featureToggle }: HeroProps) => {
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
              <div className="image-container relative flex justify-center items-center">
                <div className="sr-only">{translate('common.label.bannerImageText')}</div>
                <h2 className="absolute left-16 top-1/2 -translate-y-1/2 z-10 w-5/12 flex flex-col gap-6 text-left">
                  <span className="title-hero font-bold text-white uppercase">{banner?.title}</span>
                  <span className="heading font-normal text-white">{banner?.description}</span>
                </h2>
                {isOnlyMobile ? (
                  <>
                    {banner?.mobileUrl != '' ? (
                      <img src={generateUri(banner?.mobileUrl, 'h=500&fm=webp') || IMG_PLACEHOLDER} className={`object-cover object-center w-full ${featureToggle?.features?.enableForPCSite ? '' : ''}`} alt={banner?.alt} width={690} height={500} />
                    ) : (
                      <img src={generateUri(banner?.url, 'h=700&fm=webp') || IMG_PLACEHOLDER} alt={banner?.alt || 'banner-image'} style={css} width={1903} height={700} className="sm:max-h-screen image banner-Image mobile-banner" />
                    )}
                  </>
                ) : (
                  <img src={generateUri(banner?.url, 'h=700&fm=webp') || IMG_PLACEHOLDER} alt={banner?.alt || 'banner-image'} style={css} width={1903} height={700} className={`${featureToggle?.features?.enableForPCSite ? '!object-cover !object-left sm:min-h-[480px]' : 'sm:max-h-screen image banner-Image'}`} />
                )}

              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  )
}
export default HeroLeft