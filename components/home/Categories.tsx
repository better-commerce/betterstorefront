import { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import Image from 'next/image'
import 'swiper/css'
import 'swiper/css/navigation'
import Link from 'next/link'
import { IMG_PLACEHOLDER } from '@components/utils/textVariables'
import { generateUri } from '@commerce/utils/uri-util'

function Categories({ data, deviceInfo }: any) {
  const { isMobile, isIPadorTablet, isOnlyMobile } = deviceInfo
  const css = { maxWidth: '100%', minHeight: '350px' }
  const mobcss = { maxWidth: '100%', minHeight: '150px' }
  const [renderState, setRenderState] = useState(false)
  useEffect(() => setRenderState(true), [])
  if (!renderState) return null

  return (
    <Swiper
      slidesPerView={1.5}
      spaceBetween={10}
      navigation={true}
      // loop={true}
      breakpoints={{
        640: { slidesPerView: 3.2 },
        768: { slidesPerView: 4.5 },
        1024: { slidesPerView: 5.5 },
      }}
    >
      {data?.map((category: any, catId: number) => (
        <SwiperSlide
          key={catId}
          className="relative flex flex-col mobile-cls-fix style-newin_article"
        >
          <div className="image-continer">
            <Link
              href={category?.categorylist_link}
              title={category?.categorylist_name}
              passHref
              legacyBehavior
            >
              {isMobile ? (
                <Image
                  src={
                    generateUri(
                      category?.categorylist_image,
                      'h=300&fm=webp'
                    ) || IMG_PLACEHOLDER
                  }
                  alt={category?.categorylist_name}
                  width={300}
                  height={200}
                  style={mobcss}
                  className="cursor-pointer"
                />
              ) : (
                <Image
                  src={
                    generateUri(
                      category?.categorylist_image,
                      'h=300&fm=webp'
                    ) || IMG_PLACEHOLDER
                  }
                  alt={category?.categorylist_name}
                  width={600}
                  height={800}
                  style={css}
                  className="cursor-pointer"
                />
              )}
            </Link>
          </div>
          <div className="flex flex-col w-full px-2 text-center sm:px-4 style-newin_article-title">
            <div className="pt-1 text-sm font-semibold text-white b-2">
              {category?.categorylist_name}
            </div>
            <Link
              title={category?.categorylist_buttontext}
              href={category?.categorylist_link}
              passHref
              legacyBehavior
            >
              <a className="w-full mb-2 font-medium btn-primary-white btn-padding-none">
                {category?.categorylist_buttontext}
              </a>
            </Link>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}

export default Categories
