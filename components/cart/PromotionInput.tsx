import axios from 'axios'
import { useState } from 'react'
import { useUI } from '@components/ui/context'
import { NEXT_APPLY_PROMOTION } from '@components/utils/constants'
import { PROMO_ERROR } from '@components/utils/textVariables'
import { TrashIcon } from '@heroicons/react/outline'
export default function PromotionInput() {
  const [error, setError] = useState(false)
  const { basketId, setCartItems, cartItems } = useUI()

  const [value, setValue] = useState('')

  const handleChange = (e: any) => {
    setValue(e.target.value)
  }

  const handleSubmit = (
    method: string = 'apply',
    promoCode: string = value
  ) => {
    const handleAsync = async () => {
      try {
        const { data }: any = await axios.post(NEXT_APPLY_PROMOTION, {
          basketId,
          promoCode,
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

  return (
    <div className="flex items-center">
      <div>
        <label className="text-gray-700 text-sm">Apply promotion</label>
        <div className="flex flex-col">
          <div className="flex justify-start flex-col my-5">
            {cartItems.promotionsApplied?.length
              ? cartItems.promotionsApplied.map((promo: any, key: number) => {
                  return (
                    <div className="flex items-center py-2" key={promo.name}>
                      <span className="text-indigo-500">
                        {promo.name} has been applied
                      </span>
                      <TrashIcon
                        className="ml-5 cursor-pointer text-gray-500 hover:text-indigo-700 max-w-xs h-7"
                        onClick={() => handleSubmit('remove', promo.promoCode)}
                      />
                    </div>
                  )
                })
              : null}
          </div>

          <div className="flex justify-center items-center">
            <input
              name={'promotion-code'}
              placeholder="Apply promotion"
              onChange={handleChange}
              value={value}
              className="mb-2 mt-2 appearance-none min-w-0 w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 "
            />

            <button
              onClick={() => handleSubmit('apply')}
              type="button"
              className={`max-w-xs flex-1 ml-5 bg-indigo-600 border border-transparent rounded-md py-2 px-4 flex items-center justify-center font-medium text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-600 sm:w-full`}
            >
              Apply
            </button>
          </div>
        </div>
        {error ? (
          <div className="text-red-400 text-sm">{PROMO_ERROR}</div>
        ) : null}
      </div>
      <div></div>
    </div>
  )
}
