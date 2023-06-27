import { FC } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import SwiperCore, { Navigation } from 'swiper'
import ProductCard from '../ProductCard/ProductCard'

SwiperCore.use([Navigation])

interface Props {
  config: {
    title?: string
    newincollection?: Array<[]>
    paragraph?: string
    buttonText?: string
    subTitle?: string
  }
  deviceInfo: any
}

const ProductSlider: FC<React.PropsWithChildren<Props>> = ({
  config,
  deviceInfo,
}) => {
  return (
    <div className="px-4 sm:pxy-0 min-cls-h">
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
            className="relative inline-flex flex-col w-64 pb-4 text-left border border-gray-200 rounded shadow cursor-pointer group lg:w-auto"
          >
            <ProductCard
              product={product}
              hideWishlistCTA={true}
              deviceInfo={deviceInfo}
              maxBasketItemsCount={5}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
export default ProductSlider
