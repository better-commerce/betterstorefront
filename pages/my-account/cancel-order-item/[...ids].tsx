// Base Imports
import { useEffect, useState } from 'react'
import { Layout } from '@components/common'

// Package Imports
import axios from 'axios'
import Image from 'next/image'
import { toNumber } from 'lodash'
import Link from 'next/link'
import Router from 'next/router'

// Component Imports
import CancelReason from '../../../components/account/Orders/CancelReason'
import ConfirmDialog from '@components/common/ConfirmModal/ConfirmDialog'

// Other Imports
import { useUI } from '@components/ui'
import { matchStrings } from '@framework/utils/parse-util'
import {
  NEXT_CANCEL_REASON,
  EmptyGuid,
  NEXT_GET_ORDER_DETAILS,
  NEXT_CANCEL_ORDER_LINE,
} from '@components/utils/constants'
import { GENERAL_CANCEL, ITEM_CANCELLED, PROCEED_TO_CANCEL } from '@components/utils/textVariables'
import { recordGA4Event } from '@components/services/analytics/ga4'
import Spinner from '@components/ui/Spinner'

declare const window: any

export default function OrderCancel({
  orderId = EmptyGuid,
  itemId = EmptyGuid,
  deviceInfo,
}: any) {
  const { user, setAlert, } = useUI()
  const [orderDetails, setOrderDetails] = useState<any>()
  const [itemDatas, setItemDatas] = useState<any>(undefined)
  const [itemData, setItemData] = useState<any>(undefined)
  const [showCancellationReasons, setShowCancellationReasons] = useState(false)
  const [cancellationReasons, setCancellationReasons] = useState<any>(undefined)
  const [value, setValue] = useState<any>('')
  const handleChange = (e: any) => {
    setValue(e.target.value)
  }
  const handleFetchOrderDetails = async (id: any) => {
    const { data: orderDetails }: any = await axios.post(
      NEXT_GET_ORDER_DETAILS,
      { 
        id: user?.userId,
        orderId: id,
      }
    )
    return orderDetails
  }
  const { isMobile, isIPadorTablet } = deviceInfo;

  let deviceCheck = ''
  if (isMobile || isIPadorTablet) {
    deviceCheck = 'Mobile'
  } else {
    deviceCheck = 'Desktop'
  }

  const fetchCancellationReasons = async () => {
    const { data: reasonData }: any = await axios.post(NEXT_CANCEL_REASON)
    setCancellationReasons(reasonData?.result)
  }

  const hideCancellationReasons = () => {
    setShowCancellationReasons(!showCancellationReasons)
  }

  const cancelOrderLine = async (data: any) => {
    const { data: orderCancelData }: any = await axios.post(
      NEXT_CANCEL_ORDER_LINE,
      data
    )
    return orderCancelData
  }

  const onCancelReason = () => {
    fetchCancellationReasons()
  }

  const [cancelLineItemLoading, setCancelLineItemLoading] = useState(false)

  const itemCancelled = async (reason: string) => {
    if (matchStrings(itemData?.productId, itemId, true)) {
      setCancelLineItemLoading(true)
      try {
        const payment = orderDetails?.order?.payments?.find(
          (x: any) => x?.isValid
        )
        const orderCancelData = await cancelOrderLine({
          orderLineId: itemData?.id,
          reason: reason,
          orderId: orderDetails?.order?.id,
          qty: value,
        })
        setCancelLineItemLoading(false)
        setAlert({ type: 'success', msg: ITEM_CANCELLED })
        Router.push('/my-account/orders')
        if (typeof window !== "undefined") {
          recordGA4Event(window, 'cancel_confirm', {
            transaction_id: toNumber(payment?.id?.toString()),
            user_id: user?.userId,
            device: deviceCheck,
          })
        }
      } catch (error) {
        setCancelLineItemLoading(false)
        console.log(error)
      }
    }
  }

  useEffect(() => {
    const handleAsync = async () => {
      const orderDetails = await handleFetchOrderDetails(orderId)
      if (orderDetails?.order?.items?.length) {
        setOrderDetails(orderDetails)
        const itemsDatasNew =
          orderDetails?.order?.items?.length > 0
            ? orderDetails?.order?.items?.filter((x: any) =>
              matchStrings(x?.productId, itemId, true)
            )
            : []
        setItemDatas(itemsDatasNew)
        setItemData(
          itemsDatasNew?.length > 0
            ? itemsDatasNew?.find((x: any) => x.statusDisplay == null)
            : []
        )
      }
    }
    window.scrollTo(0, 0)
    handleAsync()
  }, [])

  return (
    <>
      {!itemData ? (
        <Spinner />
      ) : (
        <>
          <div
            className="w-full cancel-section"
            style={{ display: showCancellationReasons ? 'none' : 'block' }}
          >
            <div className="px-6 py-4 mb-4 border-b mob-header sm:hidden">
              <a href="/my-account/orders">
                <h3 className="max-w-4xl mx-auto text-xl font-semibold text-gray-900">
                  <i className="sprite-icon sprite-left-arrow mr-2"></i> {GENERAL_CANCEL} Item
                </h3>
              </a>
            </div>
            <div className="mx-auto cancel-continer">
              <a href="/my-account/orders" className='mobile-view'>
                <h4 className="mr-2 leading-none text-xl text-gray-900 uppercase font-bold">
                  <i className="sprite-icon sprite-left-arrow mr-2"></i> {GENERAL_CANCEL} Item
                </h4>
              </a>
              <div className="w-full">
                <div className="px-0 mt-4">
                  <div className="flow-root">
                    <ul role="list" className="-my-6 divide-y divide-gray-200">
                      <li className="px-0 pb-2 my-4">
                        <div className="flex gap-3 py-6 sm:gap-6 max-w-fit">
                          <div className="flex-shrink-0">
                            <Image
                              width={72}
                              height={128}
                              layout="fixed"
                              src={itemData?.image}
                              alt="image"
                              className="basket-image"
                            />
                          </div>
                          <div className="flex flex-col flex-1">
                            <div>
                              <div className="flex flex-col justify-between font-medium text-gray-900">
                                <div className="flex items-center justify-between">
                                  <p className="font-normal text-10 text-brown-light ">
                                    {itemData?.categoryItems && itemData?.categoryItems[0]?.categoryName}
                                  </p>
                                </div>
                                <h3 className="pr-6 mt-2 font-normal text-12 text-primary">
                                  <Link href={`/${itemData?.slug}`} passHref>
                                    {itemData?.name}
                                  </Link>
                                </h3>
                                <p className="mt-2 text-xs font-semibold text-secondary-full-opacity">
                                  {itemData?.price?.formatted?.withTax}
                                </p>
                                <div className="flex mt-3">
                                  <div className="w-24">
                                    <label className="text-xs text-primary dark:text-black">
                                      Size: <span className='uppercase'>{itemData?.size}</span>
                                    </label>
                                  </div>
                                  <div className="w-full">
                                    <label className="text-xs text-primary dark:text-black">
                                      Qty: {itemData?.qty}
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pb-2 border-gray-300 border-dashed border-y">
                          <div className="flex items-end flex-1 px-3 py-2 pl-0 mt-1">
                            <label className="text-base font-bold text-primary">
                              Select Quantity
                            </label>
                          </div>
                          <div className="flex items-end px-3 py-2 pl-0 mt-1 ml-2">
                            <div className="flex items-end flex-1 px-3 py-2 mt-1 ml-2 text-sm border border-gray-200">
                              <label className="text-xs text-primary">
                                Qty:{' '}
                              </label>
                              <select
                                className="w-full px-1 text-xs bg-white sm:w-22 text-primary"
                                required
                                value={value}
                                onChange={handleChange}
                              >
                                <option value="0">Select</option>
                                {Array.from(Array(itemData?.qty).keys())
                                  ?.map((x: number) => x + 1)
                                  ?.map((qty: any, idx: number) => (
                                    <option key={idx} value={qty}>
                                      {qty}
                                    </option>
                                  ))}
                              </select>
                            </div>
                          </div>
                        </div>
                        <div className="w-full py-4">
                          {value > 0 ? (
                            <button
                              type="button"
                              onClick={() => {
                                onCancelReason()
                                hideCancellationReasons()
                              }}
                              className="block w-full px-12 py-3 font-semibold text-center text-white bg-black border hover:bg-gray-800 text-14 link-btn"
                            >
                              {PROCEED_TO_CANCEL}
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="block w-full px-12 py-3 font-semibold text-center text-white bg-black border hover:bg-gray-800 text-14 link-btn"
                            >
                              {PROCEED_TO_CANCEL}
                            </button>
                          )}
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* cancel section start */}
          <div
            className="w-full"
            style={{ display: showCancellationReasons ? 'block' : 'none' }}
          >
            <div className="px-6 py-4 mb-4 border-b mob-header sm:hidden">
              <h3 className="max-w-4xl mx-auto text-xl font-semibold text-black">
                <a className="mr-2 leading-none" href="/my-account">
                  <i className="sprite-icon sprite-left-arrow"></i> Reason for
                  Cancellation
                </a>
              </h3>
            </div>
            <CancelReason
              cancellationReasons={cancellationReasons}
              onItemCancellation={itemCancelled}
              item={itemData}
              cancelTitle="Item"
              qty={value}
              cancelLoadingState={cancelLineItemLoading}
              hideCancellationReasons={hideCancellationReasons}
            />
          </div>
        </>
      )}

      <ConfirmDialog />
    </>
  )
}

export async function getServerSideProps(context: any) {
  const ids = context?.query?.ids
  return {
    props: {
      orderId: ids?.length > 0 ? ids[0] : EmptyGuid,
      itemId: ids?.length > 1 ? ids[1] : EmptyGuid,
    }, // will be passed to the page component as props
  }
}

OrderCancel.Layout = Layout