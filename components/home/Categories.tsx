import { Swiper, SwiperSlide } from 'swiper/react'
import Image from 'next/image'
import 'swiper/css'
import 'swiper/css/navigation'

import SwiperCore, { Navigation } from 'swiper'
import Link from 'next/link'
export default function Categories({data}:any) {
  var settings = {
    fade: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 8000,
    centerMode: false,
    dots: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  }

  const css = { maxWidth: "100%", minHeight: "350px" }
  return (
    <div className='flex'>
      <Swiper
        slidesPerView={1.2}
        spaceBetween={10}
        navigation={true}
        loop={true}
        breakpoints={{
          640: {
            slidesPerView: 1.2,
          },
          768: {
            slidesPerView: 4.5,
          },
          1024: {
            slidesPerView: 5.5,
          },
        }}
      >
        <div
          role="list"
          className="inline-flex mx-4 space-x-2 sm:mx-6 lg:mx-0 lg:space-x-0 lg:grid lg:grid-cols-4 lg:gap-x-2"
        >
          {data?.map((category: any, catId: number) => (
            <SwiperSlide key={catId}>
              <div className='sm:col-span-1'>
                <div className='relative flex flex-col style-newin_article'>
                  <div className='image-continer'>
                    <Link href={category?.categorylist_link} passHref legacyBehavior>
                      <a>
                        <Image src={category?.categorylist_image} alt={category?.categorylist_name} width={600} height={800} style={css} />
                      </a>
                    </Link>
                  </div>
                  <div className='flex flex-col w-full px-2 text-center sm:px-4 style-newin_article-title'>
                    <h3 className='pt-1 mb-2 text-sm font-semibold text-white'>{category?.categorylist_name}</h3>
                    <Link href={category?.categorylist_link} passHref legacyBehavior>
                      <a className='w-full py-1 mb-2 text-sm font-medium text-black bg-white border border-white hover:bg-gray-100 hover:border-gray-800 hover:shadow-md'>
                        {category?.categorylist_buttontext}
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </div>
      </Swiper>
    </div>
  )
}