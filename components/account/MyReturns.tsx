import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import {
  IMG_PLACEHOLDER,
} from '@components/utils/textVariables'
import { useTranslation } from '@commerce/utils/use-translation'
import { DATE_FORMAT, NEXT_GET_RETURNS } from '@components/utils/constants'
import { useUI } from '@components/ui'
import Link from 'next/link'
import cartHandler from '@components/services/cart'
import { isCartAssociated, vatIncluded } from '@framework/utils/app-util'
import { generateUri } from '@commerce/utils/uri-util'
import moment from 'moment'

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
    <section aria-labelledby="recent-heading" className="w-full mt-4 bg-white">
      <h2 id="recent-heading" className="sr-only dark:text-black">
        {translate('label.orderDetails.recentOrdersText')}
      </h2>
      {returns?.length > 0 ? (
        <>
          <div className="space-y-16 sm:space-y-24">
            {returns.map((order: any) => (
              <div key={order.number} className='border border-slate-200 rounded-xl'>
                <h3 className="sr-only">
                  {translate('common.label.orderPlacedText')}{' '}
                  <time dateTime={order.returnDate}>
                    {new Date(order.returnDate).toDateString()}
                  </time>
                </h3>

                <div className="px-4 py-2 border bg-gray-50 border-slate-300 sm:rounded-lg sm:py-2 md:flex md:items-center md:justify-between md:space-x-6 lg:space-x-8">
                  <dl className="flex-auto space-y-4 text-sm text-gray-600 divide-y divide-gray-200 md:divide-y-0 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-6 lg:w-full lg:flex-none lg:gap-x-8">
                    <div className="flex justify-between md:block">
                      <dt className="text-lg font-semibold text-gray-900">
                        {translate('label.returnReason.returnNumText')}
                      </dt>
                      <dd className="md:mt-1">{order.returnNo}</dd>
                    </div>
                    <div className="flex justify-between pt-4 md:block md:pt-0">
                      <dt className="text-lg font-semibold text-gray-900">
                        {translate('label.common.datePlacedText')}
                      </dt>
                      <dd className="md:mt-1">
                        {moment(new Date(order.returnDate)).format(DATE_FORMAT)}
                      </dd>
                    </div>
                    <div className="flex justify-between pt-4 font-medium text-gray-900 md:block md:pt-0">
                      {order?.lineItems?.map((product: any) => (
                        <>
                          <dt className="text-lg font-semibold text-gray-900">
                            {translate('label.orderDetails.refundAmtText')}
                          </dt>
                          <dd className="md:mt-1">
                            {product?.price?.raw?.withTax > 0 ? (
                              isIncludeVAT ? (
                                product?.price?.formatted?.withTax
                              ) : (
                                product?.price?.formatted?.withoutTax
                              )
                            ) : (
                              <span className="font-medium uppercase text-14 xs-text-14 text-emerald-600">
                                {translate('label.orderSummary.freeText')}
                              </span>
                            )}
                          </dd>
                        </>
                      ))}
                    </div>
                  </dl>
                </div>

                <div className="flow-root px-4 mt-6 sm:mt-4 sm:px-0">
                  <div className="divide-y divide-gray-200">
                    {order?.lineItems?.map((product: any) => {
                      return (
                        <div key={product.id} className="flex pt-2 pb-1">
                          <div className='grid grid-cols-12 gap-4'>
                            <div className='col-span-3'>
                              <img src={generateUri(product.image, 'h=100&fm=webp') || IMG_PLACEHOLDER} alt={product.name || 'returns-Image'} height={100} width={100} className="object-cover object-center rounded-lg" />
                            </div>
                            <div className='col-span-9'>
                              <div className="lg:flex-1">
                                <div className="sm:flex">
                                  <h4 className="font-medium text-gray-900">
                                    {product?.name}
                                  </h4>
                                  <p className="mt-1 font-semibold text-gray-900 sm:mt-0">
                                    {product?.price?.raw?.withTax > 0 ?
                                      (isIncludeVAT ? product.price?.formatted?.withTax : product.price?.formatted?.withoutTax)
                                      : <span className='font-medium uppercase text-14 xs-text-14 text-emerald-600'> {translate('label.orderSummary.freeText')}</span>
                                    }
                                  </p>
                                </div>
                                <div className="flex mt-2 text-sm font-medium sm:mt-1">
                                  <Link href={`/${product.slug}`} passHref className="text-indigo-600 hover:text-indigo-500" >
                                    {translate('label.product.viewProductText')}
                                  </Link>
                                  <div className="pl-4 ml-4 border-l border-gray-200 sm:ml-6 sm:pl-6">
                                    <button onClick={() => handleAddToCart(product)} className="text-indigo-600 hover:text-indigo-500" >
                                      {translate('label.basket.addToBagText')}
                                    </button>
                                  </div>
                                </div>
                              </div>
                              <div className="mt-2 font-medium">
                                <span className='px-2 py-1 text-xs border bg-emerald-100 text-emerald-600 border-emerald-300 rounded-2xl'>{order?.returnStatusLabel}</span>
                              </div>
                            </div>
                          </div>

                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="py-4 sm:py-10 lg:mx-0 dark:text-black">No Return available</div>
      )}
    </section>
  )
}
