import { generateUri } from "@commerce/utils/uri-util";
import { IMG_PLACEHOLDER } from "@components/utils/textVariables";
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import { useTranslation } from "@commerce/utils/use-translation";
import Link from "next/link";
import { CURRENT_THEME } from "@components/utils/constants";
export default function LandingFeaturedCategory({ featuredCategory, deviceInfo }: any) {
  const { isMobile, isIPadorTablet } = deviceInfo
  const translate = useTranslation()
  let spv = 4
  if (CURRENT_THEME == 'green') {
    spv = 7
  }
  return (
    <div className="py-6">
      <Swiper spaceBetween={10} slidesPerView={2.3} navigation={!isMobile} loop={false} breakpoints={{ 640: { slidesPerView: 2, }, 768: { slidesPerView: 4, }, 1024: { slidesPerView: spv, }, 1400: { slidesPerView: spv, }, }} className="mySwiper" >
        {featuredCategory?.map((featured: any, featuredIdx: number) => (
          <div key={featuredIdx}>
            {featured?.isFeatured == true && (
              <SwiperSlide key={featuredIdx}>
                <div className="relative border group sm:rounded-2xl bg-slate-100 border-slate-100 hover:bg-slate-200">
                  <>
                    {featured?.image != '' ? (
                      <img src={generateUri(featured?.image, 'h=500&fm=webp') || IMG_PLACEHOLDER} className="object-fill object-center w-full sm:rounded-2xl" alt="Image" width={240} height={160} />
                    ) : (
                      <img src={IMG_PLACEHOLDER} className="object-fill object-center w-full rounded-2xl" alt="Image" width={240} height={160} />
                    )}
                  </>
                  <div className="absolute px-6 -mt-4 sm:w-full top-2/4">
                    <Link href={`/${featured?.link}`} className="flex justify-center w-full px-4 py-2 font-semibold text-center text-black bg-white sm:rounded-lg hover:text-white hover:bg-sky-800 font-14">
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