// Base Imports
import { useEffect, useState } from 'react'
import { Layout } from '@components/common'

// Package Imports
import axios from 'axios'
import Image from 'next/image'
import Router from 'next/router'
import Link from 'next/link'

// Component Imports
import CancelReason from '@components/account/Orders/CancelReason'
import ConfirmDialog from '@components/common/ConfirmModal/ConfirmDialog'

// Other Imports
import { Button, useUI } from '@components/ui'
import {
  NEXT_CANCEL_REASON,
  EmptyGuid,
  NEXT_GET_ORDER_DETAILS,
  NEXT_CANCEL_ORDER,
} from '@components/utils/constants'
import { CANCEL_ORDER, ORDER_CANCELLED, PROCEED_TO_CANCEL, REASON_CANCEL_HEADING } from '@components/utils/textVariables'
import Spinner from '@components/ui/Spinner'

declare const window: any

export default function OrderCancel({ orderId = EmptyGuid, deviceInfo, }: any) {
  const { user, setAlert, } = useUI()
  const [orderDetails, setOrderDetails] = useState<any>()
  const [itemDatas, setItemDatas] = useState<any>(undefined)
  const [itemData, setItemData] = useState<any>(undefined)
  const [showCancellationReasons, setShowCancellationReasons] = useState(false)
  const [cancellationReasons, setCancellationReasons] = useState<any>(undefined)

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

  const cancelOrder = async (data: any) => {
    try {
      const { data: orderCancelData }: any = await axios.post(
        NEXT_CANCEL_ORDER,
        data
      )
      return orderCancelData
    } catch (error) {
      // console.log('Error inside cancelOrder', error);
    }
  }

  const onCancelReason = () => {
    fetchCancellationReasons()
  }

  const [cancelLoading, setCancelLoading] = useState(false)

  const orderCancelled = async (reason: string) => {
    setCancelLoading(true)
    try {
      const response = await cancelOrder({ id: orderDetails?.order?.id })
      if (response) {
        setCancelLoading(false)
        setAlert({ type: 'cancel', msg: ORDER_CANCELLED })
        Router.push('/my-account/orders')
      }
    } catch (error) {
      setCancelLoading(false)
    }
  }

  useEffect(() => {
    const handleAsync = async () => {
      const orderDetails = await handleFetchOrderDetails(orderId)

      if (orderDetails?.order?.items?.length) {
        setOrderDetails(orderDetails)
        setItemData(
          orderDetails?.order?.items?.length > 0
            ? orderDetails?.order?.items
            : []
        )

        const itemsDatasNew =
          orderDetails?.order?.items?.length > 0
            ? orderDetails?.order?.items
            : [];
        setItemDatas(itemsDatasNew)
        setItemData(
          itemsDatasNew?.length > 0
            ? itemsDatasNew?.filter((x: any) => x.statusDisplay == null)
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
          {/* cancel section start */}
          <div
            className="w-full cancel-section"
            style={{ display: showCancellationReasons ? 'none' : 'block' }}
          >
            <div className="px-6 py-4 mb-4 border-b mob-header sm:hidden">
              <a href="/my-account/orders">
                <h3 className="max-w-4xl mx-auto text-xl font-semibold text-gray-900">
                  <i className="sprite-icon sprite-left-arrow mr-2"></i> {CANCEL_ORDER}
                </h3>
              </a>
            </div>

            <div className="mx-auto cancel-continer">
              <a href="/my-account/orders" className='mobile-view'>
                <h4 className="mr-2 leading-none text-xl text-gray-900 uppercase font-bold">
                  <i className="sprite-icon sprite-left-arrow mr-2"></i> {CANCEL_ORDER}
                </h4>
              </a>
              <div className="w-full">
                <div className="px-0 mt-4">
                  <div className="flow-root">
                    <ul role="list" className="-my-6 divide-y divide-gray-200">
                      {itemData?.map((item: any, itemId: number) => (
                        <>
                          <li className="px-0 pb-2 my-4" key={itemId}>
                            <div className="flex gap-3 py-6 sm:gap-6 max-w-fit">
                              <div className="flex-shrink-0">
                                <Image
                                  width={72}
                                  height={128}
                                  src={item?.image}
                                  alt="image"
                                  className="basket-image"
                                />
                              </div>
                              <div className="flex flex-col flex-1">
                                <div>
                                  <div className="flex flex-col justify-between font-medium text-gray-900">
                                    <div className="flex items-center justify-between">
                                      <p className="font-medium uppercase text-sm">
                                        {item?.categoryItems[0]?.categoryName}
                                      </p>
                                    </div>
                                    <h3 className='pr-6 mt-2'>
                                      <Link href={`/${item?.slug}`} passHref className="font-semibold text-md dark:text-gray-900">
                                        {item?.name}
                                      </Link>
                                    </h3>
                                    <p className="mt-2 text-sm font-medium">
                                      {item?.price?.formatted?.withTax}
                                    </p>
                                    <div className="flex mt-3 text-sm">
                                      <div className="w-24">
                                        <label className="font-medium dark:text-gray-900">
                                          Size: {item?.size}
                                        </label>
                                      </div>
                                      <div className="w-full">
                                        <label className="font-medium dark:text-gray-900">
                                          Qty: {item?.qty}
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </li>
                        </>
                      ))}
                    </ul>
                    <div className="w-full py-4">
                      <Button
                        variant='slim'
                        onClick={() => {
                          onCancelReason()
                          hideCancellationReasons()
                        }}
                        type='button'
                      >
                        <span className='block py-1 font-bold'>
                          {PROCEED_TO_CANCEL}
                        </span>
                      </Button>
                    </div>
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
              <a className="block mr-2 leading-none" href="#" onClick={(e) => {
                e.preventDefault()
                hideCancellationReasons()
              }}>
                <h3 className="max-w-4xl mx-auto text-xl font-semibold text-gray-900">
                  <i className="sprite-icon sprite-left-arrow mr-2"></i> {REASON_CANCEL_HEADING}
                </h3>
              </a>
            </div>
            <CancelReason
              cancellationReasons={cancellationReasons}
              item={itemData}
              onItemCancellation={orderCancelled}
              cancelTitle="Order"
              cancelLoadingState={cancelLoading}
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
