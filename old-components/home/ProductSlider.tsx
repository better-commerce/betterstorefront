import { FC, useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import SwiperCore, { Navigation } from 'swiper'
import ProductCard from '@components/product/ProductCard/ProductCard'
import { ArrowLeft, ArrowRight } from '@components/icons'

SwiperCore.use([Navigation])

interface Props {
  config: {
    title?: string
    newincollection?: Array<[]>
    paragraph?: string
    buttonText?: string
    subTitle?: string
    limit?: number
  }
  deviceInfo: any
}

const BestSellerProduct: FC<React.PropsWithChildren<Props>> = ({ config, deviceInfo }) => {
  const swiperRef: any = useRef(null)

  const isCompared:boolean = true
  return (
    <>
      <div className="flex justify-between gap-1 mb-2 lg:gap-3 sm:mb-0">
        <div className="sm:col-span-8">
          <div className="flex-1 pb-0 pr-4 sm:pb-4">
            <h2>&nbsp;</h2>
          </div>
        </div>
        <div className="flex gap-4">
          <button aria-label="Arrow Left" onClick={() => swiperRef.current.swiper.slidePrev()} className="flex items-center justify-center w-10 h-10 border-2 border-gray-200 rounded-full arrow-container hover:border-gray-700">
            <ArrowLeft className="w-5 h-5 text-black" />
          </button>
          <button aria-label="Arrow Right" onClick={() => swiperRef.current.swiper.slideNext()} className="flex items-center justify-center w-10 h-10 border-2 border-gray-200 rounded-full arrow-container hover:border-gray-700">
            <ArrowRight className="w-5 h-5 text-black" />
          </button>
        </div>
      </div>
      <Swiper
        className="px-4 mb-4 bg-white sm:mb-8 sm:px-0 min-cls-h"
        slidesPerView={1.1}
        spaceBetween={10}
        navigation={false}
        ref={swiperRef}
        // loop={true}
        breakpoints={{
          640: { slidesPerView: 1.1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 5 },
        }}
      >
        {config?.newincollection
          ?.slice(0, config?.limit || 6)
          ?.map((product?: any) => (
            <SwiperSlide
              key={product?.slug}
              className="relative inline-flex flex-col h-auto pb-5 text-left cursor-pointer height-auto-slide group lg:w-auto"
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
    </>
  )
}
export default BestSellerProduct