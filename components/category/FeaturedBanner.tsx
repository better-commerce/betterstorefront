import { generateUri } from "@commerce/utils/uri-util";
import { IMG_PLACEHOLDER } from "@components/utils/textVariables";
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import { CURRENT_THEME } from "@components/utils/constants";
export default function FeaturedBanner({ category }: any) {
 let spv = 1
  if (CURRENT_THEME == 'green') {
    spv = 2
  }
  return (
    <>
      {category && category?.images && category?.images.length > 0 &&
        <div className="py-0 mx-auto">
          <Swiper spaceBetween={16} slidesPerView={1} navigation={true} loop={true} breakpoints={{ 640: { slidesPerView: 1, }, 768: { slidesPerView: 1, }, 1024: { slidesPerView: spv }, 1400: { slidesPerView: spv }, }} className="mySwier" >
            {category?.images?.map((cat: any, idx: number) => (
              <SwiperSlide key={idx}>
                <div className='mt-4 sm:mt-8 category-banner-container'>
                  <div className="flex items-center justify-center order-2 w-full h-full bg-blue-web sm:order-1">
                    <div className="relative z-10 justify-center w-full pos-absolute sm:absolute top-space-mobile sm:top-2/4 sm:-translate-y-2/4 cat-container">
                      <h2 className="text-2xl text-white uppercase sm:text-4xl"> {cat?.name} </h2>
                      <p className="mt-5 font-light text-white"> {cat?.description} </p>
                    </div>
                  </div>
                  <div className="order-1 sm:order-2">
                    <img src={generateUri(cat?.url, 'h=700&fm=webp') || IMG_PLACEHOLDER} className="w-full h-[500px]" alt={category?.name || 'category'} width={700} height={700} />
                  </div>
                </div>
              </SwiperSlide>
            )
            )}
          </Swiper>
        </div>
      }
    </>
  )
}