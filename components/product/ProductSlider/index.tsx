import { FC } from 'react'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import Image from 'next/image'
import 'swiper/css'
import 'swiper/css/navigation'

import SwiperCore, { Navigation } from 'swiper'
import {
  BTN_SEE_EVERYTHING,
  IMG_PLACEHOLDER,
} from '@components/utils/textVariables'
import { generateUri } from '@commerce/utils/uri-util'

SwiperCore.use([Navigation])

interface Props {
  config: {
    title?: string
    products?: Array<[]>
    paragraph?: string
    buttonText?: string
    subTitle?: string
  }
}

const ProductSlider: FC<Props> = ({ config }) => {
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
  const css = { maxWidth: '100%', height: 'auto' }
  return (
    <section aria-labelledby="trending-heading" className="bg-white">
      <div className="py-8 sm:py-24 lg:max-w-7xl lg:mx-auto lg:py-32 lg:px-8">
        <div className="flex flex-col items-center justify-center px-4 sm:px-6 lg:px-0">
          <h2 className="text-4xl font-extrabold tracking-tight text-center text-gray-900 sm:text-6xl">
            {config?.title}
          </h2>
          <h2 className="py-3 text-xl font-bold tracking-tight text-center text-gray-900 sm:py-5 sm:text-4xl">
            {config?.subTitle}
          </h2>
          <p className="py-3 tracking-tight text-center text-gray-900 sm:py-5 sm:text-xl text-md sm:max-w-40p">
            {config?.paragraph}
          </p>
        </div>

        <div className="relative mt-8">
          <div className="relative w-full overflow-x-auto">
            <Swiper
              slidesPerView={1}
              spaceBetween={10}
              navigation={true}
              loop={true}
              breakpoints={{
                640: {
                  slidesPerView: 1,
                },
                768: {
                  slidesPerView: 4,
                },
                1024: {
                  slidesPerView: 4,
                },
              }}
            >
              <div
                role="list"
                className="inline-flex mx-4 space-x-8 sm:mx-6 lg:mx-0 lg:space-x-0 lg:grid lg:grid-cols-4 lg:gap-x-8"
              >
                {config?.products?.map((product?: any) => (
                  <SwiperSlide className="px-5" key={product?.slug}>
                    <Link href={product?.slug}>
                      <div
                        key={product?.id}
                        className="inline-flex flex-col w-64 text-center cursor-pointer lg:w-auto"
                      >
                        <div className="relative group">
                          <div className="w-full overflow-hidden bg-gray-200 rounded-md aspect-w-1 aspect-h-1">
                            <Image
                              priority
                              src={
                                generateUri(product.image, 'h=500&fm=webp') ||
                                IMG_PLACEHOLDER
                              }
                              alt={product?.name}
                              style={css}
                              width={257}
                              height={362}
                              className="object-cover object-center w-full h-full group-hover:opacity-75"
                            ></Image>
                          </div>
                          <div className="mt-6">
                            <p className="text-sm text-gray-500">
                              {product?.color}
                            </p>
                            <h3 className="mt-1 font-semibold text-gray-900">
                              <span className="absolute inset-0" />
                              {product?.name}
                            </h3>
                            <p className="mt-1 text-gray-900">
                              {product?.price?.formatted?.withTax}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </SwiperSlide>
                ))}
              </div>
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductSlider
