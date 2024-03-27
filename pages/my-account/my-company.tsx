import { useState, useEffect, Fragment } from 'react'
import Layout from '@components//Layout/Layout'
import withDataLayer, { PAGE_TYPES } from '@components//withDataLayer'
import { Tab } from '@headlessui/react'
import { useConfig } from '@components//utils/myAccount'
import withAuth from '@components//utils/withAuth'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { EVENTS_MAP } from '@components//services/analytics/constants'
import useAnalytics from '@components//services/analytics/useAnalytics'
import { useUI } from '@components//ui/context'
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
} from '@components//utils/constants'
import classNames from 'classnames'
import CompanyUsers from '@old-components/account/CompanyUsers'
import B2BOrders from '@old-components/account/Orders/B2BOrders'
import B2BQuotes from '@old-components/account/B2BQuotes'
import AddressBook from '@old-components/account/Address/AddressBook'
import Spinner from '@components//ui/Spinner'
import SideMenu from '@old-components/account/MyAccountMenu'
import { Guid } from '@commerce/types'
import { isB2BUser } from '@framework/utils/app-util'
import { UserRoleType } from '@framework/utils/enums'
import { useTranslation } from '@commerce/utils/use-translation'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
function MyCompany({ deviceInfo }: any) {
  const { user, deleteUser, isGuestUser, displayDetailedOrder } = useUI()
  const router = useRouter()
  const { isMobile, isIPadorTablet, isOnlyMobile } = deviceInfo
  const [isShow, setShow] = useState(true)
  const { CustomerProfileViewed } = EVENTS_MAP.EVENT_TYPES
  const { Customer } = EVENTS_MAP.ENTITY_TYPES
  const translate = useTranslation()
  const [userOrderIdMap, setUserOrderIdMap] = useState<any>(null)
  const [active, setActive] = useState(false)

  const [selectedOption, setSelectedOption] = useState<any>('Users')
  const [currentTab, setCurrentTab] = useState(0)
  const [b2bUsers, setB2BUsers] = useState<any>(null)
  const [b2bQuotes, setB2BQuotes] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const currentOption = translate('label.myAccount.myCompanyText')

  const optionsConfig = [
    {
      name: 'Users',
      value: 'Users',
      onClick: (value: any) => {
        setSelectedOption(value)
      },
    },
    {
      name: 'Orders',
      value: 'Orders',
      onClick: (value: any) => {
        setSelectedOption(value)
      },
    },
    {
      name: 'Quotes',
      value: 'Quotes',
      onClick: (value: any) => {
        setSelectedOption(value)
      },
    },
    {
      name: 'Address Book',
      value: 'AddressBook',
      onClick: (value: any) => {
        setSelectedOption(value)
      },
    },
    {
      name: 'Invoices',
      value: 'Invoices',
      onClick: (value: any) => {
        setSelectedOption(value)
      },
    },
  ]

  useEffect(() => {
    const fetchData = async () => {
      if (!b2bUsers) return

      const fetchOrders = async (userId: any) => {
        const { data } = await axios.post(NEXT_GET_ORDERS, { id: userId })
        return data?.map((order: any) => order?.id) || []
      }

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
    const handleCurrentTab = () => {
      let Index = optionsConfig.findIndex(
        (x: any) => x.value === selectedOption
      )

      setCurrentTab(Index)
    }
    handleCurrentTab()
  }, [selectedOption])

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

  useEffect(() => {
    if (selectedOption === 'Users') {
      fetchB2BUsers()
    } else if (selectedOption === 'Quotes') {
      fetchB2BUserQuotes()
    } else if (selectedOption === 'AddressBook') {
      fetchB2BAddressBook()
    } else if (selectedOption === 'Invoices') {
      fetchB2BInvoices()
    }
  }, [selectedOption])

  useEffect(() => {
    if (router.query.tab) {
      let Index = optionsConfig.findIndex(
        (x: any) => x.value.toLowerCase() === router.query.tab
      )
      setSelectedOption(optionsConfig[Index].value)
      setCurrentTab(Index)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.asPath])

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

  return (
    <>
      <NextHead>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <link rel="canonical" href={SITE_ORIGIN_URL+router.asPath} />
        <title>{currentOption}</title>
        <meta name="title" content={currentOption} />
        <meta name="description" content={currentOption} />
        <meta name="keywords" content={currentOption} />
        <meta property="og:image" content="" />
        <meta property="og:title" content={currentOption} key="ogtitle" />
        <meta property="og:description" content={currentOption} key="ogdesc" />
      </NextHead>
      {!isB2BUser(user) ? (
        <>
          <Spinner />
        </>
      ) : (
       <section className="relative pb-10 text-gray-900">
          <div className="w-full px-0 mx-auto md:container sm:px-0 lg:px-0">
            {/* {!isShowDetailedOrder && (
              <div className="px-2 py-4 mb-4 border-b mob-header md:hidden full-m-header">
                <h3 className="mt-2 text-xl font-semibold text-black flex gap-1 mx-5">
                  <Link
                    className="mx-2 leading-none mt-1 align-middle"
                    href="/my-account"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-arrow-left"
                      viewBox="0 0 16 16"
                    >
                      {' '}
                      <path d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />{' '}
                    </svg>
                  </Link>
                  <span className="leading-none">{translate('label.myAccount.myCompanyText')}</span>
                </h3>
              </div>
            )} */}
            <div className="grid w-full grid-cols-12 px-4 sm:px-2 sm:pr-0 main-account-grid">
              <SideMenu
                handleClick={handleClick}
                setShow={setShow}
                currentOption={currentOption}
              />
              <div
                className={`relative col-span-9 lg:col-span-8 md:col-span-8 border-l tabpanel-sm mob-tab-full ${
                  isShow ? `` : ''
                }`}
              >
                <div className={'orders bg-white my-2 sm:my-6 pl-2'}>
                  <div className="w-full \max-w-md px-2 py-9 sm:px-0">
                    <Tab.Group selectedIndex={currentTab}>
                      <Tab.List
                        className={
                          'flex space-x-1 rounded-xl bg-gray-200 p-1 mx-20 '
                        }
                      >
                        {optionsConfig?.map((option: any, Idx: any) => (
                          <>
                          {option?.name == 'Users' ? (
                            <>
                             {user?.companyUserRole === UserRoleType.ADMIN &&
                             <Tab as={Fragment} key={Idx}>
                             {({ selected }) => (
                              <button
                                className={classNames(
                                  'w-full rounded-lg py-2.5 text-md uppercase font-medium leading-5 text-blue-700 hover:\bg-slate-100/70',
                                  'ring-white/40 ring-opacity-60 transition-all delay-600 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:\ring-2',
                                  selected
                                    ? 'bg-white shadow hover:bg-gray-50'
                                    : 'text-blue-100 hover:bg-white/[0.32] '
                                )}
                                onClick={() => {
                                  option?.onClick(option?.value)
                                }}
                              >
                                {option?.name}
                              </button>
                            )}
                             </Tab>}
                            </>
                          ) : (
                            <>
                              <Tab as={Fragment} key={Idx}>
                              {({ selected }) => (
                                <button
                                  className={classNames(
                                    'w-full rounded-lg py-2.5 text-md uppercase font-medium leading-5 text-blue-700 hover:\bg-slate-100/70',
                                    'ring-white/40 ring-opacity-60 transition-all delay-600 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:\ring-2',
                                    selected
                                      ? 'bg-white shadow hover:bg-gray-50'
                                      : 'text-blue-100 hover:bg-white/[0.32] '
                                  )}
                                  onClick={() => {
                                    option?.onClick(option?.value)
                                  }}
                                >
                                  {option?.name}
                                </button>
                                )}
                              </Tab>
                            </>
                          )}
                          </>
                        ))}
                      </Tab.List>
                      <Tab.Panels>
                        {user?.companyUserRole === UserRoleType.ADMIN &&
                            <Tab.Panel>
                              <CompanyUsers users={b2bUsers} />
                            </Tab.Panel>
                          }
                        <Tab.Panel>
                          <B2BOrders
                            selectedOption={selectedOption}
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
                          <div className="font-Inter text-lg font-bold text-brand-blue p-10">{`No Invoices Generated Yet`}</div>
                        </Tab.Panel>
                      </Tab.Panels>
                    </Tab.Group>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  )
}

MyCompany.Layout = Layout

const PAGE_TYPE = PAGE_TYPES.Page

export async function getServerSideProps(context: any) {
  const { locale } = context
  return {
    props: { 
      ...(await serverSideTranslations(locale ?? BETTERCOMMERCE_DEFAULT_LANGUAGE!))
    }, // will be passed to the page component as props
  }
}

export default withDataLayer(withAuth(MyCompany), PAGE_TYPE, true)
