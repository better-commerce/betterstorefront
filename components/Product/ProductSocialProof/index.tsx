import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade } from 'swiper';
import 'swiper/swiper-bundle.css'

const ProductSocialProof = ({ data = [], featureToggle }: any) => {
  if (!data || !Array.isArray(data) ) {
    return <></>
  }

  return (
    <div className={`${featureToggle?.features?.enableDemoToggle ? ' bottom-0 right-0 ' : ' bottom-0 left-0 '} fixed m-4 overflow-hidden z-99 max-w-[280px] w-full social-proof-box-shadow rounded-full`}>
      <Swiper
        effect='fade'
        spaceBetween={30}
        centeredSlides={true}
        fadeEffect={{ crossFade: true }}
        modules={[Autoplay, EffectFade]}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 2500 }}
        speed={500}
      >
       {data?.map((item: any, index: any) => (
          <SwiperSlide key={index}>
            <div className="flex items-center gap-3 px-6 py-2 bg-white">
              {item?.ImageUrl && (
                <div className="overflow-hidden rounded-full h-14 w-14">
                  <img src={item?.ImageUrl} alt={item?.Subtitle} className="w-full h-full !object-fill" />
                </div>
              )}
              <div className="text-left">
                <div className="text-sm font-semibold">{item?.Title}</div>
                <div className="text-xs leading-6 text-gray-500">{item?.Time}</div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default ProductSocialProof
