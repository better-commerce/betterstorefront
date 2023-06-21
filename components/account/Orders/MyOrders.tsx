// Base Imports
import { useEffect, useState } from 'react'

// Package Imports
import axios from 'axios'
import { groupBy } from 'lodash'

// Component Imports
import OrderDetail from './OrderDetail'
import OrderLines from './OrderLines'
import DeliveryOrderLines from './DeliveryOrderLines'
import { useUI } from '@components/ui/context'
import InfiniteScroll from '@components/ui/InfiniteScroll'

// Other Imports
import { GENERAL_RECENT_ORDERS } from '@components/utils/textVariables'
import { NEXT_GET_ORDER_DETAILS } from '@components/utils/constants'
import Spinner from '@components/ui/Spinner'
import Link from 'next/link'

export default function MyOrders({
  allOrders,
  handleInfiniteScroll,
  deviceInfo,
  isShowDetailedOrder, setIsShowDetailedOrder 
}: any) {
  const { isMobile, isIPadorTablet } = deviceInfo
  const { user, displayAlert, alertRibbon } = useUI()
  const [orderDetails, setOrderDetails] = useState<any>(undefined)
  // console.log(allOrders)

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

  const fetchOrderDetails = async (id: any) => {
    const { orderDetails } = allOrders.find((order: any) => order.id === id)
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
      {isShowDetailedOrder ? (
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
          {/* <div className='px-2 py-4 mb-4 border-b mob-header md:hidden full-m-header'>
            <h3 className='max-w-4xl mx-auto text-xl font-semibold text-black'>
              <Link href="/my-account" className='mr-2 leading-none'>
                <i className='sprite-icon sprite-left-arrow'></i>
              </Link>
              My Orders
            </h3>
          </div> */}

          <div className="bg-white">
            <main className="lg:px-8">
              <div className="max-w-4xl">
                {!allOrders ? (
                  <Spinner />
                ) : (
                  <>
                    {allOrders?.length > 0 ? (
                      <>
                        <section
                          aria-labelledby="recent-heading"
                          className="mt-2"
                        >
                          <h2 id="recent-heading" className="sr-only">
                            {GENERAL_RECENT_ORDERS}
                          </h2>
                          <div className="w-full mx-auto overflow-hidden sm:px-0 lg:px-0 paged-orders">
                            <InfiniteScroll
                              fetchData={handleInfiniteScroll}
                              total={
                                allOrders?.length
                                  ? allOrders[0]?.totalRecord
                                  : 0
                              }
                              currentNumber={allOrders?.length}
                              component={allOrders?.map((order: any) => {
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
                            {allOrders[0]?.totalRecord > 10 &&
                              allOrders[0]?.totalRecord > allOrders?.length && (
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
      )}
    </>
  )
}
