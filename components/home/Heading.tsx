export default function Heading({ title, subTite, key }: any) {
  return (
    <div className='flex flex-col justify-center mt-2 mb-4 text-center sm:mb-8 sm:mt-4' key={key}>
        <h3 className='text-3xl font-bold text-black uppercase'>{title}</h3>
      </div>
  )
}