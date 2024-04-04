import { FC, useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import SwiperCore, { Navigation } from 'swiper'
import { useTranslation } from '@commerce/utils/use-translation'
import CompareProductCard from '@components/CompareProductCard'

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
  compareProductsAttributes?: any
}

const BestSellerProduct: FC<React.PropsWithChildren<Props>> = ({ config, deviceInfo, maxBasketItemsCount, activeProduct, attributeNames, products, compareProductsAttributes}) => {
  const translate = useTranslation()
  const swiperRef: any = useRef(null)
  return (
    <>
      <div className="flex justify-between gap-1 mb-2 lg:gap-3 sm:mb-0">
        <h2 className="flex-1 pb-0 pr-4 mb-2 font-semibold sm:pb-4 font-18 text-dark-brown dark:text-black">{translate('label.product.compareSameRangeText')}</h2>
        <div className="flex gap-4">
          <button aria-label="Arrow Left" onClick={() => swiperRef.current.swiper.slidePrev()} className="flex items-center justify-center rounded arrow-container hover:border-2">
            <i className="sprite-icons sprite-left-arrow"></i>
          </button>
          <button aria-label="Arrow Right" onClick={() => swiperRef.current.swiper.slideNext()} className="flex items-center justify-center rounded arrow-container hover:border-2">
            <i className="sprite-icons sprite-right-arrow"></i>
          </button>
        </div>
      </div>
      <Swiper className="px-4 pb-5 mb-4 bg-white sm:mb-8 sm:px-0 min-cls-h" slidesPerView={1.1} spaceBetween={10} navigation={false} ref={swiperRef}
        breakpoints={{ 640: { slidesPerView: 1.1 }, 768: { slidesPerView: 4.01 }, 1024: { slidesPerView: 4.01 }, }}>
        <SwiperSlide className="relative inline-flex flex-col w-64 h-auto pb-5 text-left border border-orange-500 rounded-md cursor-pointer height-auto-slide group lg:w-auto">
          <CompareProductCard active={true} compareProductsAttributes={compareProductsAttributes} attributeNames={attributeNames} data={activeProduct} hideWishlistCTA={false} deviceInfo={deviceInfo} maxBasketItemsCount={maxBasketItemsCount} />
        </SwiperSlide>
        {products?.map((product?: any, productIdx?: number) => (
          activeProduct?.stockCode != product?.stockCode &&
          <SwiperSlide key={`pdp-compare-product-${productIdx}`} className={`relative flex-col w-64 h-auto pb-5 text-left cursor-pointer height-auto-slide group lg:w-auto`}>
            <CompareProductCard active={false} compareProductsAttributes={compareProductsAttributes} attributeNames={attributeNames} data={product} hideWishlistCTA={false} deviceInfo={deviceInfo} maxBasketItemsCount={maxBasketItemsCount} />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  )
}
export default BestSellerProduct
