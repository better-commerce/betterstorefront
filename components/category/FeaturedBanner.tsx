import { generateUri } from "@commerce/utils/uri-util";
import { IMG_PLACEHOLDER } from "@components/utils/textVariables";
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
export default function FeaturedBanner({ category }: any) {
  return (
    <>
      {category && category?.images && category?.images.length > 0 &&
        <div className="py-0 mx-auto">
          <Swiper spaceBetween={16} slidesPerView={2} navigation={true} loop={true} breakpoints={{ 640: { slidesPerView: 1, }, 768: { slidesPerView: 1, }, 1024: { slidesPerView: 2 }, 1400: { slidesPerView: 2 }, }} className="mySwier" >
            {category?.images?.map((cat: any, idx: number) => (
              <SwiperSlide key={idx}>
                <div className='mt-4 sm:mt-8 category-banner-container'>
                  <div className="flex items-center justify-center order-2 w-full h-full p-4 py-8 bg-blue-web sm:py-0 sm:p-0 sm:order-1">
                    <div className="relative z-10 justify-center w-full sm:absolute sm:top-2/4 sm:-translate-y-2/4 cat-container">
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