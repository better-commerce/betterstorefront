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
import KitOrderItems from './KitOrderItem'
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
                      <button className="border border-gray-900 rounded-full">
                        <ChevronDownIcon
                          className={`w-4 h-4 dark:text-gray-900 ${open && 'rotate-180 transform'
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
              <div className="w-full px-4 py-4 border-b border-gray-300 border-dashed sm:px-16 sm:pl-0 sm:pt-0">
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
            <div className="px-0">
              <div className="flow-root">
                <ul role="list" className="flex flex-col w-full gap-2 pt-4">
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
                            <KitOrderItems orderItem={productItem} isKitOrderItem={false} openHelpModal={openHelpModal} />

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
