import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import classNames from 'classnames'
import { isIncludeVATInPriceDisplay, vatIncluded } from '@framework/utils/app-util'
import { generateUri } from '@commerce/utils/uri-util'
import { IMG_PLACEHOLDER } from '@components/utils/textVariables'
import { tryParseJson } from '@framework/utils/parse-util'
const KitOrderItems = ({ orderItem, details, splitDeliveryFlag = false, isKitOrderItem = false, itemStatus, ifItemCancelled, openHelpModal }: any) => {
  const isIncludeVAT = vatIncluded()
  const [qty, setQty] = useState<any>(null)
  useEffect(() => {
    if (isKitOrderItem) {
      setQty(orderItem?.qty > 1 ? orderItem?.qty / orderItem?.orderItemGroupData?.kitQty : orderItem?.qty)
    }
    else {
      setQty(orderItem?.qty)
    }
  }, [])
  const itemStatusCss = ifItemCancelled ? 'label-Cancelled' : 'label-confirmed'
  const customInfo1: any = tryParseJson(orderItem.customInfo1)
  const customInfo1FormattedData = customInfo1?.formatted?.data || null
  const personalizationFont = `font-${customInfo1FormattedData?.Font}`
  return (
    <div className={classNames(
      `${orderItem?.statusDisplay == 'Cancelled' ? '!bg-red-50 !border-red-300 hover:!border-red-400' : 'bg-white border-gray-200 hover:border-gray-400 hover:bg-gray-50'}`,
      'p-4 mb-2 border rounded-md flex items-center justify-between',
      `${orderItem?.price?.raw?.withTax > 0 ? 'border border-gray-200' : 'border !border-emerald-300 !bg-emerald-50'}`
    )}>
      <div className='flex flex-col justify-start w-full gap-4'>
        <div className='flex items-center gap-4'>
          <Link href={`/${orderItem?.slug}`}>
            <img width={80} height={80} src={generateUri(orderItem?.image, 'h=200&fm=webp') || IMG_PLACEHOLDER} alt={orderItem?.name} className="object-cover object-center image" />
          </Link>
          <div className='flex flex-col w-full remove-cancel-thank-you'>
            <div className='flex justify-between w-ful'>
              <span className='flex flex-col w-full font-medium text-left text-gray-500 font-12'>{orderItem?.categoryItems?.length > 0 && orderItem?.categoryItems[0]?.categoryName}</span>
            </div>
            <Link href={`/${orderItem?.slug}`}>
              <span className='font-medium text-left text-black font-16 hover:text-black hover:underline'>{orderItem?.name}</span>
            </Link>
            <div className='flex items-center gap-2 mt-1 font-medium text-gray-600'>
              <div className='flex items-center gap-4 divide-x divide-gray-300 justify-normal'>
                <label className="text-xs font-medium text-gray-500 capitalize dark:text-black">
                  Qty{': '} <span className="text-black uppercase font-14">{orderItem?.qty}</span>
                </label>
                {orderItem?.size != "" &&
                  <label className="pl-4 text-xs font-medium text-gray-500 capitalize dark:text-black">
                    Size{': '} <span className="text-black uppercase font-14"> {orderItem?.size} </span>
                  </label>
                }
                {orderItem?.colorName != "" &&
                  <label className="pl-4 text-xs font-medium text-gray-500 capitalize dark:text-black">
                    Color{': '} <span className="text-black uppercase font-14"> {orderItem?.colorName} </span>
                  </label>
                }
              </div>
              {orderItem?.statusDisplay === 'Cancelled' &&
                <span className='px-2 text-red-700 bg-red-100 border border-red-400 rounded-md font-12 y-1 thank-you-cancel'>Cancelled</span>
              }
            </div>
            <div className='flex justify-between w-full mt-2'>
              {customInfo1FormattedData && (
                <div className="flex mt-3">
                  <div className="w-auto">
                    <label className="font-medium capitalize text-12 text-primary dark:text-black"> Personalization: <span className={personalizationFont}> {customInfo1?.formatted?.data?.Message} </span> </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className='flex flex-col justify-end col-span-3 gap-2'>
        <span className='flex justify-end'>
          {orderItem?.isRMACreated && orderItem?.shippedQty > 0 ? (
            <label className={`px-4 py-3 text-sm font-bold leading-none ${itemStatusCss}`} > {itemStatus} </label>
          ) : !ifItemCancelled || !itemStatus ? (
            <a onClick={() => openHelpModal(orderItem, details)} className="text-sm font-semibold underline cursor-pointer text-orange" > Help? </a>
          ) : (
            itemStatus && (
              <label className={`px-4 py-3 text-sm font-bold leading-none ${itemStatusCss}`} > {itemStatus} </label>
            )
          )}
        </span>
        <div className="flex flex-col items-center justify-end pl-6 font-bold capitalize truncate gap-x-2 lg:pl-0 lg:flex-row font-18">
          {orderItem?.price?.raw?.withTax > 0 ?
            <span className="block font-semibold text-black dark:text-black font-18">
              {isIncludeVATInPriceDisplay(isIncludeVAT, orderItem) ? orderItem?.price?.formatted?.withTax : orderItem?.price?.formatted?.withoutTax}
            </span> : <span className='"block font-semibold dark:text-red-500 font-18 text-red-500'>FREE</span>
          }
          {isIncludeVATInPriceDisplay(isIncludeVAT, orderItem) ? (
            orderItem?.listPrice?.raw?.withTax > 0 && orderItem?.listPrice?.raw?.withTax > orderItem?.price?.raw?.withTax && (
              <span className="text-sm font-light text-gray-400 line-through dark:text-black">
                {orderItem?.listPrice?.formatted?.withTax}
              </span>
            )
          ) : (
            orderItem?.listPrice?.raw?.withoutTax > 0 && orderItem?.listPrice?.raw?.withoutTax > orderItem?.price?.raw?.withoutTax && (
              <span className="text-sm font-light text-gray-400 line-through dark:text-black">
                {orderItem?.listPrice?.formatted?.withoutTax}
              </span>
            )
          )}
        </div>
      </div>
    </div>
  )
}
export default KitOrderItems