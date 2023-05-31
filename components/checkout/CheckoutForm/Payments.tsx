import { useEffect, useState } from 'react'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import Button from '@components/ui/IndigoButton'
import { GENERAL_CONFIRM } from '@components/utils/textVariables'
import getStripe from '@components/utils/get-stripe'
import PaymentButton from './PaymentButton'
import { IDispatchState } from './PaymentButton/BasePaymentButton'

interface IPaymentMethodsProps {
  readonly paymentData: Function;
  readonly paymentOrderInfo: Function;
  readonly basketOrderInfo?: any;
  readonly selectedPaymentMethod: any;
}

export default function PaymentMethods({
  paymentData,
  paymentOrderInfo,
  basketOrderInfo,
  selectedPaymentMethod,
  uiContext,
  dispatchState,
}: IPaymentMethodsProps & IDispatchState) {
  const [methods, setPaymentMethods] = useState([])
  const [activePaymentMethod, setActivePaymentMethod] = useState<any>({ id: null })
  useEffect(() => {
    paymentData()
      .then((response: any) => {
        if (response.data) setPaymentMethods(response.data)
      })
      .catch((err: any) => console.log(err))
  }, [])

  return (
    <ul className={`text-gray-900 mt-4`}>
      {methods?.map((item: any, idx: number) => {
        return (
          <li
            key={idx}
            onClick={() => setActivePaymentMethod(item)}
            className={`${activePaymentMethod.id === item.id ? 'border-black border-t-2 border-2' : 'border-t border border-gray-300'
              }  pointer mb-2 py-5 px-5 flex justify-start flex-row`}
          >
            <div className="flex flex-row justify-center items-center">
              {activePaymentMethod.id === item.id ? (
                <div>
                  <CheckCircleIcon
                    className="h-5 pr-4 text-black"
                    aria-hidden="true"
                  />
                </div>
              ) : null}
              {activePaymentMethod.id !== item.id ? (
                <div>
                  <CheckCircleIcon
                    className="h-5 pr-4 text-left align-left text-gray-200"
                    aria-hidden="true"
                  />
                </div>
              ) : null}
            </div>
            <div>
              <h3 className="font-bold uppercase text-md">{item.displayName}</h3>
              <p className="text-sm py-2 text-gray-400">{item.description}</p>
            </div>
          </li>
        )
      })}
      {activePaymentMethod.id &&
        selectedPaymentMethod?.id !== activePaymentMethod.id ? (
        <div className="py-5 flex justify-center w-full">
          <PaymentButton
            btnTitle={GENERAL_CONFIRM}
            paymentMethod={activePaymentMethod}
            paymentOrderInfo={paymentOrderInfo}
            basketOrderInfo={basketOrderInfo}
            uiContext={uiContext}
            dispatchState={dispatchState}
          />
        </div>
      ) : null}
    </ul>
  )
}
