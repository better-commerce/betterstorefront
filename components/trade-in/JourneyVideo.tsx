export default function JourneyVideo({data}:any) {
  return (
    <div className='flex flex-col w-full'>
      {data?.map((data: any, dataIdx: number) => (
        <div className='flex flex-col w-full' key={`guide-${dataIdx}`}>
          <iframe src={data?.guide_videolink} frameBorder={0} className='w-full mx-auto h-[580px]'></iframe>
          <div className='flex flex-col justify-start w-full p-6 mt-6 bg-white border border-gray-200'>
            <h3 className='text-3xl font-semibold text-[#2d4d9c] uppercase'>{data?.guide_title}</h3>
            <div className='w-full mx-auto mb-4 text-xl font-normal text-left text-black sm:w-full sm:mb-8 cms-para-xl' dangerouslySetInnerHTML={{ __html: data?.guide_guidedescription }}></div>
          </div>
        </div>
      ))}
    </div>
  )
}