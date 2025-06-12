
export default function CategoryBanner({ data, props, deviceInfo }: any) {
  return (
    <>{props?.image && (
      <section className="relative grid w-full col-span-12 mt-4">
        <div className="relative">
          <img src={props?.image} alt="banner" className="object-cover object-center w-full h-auto sm:h-[480px] sm:max-h-[480px] cursor-pointer" />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
      </section>)}
      <section className="grid col-span-12 pt-4 mt-4 bg-white">
        <div className="container !px-0 mx-auto space-y-4">
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