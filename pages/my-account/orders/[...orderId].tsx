// Base Imports
import React, { useEffect, useState } from 'react'
import NextHead from 'next/head'
// Package Imports
import moment from 'moment'
import { useRouter } from 'next/router'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { Disclosure } from '@headlessui/react'

// Component Imports
import OrderStatusMapping from '@components/account/Orders/OrderStatusMapping'
import { useTranslation } from '@commerce/utils/use-translation'
// Other Imports
import { PaymentStatus } from '@new-components/utils/payment-constants'
import { BETTERCOMMERCE_DEFAULT_LANGUAGE, DATE_FORMAT, NEXT_GET_ORDER, NEXT_GET_ORDER_DETAILS, SITE_ORIGIN_URL } from '@new-components/utils/constants'
// import getCustomerOrderDetail from '@framework/checkout/customer-order-orderData'
import { useUI } from '@new-components/ui'

// import { recordGA4Event } from '@new-components/services/analytics/ga4';
import OrderLog from '@components/account/Orders/OrderLog'
// import CartFreeGift from '@components/cart/CartSidebarView/FreeGift';
import OrderDetailHeader from '@components/account/Orders/OrderDetailHeader'
import OrderItems from '@components/account/Orders/OrderItems'
import OrderSummary from '@components/account/Orders/OrderSummary'
import HelpModal from '@components/account/Orders/HelpModal'
import OrderReviewModal from '@components/account/Orders/OrderReviewModal'
import OrderDeliveryPlanItems from '@components/account/Orders/OrderDeliveryPlanItems'
import { recordGA4Event } from '@new-components/services/analytics/ga4'
import { isB2BUser, notFoundRedirect, vatIncluded } from '@framework/utils/app-util'
import axios from 'axios'
import Spinner from '@new-components/ui/Spinner'
import Layout from '@new-components/Layout/Layout'
import withDataLayer, { PAGE_TYPES } from '@new-components/withDataLayer'
import withAuth from '@new-components/utils/withAuth'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetServerSideProps } from 'next'
import { matchStrings } from '@framework/utils/parse-util'

function OrderDetail({ deviceInfo }: any) {
    const router: any = useRouter();
    const { user } = useUI();
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
        router.push(`/my-account/cancel-order-item/${data?.orderId}/${data?.itemId}`)
        if (typeof window !== 'undefined') {
            recordGA4Event(window, 'proceed_to_cancel_item', {})
            recordGA4Event(window, 'help_sidebar_menu', {
                helpmode: mode,
                device: deviceCheck,
            })
        }
    }
    const onCancelOrder = async (mode: any) => {
        router.push(`/my-account/cancel-order/${data?.orderId}`)
        if (typeof window !== 'undefined') {
            recordGA4Event(window, 'proceed_to_cancel_order', {})
            recordGA4Event(window, 'help_sidebar_menu', {
                helpmode: mode,
                device: deviceCheck,
            })
        }
    }
    const onReturnItem = async (mode: any) => {
        router.push(`/my-account/return-order/${data?.orderId}/${data?.itemId}`)
        if (typeof window !== 'undefined') {
            recordGA4Event(window, 'proceed_to_return', {})
            recordGA4Event(window, 'help_sidebar_menu', {
                helpmode: mode,
                device: deviceCheck,
            })
        }
    }
    const onExchangeItem = async (mode: any) => {
        router.push(`/my-account/exchange-order/${data?.orderId}/${data?.itemId}`)
        if (typeof window !== 'undefined') {
            recordGA4Event(window, 'proceed_to_exchange', {})
            recordGA4Event(window, 'track_package', {
                transaction_id: orderData?.payments?.id,
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
    // console.log('ENTIRE_ORDER_LOG_SORTED', orderData?.orderLog.sort((a:any,b:any) => new Date(a?.created) - new Date(b?.created)))
    // console.log('ENTIRE_ORDER_', orderData)
    const trackPackage = (orderData: any) => {
        if (typeof window !== 'undefined')
            recordGA4Event(window, 'proceed_to_exchange', {})
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

    return (
        <>
            {
                !orderData
                    ?
                    <> <Spinner /> </>
                    : <>
                        <NextHead>
                            <meta
                                name="viewport"
                                content="width=device-width, initial-scale=1, maximum-scale=1"
                            />
                            <link rel="canonical" href={SITE_ORIGIN_URL + router.asPath} />
                            <title>Order Detail : {orderData?.orderNo}</title>
                            <meta
                                name="title"
                                content={`Order Detail : ${orderData?.orderNo}`}
                            />
                            <meta
                                name="description"
                                content={`Order Detail : ${orderData?.orderNo}`}
                            />
                            <meta
                                name="keywords"
                                content={`Order Detail : ${orderData?.orderNo}`}
                            />
                            <meta property="og:image" content="" />
                            <meta
                                property="og:title"
                                content={`Order Detail : ${orderData?.orderNo}`}
                                key="ogtitle"
                            />
                            <meta
                                property="og:description"
                                content={`Order Detail : ${orderData?.orderNo}`}
                                key="ogdesc"
                            />
                        </NextHead>
                        <div className="container w-full bg-white">
                            <div className='mt-14 sm:mt-20'>
                                <div className='max-w-4xl mx-auto'>
                                <OrderDetailHeader
                                details={orderData}
                                showDetailedOrder={true}
                            />

                            <div className="w-full py-6">
                                {orderData?.deliveryPlans?.length > 0 ? (
                                    <OrderDeliveryPlanItems
                                        items={orderData?.deliveryPlans}
                                        details={orderData}
                                        trackPackage={trackPackage}
                                        ifCancelled={ifCancelled}
                                        openHelpModal={openHelpModal}
                                        setReview={setReview}
                                    />
                                ) : (
                                    <>
                                        <div className="flex items-center justify-end w-full pb-4 border-b border-gray-300 border-dashed">
                                            <OrderStatusMapping
                                                orderStatusDisplay={orderData?.orderStatusDisplay}
                                                orderStatusRag={orderData?.orderStatusRag}
                                            />
                                        </div>
                                        <div className="px-4 order-track sm:px-16">
                                            <Disclosure defaultOpen>
                                                {({ open }) => (
                                                    <>
                                                        {orderData?.showETA && (
                                                            <Disclosure.Button className="flex items-center justify-between w-full py-3">
                                                                <p className="text-sm font-medium text-black">
                                                                    <span>
                                                                        {translate('label.orderSummary.generalETAText')}{' '}
                                                                        {moment(new Date(orderData?.dueDate)).format(
                                                                            DATE_FORMAT
                                                                        )}
                                                                    </span>
                                                                </p>
                                                                <button className="border border-gray-900 rounded-full">
                                                                    <ChevronDownIcon
                                                                        className={`w-4 h-4 ${open && 'rotate-180 transform'
                                                                            }`}
                                                                    />
                                                                </button>
                                                            </Disclosure.Button>
                                                        )}
                                                        <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                                                            <OrderLog
                                                                orderLog={orderData?.orderLog}
                                                                orderJourney={orderData?.orderJourney}
                                                            />
                                                        </Disclosure.Panel>
                                                    </>
                                                )}
                                            </Disclosure>
                                        </div>
                                        {orderData?.allowedToTrack && (
                                            <div className="w-full px-4 py-4 mb-4 border-b border-gray-300 border-dashed sm:px-16">
                                                <div className="flex flex-col w-full">
                                                    <span
                                                        onClick={() => trackPackage(orderData)}
                                                        className="font-semibold text-orange-500 cursor-pointer text-14"
                                                    >
                                                        {translate('label.orderDetails.trackingDetailsBtnText')} </span>
                                                </div>
                                            </div>
                                        )}
                                        <OrderItems
                                            items={orderData?.items}
                                            details={orderData}
                                            ifCancelled={ifCancelled}
                                            openHelpModal={openHelpModal}
                                            setReview={setReview}
                                        />
                                    </>
                                )}
                            </div>
                            <OrderSummary
                                details={orderData}
                                subTotalAmount={subTotalAmount}
                                openOrderHelpModal={openOrderHelpModal}
                            />
                                </div>
                            </div>                      
                        </div>

                        <HelpModal
                            details={orderData}
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
            }
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (context: any) => {
    const { locale } = context;
    if (matchStrings(locale, context?.query?.orderId[0])) {
        return notFoundRedirect();
    }
    return {
        props: {
            ...(await serverSideTranslations(locale ?? BETTERCOMMERCE_DEFAULT_LANGUAGE!)),
        }
    }
}

OrderDetail.Layout = Layout
const PAGE_TYPE = PAGE_TYPES.Page
export default withDataLayer(withAuth(OrderDetail), PAGE_TYPE, true)
