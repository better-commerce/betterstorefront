import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import Link from "next/link";
export default function FeaturedCategory({ featuredCategory }: any) {
  return (
    <div className="pt-6 pb-3">
      <Swiper spaceBetween={10} slidesPerView={1} navigation={false} loop={false} breakpoints={{ 640: { slidesPerView: 3, }, 768: { slidesPerView: 5 }, 1024: { slidesPerView: 6.8 }, 1400: { slidesPerView: 8.4 }, }} className="px-20 mySwiper center-content swiper-center" >
        {featuredCategory?.map((featured: any, featuredIdx: number) => (featured?.isFeatured == true && (
          <SwiperSlide key={featuredIdx}>
            <Link href={`/${featured?.link}`} className="flex justify-center w-full px-0 py-2 font-semibold text-center text-black bg-gray-100 border border-gray-100 rounded-xl hover:bg-gray-200 font-14">
              <span>{featured?.name}</span>
            </Link>
          </SwiperSlide>
        )))}
      </Swiper>
    </div>
  )
}