import 'swiper/css'
import 'swiper/css/navigation'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import Link from "next/link";
export default function CategoryBanner({ data }: any) {
  return (
    <>
      <section className="relative">
        <div className="relative h-[320px] md:h-[480px]">
          {/* Background Image */}
          <img src={data?.additionalInfo3} alt="Banner Image" className="absolute inset-0 object-cover sm:h-[480px] sm:max-h-[480px] w-full h-full" />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          {/* Top Content */}
          <div className="relative z-10 pt-4">
            <div className="container mx-auto">
              <div className="text-white">
                <Link href="/" className="flex items-center w-full gap-2 mb-2 text-sm text-white">
                  <ChevronLeftIcon className="w-3 h-3 text-white" /> Home
                </Link>
                <h1 className="mb-2 font-bold text-white title-hero">{data?.name}</h1>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="pt-2 bg-white">
        <div className="container mx-auto">
          {/* <div className="relative z-10 p-6 mx-auto -mt-20 bg-white shadow-md md:w-3/4 lg:w-2/3">
            <h2 className="mb-4 text-2xl font-bold text-gray-800">Choosing a Landscape Camera & Lens on a Budget</h2>
            <p className="mb-4 text-sm text-gray-600">
              Do you want to buy a DSLR or mirrorless camera to photograph landscapes on a budget? Not sure which body and lens to go for? In this article we'll discuss some of the best options for landscape photography.
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>By Dave Kai-Piper, Marketing Manager</span>
              <span>|</span>
              <span>February 2nd, 2023</span>
            </div>
          </div> */}
          <div dangerouslySetInnerHTML={{ __html: data?.description, }} className="px-0 mt-8 text-sm font-medium text-black text-x-small pc-dynamic-html" />
        </div>
      </section>
    </>
  )
}