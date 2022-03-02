import axios from 'axios'
import { useState } from 'react'
import { useUI } from '@components/ui/context'
import { NEXT_APPLY_PROMOTION } from '@components/utils/constants'
import { PROMO_ERROR } from '@components/utils/textVariables'
import { TrashIcon } from '@heroicons/react/outline'
import Button from '@components/ui/IndigoButton'
import {
  APPLY_PROMOTION,
  APPLY_PROMOTION_SUCCESS_MESSAGE,
  GENERAL_APPLY_TEXT
} from '@components/utils/textVariables'

export default function PromotionInput() {
  const [error, setError] = useState(false)
  const { basketId, setCartItems, cartItems } = useUI()

  const [value, setValue] = useState('')

  const handleChange = (e: any) => {
    setValue(e.target.value)
  }

  const handleSubmit = async (
    method: string = 'apply',
    promoCode: string = value
  ) => {
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
const DEFAULT_COLOR_SCHEME = {
  bgColor: 'bg-gray-900',
  hoverBgColor: 'bg-gray-800',
  focusRingColor: 'ring-gray-900',
  paddingTop: 'py-2',
  fontSize: ''
}
  return (
    <div className="flex items-center">
      <div>
        <label className="text-gray-700 font-medium text-sm">{APPLY_PROMOTION}</label>
        <div className="flex flex-col">
          <div className="flex justify-start flex-col sm:my-5 my-0">
            {cartItems.promotionsApplied?.length
              ? cartItems.promotionsApplied.map((promo: any, key: number) => {
                  return (
                    <div className="flex items-center py-2" key={promo.name}>
                      <span className="text-indigo-500">
                        {promo.name} {APPLY_PROMOTION_SUCCESS_MESSAGE}
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
              placeholder={APPLY_PROMOTION}
              onChange={handleChange}
              value={value}
              className="mb-2 mt-2 appearance-none min-w-0 w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 "
            />

            <Button
              action={async () => await handleSubmit('apply')}
              type="button"
              title={GENERAL_APPLY_TEXT}
              colorScheme = {DEFAULT_COLOR_SCHEME}
              className={`max-w-xs flex-1 ml-5 bg-black border border-transparent rounded-md px-4 flex items-center justify-center font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-gray-800 sm:w-full`}
            />
          </div>
        </div>
        {error ? (
          <div className="text-red-400 text-xs capitalize mb-2">
            {PROMO_ERROR}
          </div>
        ) : null}
      </div>
      <div></div>
    </div>
  )
}
