import { useEffect, useState } from 'react'
import { CheckCircleIcon } from '@heroicons/react/solid'
import Button from '@components/ui/IndigoButton'

export default function PaymentMethods({
  paymentData,
  handlePaymentMethod,
  selectedPaymentMethod,
}: any) {
  const [methods, setPaymentMethods] = useState([])
  const [activePaymentMethod, setActivePaymentMethod] = useState({ id: null })
  useEffect(() => {
    paymentData()
      .then((response: any) => {
        setPaymentMethods(response.data)
      })
      .catch((err: any) => console.log(err))
  }, [])

  return (
    <ul className={`text-gray-900 mt-10`}>
      {methods.map((item: any, idx: number) => {
        return (
          <li
            key={idx}
            onClick={() => setActivePaymentMethod(item)}
            className={`${
              activePaymentMethod.id === item.id ? 'border-indigo-600' : ''
            }  pointer border-t border py-5 px-5 flex justify-between flex-row`}
          >
            <div>
              <h3 className="font-bold">{item.displayName}</h3>
              <p className="text-sm py-2">{item.description}</p>
            </div>
            <div className="flex flex-row justify-center items-center">
              {activePaymentMethod.id === item.id ? (
                <div className="ml-5">
                  <CheckCircleIcon
                    className="h-5 w-5 text-indigo-600"
                    aria-hidden="true"
                  />
                </div>
              ) : null}
            </div>
          </li>
        )
      })}
      {activePaymentMethod.id &&
      selectedPaymentMethod?.id !== activePaymentMethod.id ? (
        <div className="py-5 flex justify-center w-full">
          <Button
            buttonType="button"
            action={() => handlePaymentMethod(activePaymentMethod)}
            title="Confirm"
          />
        </div>
      ) : null}
    </ul>
  )
}
