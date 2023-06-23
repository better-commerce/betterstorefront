import { FC } from 'react'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import Image from 'next/image'
import 'swiper/css'
import 'swiper/css/navigation'
import SwiperCore, { Navigation } from 'swiper'
import { IMG_PLACEHOLDER } from '@components/utils/textVariables'
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
  const css = { maxWidth: '100%', height: 'auto', minHeight: '400px' }
  return (
    <div className="px-4 sm:pxy-0">
      <Swiper
        className="mb-4 bg-white sm:mb-8"
        slidesPerView={1.5}
        spaceBetween={10}
        navigation={true}
        loop={true}
        breakpoints={{
          640: { slidesPerView: 1.5 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 5 },
        }}
      >
        {config?.newincollection?.map((product?: any) => (
          <SwiperSlide
            key={product?.slug}
            className="relative inline-flex flex-col w-64 text-center shadow-md cursor-pointer group lg:w-auto"
          >
            <Link href={product?.slug}>
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
                  className="object-cover object-center w-full h-full group-hover:opacity-75 mob-prod-height"
                />
              </div>
              <div className="px-2 pb-3 mt-3 text-left sm:px-4">
                <p className="text-sm text-black">{product?.color}</p>
                <h4 className="mt-1 text-sm font-semibold text-black capitalize">
                  {product?.name}
                </h4>
                <span className="block mt-1 text-sm font-semibold text-black">
                  {product?.price?.formatted?.withTax}
                </span>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
export default ProductSlider
