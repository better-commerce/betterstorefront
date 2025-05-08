
import { useTranslation } from '@commerce/utils/use-translation'
export default function BrandBanner({ data, props, deviceInfo, description }: any) {
  const { isOnlyMobile, isMobile } = deviceInfo
  const translate = useTranslation()
  return (
    <>
      <section className="relative w-full grid col-span-12">
        {props?.premiumBrandLogo != ""  &&(
          <>
            <div className="relative">
              <img src={props?.premiumBrandLogo} alt="banner" className="object-cover object-center w-full h-auto sm:h-[400px] sm:max-h-[400px] cursor-pointer" />
               <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            </div>
          </>
         )}
      </section>
     <section className="pt-2 grid col-span-12 bg-white">
      <div className="container !px-2 mx-auto space-y-4">
      <h1 className={`block title-page font-bold dark:text-black primary-text-blue`}>
        {props?.name}
       </h1>
        {description &&
           <div className='flex w-full'>
              <div className="block text-sm font-normal text-gray-800 dark:text-neutral-400 dynamic-html-data" dangerouslySetInnerHTML={{ __html: description }}></div>
            </div>
           }                 
        </div>
      </section>
    </>
  )
}