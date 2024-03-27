// import CartFreeGift from "@old-components/cart/CartSidebarView/FreeGift";
// import ReplacementItem from "@old-components/cart/CartSidebarView/ReplacementItem";
import { OrderStatus } from '@components//utils/constants'
import { matchStrings, priceFormat } from '@framework/utils/parse-util'
import { StarIcon } from '@heroicons/react/24/solid'
import { round } from 'lodash'
import moment from 'moment'
import Image from 'next/image'
import React from 'react'
import TrackingDetail from './TrackingDetail'
import { vatIncluded } from '@framework/utils/app-util'
import { IMG_PLACEHOLDER } from '@components//utils/textVariables'
import { generateUri } from '@commerce/utils/uri-util'
import { useTranslation } from '@commerce/utils/use-translation'


const OrderItems = ({
  items,
  details,
  ifCancelled,
  openHelpModal,
  setReview,
}: any) => {
  const translate = useTranslation();
  const isIncludeVAT = vatIncluded();
  return (
    <>
      <ul role="list" className="-my-6 divide-y divide-gray-200">
        {items?.map((productItem: any, odx: number) => {
          //const productItem = details?.order?.items?.find((x: any) => matchStrings(x?.productId, item?.productId, true));
          const saving =
            productItem?.listPrice?.raw?.withTax -
            productItem?.price?.raw?.withTax
          const discount = round(
            (saving / productItem?.listPrice?.raw?.withTax) * 100,
            0
          )
          const ifItemCancelled =
            productItem.status == 24 || productItem.statusDisplay == 'Cancelled'
              ? true
              : false
          //const itemStatus = ifItemCancelled ? "Cancelled" : productItem.statusCode ;
          const itemStatus = productItem.statusDisplay
          const itemStatusCss = ifItemCancelled
            ? 'label-Cancelled'
            : 'label-confirmed'
          return (
            <>
              <li
                className="inline-block w-full px-4 pb-0 my-4 sm:px-16"
                key={odx}
              >
                <div className="flex gap-3 py-6 sm:gap-6">
                  <div className="flex-shrink-0">
                    <img
                      width={72}
                      height={128}
                      src={
                        generateUri(productItem?.image, 'h=128&fm=webp') ||
                        IMG_PLACEHOLDER
                      }
                      alt="image"
                      className="basket-image"
                    />
                  </div>
                  <div className="flex flex-col flex-1 flex-width-nob">
                    <div>
                      <div className="flex flex-col justify-between font-medium text-gray-900">
                        <div className="flex items-center justify-between w-full">
                          <p className="text-xs font-normal text-black-light">
                            {productItem?.manufacturer}
                          </p>
                          {
                            //!ifCancelled
                            !ifItemCancelled ? (
                              <a
                                onClick={() =>
                                  openHelpModal(productItem, details?.order)
                                }
                                className="text-sm font-bold cursor-pointer text-orange"
                              >
                                Help?
                              </a>
                            ) : (
                              <label
                                className={`px-4 py-3 text-sm font-bold leading-none ${itemStatusCss}`}
                              >
                                {itemStatus}
                              </label>
                            )
                          }
                        </div>
                        <h3 className="max-w-sm /xsm:max-w-full /xsm:flex /xsm:flex-col /xsm:flex-wrap xsm:w-[50vw] pr-6 mt-0 dark:text-black font-normal /truncate text-14 xsm:text-sm text-primary text-ellipsis !text-sm">
                          <a href={`/${productItem?.slug}`}>
                            {productItem?.name}
                          </a>
                        </h3>
                        <p className="mt-2 text-sm font-semibold text-secondary-full-opacity">
                          {productItem?.price?.raw?.withTax > 0 ? isIncludeVAT
                            ? priceFormat(
                                productItem?.price?.raw?.withTax,
                                undefined,
                                productItem?.price?.currencySymbol
                              )
                            : priceFormat(
                                productItem?.price?.raw?.withoutTax,
                                undefined,
                                productItem?.price?.currencySymbol
                              )
                            : <span className='font-medium uppercase text-14 xs-text-14 text-emerald-600'>FREE</span>}
                          {productItem?.listPrice?.raw?.tax > 0 && (
                            <>
                              <span className="px-2 text-sm font-normal line-through text-brown-light sm:text-md">
                                {isIncludeVAT
                                  ? priceFormat(
                                      productItem?.listPrice?.raw?.withTax,
                                      undefined,
                                      productItem?.listPrice?.currencySymbol
                                    )
                                  : priceFormat(
                                      productItem?.listPrice?.raw?.withoutTax,
                                      undefined,
                                      productItem?.listPrice?.currencySymbol
                                    )}
                              </span>
                              <span className="text-sm font-normal text-green sm:text-md">
                                {discount}{translate('common.label.discountText')}
                              </span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex mt-3">
                      <div className="w-24">
                        <label className="text-sm font-medium capitalize text-primary dark:text-black">
                          {translate('common.label.sizeText')} {' '}
                          <span className="font-medium uppercase">
                            {productItem?.size}
                          </span>
                        </label>
                      </div>
                      <div className="w-full">
                        <label className="text-sm font-medium text-primary dark:text-black">
                        {translate('common.label.qtyText')} {productItem?.qty}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                {matchStrings(
                  details?.orderStatus,
                  OrderStatus.DELIVERED,
                  true
                ) && (
                  <div className="flex w-full">
                    <p
                      className="w-16 mt-2 text-xs text-black opacity-60"
                      onClick={() => setReview(productItem)}
                    >
                      {translate('label.orderDetails.rateItemText')}:{' '}
                    </p>
                    <div className="flex gap-1 sm:gap-2 flex-center">
                      {Array.from(Array(5).keys()).map((num) => (
                        <StarIcon
                          key={`starIcon-${num}`}
                          className="flex-shrink-0 w-8 h-8 text-gray-200 sm:h-8 sm:w-8"
                          onClick={() => setReview(productItem)}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </li>
            </>
          )
        })}
      </ul>
      {details?.allowedToTrack && (
        <TrackingDetail deliveryPlan={details?.deliveryPlans} />
      )}
    </>
  )
}

export default OrderItems
