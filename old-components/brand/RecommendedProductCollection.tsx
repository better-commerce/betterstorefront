import React, { useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper.min.css'
import SwiperCore, { Navigation } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'
import dynamic from 'next/dynamic'
import { maxBasketItemsCount } from '@framework/utils/app-util'

const ProductCard = dynamic(() => import('@old-components/product/ProductCard/ProductCard'))

const RecommendedProductCollection = ({
  recommendedProducts,
  deviceInfo,
  config,
}: any) => {
  SwiperCore.use([Navigation])
  const swiperRef: any = useRef(null)

  return (
    <div className="mt-4 mb-4">
      <Swiper
        slidesPerView={5}
        navigation={true}
        loop={false}
        ref={swiperRef}
        breakpoints={{
          320: {
            slidesPerView: 1.2,
            centeredSlides: true,
            centeredSlidesBounds: true,
            spaceBetween: 12,
          },
          640: { slidesPerView: 1.1 },
          768: { slidesPerView: 1.1 },
          1024: { slidesPerView: 4, spaceBetween: 24 },
        }}
      >
        {recommendedProducts.map((product: any, productIdx: number) => (
          <SwiperSlide
            className="py-0 2xl:w-[300px] w-[25vw] h-full"
            key={`brand-landing-${productIdx}`}
          >
            <ProductCard
              product={product}
              deviceInfo={deviceInfo}
              maxBasketItemsCount={maxBasketItemsCount(config)}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default RecommendedProductCollection
