import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { useRef } from 'react'
import 'swiper/css/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { resolve } from 'url'

interface IBrandImageSliderProps {
  readonly imageList: any
  readonly header: any
}

const BrandImageSlider: React.FC<IBrandImageSliderProps> = ({ imageList, header }: any) => {
  const swiperRefimage: any = useRef(null)
  return (
    <>
      {imageList && header &&
        <div className="py-5">
          <Swiper
            className="px-4 bg-white sm:px-0"
            slidesPerView={1.1}
            spaceBetween={10}
            loop={true}
            navigation={false}
            ref={swiperRefimage}
            breakpoints={{
              640: { slidesPerView: 1.1 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 3 },
            }}
          >
            {imageList?.length > 0 && imageList?.map((ImageList: any, mmid: number) => (
              <SwiperSlide className="relative inline-flex flex-col w-64 h-auto pb-5 text-left rounded-md cursor-pointer height-auto-slide group lg:w-auto" key={mmid}>
                <Link href={ImageList?.imagelistsecond_link || '/'} passHref legacyBehavior>
                  <a className="flex">
                    <img
                      src={ImageList?.imagelistsecond_image}
                      alt={ImageList?.imagelistsecond_imagetitle}
                    />
                  </a>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="flex items-center justify-end gap-8 pr-3">
            <div>
              {header?.length > 0 && header?.map((button: any, btnId: number) => (
                button?.imagelistheadingtwo_buttontext && (
                  <Link title={resolve("/", button?.imagelistheadingtwo_buttonlink)} href={button?.imagelistheadingtwo_buttonlink} passHref legacyBehavior key={btnId}>
                    <a className="inline-block py-3 pl-5 pr-5 text-sm font-semibold text-white uppercase bg-black rounded">{button?.imagelistheadingtwo_buttontext}</a>
                  </Link>
                )
              ))}
            </div>

            <div className="flex gap-4">
              <button
                aria-label="Arrow Left"
                onClick={() => swiperRefimage.current.swiper.slidePrev()}
                className="flex items-center justify-center py-3 rounded arrow-container hover:border-2"
              >
                <i className="sprite-icons sprite-left-arrow"></i>
              </button>
              <button
                aria-label="Arrow Right"
                onClick={() => swiperRefimage.current.swiper.slideNext()}
                className="flex items-center justify-center py-3 rounded arrow-container hover:border-2"
              >
                <i className="sprite-icons sprite-right-arrow"></i>
              </button>
            </div>
          </div>
        </div>
      }
    </>
  )
}

export default BrandImageSlider