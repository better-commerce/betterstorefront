import classNames from '@components/utils/classNames'
import React, { useState, useEffect, SyntheticEvent } from 'react'
import { RadioGroup } from '@headlessui/react'
import { CheckCircleIcon } from '@heroicons/react/solid'
import countryList from '@components/utils/countryList'
import { postData } from '@components/utils/clientFetcher'
import {
  NEXT_SHIPPING_ENDPOINT,
  NEXT_UPDATE_SHIPPING,
} from '@components/utils/constants'
import { useUI } from '@components/ui/context'
import Button from '@components/ui/IndigoButton'
import ConfirmedGeneralComponent from './ConfirmedGeneralComponent'
import geoData from '@components/utils/geographicService'
import axios from 'axios'

const DELIVERY_METHODS_TYPE = [
  {
    id: 1,
    title: 'Deliver',
    content: 'to an address of your choice',
    children: [],
    type: 2,
  },
  {
    id: 2,
    type: 3,
    title: 'Collect',
    content: 'in store or using Collect+',
    children: [],
  },
]

export default function Delivery({
  toggleDelivery,
  isDeliveryMethodSelected,
  setParentShipping,
  appConfig,
  location,
}: any) {
  const { basketId, setCartItems, cartItems } = useUI()

  const [selectedCountry, setSelectedCountry] = useState({
    name: 'Country',
    twoLetterIsoCode: null,
  })
  const [deliveryMethods, setDeliveryMethods] = useState(DELIVERY_METHODS_TYPE)
  const [shippingMethod, setShippingMethod] = useState({
    id: false,
    displayName: '',
    description: '',
    price: { formatted: { withTax: '' } },
  })
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState({
    id: 0,
    children: [],
  })

  const handleShippingMethod = (item: any) => {
    setShippingMethod(item)
  }

  const submitShippingMethod = () => {
    axios
      .post(NEXT_UPDATE_SHIPPING, {
        basketId,
        countryCode: selectedCountry.twoLetterIsoCode,
        shippingId: shippingMethod.id,
      })
      .then((response: any) => {
        setCartItems({ ...cartItems, ...response.data })
        toggleDelivery(selectedCountry)
        setParentShipping(shippingMethod)
      })
      .catch((err) => console.log(err))
  }

  useEffect(() => {
    const getDefaultCountry = async () => {
      const { CountryCode } = location
      const defaultSelectedCountry: any = appConfig.shippingCountries?.find(
        (item: any) => item.twoLetterIsoCode === CountryCode
      )

      if (defaultSelectedCountry) setSelectedCountry(defaultSelectedCountry)
    }
    if (Object.keys(appConfig).length) getDefaultCountry()
  }, [appConfig])

  useEffect(() => {
    setDeliveryMethods(DELIVERY_METHODS_TYPE)
    setSelectedDeliveryMethod({ id: 0, children: [] })
    const fetchDeliveryMethods = async () => {
      const response = await postData(NEXT_SHIPPING_ENDPOINT, {
        basketId,
        countryCode: selectedCountry.twoLetterIsoCode,
      })
      if (response.length) {
        let tempArr = deliveryMethods.reduce((acc: any, obj: any) => {
          let itemWithChildren = { ...obj }
          response.forEach((item: any) => {
            if (item.type === obj.type) {
              itemWithChildren.children = [item]
            }
          })
          acc.push(itemWithChildren)
          return acc
        }, [])
        setDeliveryMethods(tempArr)
        if (tempArr[0].children[0]) {
          setShippingMethod(tempArr[0].children[0])
        }
        setSelectedDeliveryMethod(tempArr[0])
      }
    }
    fetchDeliveryMethods()
  }, [selectedCountry])

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    const country: any = appConfig.shippingCountries.find(
      (el: any) => el.name === value
    )
    setSelectedCountry(country)
  }

  return (
    <div className="py-10 mt-10 border-t border-gray-200">
      {isDeliveryMethodSelected ? (
        <>
          <h3 className="text-lg font-medium text-gray-900">Delivery method</h3>
          <ConfirmedGeneralComponent
            onStateChange={toggleDelivery}
            content={{
              firstLine: selectedCountry.name,
              secondLine: shippingMethod.displayName,
              thirdLine: shippingMethod.description,
              fourthLine: shippingMethod.price?.formatted?.withTax,
            }}
          />
        </>
      ) : (
        <>
          <div className="py-5">
            <h1 className="text-lg font-semibold text-gray-900">
              Select country
            </h1>
            <select
              onChange={handleChange}
              className="mb-2 mt-2 appearance-none min-w-0 w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 "
            >
              {!Object.keys(appConfig.shippingCountries).length ? (
                <option value={''}>Country List</option>
              ) : null}
              {appConfig.shippingCountries?.map((country: any, idx: number) => {
                return (
                  <option
                    key={idx}
                    selected={country.name === selectedCountry.name}
                    value={country.name}
                  >
                    {country.name}
                  </option>
                )
              })}
            </select>
          </div>
          <RadioGroup
            value={selectedDeliveryMethod}
            onChange={setSelectedDeliveryMethod}
          >
            <RadioGroup.Label className="text-lg font-semibold text-gray-900">
              Delivery method
            </RadioGroup.Label>

            <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
              {deliveryMethods.map(
                (deliveryMethod: any, deliveryIdx) =>
                  !!deliveryMethod.children.length && (
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
                                {deliveryMethod.content}
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
                              checked
                                ? 'border-indigo-500'
                                : 'border-transparent',
                              'absolute -inset-px rounded-lg pointer-events-none'
                            )}
                            aria-hidden="true"
                          />
                        </>
                      )}
                    </RadioGroup.Option>
                  )
              )}
            </div>
            <ul className={`text-gray-900 mt-10`}>
              {selectedDeliveryMethod.children.map((item: any, idx: number) => {
                return (
                  <li
                    key={idx}
                    onClick={() => handleShippingMethod(item)}
                    className={`${
                      shippingMethod.id === item.id ? 'border-indigo-600' : ''
                    }  pointer border-t border py-5 px-5 flex justify-between flex-row`}
                  >
                    <div>
                      <h3 className="font-bold">{item.displayName}</h3>
                      <p className="text-sm py-2">{item.description}</p>
                    </div>
                    <div className="flex flex-row justify-center items-center">
                      <h3>{item.price.formatted.withTax}</h3>
                      {shippingMethod.id === item.id ? (
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
            </ul>
          </RadioGroup>
          {selectedDeliveryMethod.id ? (
            <div className="py-5 flex justify-center w-full">
              <Button
                buttonType="button"
                action={submitShippingMethod}
                title="Confirm"
              />
            </div>
          ) : null}
        </>
      )}
    </div>
  )
}
