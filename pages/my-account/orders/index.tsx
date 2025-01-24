import { useState, useEffect } from 'react'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import withAuth from '@components/utils/withAuth'
import { useRouter } from 'next/router'
import { EVENTS_MAP } from '@components/services/analytics/constants'
import useAnalytics from '@components/services/analytics/useAnalytics'
import { useUI } from '@components/ui/context'
import React from 'react'
import MyOrders from '@components/account/Orders/MyOrders'
import { matchStrings } from '@framework/utils/parse-util'
import axios from 'axios'
import { NEXT_GET_ORDERS, NEXT_GET_ORDER_DETAILS, } from '@components/utils/constants'
import { useTranslation } from '@commerce/utils/use-translation'
import LayoutAccount from '@components/Layout/LayoutAccount'
import { IPagePropsProvider } from '@framework/contracts/page-props/IPagePropsProvider'
import { getPagePropType, PagePropType } from '@framework/page-props'
import { AnalyticsEventType } from '@components/services/analytics'
const PAGE_SIZE = 10

function MyOrdersPage({ deviceInfo }: any) {
  const { user, isGuestUser, displayDetailedOrder, changeMyAccountTab } = useUI()
  const router = useRouter()
  const { Customer } = EVENTS_MAP.ENTITY_TYPES
  const translate = useTranslation()
  const [allOrders, setAllOrders] = useState<Array<any> | undefined>(undefined)
  const [pageNumber, setPageNumber] = useState<number>(1)

  useEffect(() => {
    changeMyAccountTab(translate('label.order.myOrdersText'))
  }, [])

  useEffect(() => {
    if (isGuestUser) {
      router.push('/')
    } else {
      //todo get new users created with different roles and make them place orders to verify the endpoint
      fetchOrders(pageNumber)
    }
  }, [pageNumber])

  const fetchOrders = async (pageNumber: number) => {
    const { data: ordersResult }: any = await axios.post(NEXT_GET_ORDERS, {
      id: user?.userId,
      hasMembership: user?.hasMembership,
      pageNumber: pageNumber,
      pageSize: PAGE_SIZE,
    })

    // console.log('setPagedOrders ::', ordersResult);<a
    setAllOrders(ordersResult)
  }

  const handleInfiniteScroll = () => {
    //alert(pageNumber)
    setPageNumber(pageNumber + 1)
  }

  let loggedInEventData: any = { eventType: AnalyticsEventType.CUSTOMER_PROFILE_VIEWED, entityType: Customer, }

  if (user && user.userId) {
    loggedInEventData = { ...loggedInEventData, ...user, }
  }
  useAnalytics(AnalyticsEventType.CUSTOMER_PROFILE_VIEWED, loggedInEventData)

  const [isShowDetailedOrder, setIsShowDetailedOrder] =
    useState(displayDetailedOrder)
  useEffect(() => {
    setIsShowDetailedOrder(displayDetailedOrder)
  }, [displayDetailedOrder])

  return (
    <>
      <h1 className='text-xl font-normal sm:text-2xl dark:text-black'>{translate('label.order.orderHistory')}</h1>
      <div className={'orders bg-white dark:bg-transparent my-2 sm:my-6'}>
        <MyOrders allOrders={allOrders} handleInfiniteScroll={handleInfiniteScroll} deviceInfo={deviceInfo} isShowDetailedOrder={isShowDetailedOrder} setIsShowDetailedOrder={setIsShowDetailedOrder} />
      </div>
    </>
  )
}

MyOrdersPage.LayoutAccount = LayoutAccount

export async function getServerSideProps(context: any) {
  const { locale } = context
  const props: IPagePropsProvider = getPagePropType({ type: PagePropType.COMMON })
  const pageProps = await props.getPageProps({ cookies: context?.req?.cookies })

  return {
    props: {
      ...pageProps,
    }, // will be passed to the page component as props
  }
}

export default withDataLayer(withAuth(MyOrdersPage), PAGE_TYPES.OrderList, true, LayoutAccount)
