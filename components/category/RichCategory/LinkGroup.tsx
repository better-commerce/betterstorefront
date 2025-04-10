import { generateUri } from "@commerce/utils/uri-util";
import { IMG_PLACEHOLDER } from "@components/utils/textVariables";
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import { CURRENT_THEME } from "@components/utils/constants";
import Link from "next/link";
import { sanitizeRelativeUrl } from "@framework/utils/app-util";
export default function LinkGroup({ data }: any) {
  return (
    <>
    <section className="py-8 border-b border-gray-200">
    {data?.map((grp: any, grpIdx: number) => (
      <div className="container mx-auto px-4" key={`linkGrp-${grpIdx}`}>
        <h2 className="text-xl font-bold text-gray-800 mb-6">{grp?.name}</h2>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {grp?.items?.length > 0 && grp?.items?.map((item: any, cdx: number) => (
            <Link key={cdx} href={item?.link != null ? sanitizeRelativeUrl(`/${item?.link}`) : `#`}  className="group">
              <div className="relative overflow-hidden rounded-md">
                <div className="flex flex-col items-center w-full img-container-category">
                {item?.imageUrl != '' ? (
                    <img src={generateUri(item?.imageUrl, 'h=500&fm=webp') || IMG_PLACEHOLDER} className="w-full object-cover rounded-full" alt="Image" width={240} height={160} />
                    ) : (
                  <img src={IMG_PLACEHOLDER} className="w-full object-cover rounded-full" alt="Image" width={240} height={160} />
                    )}
                </div>
                    <span className="text-xs mt-2 block text-center font-medium text-gray-700 group-hover:text-blue-600">
                      {item?.name}
                    </span>
              </div>
            </Link>
        ))}
        </div>
      </div>
    ))}
    </section>
    </>
  )
}