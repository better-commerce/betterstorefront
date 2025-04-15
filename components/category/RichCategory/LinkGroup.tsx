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
      <section className="pt-8">
        {data?.map((grp: any, grpIdx: number) => (
          <div className="container px-4 mx-auto" key={`linkGrp-${grpIdx}`}>
            <h2 className="pt-4 mb-6 font-semibold text-black border-t border-gray-400 heading">{grp?.name}</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-6">
              {grp?.items?.length > 0 && grp?.items?.map((item: any, cdx: number) => (
                <Link key={cdx} href={item?.link != null ? sanitizeRelativeUrl(`/${item?.link}`) : `#`} className="group">
                  <div className="relative overflow-hidden rounded-md">
                    <div className="flex flex-col items-center w-full img-container-category">
                      {item?.imageUrl != '' ? (
                        <img src={generateUri(item?.imageUrl, 'h=500&fm=webp') || IMG_PLACEHOLDER} className="object-cover w-full rounded-full" alt="Image" width={240} height={160} />
                      ) : (
                        <img src={IMG_PLACEHOLDER} className="object-cover w-full rounded-full" alt="Image" width={240} height={160} />
                      )}
                    </div>
                    <span className="block mt-2 text-xs font-medium text-center text-gray-700 group-hover:text-blue-600">
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