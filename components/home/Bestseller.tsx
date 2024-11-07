import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import { useRef } from 'react'
import SwiperCore, { Navigation } from 'swiper'
import dynamic from 'next/dynamic'
import { IDeviceInfo } from '@components/ui/context'
const HomeProductCard = dynamic(() => import('@components/Product/ProductCard/HomeProductCard'))

SwiperCore.use([Navigation])

interface IProductSliderProps {
  config: any
  deviceInfo: IDeviceInfo
  maxBasketItemsCount?: any
}

const ProductSlider: React.FC<IProductSliderProps> = ({ config, deviceInfo, maxBasketItemsCount, }: IProductSliderProps) => {
  const swiperRef: any = useRef(null)
  return (
    config?.bestsellerslist &&
    <section className="container py-8 mx-auto bg-white sm:py-16 vertical-prod-list-mob">
      <div className="container-ffx">
        <div className="flex justify-between gap-1 mb-6 lg:gap-3 sm:mb-6">
          {config?.productheading?.map((heading: any, chId: number) => (
            <h3 className="text-3xl font-semibold md:text-4xl dark:text-black" key={`bestseller-${chId}`}>{heading?.productheading_title}</h3>
          ))}
          <div className="hidden gap-4 sm:flex">
            <button aria-label="Arrow Left" onClick={() => swiperRef.current.swiper.slidePrev()} className="flex items-center justify-center rounded arrow-container hover:border-2">
              <i className="sprite-icons sprite-left-arrow"></i>
            </button>
            <button aria-label="Arrow Right" onClick={() => swiperRef.current.swiper.slideNext()} className="flex items-center justify-center rounded arrow-container hover:border-2">
              <i className="sprite-icons sprite-right-arrow"></i>
            </button>
          </div>
        </div>
        <Swiper className="px-4 mb-0 bg-white sm:mb-0 sm:px-0 min-cls-h" slidesPerView={1.2} ref={swiperRef} loop={true} spaceBetween={10} navigation={false} breakpoints={{ 320: { slidesPerView: 1.2, centeredSlides: true, loop: true }, 768: { slidesPerView: 2 }, 1024: { slidesPerView: 4 }, }}>
          {config?.bestsellerslist?.map((product: any, bbid: number) => (
            <SwiperSlide key={product?.slug} className="relative inline-flex flex-col w-64 text-left height-auto-slide group lg:w-auto h-100">
              <HomeProductCard product={product} hideWishlistCTA={true} deviceInfo={deviceInfo} maxBasketItemsCount={maxBasketItemsCount} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}
export default ProductSlider
