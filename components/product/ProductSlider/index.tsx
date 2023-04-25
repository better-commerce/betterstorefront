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
    newincollection?: Array<[]>
    paragraph?: string
    buttonText?: string
    subTitle?: string
  }
}

const ProductSlider: FC<React.PropsWithChildren<Props>> = ({ config }) => {
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
  const css = { maxWidth: '100%', height: 'auto', minHeight:"500px" }
  return (
    <section aria-labelledby="trending-heading" className="mb-4 bg-white sm:mb-8">
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
          className="inline-flex mx-4 space-x-2 sm:mx-6 lg:mx-0 lg:space-x-0 lg:grid lg:grid-cols-4 lg:gap-x-2"
        >
          {config?.newincollection?.map((product?: any) => (
            <SwiperSlide key={product?.slug}>
              <Link href={product?.slug}>
                <div
                  key={product?.id}
                  className="inline-flex flex-col w-64 text-center cursor-pointer lg:w-auto"
                >
                  <div className="relative group">
                    <div className="w-full overflow-hidden bg-gray-200 aspect-w-1 aspect-h-1">
                      <Image
                        priority
                        src={
                          generateUri(product.image, 'h=500&fm=webp') ||
                          IMG_PLACEHOLDER
                        }
                        alt={product?.name}
                        style={css}
                        width={500}
                        height={600}
                        className="object-cover object-center w-full h-full group-hover:opacity-75"
                      ></Image>
                    </div>
                    <div className="mt-3 text-left">
                      <p className="text-sm text-black">
                        {product?.color}
                      </p>
                      <h3 className="mt-1 text-sm font-semibold text-black capitalize">
                        {product?.name}
                      </h3>
                      <p className="mt-1 text-sm font-semibold text-black">
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
    </section>
  )
}

export default ProductSlider
