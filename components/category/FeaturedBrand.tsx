import { generateUri } from "@commerce/utils/uri-util";
import { IMG_PLACEHOLDER } from "@components/utils/textVariables";
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import { CURRENT_THEME } from "@components/utils/constants";
export default function FeaturedBrand({ featuredBrand, filterBrandData }: any) {
  let spv = 4
  if (CURRENT_THEME == 'green') {
    spv = 8
  }
  return (
    <div className="pt-2 pb-4 mx-auto">
      <Swiper spaceBetween={10} slidesPerView={1} navigation={false} loop={false} breakpoints={{ 640: { slidesPerView: 2, }, 768: { slidesPerView: 3, }, 1024: { slidesPerView: spv, }, 1400: { slidesPerView: spv, }, }} className="mySwiper center-content swiper-center" >
        {featuredBrand?.map((feature: any, fdx: number) => (
          <SwiperSlide key={fdx}>
            <div className="flex items-center justify-center flex-col overflow-hidden cursor-pointer bg-[#EFEFEF] border border-gray-200 rounded-lg hover:border-gray-300 flex-shrink-0" key={fdx} >
              {feature?.logoImageName != '' ? (
                <img src={CURRENT_THEME === 'tool' ? (generateUri(`https://www.imagedelivery.space/bettertools/${feature?.logoImageName}`, 'h=80&fm=webp') || IMG_PLACEHOLDER) : CURRENT_THEME === 'green' ? (generateUri(`https://www.imagedelivery.space/tagdeal/${feature?.logoImageName}`, 'h=80&fm=webp') || IMG_PLACEHOLDER) : (generateUri(`https://www.imagedelivery.space/fashion/${feature?.logoImageName}`, 'h=80&fm=webp') || IMG_PLACEHOLDER)} title={feature?.manufacturerName} className="object-contain object-center h-10 brand-logo-category max-h-[80px] dark:text-black" alt={feature?.manufacturerName} width={100} height={80} />
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