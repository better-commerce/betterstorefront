import Spinner from '@new-components/ui/Spinner'
import { groupBy } from 'lodash'
import Link from 'next/link'
import React from 'react'
import { isMobile } from 'react-device-detect'
import InfiniteScroll from '@new-components/ui/InfiniteScroll'
import { useRouter } from 'next/router'
import DeliveryOrderLines from './DeliveryOrderLines'
import OrderDetail from './OrderDetail'
import OrderLines from './OrderLines'
import { useTranslation } from '@commerce/utils/use-translation'

function OrdersListView({
  isShowDetailedOrder,
  alertRibbon,
  displayAlert,
  isIPadorTablet,
  isMobile,
  alertBgColor,
  ordersList,
  trackPackage,
  onOrderDetail,
  handleInfiniteScroll,
  setIsShowDetailedOrder,
  deviceInfo,
  orderDetails,
}: any) {
  const translate = useTranslation()
  const router = useRouter();
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
          <div className="bg-white">
            <main className="">
              <div className="max-w-4xl">
                {!ordersList ? (
                  <Spinner />
                ) : (
                  <>
                    {ordersList?.length > 0 ? (
                      <>
                        <section aria-labelledby="recent-heading" className="pt-5 mt-2" >
                          <h2 id="recent-heading" className="sr-only"> {translate('label.orderDetails.recentOrdersText')} </h2>
                          <div className="w-full mx-auto overflow-hidden sm:px-4 lg:px-0 paged-orders">
                            <InfiniteScroll
                              fetchData={handleInfiniteScroll}
                              total={
                                ordersList?.length
                                  ? ordersList[0]?.totalRecord
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
                                                  router.push(`/my-account/orders/${order?.id}`)
                                                  // await onOrderDetail(order.id)
                                                }}
                                                className="inline-block w-full mb-6 border cursor-pointer rounded-2xl"
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
                                            router.push(`/my-account/orders/${order?.id}`)
                                            await onOrderDetail(order.id)
                                            // setIsShowDetailedOrder(true)
                                          }}
                                          className="inline-block w-full mb-6 border cursor-pointer rounded-2xl"
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
                              ordersList[0].totalRecord >
                                ordersList?.length && (
                                <div className="flex justify-center flex-1 mx-auto">
                                  <button
                                    className="px-6 py-2 font-semibold text-center text-gray-700 bg-gray-100 border border-gray-200 text-14 hover:bg-gray-800 hover:text-white"
                                    onClick={handleInfiniteScroll}
                                  >
                                    {translate('common.label.loadMoreBtnText')} </button>
                                </div>
                              )}
                          </div>
                        </section>
                      </>
                    ) : (
                      <>
                        <div className="flex flex-col w-full px-4 py-12 max-acc-container sm:px-0">
                          <h1 className="my-2 text-2xl font-semibold text-black">
                            {translate('label.orderDetails.noOrderFoundHeadingText')} </h1>
                          <div className="flex mt-5 w-60 sm:flex-col">
                            <Link legacyBehavior passHref href="/">
                              <a className="w-full flex items-center justify-center px-4 py-3 -mr-0.5 rounded-sm sm:px-6 link-button btn-primary">
                                {translate('label.orderDetails.startShoppingBtnText')} </a>
                            </Link>
                          </div>
                        </div>
                      </>
                    )}
                  </>
                )}

                {(isMobile || isIPadorTablet) && (
                  <div className="sticky bottom-0 z-50 p-0 sm:px-0">
                    {displayAlert && (
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
                    )}
                  </div>
                )}
              </div>
            </main>
          </div>
        </>
      )}
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
                {!ordersList ? (
                  <Spinner />
                ) : (
                  <>
                    {ordersList?.length > 0 ? (
                      <>
                        <section
                          aria-labelledby="recent-heading"
                          className="pt-5 mt-2"
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
                        <div className="flex flex-col w-full px-4 py-12 lg:mx-8 max-acc-container sm:px-0">
                          <h1 className="my-2 text-2xl font-semibold text-black">
                            No Order Available
                          </h1>
                          <div className="flex mt-5 w-60 sm:flex-col">
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

export default OrdersListView
