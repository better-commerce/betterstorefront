import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade } from 'swiper';
import 'swiper/swiper-bundle.css'

const ProductSocialProof = ({ data = [] }: any) => {
  if (!data || data?.length < 1) {
    return <></>
  }

  return (
    <div className="fixed bottom-0 left-0 m-4 overflow-hidden z-999 max-w-[280px] w-full social-proof-box-shadow rounded-full">
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
            <div className="bg-white px-6 py-2 flex items-center gap-3">
              {item.ImageUrl && (
                <div className="h-14 w-14 rounded-full overflow-hidden">
                  <img src={item.ImageUrl} alt={item.Subtitle} className="w-full h-full !object-fill" />
                </div>
              )}
              <div className="text-left">
                <div className="text-sm font-semibold">{item.Title}</div>
                <div className="text-xs text-gray-500 leading-6">{item.Time}</div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default ProductSocialProof
