import { FC } from 'react'

interface Props {
  className?: string
}

const AddToBasketButton: FC<Props> = ({ className = '' }) => {
  return (
    <button
      type="submit"
      className={`max-w-xs flex-1 bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500 sm:w-full ${className}`}
    >
      Add to bag
    </button>
  )
}

export default AddToBasketButton
