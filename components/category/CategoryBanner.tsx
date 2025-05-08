
import Link from "next/link";
import { IMG_PLACEHOLDER } from '@components/utils/textVariables';
import { useTranslation } from '@commerce/utils/use-translation'
import { sanitizeRelativeUrl } from '@framework/utils/app-util';
export default function CategoryBanner({ data, props, deviceInfo }: any) {
  const { isOnlyMobile, isMobile } = deviceInfo
  const translate = useTranslation()
  return (
    <>
      <section className="relative w-full grid col-span-12">
        {props?.image &&(
          <>
            <div className="relative">
              <img src={props?.image} alt="banner" className="object-cover object-center w-full h-auto sm:h-[400px] sm:max-h-[400px] cursor-pointer" />
               <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            </div>
          </>
         )}
      </section>
     <section className="pt-4 grid col-span-12 bg-white">
      <div className="container !px-2 mx-auto space-y-4">
      <h1 className={`block title-page mb-2 font-bold dark:text-black primary-text-blue`}>
        {props?.name}
       </h1>
        {props?.customInfo1 &&
           <div className='flex w-full'>
              <div className="block text-sm font-normal text-gray-800 dark:text-neutral-400 dynamic-html-data" dangerouslySetInnerHTML={{ __html: props?.description }}></div>
            </div>
           }                 
        </div>
      </section>
    </>
  )
}