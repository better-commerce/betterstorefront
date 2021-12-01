import classNames from '@components/utils/classNames'
import React, { useState, useEffect, SyntheticEvent } from 'react'
import { RadioGroup } from '@headlessui/react'
import { CheckCircleIcon } from '@heroicons/react/solid'
import countryList from '@components/utils/countryList'
import { postData } from '@components/utils/clientFetcher'
import { NEXT_SHIPPING_ENDPOINT } from '@components/utils/constants'
import { useUI } from '@components/ui/context'
import Button from '@components/ui/IndigoButton'
import ConfirmedGeneralComponent from './ConfirmedGeneralComponent'

const deliveryMethods = [
  {
    id: 1,
    title: 'Standard',
    turnaround: '4–10 business days',
    price: '$5.00',
  },
  { id: 2, title: 'Express', turnaround: '2–5 business days', price: '$16.00' },
]
export default function Delivery({
  toggleDelivery,
  isDeliveryMethodSelected,
}: any) {
  const [selectedCountry, setSelectedCountry] = useState(countryList[1])
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState(
    deliveryMethods[0]
  )

  const { basketId } = useUI()
  useEffect(() => {
    const fetchDeliveryMethods = async () => {
      const response = await postData(NEXT_SHIPPING_ENDPOINT, {
        basketId,
        shipToCountryIso: selectedCountry.code,
        postCode: 'w44hh',
      })
    }
    fetchDeliveryMethods()
  }, [selectedCountry])

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    const country: any = countryList.find((el) => el.value === value)
    setSelectedCountry(country)
  }

  return (
    <div className="py-10 mt-10 border-t border-gray-200">
      {isDeliveryMethodSelected ? (
        <>
          <h3 className="text-lg font-medium text-gray-900">Delivery method</h3>
          <ConfirmedGeneralComponent onStateChange={toggleDelivery} />
        </>
      ) : (
        <>
          <div className="py-5">
            <h1 className="text-lg font-medium text-gray-900">
              Select country
            </h1>
            <select
              onChange={handleChange}
              className="mb-2 mt-2 appearance-none min-w-0 w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 "
            >
              {countryList.map((country: any, idx: number) => {
                return (
                  <option
                    key={idx}
                    selected={country.value === selectedCountry.value}
                    value={country.value}
                  >
                    {country.value}
                  </option>
                )
              })}
            </select>
          </div>
          <RadioGroup
            value={selectedDeliveryMethod}
            onChange={setSelectedDeliveryMethod}
          >
            <RadioGroup.Label className="text-lg font-medium text-gray-900">
              Delivery method
            </RadioGroup.Label>

            <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
              {deliveryMethods.map((deliveryMethod: any, deliveryIdx) => (
                <RadioGroup.Option
                  key={deliveryIdx}
                  value={deliveryMethod}
                  className={({ checked, active }) =>
                    classNames(
                      checked ? 'border-transparent' : 'border-gray-300',
                      active ? 'ring-2 ring-indigo-500' : '',
                      'relative bg-white border rounded-lg shadow-sm p-4 flex cursor-pointer focus:outline-none'
                    )
                  }
                >
                  {({ checked, active }) => (
                    <>
                      <div className="flex-1 flex">
                        <div className="flex flex-col">
                          <RadioGroup.Label
                            as="span"
                            className="block text-sm font-medium text-gray-900"
                          >
                            {deliveryMethod.title}
                          </RadioGroup.Label>
                          <RadioGroup.Description
                            as="span"
                            className="mt-1 flex items-center text-sm text-gray-500"
                          >
                            {deliveryMethod.turnaround}
                          </RadioGroup.Description>
                          <RadioGroup.Description
                            as="span"
                            className="mt-6 text-sm font-medium text-gray-900"
                          >
                            {deliveryMethod.price}
                          </RadioGroup.Description>
                        </div>
                      </div>
                      {checked ? (
                        <CheckCircleIcon
                          className="h-5 w-5 text-indigo-600"
                          aria-hidden="true"
                        />
                      ) : null}
                      <div
                        className={classNames(
                          active ? 'border' : 'border-2',
                          checked ? 'border-indigo-500' : 'border-transparent',
                          'absolute -inset-px rounded-lg pointer-events-none'
                        )}
                        aria-hidden="true"
                      />
                    </>
                  )}
                </RadioGroup.Option>
              ))}
            </div>
          </RadioGroup>
          <div className="py-5 flex justify-center w-full">
            <Button
              buttonType="button"
              action={toggleDelivery}
              title="Confirm"
            />
          </div>
        </>
      )}
    </div>
  )
}
