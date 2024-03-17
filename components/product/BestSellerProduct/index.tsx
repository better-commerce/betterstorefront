import { FC } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import { useRef } from 'react'
import SwiperCore, { Navigation } from 'swiper'
import dynamic from 'next/dynamic'
import { IDeviceInfo } from '@components/ui/context'
import ProductCard from '../ProductCard/ProductCard'
import { useTranslation } from '@commerce/utils/use-translation'

SwiperCore.use([Navigation])

interface IProductSliderProps {
  products: []
  deviceInfo: IDeviceInfo
  maxBasketItemsCount?: any
}

const ProductSlider: React.FC<IProductSliderProps> = ({
  products,
  deviceInfo,
  maxBasketItemsCount,
}: IProductSliderProps) => {
  const translate = useTranslation()
  const swiperRef: any = useRef(null)
  return (

    <section className="pt-4 pb-8 sm:pt-16 vertical-prod-list-mob">
      <div className="container-ffx">
        <h2 className='flex flex-col justify-center w-full mb-3 sm:mb-10 font-bold text-left sm:text-center'>{translate('label.product.bestSeleer.h2')}</h2>
        <div className="flex justify-between gap-1 mb-2 lg:gap-3 sm:mb-0">
          <h3 className="mb-6 font-medium font-24 mob-font-16 dark:text-black text-left sm:text-center">{translate('label.product.bestSeleer.h3')}</h3>
        </div>
        <Swiper className="px-4 mb-0 bg-white sm:mb-0 sm:px-0 min-cls-h-400 mob-navigation-hide" slidesPerView={1.2} ref={swiperRef} loop={true} spaceBetween={10} navigation={true} breakpoints={{ 320: { slidesPerView: 1.2, centeredSlides: true, loop: true }, 768: { slidesPerView: 3 }, 1024: { slidesPerView: 5 }, }}>
          {products?.map((product: any, bbid: number) => (
            <SwiperSlide key={product?.slug} className="relative inline-flex flex-col w-64 text-left height-auto-slide group lg:w-auto h-100">
              <ProductCard product={product} deviceInfo={deviceInfo} maxBasketItemsCount={maxBasketItemsCount} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}
export default ProductSlider
