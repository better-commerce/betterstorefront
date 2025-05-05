import { Swiper, SwiperSlide } from 'swiper/react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import 'swiper/css'
import 'swiper/css/navigation'
import Link from "next/link";
import { IMG_PLACEHOLDER } from '@components/utils/textVariables';
import { useTranslation } from '@commerce/utils/use-translation'
import { generateUri } from '@commerce/utils/uri-util';
import { sanitizeRelativeUrl } from '@framework/utils/app-util';
export default function CollectionBanner({ data, props, deviceInfo }: any) {
  const { isOnlyMobile, isMobile } = deviceInfo
  const translate = useTranslation()
  return (
    <>
      <section className="relative w-full grid col-span-12">
        <> 
        {props?.images?.length > 1 ? (
         <Swiper
              navigation={true}
              loop={true}
              className="flex items-center justify-center w-full mx-auto mt-0 mySwiper sm:px-0 sm:mt-0"
            >
              {props?.images?.map((img: any, idx: number) => (
                <SwiperSlide key={`horizontal-slider-${idx}`} className='relative'>
                  <Link href={sanitizeRelativeUrl(img?.link || '')}>
                    <img
                      width={1920}
                      height={500}
                      src={generateUri(img?.url, 'h=1000&fm=webp') || IMG_PLACEHOLDER}
                      alt={props?.name || 'Collection Banner'}
                      className="object-cover object-center w-full h-[400px] max-h-[400px] cursor-pointer"
                      loading={idx < 2 ? "eager" : "lazy"}
                    />
                  </Link>
                  <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : null}
        </>
        {props?.images?.length === 1 &&(
          <>
          {props?.images?.map((img: { mobileUrl?: string; url: string; link?: string }, idx: number) => {
            const imgUrl = (isOnlyMobile ? img?.mobileUrl : img?.url) || img?.url;
              return (
                  <div className="relative" key={`banner-image-${idx}`}>
                      <Link legacyBehavior href={sanitizeRelativeUrl(img.link || '')}>
                          <a>
                              <img
                                  src={imgUrl}
                                  alt="banner"
                                  loading={idx < 2 ? "eager" : "lazy"}
                             className="object-cover object-center w-full h-[400px] max-h-[400px] cursor-pointer"
                              />
                          </a>
                      </Link>
                      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                  </div>
              );
          })}
          </>
         )}
      </section>
     <section className="pt-6 grid col-span-12 bg-white">
      <div className="container mx-auto space-y-4">
      <h1 className={`block title-page font-bold dark:text-black primary-text-blue`}>
        {props?.name}
       </h1>
        {props?.customInfo1 &&
           <div className='flex w-full'>
              <div className="block text-sm font-normal text-gray-800 dark:text-neutral-400 dynamic-html-data" dangerouslySetInnerHTML={{ __html: props?.customInfo1 }}></div>
            </div>
           }                 
        </div>
      </section>
    </>
  )
}