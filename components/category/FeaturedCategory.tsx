import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import Link from "next/link";
export default function FeaturedCategory({ featuredCategory }: any) {
  return (
    <div className="flex w-full pt-6 pb-3 sm:col-span-12">
      <Swiper spaceBetween={10} slidesPerView={2.3} navigation={false} loop={false} breakpoints={{ 640: { slidesPerView: 3, }, 768: { slidesPerView: 5 }, 1024: { slidesPerView: 6.8 }, 1400: { slidesPerView: 6 }, }} className="px-20 mySwiper center-content swiper-left" >
        {featuredCategory?.map((featured: any, featuredIdx: number) => (featured?.isFeatured == true && (
          <SwiperSlide key={featuredIdx}>
            <Link href={`/${featured?.link}`} className="flex min-h-[70px] items-center justify-center w-full px-0 py-2 font-semibold text-center text-black bg-gray-100 border border-gray-100 rounded-xl hover:bg-gray-200 text-[12px]">
              <span>{featured?.name}</span>
            </Link>
          </SwiperSlide>
        )))}
      </Swiper>
    </div>
  )
}