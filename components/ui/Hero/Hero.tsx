import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import Link from 'next/link'
import { IDeviceInfo } from '@new-components/ui/context'

interface HeroProps {
  banners?: []
  readonly deviceInfo: IDeviceInfo
}

interface BannerProps {
  url: string
  link: string
  alt: string
}

// import Swiper core and required modules
import SwiperCore, { Navigation } from 'swiper'
import { IMG_PLACEHOLDER } from '@new-components/utils/textVariables'
import { generateUri } from '@commerce/utils/uri-util'
import { useTranslation } from '@commerce/utils/use-translation'

// install Swiper modules
SwiperCore.use([Navigation])
const Hero: React.FC<HeroProps> = ({ banners = [], deviceInfo }: HeroProps) => {
  const { isOnlyMobile } = deviceInfo
  const css = { maxWidth: '100%', height: 'auto' }
  const translate = useTranslation()
  return (
    <>
      <h1 className="sr-only">{translate('label.home.HomePageText')}</h1>
      <Swiper
        navigation={true}
        loop={true}
        className="relative bg-gray-900 mySwiper"
      >
        {banners?.sort((a: { displayOrder: number }, b: { displayOrder: number }) => a.displayOrder > b.displayOrder ? 1 : -1).map((banner: any, bid: number) => (
          <>
            <SwiperSlide key={bid}>
              <Link href={banner?.link || '#'}>
                <div className="image-container">
                  {isOnlyMobile ? (
                    <>
                      {banner?.mobileUrl != '' ? (
                        <img src={generateUri(banner?.mobileUrl, 'h=500&fm=webp') || IMG_PLACEHOLDER} className="object-cover object-center w-full" alt={banner?.alt} width={690} height={500} />
                      ) : (
                        <>
                          <img src={generateUri(banner?.url, 'h=700&fm=webp') || IMG_PLACEHOLDER} alt={banner?.alt || 'banner-image'} style={css} width={1903} height={700} className="sm:max-h-screen image banner-Image" />
                        </>
                      )}
                    </>
                  ) : (
                    <img src={generateUri(banner?.url, 'h=700&fm=webp') || IMG_PLACEHOLDER} alt={banner?.alt || 'banner-image'} style={css} width={1903} height={700} className="sm:max-h-screen image banner-Image" />
                  )}
                  <div className="sr-only">Banner Image</div>
                </div>
              </Link>
            </SwiperSlide>
          </>
        ))}
      </Swiper>
    </>
  )
}
export default Hero