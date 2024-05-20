import { generateUri } from "@commerce/utils/uri-util";
import { IMG_PLACEHOLDER } from "@components/utils/textVariables";
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
export default function FeaturedBrand({ featuredBrand, filterBrandData }: any) {
  return (
    <div className="pt-2 pb-4 mx-auto">
      <Swiper spaceBetween={10} slidesPerView={1} navigation={false} loop={false} breakpoints={{ 640: { slidesPerView: 2, }, 768: { slidesPerView: 3, }, 1024: { slidesPerView: 7, }, 1400: { slidesPerView: 8, }, }} className="mySwiper center-content swiper-center" >
        {featuredBrand?.map((feature: any, fdx: number) => (
          <SwiperSlide key={fdx}>
            <div className="flex items-center justify-center flex-col overflow-hidden cursor-pointer bg-[#EFEFEF] border border-gray-200 rounded-lg hover:border-gray-300 flex-shrink-0" key={fdx} >
              {feature?.logoImageName != '' ? (
                <img src={generateUri(`https://www.imagedelivery.space/tagdeal/${feature?.logoImageName}`, 'h=50&fm=webp') || IMG_PLACEHOLDER} title={feature?.manufacturerName} className="object-contain object-center h-10 brand-logo-category max-h-[50px] dark:text-black" alt={feature?.manufacturerName} width={100} height={50} />
              ) : (
                <img src={IMG_PLACEHOLDER} className="object-contain object-center h-10 brand-logo-category max-h-[50px] dark:text-black" alt={feature?.manufacturerName} title={feature?.manufacturerName} width={100} height={50} />
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}