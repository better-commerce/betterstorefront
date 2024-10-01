// Base Imports
import React, { useEffect, useState } from 'react'
import NextHead from 'next/head'

// Package Imports
import moment from 'moment'
import { useRouter } from 'next/router'
import axios from 'axios'

// Component Imports
import OrderStatusMapping from '@components/account/Orders/OrderStatusMapping'
import OrderLog from '@components/account/Orders/OrderLog'
import OrderDetailHeader from '@components/account/Orders/OrderDetailHeader'
import OrderItems from '@components/account/Orders/OrderItems'
import OrderSummary from '@components/account/Orders/OrderSummary'
import HelpModal from '@components/account/Orders/HelpModal'
import OrderReviewModal from '@components/account/Orders/OrderReviewModal'
import OrderDeliveryPlanItems from '@components/account/Orders/OrderDeliveryPlanItems'
import { Disclosure } from '@headlessui/react'
import { useTranslation } from '@commerce/utils/use-translation'
import Spinner from '@components/ui/Spinner'
import {
    EmptyObject,
    NEXT_BULK_ADD_TO_CART,
  } from '@components/utils/constants'

// Other Imports
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { PaymentStatus } from '@components/utils/payment-constants'
import { DATE_FORMAT, NEXT_GET_ORDER, NEXT_GET_ORDER_DETAILS, SITE_ORIGIN_URL } from '@components/utils/constants'
import { useUI } from '@components/ui'
import { isB2BUser, notFoundRedirect, vatIncluded } from '@framework/utils/app-util'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import withAuth from '@components/utils/withAuth'
import { GetServerSideProps } from 'next'
import { matchStrings } from '@framework/utils/parse-util'
import LayoutAccount from '@components/Layout/LayoutAccount'
import { IPagePropsProvider } from '@framework/contracts/page-props/IPagePropsProvider'
import { getPagePropType, PagePropType } from '@framework/page-props'
import useAnalytics from '@components/services/analytics/useAnalytics'
import { EVENTS_MAP } from '@components/services/analytics/constants'
import { AnalyticsEventType } from '@components/services/analytics'

function OrderDetail({ deviceInfo }: any) {
    const { recordAnalytics } = useAnalytics()
    const router: any = useRouter();
    const { user, setCartItems, openCart, basketId } = useUI();
    const translate = useTranslation();
    const { isMobile, isIPadorTablet } = deviceInfo
    const [isHelpOpen, setIsHelpOpen] = useState(false)
    const [isHelpOrderOpen, setIsHelpOrderOpen] = useState(false)
    const [isHelpStatus, setIsHelpStatus] = useState<any>()
    const [data, setData] = useState<any>(undefined)
    const [isSubmitReview, setSubmitReview] = useState<any>(false)
    const [isReviewdata, setReviewData] = useState<any>()
    const [orderData, setOrderData] = useState<any>(null)
    const [returnRequestedItems, setReturnRequestedItems] = useState({})
    let isB2B: any = isB2BUser(user);

    const fetchOrderDetailById = async (id: any) => {
        if (!id) return
        try {
            if (isB2B) {
                const { data }: any = await axios.post(NEXT_GET_ORDER, {
                    id
                })
                setOrderData(data?.order)
            } else {
                const { data }: any = await axios.post(NEXT_GET_ORDER_DETAILS, {
                    id: user?.userId,
                    orderId: id,
                })
                setOrderData(data?.order)
            }
        } catch (error) {
            setOrderData({})
            router.push('/404')
        }
    }

    recordAnalytics(AnalyticsEventType.ORDER_PAGE_VIEWED, {
        entityName: PAGE_TYPES.OrderDetail,
        entityType: EVENTS_MAP.ENTITY_TYPES.Page,
        eventType: AnalyticsEventType.ORDER_PAGE_VIEWED,
    })

    useEffect(() => {
        const orderId = router.query?.orderId[0]
        fetchOrderDetailById(orderId)
    }, [router.query])

    useEffect(() => {
        // need to map the "isRMACreated" field to control return item status/cta
        console.log()
        if (orderData?.items?.length > 0) {
            const mapOrderLineItemObj = orderData?.items?.reduce(
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
    }, [orderData])

    const isConfirmedOrder = () => {
        if (orderData?.payments?.length) {
            const payment = orderData?.payments?.find((x: any) => x?.isValid)
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
        orderData?.orderLog
            ?.map((x: any) => x?.updateType)
            .includes('UpdateOrderLine') ||
        orderData?.orderLog
            ?.map((x: any) => x?.updateType)
            .includes('RefundGenerated') ||
        orderData?.orderLog
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
            debugger
            recordAnalytics(AnalyticsEventType.HELP_ICON, { helpMode: 'cancel/return/exchange/chat', deviceCheck })
        }
    }

    const chooseHelpMode = (mode: any) => {
        if (typeof window !== 'undefined')
            debugger
        recordAnalytics(AnalyticsEventType.HELP_SIDEBAR_MENU, { mode, deviceCheck, })
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
            debugger
        recordAnalytics(AnalyticsEventType.NEED_HELP_WITH_ORDER, { deviceCheck, })
    }

    const closeOrderHelpModal = () => {
        setIsHelpOrderOpen(false)
    }

    const onCancelItem = async (mode: any) => {
        router.push(`/my-account/cancel-order-item/${data?.orderId}/${data?.itemId}`)
        if (typeof window !== 'undefined') {
            debugger
            recordAnalytics(AnalyticsEventType.PROCEED_TO_CANCEL_ITEM, EmptyObject)
            recordAnalytics(AnalyticsEventType.HELP_SIDEBAR_MENU, { mode, deviceCheck, })
        }
    }
    const onCancelOrder = async (mode: any) => {
        router.push(`/my-account/cancel-order/${data?.orderId}`)
        if (typeof window !== 'undefined') {
            debugger
            recordAnalytics(AnalyticsEventType.PROCEED_TO_CANCEL_ORDER, EmptyObject)
            recordAnalytics(AnalyticsEventType.HELP_SIDEBAR_MENU, { mode, deviceCheck, })
        }
    }
    const onReturnItem = async (mode: any) => {
        router.push(`/my-account/return-order/${data?.orderId}/${data?.itemId}`)
        if (typeof window !== 'undefined') {
            debugger
            recordAnalytics(AnalyticsEventType.PROCEED_TO_RETURN, EmptyObject)
            recordAnalytics(AnalyticsEventType.HELP_SIDEBAR_MENU, { mode, deviceCheck, })
        }
    }
    const onExchangeItem = async (mode: any) => {
        router.push(`/my-account/exchange-order/${data?.orderId}/${data?.itemId}`)
        if (typeof window !== 'undefined') {
            debugger
            recordAnalytics(AnalyticsEventType.PROCEED_TO_EXCHANGE, EmptyObject)
            recordAnalytics(AnalyticsEventType.TRACK_PACKAGE, { details: orderData, deviceCheck, })
            recordAnalytics(AnalyticsEventType.HELP_SIDEBAR_MENU, { mode, deviceCheck, })
        }
    }
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    // @ts-ignore
    // console.log('ENTIRE_ORDER_LOG_SORTED', orderData?.orderLog.sort((a:any,b:any) => new Date(a?.created) - new Date(b?.created)))
    // console.log('ENTIRE_ORDER_', orderData)
    const trackPackage = (orderData: any) => {
        if (typeof window !== 'undefined') {
            debugger
            recordAnalytics(AnalyticsEventType.PROCEED_TO_EXCHANGE, EmptyObject)
        }
    }
    const isIncludeVAT = vatIncluded()
    const subTotalAmount = isIncludeVAT
        ? (
            orderData?.subTotal?.raw?.withTax -
            orderData?.discount?.raw?.withTax
        ).toFixed(2)
        : (
            orderData?.subTotal?.raw?.withoutTax -
            orderData?.discount?.raw?.withoutTax
        ).toFixed(2)


        const handleReOrder = async () => {
            const computedProducts = orderData?.items?.reduce((acc: any, obj: any) => {
              acc.push({
                ProductId: obj?.recordId || obj?.productId,
                Qty: obj?.qty || 1,
                StockCode: obj?.stockCode,
                ProductName: obj?.name,
                ManualUnitPrice: obj?.manualUnitPrice || 0.0,
              })
              return acc
            }, [])
            const newCart = await axios.post(NEXT_BULK_ADD_TO_CART, {
              basketId,
              products: computedProducts,
            })
            if (newCart?.data) {
              setCartItems(newCart?.data)
              openCart()
            }
          }
    return (
        <>
            {
                !orderData ? <> <Spinner /> </>
                    : <>
                        <NextHead>
                            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
                            <link rel="canonical" href={SITE_ORIGIN_URL + router.asPath} />
                            <title>Order Detail : {orderData?.orderNo}</title>
                            <meta name="title" content={`Order Detail : ${orderData?.orderNo}`} />
                            <meta name="description" content={`Order Detail : ${orderData?.orderNo}`} />
                            <meta name="keywords" content={`Order Detail : ${orderData?.orderNo}`} />
                            <meta property="og:image" content="" />
                            <meta property="og:title" content={`Order Detail : ${orderData?.orderNo}`} key="ogtitle" />
                            <meta property="og:description" content={`Order Detail : ${orderData?.orderNo}`} key="ogdesc" />
                        </NextHead>
                        <div className='w-full bg-white'>
                            <h1 className='sr-only'>Order Detail : {orderData?.orderNo}</h1>
                            <div className=''> <OrderDetailHeader details={orderData} showDetailedOrder={true} />
                                <div className="w-full">
                                    {orderData?.deliveryPlans?.length > 0 ? (
                                        <OrderDeliveryPlanItems items={orderData?.deliveryPlans} details={orderData} trackPackage={trackPackage} ifCancelled={ifCancelled} openHelpModal={openHelpModal} setReview={setReview} />
                                    ) : (
                                        <>
                                            <div className="flex items-center justify-end w-full pb-2 border-b border-gray-300 border-dashed">
                                                <OrderStatusMapping orderStatusDisplay={orderData?.orderStatusDisplay} orderStatusRag={orderData?.orderStatusRag} />
                                            </div>
                                            <div className="w-full px-0 border-b border-gray-300 border-dashed order-track">
                                                <Disclosure defaultOpen>
                                                    {({ open }) => (
                                                        <>
                                                            {orderData?.showETA && (
                                                                <Disclosure.Button className="flex items-center justify-between w-full py-3">
                                                                    <p className="text-sm font-medium text-black">
                                                                        <span>
                                                                            {translate('label.orderSummary.generalETAText')}{' '}
                                                                            {moment(new Date(orderData?.dueDate)).format(DATE_FORMAT)}
                                                                        </span>
                                                                    </p>
                                                                    <button className="border border-gray-900 rounded-full">
                                                                        <ChevronDownIcon className={`w-4 h-4 ${open && 'rotate-180 transform'}`} />
                                                                    </button>
                                                                </Disclosure.Button>
                                                            )}
                                                            <Disclosure.Panel className="px-0 pt-4 pb-2 text-sm text-gray-500">
                                                                <OrderLog orderLog={orderData?.orderLog} orderJourney={orderData?.orderJourney} />
                                                            </Disclosure.Panel>
                                                        </>
                                                    )}
                                                </Disclosure>
                                            </div>
                                            {orderData?.allowedToTrack && (
                                                <div className="w-full px-0 py-4 mb-4 border-b border-gray-300 border-dashed">
                                                    <div className="flex flex-col w-full">
                                                        <span
                                                            onClick={() => trackPackage(orderData)}
                                                            className="font-semibold text-orange-500 cursor-pointer text-14"
                                                        >
                                                            {translate('label.orderDetails.trackingDetailsBtnText')} </span>
                                                    </div>
                                                </div>
                                            )}
                                            <OrderItems items={orderData?.items} details={orderData} ifCancelled={ifCancelled} openHelpModal={openHelpModal} setReview={setReview} />
                                        </>
                                    )}
                                </div>
                                <OrderSummary details={orderData} subTotalAmount={subTotalAmount} openOrderHelpModal={openOrderHelpModal} handleReOrder={handleReOrder}   />
                            </div>
                        </div>
                        <HelpModal details={orderData} isHelpOpen={isHelpOpen} closeHelpModal={closeHelpModal} isHelpStatus={isHelpStatus} chooseHelpMode={chooseHelpMode} onExchangeItem={onExchangeItem} onReturnItem={onReturnItem} onCancelItem={onCancelItem} onCancelOrder={onCancelOrder} isHelpOrderOpen={isHelpOrderOpen} closeOrderHelpModal={closeOrderHelpModal} returnRequestedItems={returnRequestedItems} />
                        <OrderReviewModal isSubmitReview={isSubmitReview} setSubmitReview={setSubmitReview} isReviewdata={isReviewdata} />
                    </>
            }
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (context: any) => {
    const { locale } = context;
    if (matchStrings(locale, context?.query?.orderId[0])) {
        return notFoundRedirect();
    }
    const props: IPagePropsProvider = getPagePropType({ type: PagePropType.COMMON })
    const pageProps = await props.getPageProps({ cookies: context?.req?.cookies })

    return {
        props: {
            ...pageProps,
        }
    }
}

OrderDetail.LayoutAccount = LayoutAccount

export default withDataLayer(withAuth(OrderDetail), PAGE_TYPES.OrderDetail, true, LayoutAccount)
