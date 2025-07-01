import { generateUri } from "@commerce/utils/uri-util";
import { IMG_PLACEHOLDER } from "@components/utils/textVariables";
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import { CURRENT_THEME } from "@components/utils/constants";
import Link from "next/link";
import { sanitizeRelativeUrl } from "@framework/utils/app-util";
export default function LinkGroup({ featuredBrand, filterBrandData, categoryName  }: any) {
  return (
    <>
     <section className="pt-8">
      <div className="container px-4 mx-auto">
        <h2 className="pt-4 mb-6 font-semibold border-t border-gray-400 heading">Shop {categoryName} by brand</h2>
        <div className="grid items-center grid-cols-4 gap-2 text-left sm:grid-cols-6">
        {featuredBrand?.map((feature: any, fdx: number) => (
            <Link key={fdx} href={sanitizeRelativeUrl(feature?.slug)} className="flex flex-col items-start justify-start w-full text-left">
            {feature?.logoImageName != '' ? (
                <img src={generateUri(feature?.logoImageName, 'h=500&fm=webp') || IMG_PLACEHOLDER} className="w-full h-auto p-0 sm:p-2" alt={feature?.manufacturerName} />
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