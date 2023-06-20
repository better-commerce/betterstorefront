// Base Imports
import React, { useEffect, useState } from 'react'

// Package Imports
import os from 'os'
import axios from 'axios'
import Link from 'next/link'
import Image from 'next/image'
import { GetServerSideProps } from 'next'

// Component Imports
import { LoadingDots } from '@components/ui'
import { useUI } from '@components/ui/context'

// Other Imports
import { removeItem } from '@components/utils/localStorage'
import { NEXT_GET_ORDER } from '@components/utils/constants'
import { LocalStorage } from '@components/utils/payment-constants'
import { obfuscateHostName } from '@framework/utils/app-util'
import {
  BTN_BACK_TO_HOME,
  GENERAL_ADDRESSES,
  GENERAL_BILLING_ADDRESS,
  GENERAL_DELIVERY_ADDRESS,
  GENERAL_ITEMS,
  GENERAL_ORDER_FAILED,
  GENERAL_ORDER_NOT_PROCESSED,
  GENERAL_PRICE,
  GENERAL_QUANTITY,
  GENERAL_SHIPPING_ADDRESS,
  GENERAL_YOUR_ORDER,
  IMG_PLACEHOLDER,
  LOADING_YOUR_ORDERS,
  YOUR_INFORMATION,
} from '@components/utils/textVariables'
import { generateUri } from '@commerce/utils/uri-util'
import {
  ELEM_ATTR,
  ORDER_CONFIRMATION_AFTER_PROGRESS_BAR_ELEM_SELECTORS,
} from '@framework/content/use-content-snippet'

const PaymentFailedPage = ({
  /*orderId: guidOrderId,*/ config,
  hostName,
}: any) => {
  const [order, setOrderData] = useState<any>()
  const [isLoading, setIsLoading] = useState(true)
  const { orderId, setOrderId, user } = useUI()

  useEffect(() => {
    const fetchOrder = async () => {
      const { data }: any = await axios.post(NEXT_GET_ORDER, {
        id: orderId,
      })
      setOrderData(data.order)
      setIsLoading(false)
    }
    removeItem(LocalStorage.Key.ORDER_RESPONSE)
    removeItem(LocalStorage.Key.ORDER_PAYMENT)
    if (orderId) fetchOrder()
    if (!orderId) setIsLoading(false)
    return function cleanup() {
      setOrderId('')
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (isLoading) {
    return (
      <main className="px-4 pt-16 pb-24 bg-white sm:px-6 sm:pt-24 lg:px-8 lg:py-32">
        <h1 className="w-full text-5xl font-extrabold text-center text-gray-600 uppercase tracking-light">
          {LOADING_YOUR_ORDERS}
        </h1>
        <div className="flex items-center justify-center w-full mt-10 text-gray-900">
          <LoadingDots />
        </div>
      </main>
    )
  }
  const css = { maxWidth: '100%', height: 'auto' }

  return (
    <>
      <main className="px-4 pt-6 pb-24 bg-gray-50 sm:px-6 sm:pt-6 lg:px-8 lg:py-2">
        <div className="max-w-3xl p-4 mx-auto bg-white rounded-md shadow-lg">
          <div className="max-w-xl">
            <h2 className="text-sm font-semibold tracking-wide text-indigo-600 uppercase">
              {order?.orderNo ? GENERAL_ORDER_FAILED : null}
            </h2>
            {order?.orderNo ? (
              <p className="mt-2 text-black">
                {GENERAL_YOUR_ORDER}{' '}
                <span className="font-bold text-black">{order?.orderNo}</span>{' '}
                {GENERAL_ORDER_NOT_PROCESSED}
              </p>
            ) : null}
          </div>

          {order?.orderNo ? (
            <section
              aria-labelledby="order-heading"
              className="mt-10 border-t border-gray-200"
            >
              <h2 id="order-heading" className="sr-only">
                {GENERAL_YOUR_ORDER}
              </h2>

              <h3 className="sr-only">{GENERAL_ITEMS}</h3>
              {order?.items?.map((product: any) => (
                <div
                  key={product?.id}
                  className="flex py-10 space-x-6 border-b border-gray-200"
                >
                  <div className="flex-shrink-0 w-24 h-24 overflow-hidden border border-gray-200 rounded-md">
                    <Image
                      style={css}
                      src={
                        generateUri(product?.image, 'h=200&fm=webp') ||
                        IMG_PLACEHOLDER
                      }
                      width={200}
                      height={200}
                      alt={product?.name}
                      className="flex-none object-cover object-center w-20 h-20 bg-gray-100 rounded-lg sm:w-40 sm:h-40"
                    ></Image>
                  </div>
                  <div className="flex flex-col flex-auto">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        <Link href={`/${product?.slug}`}>{product?.name}</Link>
                      </h4>

                      <div
                        dangerouslySetInnerHTML={{
                          __html: product?.shortDescription,
                        }}
                        className="mt-2 text-sm text-gray-500 topspace"
                      />
                    </div>
                    <div className="flex items-end flex-1 mt-6">
                      <dl className="flex space-x-4 text-sm divide-x divide-gray-200 sm:space-x-6">
                        <div className="flex">
                          <dt className="font-medium text-gray-900">
                            {GENERAL_QUANTITY}
                          </dt>
                          <dd className="ml-2 text-gray-700">{product?.qty}</dd>
                        </div>
                        <div className="flex pl-4 sm:pl-6">
                          <dt className="font-medium text-gray-900">
                            {GENERAL_PRICE}
                          </dt>
                          <dd className="ml-2 text-gray-700">
                            {product?.price.formatted.withTax}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </div>
              ))}

              <div className="lg:pl-5 sm:pl-2">
                <h3 className="sr-only">{YOUR_INFORMATION}</h3>

                <h4 className="sr-only">{GENERAL_ADDRESSES}</h4>
                <dl className="grid grid-cols-2 py-10 text-sm gap-x-6">
                  <div>
                    <dt className="font-medium text-gray-900">
                      {/* {GENERAL_SHIPPING_ADDRESS} */}
                      {GENERAL_DELIVERY_ADDRESS}
                    </dt>
                    <dd className="mt-2 text-gray-700">
                      <address className="not-italic">
                        <span className="block">{`${order?.shippingAddress?.firstName} ${order?.shippingAddress?.lastName}`}</span>
                        <span className="block">{`${order?.shippingAddress?.phoneNo}`}</span>
                        <span className="block">{`${order?.shippingAddress?.address1}`}</span>
                        <span className="block">{`${order?.shippingAddress?.address2}`}</span>
                        <span className="block">{`${order?.shippingAddress?.city} ${order?.shippingAddress?.countryCode} ${order?.shippingAddress?.postCode}`}</span>
                      </address>
                    </dd>
                  </div>
                  {/* <div>
                                        <dt className="font-medium text-gray-900">
                                            {GENERAL_BILLING_ADDRESS}
                                        </dt>
                                        <dd className="mt-2 text-gray-700">
                                            <address className="not-italic">
                                                <span className="block">{`${order?.billingAddress?.firstName} ${order?.billingAddress?.lastName}`}</span>
                                                <span className="block">{`${order?.shippingAddress?.phoneNo}`}</span>
                                                <span className="block">{`${order?.billingAddress?.address1}`}</span>
                                                <span className="block">{`${order?.billingAddress?.address2}`}</span>
                                                <span className="block">{`${order?.billingAddress?.city} ${order?.billingAddress?.countryCode} ${order?.billingAddress?.postCode}`}</span>
                                            </address>
                                        </dd>
                                    </div> */}
                </dl>
              </div>
            </section>
          ) : null}
          <div className="max-w-xl">
            <Link href={`/`} passHref>
              <span className="font-medium text-indigo-600 hover:text-indigo-500">
                {BTN_BACK_TO_HOME}
              </span>
            </Link>
          </div>
        </div>
      </main>

      {/* Placeholder for order confirmation after progress bar snippet */}
      <div
        className={`${ELEM_ATTR}${ORDER_CONFIRMATION_AFTER_PROGRESS_BAR_ELEM_SELECTORS[0]}`}
      ></div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const params: any = context?.query
  const hostName = os.hostname()
  return {
    props: {
      hostName: obfuscateHostName(hostName),
      //orderId: params?.order_id,
    }, // will be passed to the page component as props
  }
}
export default PaymentFailedPage
