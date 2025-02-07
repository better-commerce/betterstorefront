import Link from "next/link";

export default function Service({ services }: any) {
  return (
    <div className='flex flex-col w-full mt-6 bg-white sm:mt-8'>
      {services?.map((data: any, dataIdx: number) => (
        <div className='container flex items-center w-full gap-10 mx-auto justify-normal' key={`service-${dataIdx}`}>
          <div><img src={data?.service_image} className='w-48 h-auto' alt={data?.service_title} /></div>
          <div className='flex flex-col justify-start w-full p-6 mt-6'>
            <h3 className='text-2xl font-semibold text-[#2d4d9c] uppercase'>{data?.service_title}</h3>
            <div className='w-full mx-auto mb-4 text-xl font-normal text-left text-black sm:w-full sm:mb-8 cms-para-xl' dangerouslySetInnerHTML={{ __html: data?.service_description }}></div>
            <div className='flex flex-1'>
              <Link href={data?.service_buttonlink} passHref legacyBehavior>
                <a className='flex items-center justify-center h-10 px-6 text-xs font-medium text-center text-white uppercase bg-[#2d4d9c] hover:bg-sky-900 rounded'>{data?.service_buttontext}</a>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}