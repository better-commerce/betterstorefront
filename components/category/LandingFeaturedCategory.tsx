import { generateUri } from "@commerce/utils/uri-util";
import { IMG_PLACEHOLDER } from "@components/utils/textVariables";
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import { useTranslation } from "@commerce/utils/use-translation";
import Link from "next/link";
export default function LandingFeaturedCategory({ featuredCategory }: any) {
  const translate = useTranslation()
  return (
    <div className="py-6">
      <h2 className="block mb-4 text-xl font-semibold sm:text-2xl lg:text-2xl"> {translate('label.category.popularCategoriesText')} </h2>
      <Swiper spaceBetween={10} slidesPerView={1} navigation={true} loop={false} breakpoints={{ 640: { slidesPerView: 2, }, 768: { slidesPerView: 4, }, 1024: { slidesPerView: 6, }, 1400: { slidesPerView: 7, }, }} className="mySwiper" >
        {featuredCategory?.map((featured: any, featuredIdx: number) => (
          <div key={featuredIdx}>
            {featured?.isFeatured == true && (
              <SwiperSlide key={featuredIdx}>
                <div className="relative border group rounded-2xl bg-slate-100 border-slate-100 hover:bg-slate-200">
                  <>
                    {featured?.image != '' ? (
                      <img src={generateUri(featured?.image, 'h=240&fm=webp') || IMG_PLACEHOLDER} className="object-fill object-center w-full rounded-2xl" alt="Image" width={240} height={160} />
                    ) : (
                      <img src={IMG_PLACEHOLDER} className="object-fill object-center w-full rounded-2xl" alt="Image" width={240} height={160} />
                    )}
                  </>
                  <div className="absolute w-full px-6 -mt-4 top-2/4">
                    <Link href={`/${featured?.link}`} className="flex justify-center w-full px-4 py-2 text-center text-white rounded-lg hover:bg-sky-800 bg-black/70 font-14">
                      <span>{featured?.name}</span>
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
            )}
          </div>
        )
        )}
      </Swiper>
      <hr className='mt-6 border-slate-200 dark:border-slate-700 sm:mt-10' />
    </div>
  )
}