import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import HomeProductCardMin from './HomeProductCardMin'
export default function SectionHomeProductCardNew({ products, productPerColumn, deviceInfo, maxBasketItemsCount, defaultDisplayMembership, featureToggle, onlyImage }: any) {
  return (
    <>
      <Swiper
        slidesPerView={2.2}
        spaceBetween={10}
        navigation={true}
        loop={true}
        breakpoints={{
          640: { slidesPerView: 2.2, navigation: false },
          768: { slidesPerView: 2.2, navigation: true },
          1024: { slidesPerView: productPerColumn, navigation: true, spaceBetween:20 },
        }}
      >
        {products?.map((product: any, pId: number) => (
          <SwiperSlide key={pId} className="relative inline-flex flex-col w-64 h-auto text-left cursor-pointer height-auto-slide group lg:w-auto">
           <HomeProductCardMin onlyImage={onlyImage} deviceInfo={deviceInfo} data={product} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership} />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  )
}
