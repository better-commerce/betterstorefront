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
      <div className="pb-4">
        <h2 className="block mb-4 text-lg font-semibold sm:text-xl lg:text-xl">Featured Brands</h2>
        <Swiper spaceBetween={10} slidesPerView={1} navigation={false} loop={false} breakpoints={{ 640: { slidesPerView: 2, }, 768: { slidesPerView: 3, }, 1024: { slidesPerView: 7, }, 1400: { slidesPerView: 8, }, }} className="mySwiper" >
          {featuredBrand?.map((feature: any, fdx: number) => (
            <div key={fdx}>
              <SwiperSlide key={fdx}>
                <div className="flex flex-col overflow-hidden bg-white border border-gray-200 rounded-lg hover:border-gray-300" key={fdx} >
                  <Link href={`/${feature?.slug}`}>
                    <div className="flex items-center justify-center flex-shrink-0">
                      {feature?.logoImageName != '' ? (
                        <img src={generateUri(`https://www.imagedelivery.space/tagdeal/${feature?.logoImageName}`, 'h=50&fm=webp') || IMG_PLACEHOLDER} title={feature?.manufacturerName} className="object-contain object-center h-10 brand-logo-category max-h-[50px]" alt={feature?.manufacturerName} width={100} height={50} />
                      ) : (
                        <img src={IMG_PLACEHOLDER} className="object-contain object-center h-10 brand-logo-category max-h-[50px]" alt={feature?.manufacturerName} title={feature?.manufacturerName} width={100} height={50} />
                      )}
                    </div>
                  </Link>
                  {/* <div className="flex flex-col justify-between flex-1 p-2 rounded-b-lg bg-blue-web">
                    <div className="flex-1">
                      <Link href={`/${feature?.slug}`} className="block">
                        <p className="text-xl font-semibold text-white"> {feature?.manufacturerName} </p>
                      </Link>
                    </div>
                  </div> */}
                </div>
              </SwiperSlide>
            </div>
          )
          )}
        </Swiper>
      </div>
    </>
  )
}