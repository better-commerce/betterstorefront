import { generateUri } from "@commerce/utils/uri-util";
import { IMG_PLACEHOLDER } from "@components/utils/textVariables";
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import { useTranslation } from "@commerce/utils/use-translation";
import Link from "next/link";
export default function FeaturedCategory({ featuredCategory }: any) {
  const translate = useTranslation()
  return (
    <div className="pt-6 pb-3">
      <Swiper spaceBetween={10} slidesPerView={1} navigation={false} loop={false} breakpoints={{ 640: { slidesPerView: 3, }, 768: { slidesPerView: 5 }, 1024: { slidesPerView: 6.8 }, 1400: { slidesPerView: 8.4 }, }} className="px-20 mySwiper" >
        {featuredCategory?.map((featured: any, featuredIdx: number) => (
          <div key={featuredIdx}>
            {featured?.isFeatured == true && (
              <SwiperSlide key={featuredIdx}>
                <div className="relative border group rounded-2xl bg-slate-100 border-slate-100 hover:bg-slate-50">
                  <Link href={`/${featured?.link}`} className="flex justify-center w-full px-0 py-2 font-semibold text-center text-black bg-gray-100 border border-gray-100 rounded-lg hover:bg-gray-200 font-14">
                    <span>{featured?.name}</span>
                  </Link>
                </div>
              </SwiperSlide>
            )}
          </div>
        )
        )}
      </Swiper>
      <hr className='mt-2 border-slate-200 dark:border-slate-700 sm:mt-4' />
    </div>
  )
}