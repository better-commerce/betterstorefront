export default function SellingGuide({ data }: any) {
  return (
    <div className='grid grid-cols-1 gap-6 mb-4 sm:grid-cols-3 sm:mb-8'>
      {
        data?.map((step: any, stepIdx: number) => (
          <div className='flex flex-col justify-center w-full gap-4 p-4 text-center rounded bg-[#2d4d9c] sm:p-6' key={`sell-${stepIdx}`}>
            <img src={step?.sellguide_image} className='w-auto h-16' alt={step?.sellguide_title} />
            <h3 className='text-xl font-semibold text-white uppercase'>{step?.sellguide_title}</h3>
            <div className='text-xl font-normal text-white' dangerouslySetInnerHTML={{ __html: step?.sellguide_description }}></div>
          </div>
        ))
      }
    </div>
  )
}