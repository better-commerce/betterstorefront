
export default function BrandBanner({ data, props, deviceInfo, description }: any) {
  return (
    <>
      {props?.premiumBrandLogo != "" && (<section className="relative grid w-full col-span-12">
        <div className="relative">
          <img src={props?.premiumBrandLogo} alt="banner" className="object-cover object-center w-full h-auto sm:h-[480px] sm:max-h-[480px] cursor-pointer" />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
      </section>
      )}
      <section className="grid col-span-12 pt-2 bg-white">
        <div className="container !px-0 mx-auto space-y-4">
          <h1 className={`block title-page font-bold dark:text-black primary-text-blue !mb-4`}>{props?.name}</h1>
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