import 'swiper/css'
import 'swiper/css/navigation'
import { ChevronLeftIcon} from '@heroicons/react/24/outline'
import Link from "next/link";
export default function CategoryBanner({ data }: any) {
  return (
    <>
      <section className="relative">
        <div className="bg-cover bg-center h-64 md:h-96">
            <div className="container mx-auto px-4 relative z-10 pt-6">
               <Link href="/" className="w-full flex gap-2 items-center text-white text-sm mb-2">
                 <ChevronLeftIcon className='text-white w-3 h-3'/> Home
              </Link>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{data?.name}</h1>
            </div>
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
      </section>
      <section className="bg-white py-6 border-b border-gray-200">
        <div className="container mx-auto px-4">
          {/* <div className="bg-white p-6 -mt-20 relative z-10 md:w-3/4 lg:w-2/3 mx-auto shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Choosing a Landscape Camera & Lens on a Budget</h2>
            <p className="text-sm text-gray-600 mb-4">
              Do you want to buy a DSLR or mirrorless camera to photograph landscapes on a budget? Not sure which body and lens to go for? In this article we'll discuss some of the best options for landscape photography.
            </p>
            <div className="flex items-center text-sm text-gray-500 space-x-4">
              <span>By Dave Kai-Piper, Marketing Manager</span>
              <span>|</span>
              <span>February 2nd, 2023</span>
            </div>
          </div> */}
          <div dangerouslySetInnerHTML={{  __html: data?.description, }} className="mt-8 px-0 text-sm text-gray-700" />
        </div>
      </section>
    </>
  )
}