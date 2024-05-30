import { useState, useEffect, Fragment, useMemo } from 'react'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import { Tab } from '@headlessui/react'
import { useConfig } from '@components/utils/myAccount'
import withAuth from '@components/utils/withAuth'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { EVENTS_MAP } from '@components/services/analytics/constants'
import useAnalytics from '@components/services/analytics/useAnalytics'
import { useUI } from '@components/ui/context'
import NextHead from 'next/head'
import React from 'react'
// import MyOrders from '@old-components/account/MyOrders'
import axios from 'axios'
import {
  BETTERCOMMERCE_DEFAULT_LANGUAGE,
  NEXT_ADDRESS,
  NEXT_B2B_GET_QUOTES,
  NEXT_B2B_GET_USERS,
  NEXT_GET_ORDERS,
  SITE_ORIGIN_URL,
} from '@components/utils/constants'
import classNames from 'classnames'
import CompanyUsers from '@components/account/CompanyUsers'
import B2BOrders from '@components/account/Orders/B2BOrders'
import B2BQuotes from '@components/account/B2BQuotes'
import AddressBook from '@components/account/Address/AddressBook'
import Spinner from '@components/ui/Spinner'
import { Guid } from '@commerce/types'
import { isB2BUser } from '@framework/utils/app-util'
import { UserRoleType } from '@framework/utils/enums'
import { useTranslation } from '@commerce/utils/use-translation'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import LayoutAccount from '@components/Layout/LayoutAccount'
import { BuildingOffice2Icon } from '@heroicons/react/24/outline'
import { CompanyTabs, companyMenuTabs } from '@components/account/configs/company'
import { matchStrings } from '@framework/utils/parse-util'
import { IPagePropsProvider } from '@framework/contracts/page-props/IPagePropsProvider'
import { getPagePropType, PagePropType } from '@framework/page-props'

function MyCompany({ deviceInfo }: any) {
  const { user, changeMyAccountTab, isGuestUser, displayDetailedOrder, referralProgramActive } = useUI()
  const router = useRouter()
  const { isMobile, isIPadorTablet, isOnlyMobile } = deviceInfo
  const [isShow, setShow] = useState(true)
  const { CustomerProfileViewed } = EVENTS_MAP.EVENT_TYPES
  const { Customer } = EVENTS_MAP.ENTITY_TYPES
  const translate = useTranslation()
  const [userOrderIdMap, setUserOrderIdMap] = useState<any>(null)
  const [active, setActive] = useState(false)
  const [b2bUsers, setB2BUsers] = useState<any>(null)
  const [b2bQuotes, setB2BQuotes] = useState<any>(null)
  const config = useConfig();
  const [isAdmin, setIsAdmin] = useState(false)


  const optionsConfig = useMemo(() => {
    const options: any = []
    companyMenuTabs({ translate })?.forEach((opt: any) => {
      if (user?.companyUserRole !== UserRoleType.ADMIN) {
        if (opt.value === CompanyTabs.USER) return
      }
      options.push(opt)
    })
    return options
  }, [translate, user])
  
  const onSelectTab = (tab: any) => {
    router.replace({ query: { tab: tab?.value } }, undefined, { shallow: true })
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

  useEffect(() => {
    if (isGuestUser) {
      router.push('/')
    } else if (user?.companyId === Guid.empty) {
      router.push('/404')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  const fetchB2BUserQuotes = async () => {
    let { data: b2bQuotes } = await axios.post(NEXT_B2B_GET_QUOTES, {
      userId: user?.userId,
    })
    setB2BQuotes(b2bQuotes)
  }

  function getAddress() {
    return async (id: string) => {
      const response = await axios.post(NEXT_ADDRESS, {
        id,
      })
      return response.data
    }
  }

  const fetchB2BAddressBook = async () => {
    try {
      const response: any = await getAddress()(user?.userId)
      //   setIsLoading(false)
      //   setData(response)
    } catch (error) {
      console.log(error, 'err')
      //   failCb()
      //   setIsLoading(false)
    }
  }
  const fetchB2BInvoices = async () => {
    //api logic
  }

  useEffect(()=>{
    changeMyAccountTab(translate('label.myAccount.myCompanyText'))
  },[])

  useEffect(() => {
    const { tab: selectedTab } = router.query
    if (selectedTab) {
      if (selectedTab === CompanyTabs.USER) fetchB2BUsers()
      if (selectedTab === CompanyTabs.ORDER) fetchOrders(user?.userId)
      if (selectedTab === CompanyTabs.QUOTE) fetchB2BUserQuotes()
      if (selectedTab === CompanyTabs.ADDRESS) fetchB2BAddressBook()
      if (selectedTab === CompanyTabs.INVOICE) fetchB2BInvoices()
    } else {
      router.replace({ query: { tab: optionsConfig[0]?.value } }, undefined, { shallow: true })
    }
  }, [router.query, optionsConfig])

  let loggedInEventData: any = {
    eventType: CustomerProfileViewed,
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

  const handleClick = () => {
    setActive(!active)
  }
  useAnalytics(CustomerProfileViewed, loggedInEventData)

  const [isShowDetailedOrder, setIsShowDetailedOrder] =
    useState(displayDetailedOrder)
  useEffect(() => {
    setIsShowDetailedOrder(displayDetailedOrder)
  }, [displayDetailedOrder])
  const handleToggleShowState = () => {
    setShow(!isShow)
  }

  const selectedTabIndex = useMemo(() => {
    const { tab: selectedTab }: any = router.query
    return optionsConfig?.findIndex((opt: any) => matchStrings(opt.value, selectedTab))
  }, [router.query])

  return (
    <>
      {!isB2BUser(user) ? (
        <>
          <Spinner />
        </>
      ) : (
        <>
          <section className="relative pb-10 text-gray-900 header-space">
            <div className="container w-full bar">
              <div className="max-w-4xl pt-4 pb-24 mx-auto sm:pt-6 lg:pb-32">
                <div className="relative col-span-12 mob-tab-full" >
                  <div className={'orders bg-white dark:bg-transparent'}>
                    <Tab.Group selectedIndex={selectedTabIndex}>
                      <Tab.List className={'flex space-x-1 rounded-2xl bg-slate-100 p-1 mx-0 '} >
                        {optionsConfig?.map((option: any, id: any) => (
                          <Tab as={Fragment} key={id}>
                            {({ selected }) => (
                              <button
                                className={classNames(
                                  'w-full rounded-2xl py-2.5 text-xs sm:text-md uppercase font-medium leading-5 text-blue-700 hover:\bg-slate-100/70',
                                  'ring-white/40 ring-opacity-60 transition-all delay-600 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:\ring-2',
                                  selected
                                    ? 'bg-white shadow hover:bg-gray-50'
                                    : 'text-blue-100 hover:bg-white/[0.32] '
                                )}
                                onClick={() => onSelectTab({ ...option, id })}
                              >
                                {option?.name}
                              </button>
                            )}
                          </Tab>
                        ))}
                      </Tab.List>
                      <Tab.Panels>
                        {user?.companyUserRole === UserRoleType.ADMIN && (
                          <Tab.Panel>
                            <CompanyUsers users={b2bUsers} />
                          </Tab.Panel>
                        )}
                        <Tab.Panel>
                          <B2BOrders
                            deviceInfo={deviceInfo}
                            isShowDetailedOrder={isShowDetailedOrder}
                            setIsShowDetailedOrder={setIsShowDetailedOrder}
                            isAdmin={isAdmin}
                            userOrderIdMap={userOrderIdMap}
                          />
                        </Tab.Panel>
                        <Tab.Panel>
                          <B2BQuotes quotes={b2bQuotes} />
                        </Tab.Panel>
                        <Tab.Panel>
                          <AddressBook />
                        </Tab.Panel>
                        <Tab.Panel>
                          <div className="py-20 font-medium text-center font-24 text-slate-300">{`No Invoices Generated Yet`}</div>
                        </Tab.Panel>
                      </Tab.Panels>
                    </Tab.Group>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </>
      )}
    </>
  )
}

MyCompany.LayoutAccount = LayoutAccount

export async function getServerSideProps(context: any) {
  const { locale } = context
  const props: IPagePropsProvider = getPagePropType({ type: PagePropType.COMMON })
  const pageProps = await props.getPageProps({ cookies: context?.req?.cookies })

  return {
    props: {
      ...pageProps,
      ...(await serverSideTranslations(locale ?? BETTERCOMMERCE_DEFAULT_LANGUAGE!))
    }, // will be passed to the page component as props
  }
}

export default withDataLayer(withAuth(MyCompany), PAGE_TYPES.MyCompany, true, LayoutAccount)
