import { RadioGroup } from '@headlessui/react'
import { CheckCircleIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import CncInput from './CheckoutForm/CncInput'
import CncList from './CheckoutForm/CncList'
import { LoadingDots, useUI } from '@components/ui'
import { postData } from '@components/utils/clientFetcher'
import {
  NEXT_UPDATE_SHIPPING,
  NEXT_SHIPPING_ENDPOINT,
  NEXT_CLICK_AND_COLLECT,
} from '@components/utils/constants'
import geoData from '@components/utils/geographicService'
import { vatIncluded } from '@framework/utils/app-util'
import axios from 'axios'
import {
  ADDRESS_OF_YOUR_CHOICE,
  IN_STORE_OR_COLLECT_PLUS,
} from '@components/utils/textVariables'

function DeliveryOptions({
  products,
  appConfig,
  setParentShipping,
  toggleDelivery,
  geoData,
  count,
}: any) {
  //split delivery options pending, hence using standard shipping options
  const DELIVERY_METHODS_TYPE = [
    {
      id: 1,
      title: 'Deliver',
      content: ADDRESS_OF_YOUR_CHOICE,
      children: [],
      type: 2,
    },
    {
      id: 2,
      type: 1,
      title: 'Collect',
      content: IN_STORE_OR_COLLECT_PLUS,
      children: [],
    },
  ]
  const { basketId, setCartItems, cartItems } = useUI()
  const isIncludeVAT = vatIncluded()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState({
    name: 'Country',
    twoLetterIsoCode: geoData.CountryCode,
  })
  const [deliveryMethods, setDeliveryMethods] = useState(DELIVERY_METHODS_TYPE)
  const [shippingMethod, setShippingMethod] = useState({
    id: false,
    displayName: '',
    description: '',
    shippingCode: '',
    price: { formatted: { withTax: '' } },
  })
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState({
    id: 0,
    children: [],
    type: 0,
  })
  const [isSelected, setIsSelected] = useState(true)
  const [availableLocations, setAvailableLocations] = useState([])
  const [selectedStore, setSelectedStore] = useState({
    storeId: '',
    name: '',
    availableToCollectIn: '',
  })

  const handleShippingMethod = (item: any) => {
    setShippingMethod(item)
  }

  const isCncMethod = shippingMethod.shippingCode === 'CNC'

  const submitShippingMethod = (storeId?: string) => {
    //add submit button onclick when delivery options available
    return axios
      .post(NEXT_UPDATE_SHIPPING, {
        basketId,
        countryCode: selectedCountry.twoLetterIsoCode,
        shippingId: shippingMethod.id,
      })
      .then((response: any) => {
        setCartItems({ ...cartItems, ...response.data })
        toggleDelivery(selectedCountry)
        setParentShipping(shippingMethod, isCncMethod, storeId)
      })
      .catch((err) => console.log(err))
  }

  const fetchDeliveryMethods = async () => {
    setIsLoading(true)
    const response = await postData(NEXT_SHIPPING_ENDPOINT, {
      basketId,
      countryCode: selectedCountry.twoLetterIsoCode,
    })
    if (response.length) {
      setIsLoading(false)
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

  useEffect(() => {
    const getDefaultCountry = async () => {
      const { CountryCode } = geoData
      const defaultSelectedCountry: any = appConfig.shippingCountries?.find(
        (item: any) => item.twoLetterIsoCode === CountryCode
      )

      if (defaultSelectedCountry) setSelectedCountry(defaultSelectedCountry)
      else {
        const defaultCountry = appConfig.shippingCountries[0] || {
          name: 'United Kingdom',
          twoLetterIsoCode: 'GB',
        }
        setSelectedCountry(defaultCountry)
      }
    }
    if (Object.keys(appConfig).length) getDefaultCountry()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appConfig])

  useEffect(() => {
    setDeliveryMethods(DELIVERY_METHODS_TYPE)
    setSelectedDeliveryMethod({ id: 0, children: [], type: 0 })

    fetchDeliveryMethods()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCountry])

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    const country: any = appConfig.shippingCountries.find(
      (el: any) => el.name === value
    )
    setSelectedCountry(country)
  }

  const handleDeliveryMethodChange = (value: any) => {
    setSelectedDeliveryMethod(value)
    setAvailableLocations([])
    setSelectedStore({ storeId: '', name: '', availableToCollectIn: '' })
    setShippingMethod({
      id: false,
      displayName: '',
      description: '',
      shippingCode: '',
      price: { formatted: { withTax: '' } },
    })
  }

  const handleCncPostCode = async (postCode: string) => {
    const items = cartItems.lineItems.map((item: any) => {
      return { stockCode: item.stockCode, qty: item.qty }
    })
    const response: { data: [] } = await axios.post(NEXT_CLICK_AND_COLLECT, {
      items,
      postCode,
    })
    setAvailableLocations(response.data)
  }

  const content: any = {
    firstLine: selectedCountry.name,
    secondLine: shippingMethod.displayName,
    thirdLine: shippingMethod.description,
    fourthLine: shippingMethod.price?.formatted?.withTax,
  }

  if (selectedStore.storeId && isCncMethod) {
    content['thirdLine'] = selectedStore.name
    content.fifthLine = selectedStore.availableToCollectIn
  }

  return (
    <div className="flex items-center justify-center w-full h-full">
      {isLoading ? (
        <LoadingDots />
      ) : (
        <RadioGroup
          value={selectedDeliveryMethod}
          onChange={() => {}} //{handleDeliveryMethodChange}
        >
          {/* <RadioGroup.Label className="text-lg font-semibold text-gray-900">
              {`Delivery ${count+1}`}
            </RadioGroup.Label> */}

          <div className="grid grid-cols-1 mt-4 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
            {deliveryMethods.map(
              (deliveryMethod: any, deliveryIdx: any) =>
                !!deliveryMethod.children.length && (
                  <RadioGroup.Option
                    key={deliveryIdx}
                    value={deliveryMethod}
                    className={({ checked, active }) =>
                      classNames(
                        checked ? 'border-transparent' : 'border-gray-300',
                        active ? 'ring-2 ring-black' : '',
                        'relative bg-white border shadow-sm p-4 flex cursor-pointer focus:outline-none'
                      )
                    }
                  >
                    {({ checked, active }) => (
                      <>
                        <div className="flex flex-1">
                          <div className="flex flex-col">
                            <RadioGroup.Label
                              as="span"
                              className="block font-bold text-gray-900 uppercase text-md"
                            >
                              {deliveryMethod.title}
                            </RadioGroup.Label>
                            <RadioGroup.Description
                              as="span"
                              className="flex items-center mt-1 text-sm text-gray-500"
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
                            className="w-5 h-5 text-black"
                            aria-hidden="true"
                          />
                        ) : null}
                        <div
                          className={classNames(
                            active ? 'border' : 'border-2',
                            checked ? 'border-black' : 'border-transparent',
                            'absolute -inset-px pointer-events-none'
                          )}
                          aria-hidden="true"
                        />
                      </>
                    )}
                  </RadioGroup.Option>
                )
            )}
          </div>
          <ul className={`text-gray-900 mt-4`}>
            {selectedDeliveryMethod.children.map((item: any, idx: number) => {
              return (
                <div key={idx} className="flex flex-col">
                  <li
                    onClick={() => handleShippingMethod(item)}
                    className={`${
                      shippingMethod.id === item.id ? 'border-black' : ''
                    }  pointer border-2 py-5 px-5 flex justify-between flex-row`}
                  >
                    <div>
                      <h4 className="font-bold text-gray-900 uppercase">
                        {'Standard Shipping'} {/* {item.displayName} */}
                      </h4>
                      <p className="py-2 text-sm">
                        {products[0]?.shippingSpeed}
                      </p>
                    </div>
                    <div className="flex flex-row items-center justify-center">
                      <h3 className="text-lg font-bold text-gray-900 uppercase">
                        {item.price.formatted.withTax}
                      </h3>
                      {shippingMethod.id === item.id ? (
                        <div className="ml-5">
                          <CheckCircleIcon
                            className="w-5 h-5 text-black"
                            aria-hidden="true"
                          />
                        </div>
                      ) : null}
                    </div>
                  </li>
                  {isCncMethod && <CncInput handleSubmit={handleCncPostCode} />}
                  {isCncMethod && (
                    <CncList
                      setSelectedStore={setSelectedStore}
                      submitShippingMethod={submitShippingMethod}
                      availableLocations={availableLocations}
                    />
                  )}
                </div>
              )
            })}
          </ul>
        </RadioGroup>
      )}
    </div>
  )
}

export default DeliveryOptions
