import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import HomeProductCardMin from './HomeProductCardMin'
export default function SectionHomeProductCardNew({ products, productPerColumn, deviceInfo, maxBasketItemsCount, defaultDisplayMembership, featureToggle, onlyImage }: any) {
  return (
    <>
      <Swiper
        slidesPerView={1}
        spaceBetween={20}
        navigation={true}
        loop={true}
        breakpoints={{
          640: { slidesPerView: 1.5 },
          768: { slidesPerView: productPerColumn },
          1024: { slidesPerView: productPerColumn },
        }}
      >
        {products?.map((product: any, pId: number) => (
          <SwiperSlide key={pId} className="relative inline-flex flex-col w-64 text-left cursor-pointer height-auto-slide group lg:w-auto h-auto">
           <HomeProductCardMin onlyImage={onlyImage} deviceInfo={deviceInfo} data={product} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership} />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  )
}
