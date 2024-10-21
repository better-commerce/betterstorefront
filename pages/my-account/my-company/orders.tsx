import { useState, useEffect } from 'react'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import withAuth from '@components/utils/withAuth'
import { useRouter } from 'next/router'
import { EVENTS_MAP } from '@components/services/analytics/constants'
import useAnalytics from '@components/services/analytics/useAnalytics'
import { useUI } from '@components/ui/context'
import React from 'react'
import { useTranslation } from '@commerce/utils/use-translation'
import LayoutAccount from '@components/Layout/LayoutAccount'
import { IPagePropsProvider } from '@framework/contracts/page-props/IPagePropsProvider'
import { getPagePropType, PagePropType } from '@framework/page-props'
import axios from 'axios'
import { NEXT_B2B_GET_USERS, NEXT_GET_ORDERS } from '@components/utils/constants'
import B2BOrders from '@components/account/Orders/B2BOrders'
import { AnalyticsEventType } from '@components/services/analytics'

function MyOrders({ deviceInfo }: any) {
  const [isShow, setShow] = useState(true)
  const [userOrderIdMap, setUserOrderIdMap] = useState<any>(null)
  const { user, isGuestUser, changeMyAccountTab, displayDetailedOrder } = useUI()
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [b2bUsers, setB2BUsers] = useState<any>(null)
  const translate = useTranslation()
  const [isShowDetailedOrder, setIsShowDetailedOrder] = useState(displayDetailedOrder)
  useEffect(() => {
    setIsShowDetailedOrder(displayDetailedOrder)
  }, [displayDetailedOrder])
  useEffect(() => {
    if (isGuestUser) {
      router.push('/')
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  let loggedInEventData: any = { eventType: AnalyticsEventType.CUSTOMER_PROFILE_VIEWED, }
  const userAdminCheck = (b2bUsers: any) => {
    let isAdmin = b2bUsers.find((x: any) => x?.userId === user?.userId)?.companyUserRole === 'Admin'
    setIsAdmin(isAdmin)
  }

  const fetchB2BUsers = async () => {
    let { data: b2bUsers } = await axios.post(NEXT_B2B_GET_USERS, {
      companyId: user?.companyId,
    })
    if (b2bUsers?.length) {
      setB2BUsers(b2bUsers)
      userAdminCheck(b2bUsers)
    }
    return b2bUsers
  }
  if (user && user.userId) {
    loggedInEventData = { ...loggedInEventData, ...user, }
  }
  useEffect(() => {
    changeMyAccountTab(translate('label.myAccount.myCompanyMenus.order'))
  }, [])

  useAnalytics(AnalyticsEventType.CUSTOMER_PROFILE_VIEWED, loggedInEventData)

  const handleToggleShowState = () => {
    setShow(!isShow)
  }
  const fetchOrders = async (userId: any) => {
    const { data } = await axios.post(NEXT_GET_ORDERS, { id: userId })
    return data?.map((order: any) => order?.id) || []
  }
  useEffect(() => {
    const fetchData = async () => {
      if (!b2bUsers) return

      const userOrderMap = await Promise.all(
        b2bUsers
          .filter((user: any) => user?.companyUserRole !== 'Admin')
          .map(async (user: any) => {
            const orders = await fetchOrders(user.userId)
            return { userId: user.userId, orders }
          })
      )
      setUserOrderIdMap([...userOrderMap])
    }

    fetchData()
  }, [b2bUsers])

  return (
    <div className={'orders bg-white dark:bg-transparent'}>
      <h1 className="text-xl font-normal sm:text-2xl dark:text-black"> Orders </h1>
      <B2BOrders deviceInfo={deviceInfo} isShowDetailedOrder={isShowDetailedOrder} setIsShowDetailedOrder={setIsShowDetailedOrder} isAdmin={isAdmin} userOrderIdMap={userOrderIdMap} />
    </div>
  )
}

MyOrders.LayoutAccount = LayoutAccount
const PAGE_TYPE = PAGE_TYPES.MyOrders

export async function getServerSideProps(context: any) {
  const { locale } = context
  const props: IPagePropsProvider = getPagePropType({ type: PagePropType.COMMON })
  const pageProps = await props.getPageProps({ cookies: context?.req?.cookies })

  return {
    props: {
      ...pageProps,
    }
  }
}
export default withDataLayer(withAuth(MyOrders), PAGE_TYPE, true, LayoutAccount)