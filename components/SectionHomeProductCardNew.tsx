import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import dynamic from 'next/dynamic'
const ProductCard = dynamic(() => import('@components/ProductCard'))
export default function SectionHomeProductCardNew({ products, productPerColumn, deviceInfo, maxBasketItemsCount, defaultDisplayMembership, featureToggle, onlyImage }: any) {
  const { isMobile } = deviceInfo || { isMobile: false };

  return (
    <>
      <Swiper
        slidesPerView={1.4}
        spaceBetween={10}
        navigation={true}
        loop={true}
        className={isMobile ? 'mob-navigation-hide' : ''}
        breakpoints={{
          640: { slidesPerView: 2.2, navigation: false },
          768: { slidesPerView: 2.2, navigation: true },
          1024: { slidesPerView: 4, spaceBetween:20 },
          1800: { slidesPerView: productPerColumn, spaceBetween: 16 }
        }}
      >
        {products?.map((product: any, pId: number) => (
          <SwiperSlide key={pId} className="relative inline-flex flex-col w-64 h-auto text-left cursor-pointer height-auto-slide group lg:w-auto">
            <ProductCard data={product} deviceInfo={deviceInfo} maxBasketItemsCount={maxBasketItemsCount} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership} />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  )
}
