export default function Heading({ title, subTitle }: any) {
  return (
    <div className="flex flex-col justify-center mt-4 mb-4 text-center sm:mb-8 sm:mt-6 heading-cls-fix px-4 sm:px-0">
      <h2 className="font-bold text-black">{title}</h2>
      <p className="font-normal text-gray-600 sm:mt-2">{subTitle || 'none'}</p>
    </div>
  )
}
