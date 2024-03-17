import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import {
  IMG_PLACEHOLDER,
} from '@components/utils/textVariables'
import { useTranslation } from '@commerce/utils/use-translation'
import { NEXT_GET_RETURNS } from '@components/utils/constants'
import { useUI } from '@components/ui'
import Link from 'next/link'
import cartHandler from '@components/services/cart'
import { isCartAssociated, vatIncluded } from '@framework/utils/app-util'
import { generateUri } from '@commerce/utils/uri-util'

export default function MyReturns() {
  const { user, basketId, setCartItems, openCart, cartItems } = useUI()
  const translate = useTranslation();
  const [returns, setReturns] = useState([])
  const isIncludeVAT = vatIncluded()
  const fetchReturns = async () => {
    try {
      const { data }: any = await axios.post(NEXT_GET_RETURNS, {
        userId: user.userId,
      })
      setReturns(data.response.result)
    } catch (error) {
      alert(translate('label.myAccount.myOrders.fetchReturnsErrorMsg'))
      console.log(error)
    }
  }
  useEffect(() => {
    fetchReturns()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleAddToCart = (product: any) => {
    const returnEligibility = product?.customAttributes?.find(
      (x: any) => x.key == 'product.returnandexchangeeligibility'
    )?.value
    cartHandler()
      .addToCart(
        {
          basketId,
          productId: product.recordId,
          qty: product.orderQty,
          manualUnitPrice: product.price?.raw?.withTax,
          stockCode: product.stockCode,
          userId: user.userId,
          isAssociated: isCartAssociated(cartItems),
          CustomInfo5: JSON.stringify({
            formatted: {
              title: 'Return Eligibility',
              data: { 'Return Eligibility': returnEligibility || null },
            },
          }),
          CustomInfo5Formatted: returnEligibility || null,
        },
        'ADD',
        {
          product: {
            name: product.name,
            price: {
              raw: {
                withTax: product.price.raw.withTax,
              },
            },
            stockCode: product.stockCode,
            recordId: product.recordId,
          },
        }
      )
      .then((response: any) => {
        setCartItems(response)
        openCart()
      })
      .catch((err: any) => console.log('error', err))
  }

  return (
    <div className="bg-white">
      {/* Mobile menu */}

      <main className="lg:px-8">
        <div className="max-w-4xl lg:mx-12">
          <div className="lg:px-0 sm:px-5 px-5 pt-5">
            <h1 className="font-extrabold text-lg tracking-tight text-gray-900">
              {translate('label.returnReason.returnHistoryText')}
            </h1>
            <p className="mt-2 text-sm font-normal text-black">
              {translate('label.returnReason.returnOrderMsgText')}
            </p>
          </div>

          <section aria-labelledby="recent-heading" className="mt-16">
            <h2 id="recent-heading" className="sr-only">
              {translate('label.orderDetails.recentOrdersText')}
            </h2>

            <div className="space-y-16 sm:space-y-24">
              {returns.map((order: any) => (
                <div key={order.number}>
                  <h3 className="sr-only">
                    {translate('common.label.orderPlacedText')}{' '}
                    <time dateTime={order.returnDate}>
                      {new Date(order.returnDate).toDateString()}
                    </time>
                  </h3>

                  <div className="px-4 py-6 bg-gray-50 sm:rounded-lg sm:p-6 md:flex md:items-center md:justify-between md:space-x-6 lg:space-x-8">
                    <dl className="flex-auto space-y-4 text-sm text-gray-600 divide-y divide-gray-200 md:divide-y-0 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-6 lg:w-full lg:flex-none lg:gap-x-8">
                      <div className="flex justify-between md:block">
                        <dt className="font-medium text-gray-900">
                        {translate('label.returnReason.returnNumText')}
                        </dt>
                        <dd className="md:mt-1">{order.returnNo}</dd>
                      </div>
                      <div className="flex justify-between pt-4 md:block md:pt-0">
                        <dt className="font-medium text-gray-900">
                          {translate('label.common.datePlacedText')}
                        </dt>
                        <dd className="md:mt-1">
                          <time dateTime={order.returnDate}>
                            {new Date(order.returnDate).toDateString()}
                          </time>
                        </dd>
                      </div>
                      <div className="flex justify-between pt-4 font-medium text-gray-900 md:block md:pt-0">
                        <dt>{translate('label.orderDetails.refundAmtText')}</dt>
                        <dd className="md:mt-1">
                          {order.refundAmount?.formatted?.withTax}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div className="flow-root px-4 mt-6 sm:mt-10 sm:px-0">
                    <div className="-my-6 divide-y divide-gray-200 sm:-my-10">
                      {order.lineItems.map((product: any) => (
                        <div key={product.id} className="flex py-6 sm:py-10">
                          <div className="flex-1 min-w-0 lg:flex lg:flex-col">
                            <div className="lg:flex-1">
                              <div className="sm:flex">
                                <div>
                                  <h4 className="font-medium text-gray-900">
                                    {product.name}
                                  </h4>
                                </div>
                                <p className="mt-1 font-medium text-gray-900 sm:mt-0 sm:ml-6">
                                  {product?.price?.raw?.withTax > 0 ? 
                                    (isIncludeVAT
                                      ? product.price?.formatted?.withTax
                                      : product.price?.formatted?.withoutTax)
                                   : <span className='font-medium uppercase text-14 xs-text-14 text-emerald-600'>FREE</span>
                                  }
                                </p>
                              </div>
                              <div className="flex mt-2 text-sm font-medium sm:mt-4">
                                <Link
                                  href={`/${product.slug}`}
                                  passHref
                                  className="text-indigo-600 hover:text-indigo-500"
                                >
                                  {translate('label.product.viewProductText')}
                                </Link>
                                <div className="pl-4 ml-4 border-l border-gray-200 sm:ml-6 sm:pl-6">
                                  <div className="pl-4 ml-4 border-l border-gray-200 sm:ml-6 sm:pl-6">
                                    <button
                                      onClick={() => handleAddToCart(product)}
                                      className="text-indigo-600 hover:text-indigo-500"
                                    >
                                      {translate('label.basket.addToBagText')}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="mt-6 font-medium">
                              <p className={'text-gray-500'}>
                                {order.returnStatusLabel}
                              </p>
                            </div>
                          </div>
                          <div className="flex-shrink-0 ml-4 sm:m-0 sm:mr-6 sm:order-first">
                            <img
                              src={generateUri(product.image,'h=100&fm=webp')||IMG_PLACEHOLDER}
                              alt={product.name || 'returns-Image'}
                              height={100}
                              width={100}
                              className="object-cover object-center w-20 h-20 col-start-2 col-end-3 rounded-lg sm:col-start-1 sm:row-start-1 sm:row-span-2 sm:w-40 sm:h-40 lg:w-52 lg:h-52"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
