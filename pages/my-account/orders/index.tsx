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
  const { recordAnalytics } = useAnalytics()
  const { user, isGuestUser, displayDetailedOrder, changeMyAccountTab } = useUI()
  const router = useRouter()
  const { Customer } = EVENTS_MAP.ENTITY_TYPES
  const translate = useTranslation()
  const [allOrders, setAllOrders] = useState<Array<any> | undefined>(undefined)
  const [pagedOrders, setPagedOrders] = useState<Array<any>>()
  const [allOrderIds, setAllOrderIds] = useState<Array<string> | undefined>( undefined )
  const [allOrdersFetched, setAllOrdersFetched] = useState<boolean>(false)
  const [pageNumber, setPageNumber] = useState<number>(1)

  useEffect(()=>{
    changeMyAccountTab(translate('label.order.myOrdersText'))
  },[])

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

  useEffect(() => {
    if (allOrderIds?.length) {
      allOrderIds?.forEach((id: string, index: number) => {
        handleFetchOrderDetails(id).then((orderDetails: any) => {
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

  useEffect(() => {
    if (isGuestUser) {
      router.push('/')
    } else {
      //todo get new users created with different roles and make them place orders to verify the endpoint
      fetchOrders(pageNumber)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchOrders = async (pageNumber: number) => {
    const { data: ordersResult }: any = await axios.post(NEXT_GET_ORDERS, {
      id: user?.userId,
      hasMembership: user?.hasMembership,
      pageNumber: pageNumber,
      pageSize: PAGE_SIZE,
    })

    // console.log('setPagedOrders ::', ordersResult);<a
    setPagedOrders(ordersResult)
    setAllOrdersFetched(true)
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

  const handleInfiniteScroll = () => {
    //alert(pageNumber)
    setPageNumber(pageNumber + 1)
  }

  let loggedInEventData: any = {
    eventType: AnalyticsEventType.CUSTOMER_PROFILE_VIEWED,
  }

  if (user && user.userId) {
    loggedInEventData = {
      ...loggedInEventData,
      entity: JSON.stringify({
        email: user.email,
        dateOfBirth: user.yearOfBirth,
        gender: user.gender,
        id: user.userId,
        name: user.firstName + user.lastName,
        postCode: user.postCode,
      }),
      entityId: user.userId,
      entityName: user.firstName + user.lastName,
      entityType: Customer,
    }
  }

  recordAnalytics(AnalyticsEventType.CUSTOMER_PROFILE_VIEWED, loggedInEventData)

  const [isShowDetailedOrder, setIsShowDetailedOrder] =
    useState(displayDetailedOrder)
  useEffect(() => {
    setIsShowDetailedOrder(displayDetailedOrder)
  }, [displayDetailedOrder])

  return (
    <>
     <h1 className='text-2xl font-semibold sm:text-3xl dark:text-black'>{translate('label.order.orderHistory')}</h1>
      <div className={'orders bg-white dark:bg-transparent my-2 sm:my-6'}>
        <MyOrders
          allOrders={allOrders}
          handleInfiniteScroll={handleInfiniteScroll}
          deviceInfo={deviceInfo}
          isShowDetailedOrder={isShowDetailedOrder}
          setIsShowDetailedOrder={setIsShowDetailedOrder}
        />
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
