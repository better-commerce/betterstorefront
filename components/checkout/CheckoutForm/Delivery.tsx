import classNames from '@components/utils/classNames'
import React, { useState, useEffect, SyntheticEvent } from 'react'
import { RadioGroup } from '@headlessui/react'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import CncInput from './CncInput'
import { postData } from '@components/utils/clientFetcher'
import {
  NEXT_SHIPPING_ENDPOINT,
  NEXT_UPDATE_SHIPPING,
  NEXT_CLICK_AND_COLLECT,
} from '@components/utils/constants'
import { useUI } from '@components/ui/context'
import Button from '@components/ui/IndigoButton'
import ConfirmedGeneralComponent from './ConfirmedGeneralComponent'
import axios from 'axios'
import CncList from './CncList'
import {
  ADDRESS_OF_YOUR_CHOICE,
  IN_STORE_OR_COLLECT_PLUS,
  GENERAL_SELECT_COUNTRY,
  GENERAL_EDIT,
  GENERAL_CONFIRM,
  GENERAL_DELIVERY_METHOD,
  IMG_PLACEHOLDER,
  GENERAL_PRICE_LABEL_RRP,
  GENERAL_COMBINED_DELIVERY,
} from '@components/utils/textVariables'
import Link from 'next/link'
import Image from 'next/image'
import { tryParseJson } from '@framework/utils/parse-util'
import EyeIcon from '@heroicons/react/24/solid'
import { PlusIcon } from '@heroicons/react/24/outline'
import { vatIncluded } from '@framework/utils/app-util'
import SplitDelivery from '../SplitDelivery'
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

export default function Delivery({
  toggleDelivery,
  isDeliveryMethodSelected,
  setParentShipping,
  appConfig,
  geoData,
  splitDeliveryItems,
  onShippingPlansUpdated,
}: any) {
  const { basketId, setCartItems, cartItems, isPaymentLink, isSplitDelivery } = useUI()
  const isIncludeVAT = vatIncluded()
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
    if (isSplitDelivery) {
      onShippingPlansUpdated()
    }

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

  useEffect(() => {
    if (isPaymentLink) {
      submitShippingMethod()
    }
  }, [])

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
    <div className="py-6 mt-0 border border-gray-200 bg-white shadow p-6">
      {isDeliveryMethodSelected ? (
        <>
          <h4 className="font-bold uppercase text-black">
            {isSplitDelivery
              ? GENERAL_COMBINED_DELIVERY
              : GENERAL_DELIVERY_METHOD}
          </h4>
          <ConfirmedGeneralComponent
            onStateChange={toggleDelivery}
            content={content}
            isPaymentLink={isPaymentLink}
          />
        </>
      ) : (
        <>
          <div className="py-5">
            <h1 className="text-lg font-semibold text-gray-900">
              {GENERAL_SELECT_COUNTRY}
            </h1>

            {isSelected ? (
              <>
                {!isPaymentLink && (
                  <div className="py-5 flex justify-between items-center">
                    <span className="font-normal d-inline font-sm pr-1 text-gray-900">
                      {selectedCountry.name}
                    </span>
                    <div className="flex">
                      <button
                        onClick={() => setIsSelected(false)}
                        className="btn text-pink font-xs"
                        type="button"
                      >
                        {GENERAL_EDIT}
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <select
                  onChange={handleChange}
                  className="mb-2 mt-2 appearance-none min-w-0 w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 "
                >
                  {appConfig.shippingCountries?.map(
                    (country: any, idx: number) => {
                      return (
                        <option
                          key={idx}
                          selected={country.name === selectedCountry.name}
                          value={country.name}
                        >
                          {country.name}
                        </option>
                      )
                    }
                  )}
                </select>
                <div className="py-2 h-12 flex justify-left w-full">
                  <Button
                    buttonType="button"
                    action={async () => setIsSelected(true)}
                    title={GENERAL_CONFIRM}
                  />
                </div>
              </>
            )}
          </div>
          {isSplitDelivery && (
            <SplitDelivery
              splitDeliveryItems={splitDeliveryItems}
              appConfig={appConfig}
              setParentShipping={setParentShipping}
              toggleDelivery={toggleDelivery}
              geoData={geoData}
              showDeliveryOptions={true}
            />
          )}
          <RadioGroup
            value={selectedDeliveryMethod}
            onChange={handleDeliveryMethodChange}
          >
            <RadioGroup.Label className="text-lg font-semibold text-gray-900">
              {isSplitDelivery
                ? GENERAL_COMBINED_DELIVERY
                : GENERAL_DELIVERY_METHOD}
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
                          active ? 'ring-2 ring-black' : '',
                          'relative bg-white border shadow-sm p-4 flex cursor-pointer focus:outline-none'
                        )
                      }
                    >
                      {({ checked, active }) => (
                        <>
                          <div className="flex-1 flex">
                            <div className="flex flex-col">
                              <RadioGroup.Label
                                as="span"
                                className="block text-md uppercase font-bold text-gray-900"
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
                              className="h-5 w-5 text-black"
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
            <ul className={`text-gray-900 mt-10`}>
              {selectedDeliveryMethod.children.map((item: any, idx: number) => {
                return (
                  <div key={idx} className="flex flex-col">
                    <li
                      onClick={() => handleShippingMethod(item)}
                      className={`${shippingMethod.id === item.id ? 'border-black' : ''
                        }  pointer border-2 py-5 px-5 flex justify-between flex-row`}
                    >
                      <div>
                        <h4 className="uppercase font-bold text-gray-900">
                          {item.displayName}
                        </h4>
                        <p className="text-sm py-2">{item.description}</p>
                      </div>
                      <div className="flex flex-row justify-center items-center">
                        <h3 className="text-lg uppercase font-bold text-gray-900">
                          {item.price.formatted.withTax}
                        </h3>
                        {shippingMethod.id === item.id ? (
                          <div className="ml-5">
                            <CheckCircleIcon
                              className="h-5 w-5 text-black"
                              aria-hidden="true"
                            />
                          </div>
                        ) : null}
                      </div>
                    </li>
                    {isCncMethod && (
                      <CncInput handleSubmit={handleCncPostCode} />
                    )}
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
          {selectedDeliveryMethod.id ? (
            <div className="py-5 flex justify-center w-40">
              <Button
                buttonType="button"
                action={submitShippingMethod}
                title={GENERAL_CONFIRM}
              />
            </div>
          ) : null}
        </>
      )}
    </div>
  )
}
