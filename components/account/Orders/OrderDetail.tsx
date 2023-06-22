// Base Imports
import React, { Fragment, useEffect, useState } from 'react'

// Package Imports
import moment from 'moment'
import Router from 'next/router'
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { Disclosure } from '@headlessui/react';

// Component Imports
import OrderStatusMapping from './OrderStatusMapping'

// Other Imports
import {
  matchStrings,
  priceFormat,
  stringToNumber,
} from '@framework/utils/parse-util'
import { PaymentStatus } from '@components/utils/payment-constants'
import ReviewInput from '@components/product/Reviews/ReviewInput'
import { ArrowLeft } from '@components/icons'
// import { CLOSE_PANEL, CURRENCY_SYMBOL_RUPEE } from '@components/utils/textVariables';
import { StarIcon } from '@heroicons/react/24/solid'
import { DATE_FORMAT } from '@components/utils/constants'
// import getCustomerOrderDetail from '@framework/checkout/customer-order-details'
import { round } from 'lodash'
import Link from 'next/link'
import { useUI } from '@components/ui'

// import { recordGA4Event } from '@components/services/analytics/ga4';
import OrderLog from './OrderLog'
// import CartFreeGift from '@components/cart/CartSidebarView/FreeGift';
import OrderDetailHeader from './OrderDetailHeader'
import TrackingDetail from './TrackingDetail'
import OrderItems from './OrderItems'
import OrderSummary from './OrderSummary'
import HelpModal from './HelpModal'
import OrderReviewModal from './OrderReviewModal'
import OrderDeliveryPlanItems from './OrderDeliveryPlanItems'
import { recordGA4Event } from '@components/services/analytics/ga4'

export default function OrderDetail({
  details,
  showDetailedOrder,
  show,
  deviceInfo,
}: any) {
  const { isMobile, isIPadorTablet } = deviceInfo
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const [isHelpOrderOpen, setIsHelpOrderOpen] = useState(false)
  const [isHelpStatus, setIsHelpStatus] = useState<any>()
  const [data, setData] = useState<any>(undefined)
  const [isSubmitReview, setSubmitReview] = useState<any>(false)
  const [isReviewdata, setReviewData] = useState<any>()
  const [returnRequestedItems, setReturnRequestedItems] = useState({})

  useEffect(() => {
    // need to map the "isRMACreated" field to control return item status/cta
    if (details?.order?.items?.length > 0) {
      const mapOrderLineItemObj = details?.order?.items?.reduce(
        (acc: any, cur: any) => {
          const obj = {
            [cur.id]: {
              id: cur.id,
              statusCode: cur.statusCode,
              isRMACreated: cur.isRMACreated,
            },
          }
          return {
            ...acc,
            ...obj,
          }
        },
        {}
      )
      setReturnRequestedItems(mapOrderLineItemObj)
    }
  }, [details])

  const isConfirmedOrder = () => {
    if (details?.order?.payments?.length) {
      const payment = details?.order?.payments?.find((x: any) => x?.isValid)
      if (payment?.status === PaymentStatus.PAID) {
        return true
      }
    }
    return false
  }
  function setReview(item: any) {
    setSubmitReview(true)
    setReviewData(item)
  }
  let deviceCheck = ''
  if (isMobile || isIPadorTablet) {
    deviceCheck = 'Mobile'
  } else {
    deviceCheck = 'Desktop'
  }
  const ifCancelled =
    details?.order?.orderLog
      ?.map((x: any) => x?.updateType)
      .includes('UpdateOrderLine') ||
    details?.order?.orderLog
      ?.map((x: any) => x?.updateType)
      .includes('RefundGenerated') ||
    details?.order?.orderLog
      ?.map((x: any) => x?.updateValue)
      .some((y: any) =>
        ['102', '103', '104', '105', '110', '202', '40'].includes(y)
      )

  const openHelpModal = (item: any, order: any) => {
    setData({
      orderId: order?.id,
      itemId: item?.productId,
    })
    setIsHelpOpen(true)
    setIsHelpStatus(item)
    if (typeof window !== 'undefined') {
      recordGA4Event(window, 'help_icon', {
        helpmode: 'cancel/return/exchange/chat',
        device: deviceCheck,
      })
    }
  }

  const chooseHelpMode = (mode: any) => {
    if (typeof window !== 'undefined')
      recordGA4Event(window, 'help_sidebar_menu', {
        helpmode: mode,
        device: deviceCheck,
      })
  }

  const closeHelpModal = () => {
    setData(undefined)
    setIsHelpOpen(false)
  }

  const openOrderHelpModal = (order: any) => {
    setData({
      orderId: order?.id,
    })
    setIsHelpOrderOpen(true)
    if (typeof window !== 'undefined')
      recordGA4Event(window, 'need_help_with_your_order', {
        helpmode: 'Order',
        device: deviceCheck,
      })
  }

  const closeOrderHelpModal = () => {
    setIsHelpOrderOpen(false)
  }

  const onCancelItem = async (mode: any) => {
    Router.push(
      `/my-account/cancel-order-item/${data?.orderId}/${data?.itemId}`
    )
    if (typeof window !== 'undefined') {
      recordGA4Event(window, 'proceed_to_cancel_item', {})
      recordGA4Event(window, 'help_sidebar_menu', {
        helpmode: mode,
        device: deviceCheck,
      })
    }
  }
  const onCancelOrder = async (mode: any) => {
    Router.push(`/my-account/cancel-order/${data?.orderId}`)
    if (typeof window !== 'undefined') {
      recordGA4Event(window, 'proceed_to_cancel_order', {})
      recordGA4Event(window, 'help_sidebar_menu', {
        helpmode: mode,
        device: deviceCheck,
      })
    }
  }
  const onReturnItem = async (mode: any) => {
    Router.push(`/my-account/return-order/${data?.orderId}/${data?.itemId}`)
    if (typeof window !== 'undefined') {
      recordGA4Event(window, 'proceed_to_return', {})
      recordGA4Event(window, 'help_sidebar_menu', {
        helpmode: mode,
        device: deviceCheck,
      })
    }
  }
  const onExchangeItem = async (mode: any) => {
    Router.push(`/my-account/exchange-order/${data?.orderId}/${data?.itemId}`)
    if (typeof window !== 'undefined') {
      recordGA4Event(window, 'proceed_to_exchange', {})
      recordGA4Event(window, 'track_package', {
        transaction_id: details?.payments?.id,
        device: deviceCheck,
      })
      recordGA4Event(window, 'help_sidebar_menu', {
        helpmode: mode,
        device: deviceCheck,
      })
    }
  }
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // @ts-ignore
  // console.log('ENTIRE_ORDER_LOG_SORTED', details?.order?.orderLog.sort((a:any,b:any) => new Date(a?.created) - new Date(b?.created)))
  // console.log('ENTIRE_ORDER_', details?.order)
  const trackPackage = (details: any) => {
    if (typeof window !== 'undefined')
      recordGA4Event(window, 'proceed_to_exchange', {})
  }

  const subTotalAmount = (
    details?.order?.subTotal?.raw?.withTax -
    details?.order?.discount?.raw?.withTax
  ).toFixed(2)

  return (
    <>
      <div className="w-full bg-white">
        <OrderDetailHeader
          details={details}
          showDetailedOrder={showDetailedOrder}
        />

        <div className="w-full py-6">
          {details?.order?.deliveryPlans?.length > 0 ? (
            <OrderDeliveryPlanItems
              items={details?.order?.deliveryPlans}
              details={details}
              trackPackage={trackPackage}
              ifCancelled={ifCancelled}
              openHelpModal={openHelpModal}
              setReview={setReview}
            />
          ) : (
            <>
              <div className="flex items-center justify-end w-full pb-4 border-b border-gray-300 border-dashed">
                <OrderStatusMapping
                  orderStatusDisplay={details?.order?.orderStatusDisplay}
                  orderStatusRag={details?.order?.orderStatusRag}
                />
              </div>
              <div className="px-4 order-track sm:px-16">
                <Disclosure defaultOpen>
                  {({ open }) => (
                    <>
                      {details?.order.showETA && (
                        <Disclosure.Button className="flex items-center justify-between w-full py-3">
                          <p className="text-sm text-black font-medium">
                            <span>
                              ETA:{' '}
                              {moment(new Date(details?.order.dueDate)).format(
                                DATE_FORMAT
                              )}
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
                        <OrderLog
                          orderLog={details?.order?.orderLog}
                          orderJourney={details?.order?.orderJourney}
                        />
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              </div>
              {details?.order?.allowedToTrack && (
                <div className="w-full px-4 py-4 mb-4 border-b border-gray-300 border-dashed sm:px-16">
                  <div className="flex flex-col w-full">
                    <span
                      onClick={() => trackPackage(details?.order)}
                      className="font-semibold text-orange-500 cursor-pointer text-14"
                    >
                      Tracking Details →
                    </span>
                  </div>
                </div>
              )}
              <OrderItems
                items={details?.order?.items}
                details={details}
                ifCancelled={ifCancelled}
                openHelpModal={openHelpModal}
                setReview={setReview}
              />
            </>
          )}
        </div>
        <OrderSummary
          details={details}
          subTotalAmount={subTotalAmount}
          openOrderHelpModal={openOrderHelpModal}
        />
      </div>

      <HelpModal
        details={details}
        isHelpOpen={isHelpOpen}
        closeHelpModal={closeHelpModal}
        isHelpStatus={isHelpStatus}
        chooseHelpMode={chooseHelpMode}
        onExchangeItem={onExchangeItem}
        onReturnItem={onReturnItem}
        onCancelItem={onCancelItem}
        onCancelOrder={onCancelOrder}
        isHelpOrderOpen={isHelpOrderOpen}
        closeOrderHelpModal={closeOrderHelpModal}
        returnRequestedItems={returnRequestedItems}
      />

      <OrderReviewModal
        isSubmitReview={isSubmitReview}
        setSubmitReview={setSubmitReview}
        isReviewdata={isReviewdata}
      />
    </>
  )
}
