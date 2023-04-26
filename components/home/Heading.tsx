export default function Heading({ title, subTitle, key }: any) {
  return (
    <div className='flex flex-col justify-center mt-4 mb-4 text-center sm:mb-8 sm:mt-6' key={key}>
      <h3 className='text-2xl font-bold text-black uppercase sm:text-4xl'>{title}</h3>
      <h5 className='text-xs font-normal text-gray-600 sm:text-md sm:mt-2'>{subTitle}</h5>
    </div>
  )
}