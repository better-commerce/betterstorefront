// Base Imports
import { useEffect, useState } from 'react'

// Package Imports
import axios from 'axios'
import { groupBy } from 'lodash'

// Component Imports
import OrderDetail from './OrderDetail'
import OrderLines from './OrderLines'
import DeliveryOrderLines from './DeliveryOrderLines'
import { useUI } from '@components//ui/context'
import InfiniteScroll from '@components//ui/InfiniteScroll'

// Other Imports
import {
  NEXT_GET_ORDERS,
  NEXT_GET_ORDER_DETAILS,
} from '@components//utils/constants'
import Spinner from '@components//ui/Spinner'
import Link from 'next/link'
import { matchStrings } from '@framework/utils/parse-util'
import OrdersListView from './OrdersListView'
import React from 'react'

export default function B2BOrders({
  //   allOrders,
  selectedOption,
  //   handleInfiniteScroll,
  deviceInfo,
  isShowDetailedOrder,
  setIsShowDetailedOrder,
  isAdmin,
  userOrderIdMap,
}: any) {
  const PAGE_SIZE = 10
  const { isMobile, isIPadorTablet } = deviceInfo
  const { user, displayAlert, alertRibbon } = useUI()
  const [orderDetails, setOrderDetails] = useState<any>(undefined)
  const [ordersList, setOrdersList] = useState<any>(null)
  const [allOrders, setAllOrders] = useState<Array<any> | undefined>(undefined)
  const [pagedOrders, setPagedOrders] = useState<Array<any>>()
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [allOrderIds, setAllOrderIds] = useState<Array<string> | undefined>(
    undefined
  )
  const [allOrdersFetched, setAllOrdersFetched] = useState<boolean>(false)
  useEffect(() => {
    if (allOrdersFetched) {
      setAllOrderIds(pagedOrders?.map((x: any) => x?.id))
    } else {
      fetchOrders(pageNumber)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allOrdersFetched])

  useEffect(() => {
    setAllOrdersFetched(false)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber])

  const findUserIdByOrderId = (IdMapArray: any, orderId: any) => {
    if (IdMapArray) {
      for (const data of IdMapArray) {
        const { userId, orders } = data
        const foundOrder = orders.find((order: any) => order === orderId)
        if (foundOrder) {
          return userId
        }
      }
    }
    return null
  }

  useEffect(() => {
    if (allOrderIds?.length) {
      allOrderIds?.forEach((id: string, index: number) => {
        let userMappedId = findUserIdByOrderId(userOrderIdMap, id)
        handleFetchOrderDetails(
          id,
          userMappedId ? userMappedId : user?.userId
        ).then((orderDetails: any) => {
          const newOrders = pagedOrders?.map((obj: any) =>
            matchStrings(obj?.id, id, true)
              ? Object.assign(obj, { orderDetails: orderDetails })
              : obj
          )
          setPagedOrders(newOrders)
          setAllOrders((allOrders ?? [])?.concat(newOrders))
        })
      })
    } else {
      if (allOrderIds !== undefined) {
        setAllOrders([])
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allOrderIds])

  const fetchOrders = async (pageNumber: number) => {
    const { data: ordersResult }: any = await axios.post(NEXT_GET_ORDERS, {
      id: user?.userId,
      hasMembership: user?.hasMembership,
      pageNumber: pageNumber,
      pageSize: PAGE_SIZE,
    })

    setPagedOrders(ordersResult)
    setAllOrdersFetched(true)
  }

  const handleInfiniteScroll = () => {
    //alert(pageNumber)
    setPageNumber(pageNumber + 1)
  } //TILL HERE DONE

  const handleFetchOrderDetails = async (id: any, userId: any) => {
    const { data: orderDetails }: any = await axios.post(
      NEXT_GET_ORDER_DETAILS,
      {
        id: userId,
        orderId: id,
      }
    )
    return orderDetails
  }

  const fetchOrderDetails = async (id: any) => {
    const { orderDetails } = allOrders?.find((order: any) => order.id === id)
    setOrderDetails(orderDetails)
  }

  const onOrderDetail = async (id: any) => {
    await fetchOrderDetails(id)
  }

  useEffect(() => {
    allOrders?.forEach((orderObj: any) => {
      // remove personalization from order items
      if (!!orderObj?.orderDetails?.order?.items?.length) {
        orderObj.orderDetails.order.items =
          orderObj.orderDetails.order.items.filter(
            (o: any) => o.name !== 'Personalization'
          )
      }
      // remove personalization from order delivery plans items
      if (!!orderObj?.orderDetails?.order?.deliveryPlans?.length) {
        orderObj.orderDetails.order.deliveryPlans =
          orderObj.orderDetails.order.deliveryPlans.map((o: any) => {
            o.items = o.items.filter(
              (o: any) => o.productName !== 'Personalization'
            )
            return o
          })
      }
    })
  }, [allOrders])

  useEffect(() => {
    if (allOrders) {
      setOrdersList(allOrders)
    }
  }, [allOrders])

  let deviceCheck = ''
  if (isMobile || isIPadorTablet) {
    deviceCheck = 'Mobile'
  } else {
    deviceCheck = 'Desktop'
  }
  const trackPackage = (order: any) => {
    // recordGA4Event('track_package', {
    //   transaction_id: order?.payments?.id,
    //   device: deviceCheck
    // });
  }

  const alertBgColor = (type: string) => {
    switch (type) {
      case 'error':
        return 'bg-ribbon-red capitalize'

      case 'success':
        return 'bg-ribbon-green capitalize'

      case 'cancel':
        return 'bg-ribbon-cancel'
    }
  }

  return (
    <>
      <OrdersListView
        isShowDetailedOrder={isShowDetailedOrder}
        alertRibbon={alertRibbon}
        displayAlert={displayAlert}
        isIPadorTablet={isIPadorTablet}
        isMobile={isMobile}
        alertBgColor={alertBgColor}
        ordersList={ordersList}
        trackPackage={trackPackage}
        onOrderDetail={onOrderDetail}
        handleInfiniteScroll={handleInfiniteScroll}
        setIsShowDetailedOrder={setIsShowDetailedOrder}
        deviceInfo={deviceInfo}
        orderDetails={orderDetails}
      />
      {/* {isShowDetailedOrder ? (
        <div id="OrderDetail" className="w-full">
          <OrderDetail
            show={isShowDetailedOrder}
            showDetailedOrder={setIsShowDetailedOrder}
            details={orderDetails}
            deviceInfo={deviceInfo}
          />
        </div>
      ) : (
        <>
          <div className="bg-white">
            <main className="lg:px-8">
              <div className="max-w-4xl">
                {!allOrders ? (
                  <Spinner />
                ) : (
                  <>
                    {ordersList?.length > 0 ? (
                      <>
                        <section
                          aria-labelledby="recent-heading"
                          className="mt-2 pt-5"
                        >
                          <h2 id="recent-heading" className="sr-only">
                            {translate('label.orderDetails.recentOrdersText')}
                          </h2>
                          <div className="w-full mx-auto overflow-hidden sm:px-4 lg:px-0 paged-orders">
                            <InfiniteScroll
                              fetchData={handleInfiniteScroll}
                              total={
                                ordersList?.length
                                  ?ordersList[0]?.totalRecord
                                  : 0
                              }
                              currentNumber={ordersList?.length}
                              component={ordersList?.map((order: any) => {
                                const groups: any = groupBy(
                                  order?.itemsBasic,
                                  'category'
                                )
                                return (
                                  <>
                                    {order?.orderDetails?.order?.deliveryPlans
                                      ?.length > 0 ? (
                                      <>
                                        {order?.orderDetails?.order?.deliveryPlans.map(
                                          (item: any, idx: number) => (
                                            <>
                                              <a
                                                onClick={async () => {
                                                  await onOrderDetail(order.id)
                                                  setIsShowDetailedOrder(true)
                                                }}
                                                className="inline-block w-full mb-6 border cursor-pointer"
                                                key={idx}
                                              >
                                                <DeliveryOrderLines
                                                  groups={groups}
                                                  trackPackage={trackPackage}
                                                  order={order}
                                                  item={item}
                                                  idx={idx}
                                                />
                                              </a>
                                            </>
                                          )
                                        )}
                                      </>
                                    ) : (
                                      <>
                                        <a
                                          onClick={async () => {
                                            await onOrderDetail(order.id)
                                            setIsShowDetailedOrder(true)
                                          }}
                                          className="inline-block w-full mb-6 border cursor-pointer"
                                          key={order.orderNo}
                                        >
                                          <OrderLines
                                            groups={groups}
                                            trackPackage={trackPackage}
                                            order={order}
                                            item={order}
                                            idx=""
                                          />
                                        </a>
                                      </>
                                    )}
                                  </>
                                )
                              })}
                            />
                            {ordersList[0].totalRecord > 10 &&
                              ordersList[0].totalRecord > ordersList?.length && ( 
                                <div className="flex justify-center flex-1 mx-auto">
                                  <button
                                    className="px-6 py-2 font-semibold text-center text-gray-700 bg-gray-100 border border-gray-200 text-14 hover:bg-gray-800 hover:text-white"
                                    onClick={handleInfiniteScroll}
                                  >
                                    Load More
                                  </button>
                                </div>
                              )}
                          </div>
                        </section>
                      </>
                    ) : (
                      <>
                        <div className="flex flex-col lg:mx-8 w-full px-4 py-12 max-acc-container sm:px-0">
                          <h1 className="my-2 text-2xl font-semibold text-black">
                            No Order Available
                          </h1>
                          <div className="flex w-60 mt-5 sm:flex-col">
                            <Link legacyBehavior passHref href="/">
                              <a className="w-full flex items-center justify-center px-4 py-3 -mr-0.5 rounded-sm sm:px-6 link-button btn-primary">
                                Start Shopping
                              </a>
                            </Link>
                          </div>
                        </div>
                      </>
                    )}
                  </>
                )}

                {(isMobile || isIPadorTablet) && (
                  <div className="sticky bottom-0 z-50 p-0 sm:px-0">
                    {displayAlert ? (
                      <div className="mb-3 mt-3 m-[-20px] w-auto">
                        <div
                          className={`${alertBgColor(
                            alertRibbon?.type
                          )} justify-center w-full px-10 py-4 text-center align-center`}
                        >
                          <h4
                            className={`text-16 font-medium ${
                              alertRibbon?.type == 'cancel'
                                ? 'text-[#c10000]'
                                : 'text-[#fff]'
                            }`}
                          >
                            {alertRibbon?.msg}
                          </h4>
                        </div>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            </main>
          </div>
        </>
      )} */}
    </>
  )
}
