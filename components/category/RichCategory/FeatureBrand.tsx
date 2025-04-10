import { generateUri } from "@commerce/utils/uri-util";
import { IMG_PLACEHOLDER } from "@components/utils/textVariables";
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import { CURRENT_THEME } from "@components/utils/constants";
import Link from "next/link";
export default function LinkGroup({ featuredBrand, filterBrandData, categoryname  }: any) {
  return (
    <>
     <section className="py-8 border-b border-gray-200">
      <div className="container mx-auto px-4">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Shop {categoryname} by brand</h2>
        <div className="grid items-center grid-cols-4 gap-2 text-left sm:grid-cols-6">
        {featuredBrand?.map((feature: any, fdx: number) => (
            <Link key={fdx} href={feature?.slug} className="flex flex-col items-start justify-start w-full text-left">
            {feature?.logoImageName != '' ? (
                <img src={CURRENT_THEME === 'tool' ? (generateUri(`https://www.imagedelivery.space/bettertools/${feature?.logoImageName}`, 'h=80&fm=webp') || IMG_PLACEHOLDER) : CURRENT_THEME === 'green' ? (generateUri(`https://www.imagedelivery.space/tagdeal/${feature?.logoImageName}`, 'h=80&fm=webp') || IMG_PLACEHOLDER) : (generateUri(`https://www.imagedelivery.space/fashion/${feature?.logoImageName}`, 'h=80&fm=webp') || IMG_PLACEHOLDER)} title={feature?.manufacturerName} className="w-full h-auto p-0 sm:p-2" alt={feature?.manufacturerName} />
              ) : (
                <img src={IMG_PLACEHOLDER} className="w-full h-auto p-0 sm:p-2" alt={feature?.manufacturerName} title={feature?.manufacturerName} width={100} height={50} />
              )}
            </Link>
        ))}
        </div>
      </div>
    </section>
    </>
  )
}