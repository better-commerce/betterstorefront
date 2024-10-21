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
  NEXT_GET_RETURN_DETAILS,
} from '@components/utils/constants'

// Other Imports
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { PaymentStatus } from '@components/utils/payment-constants'
import { DATE_FORMAT, NEXT_GET_ORDER, NEXT_GET_ORDER_DETAILS, SITE_ORIGIN_URL } from '@components/utils/constants'
import { useUI } from '@components/ui'
import { isB2BUser, notFoundRedirect, vatIncluded } from '@framework/utils/app-util'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import withAuth from '@components/utils/withAuth'
import { GetServerSideProps } from 'next'
import { matchStrings, priceFormat } from '@framework/utils/parse-util'
import LayoutAccount from '@components/Layout/LayoutAccount'
import { IPagePropsProvider } from '@framework/contracts/page-props/IPagePropsProvider'
import { getPagePropType, PagePropType } from '@framework/page-props'
import useAnalytics from '@components/services/analytics/useAnalytics'
import { EVENTS_MAP } from '@components/services/analytics/constants'
import { AnalyticsEventType } from '@components/services/analytics'
import Link from 'next/link'

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
  const [returnData, setreturnData] = useState<any>(null)
  const [returnRequestedItems, setReturnRequestedItems] = useState({})
  let isB2B: any = isB2BUser(user);

  const fetchOrderDetailById = async (id: any) => {
    if (!id) return
    try {
      const { data }: any = await axios.post(NEXT_GET_RETURN_DETAILS, {
        id: user?.userId,
        returnId: id,
      })
      setreturnData(data?.order)
    } catch (error) {
      setreturnData({})
      router.push('/404')
    }
  }

  useAnalytics(AnalyticsEventType.ORDER_PAGE_VIEWED, { entityName: PAGE_TYPES.OrderDetail, entityType: EVENTS_MAP.ENTITY_TYPES.Order, })

  useEffect(() => {
    const returnId = router.query?.returnId[0]
    fetchOrderDetailById(returnId)
  }, [router.query])

  useEffect(() => {
    // need to map the "isRMACreated" field to control return item status/cta
    console.log()
    if (returnData?.items?.length > 0) {
      const mapOrderLineItemObj = returnData?.items?.reduce(
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
  }, [returnData])

  const isConfirmedOrder = () => {
    if (returnData?.payments?.length) {
      const payment = returnData?.payments?.find((x: any) => x?.isValid)
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
    returnData?.orderLog
      ?.map((x: any) => x?.updateType)
      .includes('UpdateOrderLine') ||
    returnData?.orderLog
      ?.map((x: any) => x?.updateType)
      .includes('RefundGenerated') ||
    returnData?.orderLog
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
      //debugger
      recordAnalytics(AnalyticsEventType.HELP_ICON, { helpMode: 'cancel/return/exchange/chat', deviceCheck })
    }
  }

  const chooseHelpMode = (mode: any) => {
    if (typeof window !== 'undefined')
      //debugger
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
      //debugger
      recordAnalytics(AnalyticsEventType.NEED_HELP_WITH_ORDER, { deviceCheck, })
  }

  const closeOrderHelpModal = () => {
    setIsHelpOrderOpen(false)
  }

  const onCancelItem = async (mode: any) => {
    router.push(`/my-account/cancel-order-item/${data?.orderId}/${data?.itemId}`)
    if (typeof window !== 'undefined') {
      //debugger
      recordAnalytics(AnalyticsEventType.PROCEED_TO_CANCEL_ITEM, EmptyObject)
      recordAnalytics(AnalyticsEventType.HELP_SIDEBAR_MENU, { mode, deviceCheck, })
    }
  }
  const onCancelOrder = async (mode: any) => {
    router.push(`/my-account/cancel-order/${data?.orderId}`)
    if (typeof window !== 'undefined') {
      //debugger
      recordAnalytics(AnalyticsEventType.PROCEED_TO_CANCEL_ORDER, EmptyObject)
      recordAnalytics(AnalyticsEventType.HELP_SIDEBAR_MENU, { mode, deviceCheck, })
    }
  }
  const onReturnItem = async (mode: any) => {
    router.push(`/my-account/return-order/${data?.orderId}/${data?.itemId}`)
    if (typeof window !== 'undefined') {
      //debugger
      recordAnalytics(AnalyticsEventType.PROCEED_TO_RETURN, EmptyObject)
      recordAnalytics(AnalyticsEventType.HELP_SIDEBAR_MENU, { mode, deviceCheck, })
    }
  }
  const onExchangeItem = async (mode: any) => {
    router.push(`/my-account/exchange-order/${data?.orderId}/${data?.itemId}`)
    if (typeof window !== 'undefined') {
      //debugger
      recordAnalytics(AnalyticsEventType.PROCEED_TO_EXCHANGE, EmptyObject)
      recordAnalytics(AnalyticsEventType.TRACK_PACKAGE, { details: returnData, deviceCheck, })
      recordAnalytics(AnalyticsEventType.HELP_SIDEBAR_MENU, { mode, deviceCheck, })
    }
  }
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // @ts-ignore
  // console.log('ENTIRE_ORDER_LOG_SORTED', returnData?.orderLog.sort((a:any,b:any) => new Date(a?.created) - new Date(b?.created)))
  // console.log('ENTIRE_ORDER_', returnData)
  const trackPackage = (returnData: any) => {
    if (typeof window !== 'undefined') {
      //debugger
      recordAnalytics(AnalyticsEventType.PROCEED_TO_EXCHANGE, EmptyObject)
    }
  }
  const isIncludeVAT = vatIncluded()
  const subTotalAmount = isIncludeVAT
    ? (
      returnData?.subTotal?.raw?.withTax -
      returnData?.discount?.raw?.withTax
    ).toFixed(2)
    : (
      returnData?.subTotal?.raw?.withoutTax -
      returnData?.discount?.raw?.withoutTax
    ).toFixed(2)


  const handleReOrder = async () => {
    const computedProducts = returnData?.items?.reduce((acc: any, obj: any) => {
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
        !returnData ? <> <Spinner /> </>
          : <>
            <NextHead>
              <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
              <link rel="canonical" href={SITE_ORIGIN_URL + router.asPath} />
              <title>Return Detail : {returnData?.returnNo}</title>
              <meta name="title" content={`Order Detail : ${returnData?.returnNo}`} />
              <meta name="description" content={`Order Detail : ${returnData?.returnNo}`} />
              <meta name="keywords" content={`Order Detail : ${returnData?.returnNo}`} />
              <meta property="og:image" content="" />
              <meta property="og:title" content={`Order Detail : ${returnData?.returnNo}`} key="ogtitle" />
              <meta property="og:description" content={`Order Detail : ${returnData?.returnNo}`} key="ogdesc" />
            </NextHead>
            <div className='w-full bg-white'>
              <h1 className='sr-only'>Return Detail : {returnData?.returnNo}</h1>
              <div className=''>

                <ol role="list" className="flex items-center space-x-0 sm:space-x-0 sm:mb-4 sm:px-0 md:px-0 lg:px-0 2xl:px-0" >
                  <li className='flex items-center text-10-mob sm:text-sm'>
                    <Link href={`${isB2B ? '/my-account/returns' : '/my-account/returns'}`} passHref>
                      <span className="font-light hover:text-gray-900 dark:text-slate-500 text-slate-500" >Returns</span>
                    </Link>
                  </li>
                  <li className='flex items-center text-10-mob sm:text-sm'>
                    <span className="inline-block mx-1 font-normal hover:text-gray-900 dark:text-black" >
                      <ChevronRightIcon className='w-3 h-3'></ChevronRightIcon>
                    </span>
                  </li>
                  <li className="flex items-center text-10-mob sm:text-sm" >
                    <span className={`font-semibold hover:text-gray-900 capitalize dark:text-black`} >
                      {returnData?.returnNo}
                    </span>
                  </li>
                </ol>
                <div className='mb-4'>
                  <h1 className="text-xl font-normal sm:text-2xl dark:text-black">
                    {returnData?.returnNo && "Return #" + returnData?.returnNo}
                  </h1>
                </div>
                <div className="flex flex-col"><hr className="my-2 border-dashed border-slate-200 dark:border-slate-700" /></div>
                <div className="w-full pb-2">
                  <div className="w-full">
                    <div className="flex justify-between">
                      <div className="relative">
                        <div className="w-full">
                          <h5 className="font-bold text-18 text-secondary-full-opacity "> Return Detail </h5>
                          {returnData?.parentCustomNo?.length != 0 && (
                            <p className="text-sm text-black-light mob-font-14"> {returnData?.returnNo}</p>
                          )}
                        </div>
                      </div>
                      <div className="hidden sm:block">
                        <h5 className="uppercase font-10 text-black-light dark:text-gray-900">Return Date </h5>
                        <p className="text-sm dark:text-black text-primary">
                          {moment(new Date(returnData?.returnDate)).format(DATE_FORMAT)}
                        </p>
                      </div>
                      <div className="hidden sm:block">
                        <h5 className="text-black font-10 text-black-light">Refunded </h5>
                        <p className="text-sm dark:text-black text-primary">
                          {priceFormat(returnData?.refundAmount?.raw?.withTax, undefined, returnData?.refundAmount?.currencySymbol)}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between py-4 mt-4 border-t sm:pl-16 xsm:pl-16 sm:hidden full-m-ex-header">
                      <div className="">
                        <h3 className="font-10 text-black-light uppercase !text-sm dark:text-black">
                          {translate('label.orderDetails.orderPlacedOnHeadingText')} </h3>
                        <p className="text-sm text-primary dark:text-gray-700">
                          {moment(new Date(returnData?.orderDate)).format(DATE_FORMAT)}
                        </p>
                      </div>
                      <div className="">
                        <h3 className="font-10 text-black-light !text-sm dark:text-black">{translate('label.orderDetails.orderTotalHeadingText')}</h3>
                        <p className="text-sm text-primary dark:text-gray-700">
                          {returnData?.grandTotal?.formatted?.withTax}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <hr className="my-2 border-dashed border-slate-200 dark:border-slate-700"></hr>
                </div>

                {/* address section start */}
                <div className="w-full py-3">
                  <h4 className="mb-2 text-base font-semibold text-primary text dark:text-black">
                    {' '}
                    {translate('label.orderDetails.deliveryAddressHeadingText')} </h4>
                  <h5 className="mb-1 text-sm text-primary dark:text-black">
                    {returnData?.email}{' '}
                  </h5>
                  <div className="pl-0">
                    <p className="mb-1 text-sm font-normal text-black dark:text-black">
                      {returnData?.billingAddress?.address1}{' '}
                      {returnData?.billingAddress?.address2}
                    </p>
                    <p className="mb-1 text-sm font-normal text-black dark:text-black">
                      {returnData?.billingAddress?.city} -{' '}
                      {returnData?.billingAddress?.postCode}
                    </p>
                    <p className="text-sm font-normal text-black dark:text-black">
                      {returnData?.billingAddress?.phoneNo}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
      }
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const { locale } = context;
  if (matchStrings(locale, context?.query?.returnId[0])) {
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
