// Base Imports
import { useEffect, useState } from 'react'
import { CheckCircleIcon } from '@heroicons/react/24/solid'

// Component Imports
import PaymentButton from './PaymentButton'

// Other Imports
import { GENERAL_CONFIRM } from '@components/utils/textVariables'
import { IDispatchState } from './PaymentButton/BasePaymentButton'
import { CreditCardIcon } from '@heroicons/react/24/outline'

interface IPaymentMethodsProps {
  readonly paymentData: Function
  readonly basketOrderInfo?: any
  readonly selectedPaymentMethod: any
}

export default function PaymentMethods({
  paymentData,
  basketOrderInfo,
  selectedPaymentMethod,
  uiContext,
  dispatchState,
}: IPaymentMethodsProps & IDispatchState) {
  const [methods, setPaymentMethods] = useState([])
  const [activePaymentMethod, setActivePaymentMethod] = useState<any>({
    id: null,
  })
  useEffect(() => {
    paymentData()
      .then((response: any) => {
        if (response.data) setPaymentMethods(response.data)
      })
      .catch((err: any) => console.log(err))

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <ul className={`text-gray-900 mt-4`}>
      {methods?.map((item: any, idx: number) => {
        return (
          <li key={idx} onClick={() => setActivePaymentMethod(item)} className={`${activePaymentMethod.id === item.id ? 'border-sky-800 bg-sky-100 border-b-2' : 'border-b bg-white border-gray-300 hover:bg-sky-50' }  pointer mt-0 py-5 px-5 flex justify-start flex-row cursor-pointer`} >
            <div className="flex flex-row items-center justify-center">
              {activePaymentMethod.id === item.id ? (
                <div>
                  <CheckCircleIcon className="h-5 pr-4 text-black" aria-hidden="true" />
                </div>
              ) : null}
              {activePaymentMethod.id !== item.id ? (
                <div>
                  <CheckCircleIcon className="h-5 pr-4 text-left text-gray-200 align-left" aria-hidden="true" />
                </div>
              ) : null}
            </div>
            <div className='flex items-center justify-between w-full'>
              <h4 className="mt-0 font-bold uppercase">{item.displayName}</h4>
              {/* =================Only for Demo Purpose will optimized after demo=================== */}
              {item.displayName == "Checkout" ? <img src='/theme/blue/image/Pay-by-card.png' alt={item.displayName} />
                : (item.displayName == "Paypal" || item.displayName == "Pay by Paypal") ? <img src='/theme/blue/image/paypal.png' alt={item.displayName} />
                : item.displayName == "Clearpay" ? <img src='/theme/blue/image/clearpay.png' alt={item.displayName} />
                : item.displayName == "COD" ? <img src='/theme/blue/image/cod.png' alt={item.displayName} />
                : item.displayName == "Klarna" ? <img src='/theme/blue/image/klarna.png' alt={item.displayName} />
                : item.displayName == "Stripe" ? <img src='/theme/blue/image/stripe.png' alt={item.displayName} /> 
                : ''
              }
            </div>
          </li>
        )
      })}
      {activePaymentMethod.id &&
        selectedPaymentMethod?.id !== activePaymentMethod.id ? (
        <div className="flex justify-start w-full py-5">
          <PaymentButton btnTitle={GENERAL_CONFIRM} paymentMethod={activePaymentMethod} basketOrderInfo={basketOrderInfo} uiContext={uiContext} dispatchState={dispatchState} />
        </div>
      ) : null}
    </ul>
  )
}
