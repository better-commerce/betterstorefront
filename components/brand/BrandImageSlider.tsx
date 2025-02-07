import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { useRef } from 'react'
import 'swiper/css/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { resolve } from 'url'

interface IBrandSliderProps {
  readonly data: any
  readonly header: any
}

const BrandSlider: React.FC<IBrandSliderProps> = ({ data, header }: IBrandSliderProps) => {
  const swiperReftools: any = useRef(null)
  return (
    <>
      <div className="py-5">
        <Swiper
          className="px-4 bg-white sm:px-0"
          slidesPerView={1.1}
          spaceBetween={10}
          navigation={false}
          loop={true}
          ref={swiperReftools}
          breakpoints={{
            640: { slidesPerView: 1.1 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 4 },
          }}
        >
          {data?.length > 0 && data?.map((ImageList: any, mid: number) => (
            <SwiperSlide className="relative inline-flex flex-col w-64 h-auto pb-5 text-left rounded-md cursor-pointer height-auto-slide group lg:w-auto" key={mid}>
              {ImageList?.imagelistsection_link != '' ? (
                <>
                  <Link href={ImageList?.imagelistsection_link || '/'} passHref legacyBehavior>
                    <a className="flex">
                      <img
                        src={ImageList?.imagelistsection_image}
                        alt={ImageList?.imagelistsection_imagetitle}
                      />
                    </a>
                  </Link>
                </>
              ) : (
                <></>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="flex items-center justify-end gap-8 pr-3">
          <div>
            {header?.length > 0 && header?.map((button: any, btnid: number) => (
              button?.imagelistheading_buttontext && (
                <Link title={resolve("/", button?.imagelistheading_buttonlink)} href={button?.imagelistheading_buttonlink} passHref legacyBehavior key={btnid}>
                  <a className="inline-block py-3 pl-5 pr-5 text-sm font-semibold text-white uppercase bg-black rounded">{button?.imagelistheading_buttontext}</a>
                </Link>
              )
            ))}
          </div>
          <div className="flex gap-4">
            <button
              aria-label="Arrow Left"
              onClick={() => swiperReftools.current.swiper.slidePrev()}
              className="flex items-center justify-center py-3 rounded arrow-container hover:border-2"
            >
              <i className="sprite-icons sprite-left-arrow"></i>
            </button>
            <button
              aria-label="Arrow Right"
              onClick={() => swiperReftools.current.swiper.slideNext()}
              className="flex items-center justify-center py-3 rounded arrow-container hover:border-2"
            >
              <i className="sprite-icons sprite-right-arrow"></i>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default BrandSlider