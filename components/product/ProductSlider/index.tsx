import { FC, useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import SwiperCore, { Navigation } from 'swiper'
import CompareProductCard from '@components/product/ProductCard/CompareProductCard'
import { PDP_BRAND_COMPARE } from '@components/utils/textVariables'
import { ArrowLeft, ArrowRight } from '@components/icons'

SwiperCore.use([Navigation])

interface Props {
  config: {
    title?: string
    newInCollection?: Array<[]>
    paragraph?: string
    buttonText?: string
    subTitle?: string
    limit?: number
  }
  deviceInfo: any
  maxBasketItemsCount?: any
  activeProduct?: any
  attributeNames?: any
  products?: any
}

const BestSellerProduct: FC<React.PropsWithChildren<Props>> = ({ config, deviceInfo, maxBasketItemsCount, activeProduct, attributeNames, products, }) => {
  const swiperRef: any = useRef(null)
  return (
    <>
      <div className="flex justify-between gap-1 mb-2 lg:gap-3 sm:mb-0">
        <h2 className="flex-1 pb-0 pr-4 mb-2 font-semibold uppercase sm:pb-4 font-18 text-dark-brown dark:text-black">{PDP_BRAND_COMPARE}</h2>
        <div className="flex gap-4">
          <button aria-label="Arrow Left" onClick={() => swiperRef.current.swiper.slidePrev()} className="flex items-center justify-center w-10 h-10 border-2 border-gray-200 rounded-full arrow-container hover:border-gray-700">
            <ArrowLeft className="w-5 h-5 text-black" />
          </button>
          <button aria-label="Arrow Right" onClick={() => swiperRef.current.swiper.slideNext()} className="flex items-center justify-center w-10 h-10 border-2 border-gray-200 rounded-full arrow-container hover:border-gray-700">
            <ArrowRight className="w-5 h-5 text-black" />
          </button>
        </div>
      </div>
      <Swiper className="px-4 pb-5 mb-4 bg-white sm:mb-8 sm:px-0 min-cls-h" slidesPerView={1.1} spaceBetween={10} navigation={false} ref={swiperRef}
        breakpoints={{ 640: { slidesPerView: 1.1 }, 768: { slidesPerView: 4.1 }, 1024: { slidesPerView: 4.1 }, }}>
        <SwiperSlide className="relative inline-flex flex-col w-64 h-auto pb-5 text-left border border-gray-500 rounded-md cursor-pointer height-auto-slide group lg:w-auto">
          <CompareProductCard attributeNames={attributeNames} product={activeProduct} hideWishlistCTA={false} deviceInfo={deviceInfo} maxBasketItemsCount={maxBasketItemsCount} />
        </SwiperSlide>
        {products?.map((product?: any, productIdx?: number) => (
          activeProduct?.stockCode != product?.stockCode &&
          <SwiperSlide key={`pdp-compare-product-${productIdx}`} className={`relative flex-col w-64 h-auto pb-5 text-left cursor-pointer height-auto-slide group lg:w-auto`}>
            <CompareProductCard attributeNames={attributeNames} product={product} hideWishlistCTA={false} deviceInfo={deviceInfo} maxBasketItemsCount={maxBasketItemsCount} />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  )
}
export default BestSellerProduct
