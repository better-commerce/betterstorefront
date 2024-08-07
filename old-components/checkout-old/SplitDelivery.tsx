import { IMG_PLACEHOLDER } from '@components/utils/textVariables'
import { tryParseJson } from '@framework/utils/parse-util'
import { PlusIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { vatIncluded } from '@framework/utils/app-util'
// import { RadioGroup } from '@headlessui/react'
// import classNames from 'classnames'
// import CncInput from './CheckoutForm/CncInput'
// import CncList from './CheckoutForm/CncList'
// import Delivery from './CheckoutForm/Delivery'
import DeliveryOptions from './DeliveryOptions'
import { generateUri } from '@commerce/utils/uri-util'
import { useTranslation } from '@commerce/utils/use-translation'

function SplitDelivery({
  splitDeliveryItems = null,
  selectedDeliveryMethod,
  handleDeliveryMethodChange,
  deliveryMethods,
  handleShippingMethod,
  shippingMethod,
  isCncMethod,
  handleCncPostCode,
  availableLocations,
  submitShippingMethod,
  setSelectedStore,
  appConfig = null,
  setParentShipping = () => {},
  toggleDelivery = null,
  geoData = null,
  showDeliveryOptions = false,
}: any) {
  const translate = useTranslation()
  const [splitDeliveryDates, setSplitDeliveryDates] = useState<any>(null)
  const isIncludeVAT = vatIncluded()

  const sortDates = (dateArray: any) => {
    const convertedDates = dateArray.map((dateString: any) => {
      const [day, month, year] = dateString.split('/')
      return new Date(`${month}/${day}/${year}`)
    })

    convertedDates.sort((a: any, b: any) => a - b)

    const sortedDates = convertedDates.map((date: any) => {
      const formattedDate = date.toLocaleDateString('en-GB')
      return formattedDate
    })

    return sortedDates
  }

  const deliveryDatesExtract = () => {

    if (splitDeliveryItems) {
      let sortedDeliveryDates = sortDates(Object.keys(splitDeliveryItems))
      setSplitDeliveryDates(sortedDeliveryDates)
    }
  }

  useEffect(() => {
    deliveryDatesExtract()
  }, [splitDeliveryItems])

  const getLineItemSizeWithoutSlug = (product: any) => {
    const productData: any = tryParseJson(product?.attributesJson || {})
    return productData?.Size
  }
  return (
    <section>
      <h1 className="text-md">{translate('label.checkout.splitDeliveryText')}</h1>
      {splitDeliveryItems && (
        <div className="mt-4 flex flex-col  \grid \grid-cols-1 gap-y-8 \sm:grid-cols-2 sm:gap-x-4 ">
          {splitDeliveryDates?.map((deliveryDate: any, Idx: any) => (
            <div
              key={Idx}
              className="flex w-full  border-gray-30 gap-x-5 flex-row"
            >
              <div className="\h-full w-full">
                <h2 className="text-sm font-bold">{translate('label.checkout.deliveryText')}{' '}{Idx + 1}</h2>
                <ul role="list" className="divide-y divide-gray-200">
                  {splitDeliveryItems[deliveryDate]?.map(
                    (product: any, Idx: any) => (
                      <>
                        <li
                          key={product.id}
                          className="flex px-4 border-[1px] py-4 sm:px-6"
                        >
                          <div className="flex-shrink-0">
                            <Link
                              href={`/${product.slug}`}
                              className="inline-block font-medium text-gray-700 hover:text-gray-800 hover:underline"
                            >
                              <img
                                width={40}
                                height={60}
                                src={generateUri(`${product.image}`,'h=60&fm=webp') || IMG_PLACEHOLDER}
                                alt={product.name || 'product-image'}
                                className="object-cover w-full h-full"
                              />
                            </Link>
                          </div>

                          <div className="flex flex-col flex-1 ml-6">
                            <div className="flex">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between text-sm">
                                  <Link
                                    href={`/${product.slug}`}
                                    className="inline-block font-bold text-gray-700 uppercase hover:text-gray-800 hover:underline"
                                  >
                                    <p>{product?.name}</p>
                                  </Link>
                                  <p className="inline-block text-sm font-bold text-gray-700 uppercase">
                                    {isIncludeVAT
                                      ? product.price?.formatted?.withTax
                                      : product.price?.formatted?.withoutTax}
                                    {product.listPrice?.raw.withTax > 0 &&
                                    product.listPrice?.raw.withTax !=
                                      product.price?.raw?.withTax ? (
                                      <span className="px-2 text-sm text-red-400 line-through">
                                        {isIncludeVAT
                                          ? product.listPrice?.formatted
                                              ?.withTax
                                          : product.listPrice?.formatted
                                              ?.withoutTax}
                                      </span>
                                    ) : null}
                                  </p>
                                </div>
                                <p className="font-normal text-gray-700 text-ms">
                                  Size:{' '}
                                  <span className="uppercase">
                                    {getLineItemSizeWithoutSlug(product)}
                                  </span>
                                </p>
                                <div>{}</div>
                                {product?.children?.map(
                                  (child: any, childId: number) => {
                                    const customInfo1: any = tryParseJson(
                                      child.customInfo1
                                    )
                                    const customInfo1FormattedData =
                                      customInfo1?.formatted?.data || null
                                    const personalizationFont = `font-${customInfo1FormattedData?.Font}`

                                    return (
                                      <>
                                        <div
                                          className="flex justify-between mt-1"
                                          key={childId}
                                        >
                                          <div>
                                            <p className="text-sm text-gray-900">
                                              {child.name}
                                            </p>
                                          </div>
                                          <label className="text-sm text-gray-900">
                                            <PlusIcon
                                              className="inline-block -mt-1"
                                              style={{
                                                width: '0.85rem',
                                                height: '0.85rem',
                                              }}
                                            />
                                            {isIncludeVAT
                                              ? child?.price?.formatted?.withTax
                                              : child?.price?.formatted
                                                  ?.withoutTax}
                                          </label>
                                        </div>
                                        {customInfo1FormattedData && (
                                          <div className="text-gray-700 text-ms">
                                            <span
                                              title={translate('label.product.messageText')}
                                              className={personalizationFont}
                                            >
                                              {
                                                customInfo1FormattedData?.Message
                                              }
                                            </span>
                                            {' | '}
                                            {/* <span
                                      className="align-middle cursor-pointer"
                                      onClick={() =>
                                        handleToggleEngravingModal(product)
                                      }
                                      title="View Personalisation"
                                    >
                                      <EyeIcon className="inline-block w-4 h-4 -mt-3 text-gray-900 hover:text-gray-400" />
                                    </span> */}
                                          </div>
                                        )}
                                      </>
                                    )
                                  }
                                )}
                              </div>
                            </div>
                          </div>
                        </li>
                      </>
                    )
                  )}
                </ul>
              </div>
              {showDeliveryOptions ? (
                  <div className="flex \h-full w-full pt-4 items-end"> 
                  <DeliveryOptions
                    products={splitDeliveryItems[deliveryDate]}
                    appConfig={appConfig}
                    setParentShipping={setParentShipping}
                    toggleDelivery={toggleDelivery}
                    geoData={geoData}
                    count={Idx}
                  />
                </div>
              ):(
                <>
                <div className="flex \h-full w-64 justify-end pt-3 items-center">
                    {splitDeliveryItems[deliveryDate][0]?.shippingSpeed}
                </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default SplitDelivery
