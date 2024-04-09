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
function MyCompany({ deviceInfo }: any) {
  const { user, deleteUser, isGuestUser, displayDetailedOrder, referralProgramActive } = useUI()
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
  const config = useConfig();
  const [isAdmin, setIsAdmin] = useState(false)
  const currentOption = translate('label.myAccount.myCompanyText')
  const newConfig: any = useMemo(() => {
    let output: any = []
    let isB2B = user?.companyId !== Guid.empty
    const hasMyCompany = config?.some((item: any) => item?.props === 'my-company')
    const hasReferral = config?.some((item: any) => item?.props === 'refer-a-friend')
    output = [...config]
    if (isB2B) {
      let i = output.length
      if (referralProgramActive) {
        if (!hasReferral) {
          output.push({
            type: 'tab',
            text: 'Refer a Friend',
            mtext: 'Refer a Friend',
            props: 'refer-a-friend',
            href: "/my-account/refer-a-friend"
          })
        }
      }
      while (i--) {
        if (output[i]?.props === 'address-book' || output[i]?.props === 'orders') {
          output.splice(i, 1)
        }
      }
    }
    if (!isB2B) {
      if (referralProgramActive) {
        if (!hasReferral) {
          output = [...config]
          output.push({
            type: 'tab',
            text: 'Refer a Friend',
            mtext: 'Refer a Friend',
            props: 'refer-a-friend',
            href: "/my-account/refer-a-friend"
          })
        }
      } else {
        output = [...config]
      }
    } else if (!hasMyCompany) {
      output.push({
        type: 'tab',
        text: 'My Company',
        mtext: 'My Company',
        props: 'my-company',
        href: '/my-account/my-company',
      })
    }
    return output
  }, [config])
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
  const handleToggleShowState = () => {
    setShow(!isShow)
  }
  return (
    <>
      <NextHead>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="canonical" href={SITE_ORIGIN_URL + router.asPath} />
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
        <>
          <section className="relative pb-10 text-gray-900">
            <div className="container w-full">
              <div className="mt-14 sm:mt-20">
                <div className="max-w-4xl mx-auto">
                  <div className="max-w-2xl">
                    <h2 className="text-3xl font-semibold xl:text-4xl">My Company</h2>
                    <span className="block mt-4 text-base text-neutral-500 dark:text-neutral-400 sm:text-lg">
                      <span className="font-semibold text-slate-900 dark:text-slate-200">
                        {user?.firstName},
                      </span>{" "}
                      {user.email}
                    </span>
                  </div>
                  <hr className="mt-10 border-slate-200 dark:border-slate-700"></hr>
                  <div className="flex space-x-8 overflow-x-auto md:space-x-13 hiddenScrollbar">
                    {newConfig?.map((item: any, idx: number) => (
                      <>
                        {item.text == 'My Company' ? (
                          <>
                            <Link
                              key={`my-acc-${idx}`}
                              shallow={true}
                              href={item.href}
                              passHref
                              onClick={() => {
                                handleClick()
                                handleToggleShowState()
                              }}
                              className={`block py-5 md:py-8 border-b-2 flex-shrink-0 text-sm sm:text-base ${item.text == 'My Company'
                                ? "border-primary-500 font-medium text-slate-900 dark:text-slate-200"
                                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                                }`}
                            >
                              {item.text}
                            </Link>
                          </>
                        ) : (
                          <>
                            <Link
                              shallow={true}
                              href={item.href}
                              passHref
                              onClick={() => {
                                handleClick()
                              }}
                              className="flex-shrink-0 block py-5 text-sm md:py-8 sm:text-base"
                            >
                              <span className="inline-block text-black sm:hidden dark:text-black">
                                {item.mtext}
                              </span>
                              <span className="hidden text-black sm:inline-block dark:text-black">
                                {item.text}
                              </span>
                            </Link>
                          </>
                        )}

                      </>
                    ))}
                  </div>
                  <hr className="border-slate-200 dark:border-slate-700"></hr>
                </div>
              </div>
              <div className="max-w-4xl pt-4 pb-24 mx-auto sm:pt-6 lg:pb-32">
                <div className="relative col-span-12 mob-tab-full" >
                  <div className={'orders bg-white'}>
                    <Tab.Group selectedIndex={currentTab}>
                      <Tab.List className={'flex space-x-1 rounded-2xl bg-slate-100 p-1 mx-0 '} >
                        {optionsConfig?.map((option: any, Idx: any) => (
                          <>
                            {option?.name == 'Users' ? (
                              <>
                                {user?.companyUserRole === UserRoleType.ADMIN &&
                                  <Tab as={Fragment} key={Idx}>
                                    {({ selected }) => (
                                      <button
                                        className={classNames(
                                          'w-full rounded-2xl py-2.5 text-md uppercase font-medium leading-5 text-blue-700 hover:\bg-slate-100/70',
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
                                        'w-full rounded-2xl py-2.5 text-md uppercase font-medium leading-5 text-blue-700 hover:\bg-slate-100/70',
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

const PAGE_TYPE = PAGE_TYPES.Page

export async function getServerSideProps(context: any) {
  const { locale } = context
  return {
    props: {
      ...(await serverSideTranslations(locale ?? BETTERCOMMERCE_DEFAULT_LANGUAGE!))
    }, // will be passed to the page component as props
  }
}

export default withDataLayer(withAuth(MyCompany), PAGE_TYPE, true, LayoutAccount)
