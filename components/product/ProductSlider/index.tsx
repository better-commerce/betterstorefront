import { FC } from 'react'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/navigation'

import SwiperCore, { Navigation } from 'swiper'
import { BTN_SEE_EVERYTHING } from '@components/utils/textVariables'

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
  return (
    <section aria-labelledby="trending-heading" className="bg-white">
      <div className="py-16 sm:py-24 lg:max-w-7xl lg:mx-auto lg:py-32 lg:px-8">
        <div className="px-4 flex flex-col items-center justify-center sm:px-6 lg:px-0">
          <h2 className="text-6xl font-extrabold text-center tracking-tight text-gray-900">
            {config.title}
          </h2>
          <h2 className="py-5 text-4xl text-center font-extrabold tracking-tight text-gray-900">
            {config.subTitle}
          </h2>
          <p className="py-5 text-xl tracking-tight text-center max-w-40p text-gray-900">
            {config.paragraph}
          </p>
        </div>

        <div className="mt-8 relative">
          <div className="relative w-full overflow-x-auto">
            <Swiper
              slidesPerView={4}
              loopFillGroupWithBlank={true}
              loop={true}
              navigation={true}
            >
              <ul
                role="list"
                className="mx-4 inline-flex space-x-8 sm:mx-6 lg:mx-0 lg:space-x-0 lg:grid lg:grid-cols-4 lg:gap-x-8"
              >
                {config.products?.map((product: any) => (
                  <SwiperSlide className="px-5" key={product.slug}>
                    <Link href={product.slug}>
                      <li
                        key={product.id}
                        className="cursor-pointer w-64 inline-flex flex-col text-center lg:w-auto"
                      >
                        <div className="group relative">
                          <div className="w-full bg-gray-200 rounded-md overflow-hidden aspect-w-1 aspect-h-1">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-center object-cover group-hover:opacity-75"
                            />
                          </div>
                          <div className="mt-6">
                            <p className="text-sm text-gray-500">
                              {product.color}
                            </p>
                            <h3 className="mt-1 font-semibold text-gray-900">
                              <span className="absolute inset-0" />
                              {product.name}
                            </h3>
                            <p className="mt-1 text-gray-900">
                              {product?.price?.formatted?.withTax}
                            </p>
                          </div>
                        </div>
                      </li>
                    </Link>
                  </SwiperSlide>
                ))}
              </ul>
            </Swiper>
          </div>
        </div>

        <div className="mt-12 px-4 sm:hidden">
          <a
            href="#"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
          >
            {BTN_SEE_EVERYTHING}<span aria-hidden="true"> &rarr;</span>
          </a>
        </div>
      </div>
    </section>
  )
}

export default ProductSlider
