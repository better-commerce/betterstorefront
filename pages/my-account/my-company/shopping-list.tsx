import { useState, useEffect, useMemo } from 'react'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import withAuth from '@components/utils/withAuth'
import { useRouter } from 'next/router'
import { EVENTS_MAP } from '@components/services/analytics/constants'
import useAnalytics from '@components/services/analytics/useAnalytics'
import { useUI } from '@components/ui/context'
import React from 'react'
import MyDetails from '@components/account/MyDetails'
import { useTranslation } from '@commerce/utils/use-translation'
import LayoutAccount from '@components/Layout/LayoutAccount'
import { IPagePropsProvider } from '@framework/contracts/page-props/IPagePropsProvider'
import { getPagePropType, PagePropType } from '@framework/page-props'
import B2BQuotes from '@components/account/B2BQuotes'
import axios from 'axios'
import { NEXT_B2B_GET_QUOTES, NEXT_B2B_GET_USERS, NEXT_GET_ORDERS } from '@components/utils/constants'
import B2BOrders from '@components/account/Orders/B2BOrders'
import CartDropdown from '@components/Header/CartDropdown'
import B2BBaskets from '@components/account/B2BBasket'

function ShoppingList({ deviceInfo }: any) {
  const [isShow, setShow] = useState(true)
  const [b2bQuotes, setB2BQuotes] = useState<any>(null)
  const [userOrderIdMap, setUserOrderIdMap] = useState<any>(null)
  const { user, isGuestUser, changeMyAccountTab, displayDetailedOrder } = useUI()
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [b2bUsers, setB2BUsers] = useState<any>(null)
  const translate = useTranslation()
  const { CustomerProfileViewed } = EVENTS_MAP.EVENT_TYPES
  const { Customer } = EVENTS_MAP.ENTITY_TYPES
  const [isShowDetailedOrder, setIsShowDetailedOrder] = useState(displayDetailedOrder)
  useEffect(() => {
    setIsShowDetailedOrder(displayDetailedOrder)
  }, [displayDetailedOrder])
  useEffect(() => {
    fetchB2BUserQuotes()
    if (isGuestUser) {
      router.push('/')
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const fetchB2BUserQuotes = async () => {
    let { data: b2bQuotes } = await axios.post(NEXT_B2B_GET_QUOTES, {
      userId: user?.userId,
    })
    setB2BQuotes(b2bQuotes)
  }
  let loggedInEventData: any = {
    eventType: CustomerProfileViewed,
  }
  const userAdminCheck = (b2bUsers: any) => {
    let isAdmin =
      b2bUsers.find((x: any) => x?.userId === user?.userId)?.companyUserRole ===
      'Admin'
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
  useEffect(() => {
    changeMyAccountTab(translate('label.myAccount.myCompanyMenus.shoppingList'))
  }, [])

  useAnalytics(CustomerProfileViewed, loggedInEventData)

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
      <div className=''>
        <h1 className="text-2xl font-semibold sm:text-3xl dark:text-black">
          Shopping List
        </h1>
      </div>
      <div>
        <B2BBaskets />
      </div>
    </div>)
}

ShoppingList.LayoutAccount = LayoutAccount

const PAGE_TYPE = PAGE_TYPES.ShoppingList

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

export default withDataLayer(withAuth(ShoppingList), PAGE_TYPE, true, LayoutAccount)