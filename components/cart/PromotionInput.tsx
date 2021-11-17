import axios from 'axios'
import { useState } from 'react'
import { useUI } from '@components/ui/context'
import { NEXT_APPLY_PROMOTION } from '@components/utils/constants'
import { PROMO_ERROR } from '@components/utils/textVariables'

export default function PromotionInput() {
  const [error, setError] = useState(false)
  const { basketId, setCartItems, cartItems } = useUI()

  const existingPromo = cartItems.promotionsApplied.map(
    (item: any) => item.promoCode
  )[0]

  const [value, setValue] = useState(existingPromo)

  const handleChange = (e: any) => {
    setValue(e.target.value)
  }

  const handleSubmit = (method: string = 'apply') => {
    const handleAsync = async () => {
      try {
        const { data }: any = await axios.post(NEXT_APPLY_PROMOTION, {
          basketId,
          promoCode: value,
          method,
        })
        if (data.result) {
          setError(data.result.isValid)
          setCartItems(data.result.basket)
        } else setError(!data.isValid)
      } catch (error) {
        console.log(error)
      }
    }
    handleAsync()
  }

  const method = existingPromo ? 'remove' : 'apply'

  return (
    <div className="flex items-center">
      <div>
        <label className="text-gray-700 text-sm">Apply promotion</label>
        <div className="flex justify-center items-center">
          {existingPromo ? (
            <span className="text-indigo-500">
              {existingPromo} has been applied
            </span>
          ) : (
            <input
              name={'promotion-code'}
              placeholder="Apply promotion"
              onChange={handleChange}
              value={value}
              className="mb-2 mt-2 appearance-none min-w-0 w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 "
            />
          )}
          <button
            onClick={() => handleSubmit(method)}
            className={`max-w-xs flex-1 ml-5 bg-indigo-600 border border-transparent rounded-md py-2 px-4 flex items-center justify-center font-medium text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-600 sm:w-full`}
          >
            {existingPromo ? 'Remove' : 'Apply'}
          </button>
        </div>
        {error ? (
          <div className="text-red-400 text-sm">{PROMO_ERROR}</div>
        ) : null}
      </div>
      <div></div>
    </div>
  )
}
