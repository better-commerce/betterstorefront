export default function Heading({ title, subTitle }: any) {
  return (
    <div className='flex flex-col justify-center mt-4 mb-4 text-center sm:mb-8 sm:mt-6 heading-cls-fix'>
      <h3 className='text-3xl font-bold text-black sm:text-4xl'>{title}</h3>
      <h5 className='font-normal text-gray-600 text-md sm:text-md sm:mt-2'>{subTitle}</h5>
    </div>
  )
}