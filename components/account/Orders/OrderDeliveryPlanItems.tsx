// import CartFreeGift from "@components/cart/CartSidebarView/FreeGift";
// import ReplacementItem from "@components/cart/CartSidebarView/ReplacementItem";
import { DATE_FORMAT } from '@components/utils/constants'
import Link from 'next/link'
import {
  matchStrings,
  priceFormat,
  tryParseJson,
} from '@framework/utils/parse-util'
import { Disclosure } from '@headlessui/react'
import { StarIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { round } from 'lodash'
import moment from 'moment'
import Image from 'next/image'
import React from 'react'
import OrderLog from './OrderLog'
import OrderStatusMapping from './OrderStatusMapping'
import TrackingDetail from './TrackingDetail'
import { IMG_PLACEHOLDER } from '@components/utils/textVariables'
import { generateUri } from '@commerce/utils/uri-util'
import { useTranslation } from '@commerce/utils/use-translation'
const OrderDeliveryPlanItems = ({
  items,
  details,
  trackPackage,
  ifCancelled,
  openHelpModal,
  setReview,
}: any) => {
  const translate = useTranslation()
  return (
    <>
      {items?.map((deliveryPlan: any, idx: number) => (
        <div key={idx} className="w-full">
          <div className="flex items-center justify-between w-full pb-4 border-b border-gray-300 border-dashed">
            <div className="">
              <h4 className="mb-2 text-xs text-black opacity-60">
                {deliveryPlan?.items?.length} {translate('common.label.itemPluralText')}
              </h4>
              <span className="text-base font-semibold text-black">
                {translate('label.orderDetails.packageText')} {idx + 1}
                {' of '}
                {details?.deliveryPlans?.length}
              </span>
            </div>

            <div className="">
              <OrderStatusMapping
                orderStatusDisplay={deliveryPlan?.orderStatusDisplay}
                orderStatusRag={deliveryPlan?.orderStatusRag}
                orderStatus={deliveryPlan.statusType}
                orderId={details?.orderId}
                orderLog={details?.orderLog}
              />
            </div>
          </div>

          {/* order status section start */}
          <div className="w-full pb-0 mb-4 border-b border-gray-300 border-dashed">
            <Disclosure defaultOpen>
              {({ open }) => (
                <>
                  {deliveryPlan?.showETA && (
                    <Disclosure.Button className="flex items-center justify-between w-full py-3">
                      <p className="text-sm font-light text-black">
                        <span>
                          ETA: {' '}
                          {moment(
                            new Date(deliveryPlan?.deliveryDateTarget)
                          ).format(DATE_FORMAT)}
                        </span>
                      </p>
                      <button className="border rounded-full border-gray-900">
                        <ChevronDownIcon
                          className={`w-4 h-4 ${
                            open && 'rotate-180 transform'
                          }`}
                        />
                      </button>
                    </Disclosure.Button>
                  )}
                  <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                    <div className="order-track">
                      <OrderLog
                        orderLog={deliveryPlan?.orderLog}
                        orderStatus={details?.orderStatus}
                        orderJourney={deliveryPlan?.orderJourney}
                        deliveryPlanId={deliveryPlan?.recordId}
                      />
                    </div>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </div>
          {details?.allowedToTrack && (
            <>
              <div className="w-full px-4 py-4 mb-4 border-b border-gray-300 border-dashed sm:px-16 sm:pl-0 sm:pt-0">
                <div className="flex flex-col w-full">
                  <a
                    onClick={() => trackPackage(details)}
                    className="font-semibold text-[#32CD32] cursor-pointer text-14"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={deliveryPlan?.trackingLink}
                  >
                    {translate('label.orderDetails.trackingDetailsBtnText')} </a>
                </div>
              </div>
            </>
          )}

          <div className="w-full">
            <div className="px-0 mt-4">
              <div className="flow-root">
                <ul role="list" className="-my-6 divide-y divide-gray-200">
                  {deliveryPlan?.items?.map((item: any, idx: number) =>
                    details?.items
                      ?.filter((x: any) =>
                        matchStrings(x?.productId, item?.productId, true)
                      )
                      ?.map((productItem: any, pId: number) => {
                        const saving =
                          productItem?.listPrice?.raw?.withTax -
                          productItem?.price?.raw?.withTax
                        const discount = round(
                          (saving / productItem?.listPrice?.raw?.withTax) * 100,
                          0
                        )
                        const ifItemCancelled =
                          item?.returnQtyRequested > 0 ||
                          productItem.status == 24 ||
                          productItem.statusDisplay == 'Cancelled'
                            ? true
                            : false
                        //ItemStatus should be ideally coming from API, as of now it comes ONLY upto 'Delivered' state
                        //const itemStatus = ifItemCancelled ? item?.returnQtyRequested == item.qty ? "Cancelled" : "Partly Cancelled" : productItem?.statusCode ;
                        const itemStatus = productItem.statusDisplay
                        const rmaTrackingNo = productItem.rmaTrackingNo
                        const rmaTrackingLink = productItem.rmaTrackingLink
                        const itemStatusCss = ifItemCancelled
                          ? 'label-Cancelled'
                          : 'label-confirmed'
                        const customInfo1: any = tryParseJson(
                          productItem.customInfo1
                        )
                        const customInfo1FormattedData =
                          customInfo1?.formatted?.data || null
                        const personalizationFont = `font-${customInfo1FormattedData?.Font}`

                        return item?.price?.raw?.withTax == 0 ? (
                          <>
                            <div className="w-full px-0 pb-0 my-4 border-b border-gray-300 border-dashed no-change-button">
                              {/* <ReplacementItem data={item} key={idx} details={details} /> */}
                            </div>
                          </>
                        ) : (
                          <>
                            <li
                              className="px-0 pb-0 my-4 border-b border-gray-300 border-dashed"
                              key={idx}
                            >
                              <div className="flex gap-3 py-6 sm:gap-6">
                                <div className="flex-shrink-0">
                                  <Link href={`/${productItem?.slug}`}>
                                    <img
                                      width={102}
                                      height={148}
                                      src={
                                        generateUri(
                                          customInfo1?.formatted?.data
                                            ?.ImageUrl,
                                          'h=148&webp'
                                        ) ||
                                        generateUri(
                                          productItem?.image,
                                          'h=148&webp'
                                        ) ||
                                        IMG_PLACEHOLDER
                                      }
                                      alt="image"
                                      // className="basket-image"
                                    />
                                  </Link>
                                </div>
                                <div className="flex flex-col flex-1 flex-width-nob">
                                  <div>
                                    <div className="flex flex-col justify-between font-medium text-gray-900">
                                      <div className="flex items-center justify-between">
                                        <p className="font-normal text-10 text-black">
                                          {
                                            productItem?.categoryItems[0]
                                              ?.categoryName
                                          }
                                        </p>
                                        {productItem?.isRMACreated &&
                                        productItem?.shippedQty > 0 ? (
                                          <label
                                            className={`px-4 py-3 text-sm font-bold leading-none ${itemStatusCss}`}
                                          >
                                            {itemStatus}
                                          </label>
                                        ) : !ifItemCancelled || !itemStatus ? (
                                          <a
                                            onClick={() =>
                                              openHelpModal(
                                                item,
                                                details
                                              )
                                            }
                                            className="text-sm font-semibold underline cursor-pointer text-orange"
                                          >
                                            Help?
                                          </a>
                                        ) : (
                                          itemStatus && (
                                            <label
                                              className={`px-4 py-3 text-sm font-bold leading-none ${itemStatusCss}`}
                                            >
                                              {itemStatus}
                                            </label>
                                          )
                                        )}
                                      </div>
                                      <div className="flex flex-col">
                                        <h3 className="max-w-sm /xsm:max-w-full /xsm:flex /xsm:flex-col /xsm:flex-wrap xsm:w-[50vw] pr-6 mt-0 dark:text-black font-normal /truncate text-14 xsm:text-sm text-primary text-ellipsis !text-sm">
                                          <a href={`/${productItem?.slug}`}>
                                            {productItem?.name}
                                          </a>
                                        </h3>
                                      </div>
                                      <p className="mt-2 text-sm font-normal text-secondary-full-opacity">
                                        {productItem?.price?.raw?.withTax > 0 ? priceFormat(
                                          productItem?.price?.raw?.withTax,
                                          undefined,
                                          productItem?.price?.currencySymbol
                                        ) : <span className="font-medium uppercase text-14 xs-text-14 text-emerald-600">FREE</span>}
                                        {productItem?.listPrice?.raw?.tax >
                                        0 && (
                                          <>
                                            <span className="px-2 text-sm font-normal line-through text-brown-light sm:text-md">
                                              {priceFormat(
                                                productItem?.listPrice?.raw
                                                  ?.withTax,
                                                undefined,
                                                productItem?.listPrice
                                                  ?.currencySymbol
                                              )}
                                            </span>
                                            {productItem?.price?.raw?.withTax > 0 &&
                                              (<span className="text-sm font-normal text-green sm:text-md">
                                                {discount}{translate('common.label.discountText')}
                                              </span>)
                                            }
                                          </>
                                        )}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex mt-3">
                                    <div className="w-full">
                                      <label className="font-medium capitalize text-12 text-primary dark:text-black">
                                        {translate('common.label.sizeText')}{' '}
                                        <span className="uppercase">
                                          {productItem?.size}
                                        </span>
                                      </label>
                                    </div>
                                    <div className="w-full">
                                      <label className="font-medium text-12 text-primary dark:text-black">
                                      {translate('label.product.qtyText')} {productItem?.qty}
                                      </label>
                                    </div>
                                  </div>
                                  {customInfo1FormattedData && (
                                    <div className="flex mt-3">
                                      <div className="w-auto">
                                        <label className="font-medium capitalize text-12 text-primary dark:text-black">
                                          Personalization:
                                          <span className={personalizationFont}>
                                            {
                                              customInfo1?.formatted?.data
                                                ?.Message
                                            }
                                          </span>
                                        </label>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                              {rmaTrackingNo && (
                                <div className="w-full py-4">
                                  <h3 className="mb-1 text-black opacity-60 font-10">
                                    {translate('label.orderDetails.returnTrackingDetailHeadingText')} </h3>
                                  <a
                                    className="text-orange-500 opacity-80"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href={rmaTrackingLink}
                                  >
                                    {rmaTrackingNo}
                                  </a>
                                </div>
                              )}
                              {details?.allowedToReview && (
                                <>
                                  <div className="flex w-full py-4">
                                    <p
                                      className="w-16 mt-2 text-xs text-black opacity-60"
                                      onClick={() => setReview(item)}
                                    >
                                      {translate('label.orderDetails.rateItemText')}:{' '}
                                    </p>
                                    <div className="flex gap-1 sm:gap-2 flex-center">
                                      {Array.from(Array(5).keys()).map(
                                        (num) => (
                                          <StarIcon
                                            key={`starIcon-${num}`}
                                            className="flex-shrink-0 w-8 h-8 text-gray-200 sm:h-8 sm:w-8"
                                            onClick={() => setReview(item)}
                                            aria-hidden="true"
                                          />
                                        )
                                      )}
                                    </div>
                                  </div>
                                </>
                              )}
                            </li>
                          </>
                        )
                      })
                  )}
                </ul>
              </div>
            </div>
          </div>
          {details?.allowedToTrack && (
            <TrackingDetail deliveryPlan={deliveryPlan} />
          )}
          {deliveryPlan?.invoiceURL && (
            <div className="py-6">
              <a
                href={deliveryPlan?.invoiceURL}
                className="block w-full px-4 font-bold text-center text-black border btn-basic-property rounde-sm"
              >
                {translate('label.orderDetails.downloadInvoiceBtnText')} </a>
            </div>
          )}
        </div>
      ))}
    </>
  )
}

export default OrderDeliveryPlanItems
