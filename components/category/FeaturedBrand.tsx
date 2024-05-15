import { generateUri } from "@commerce/utils/uri-util";
import { IMG_PLACEHOLDER } from "@components/utils/textVariables";
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import { useTranslation } from "@commerce/utils/use-translation";
import Link from "next/link";
export default function FeaturedBrand({ featuredBrand }: any) {
  const translate = useTranslation()
  return (
    <>
      <div className="py-0">
        <h2 className="block mb-4 text-xl font-semibold sm:text-2xl lg:text-2xl">Popular Brands</h2>
        <Swiper spaceBetween={10} slidesPerView={1} navigation={true} loop={false} breakpoints={{ 640: { slidesPerView: 2, }, 768: { slidesPerView: 3, }, 1024: { slidesPerView: 4, }, 1400: { slidesPerView: 5, }, }} className="mySwiper" >
          {featuredBrand?.map((feature: any, fdx: number) => (
            <div key={fdx}>
              <SwiperSlide key={fdx}>
                <div className="flex flex-col overflow-hidden bg-white rounded-lg hover:bg-slate-200" key={fdx} >
                  <div className="flex-shrink-0 items-center flex justify-center max-h-[270px] min-h-[270px]">
                    <>
                      {feature?.logoImageName != '' ? (
                        <img src={generateUri(`https://www.imagedelivery.space/tagdeal/${feature?.logoImageName}`, 'h=180&fm=webp') || IMG_PLACEHOLDER} className="object-fill object-center w-full" alt="Image" width={240} height={160} />
                      ) : (
                        <img src={IMG_PLACEHOLDER} className="object-fill object-center w-full" alt="Image" width={180} height={160} />
                      )}
                    </>
                  </div>
                  <div className="flex flex-col justify-between flex-1 p-2 rounded-b-lg bg-blue-web">
                    <div className="flex-1">
                      <Link href={`/${feature?.slug}`} className="block">
                        <p className="text-xl font-semibold text-white"> {feature?.manufacturerName} </p>
                      </Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            </div>
          )
          )}
        </Swiper>
        <hr className='mt-6 border-slate-200 dark:border-slate-700 sm:mt-10' />
      </div>
    </>
  )
}