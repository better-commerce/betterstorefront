import { useState, useEffect } from 'react'
import { Layout } from '@components/common'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import { useConfig } from '@components/utils/myAccount'
import withAuth from '@components/utils/withAuth'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { EVENTS_MAP } from '@components/services/analytics/constants'
import useAnalytics from '@components/services/analytics/useAnalytics'
import { useUI } from '@components/ui/context'
import NextHead from 'next/head'
import React from 'react'
// import MyOrders from '@components/account/MyOrders'
import MyOrders from '@components/account/Orders/MyOrders'
import { matchStrings } from '@framework/utils/parse-util'
import axios from 'axios'
import {
  BETTERCOMMERCE_DEFAULT_LANGUAGE,
  NEXT_GET_ORDERS,
  NEXT_GET_ORDER_DETAILS,
  SITE_ORIGIN_URL,
} from '@components/utils/constants'
import SideMenu from '@components/account/MyAccountMenu'
import { useTranslation } from '@commerce/utils/use-translation'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
const PAGE_SIZE = 10

function MyAccount({ defaultView, isLoggedIn, deviceInfo }: any) {
  const { user, deleteUser, isGuestUser, displayDetailedOrder } = useUI()
  const router = useRouter()
  const { isMobile, isIPadorTablet, isOnlyMobile } = deviceInfo
  const [isShow, setShow] = useState(true)
  const [view, setView] = useState(defaultView)
  const { CustomerProfileViewed } = EVENTS_MAP.EVENT_TYPES
  const { Customer } = EVENTS_MAP.ENTITY_TYPES
  const translate = useTranslation()
  const [allOrders, setAllOrders] = useState<Array<any> | undefined>(undefined)
  const [pagedOrders, setPagedOrders] = useState<Array<any>>()
  const [allOrderIds, setAllOrderIds] = useState<Array<string> | undefined>(
    undefined
  )
  const [allOrdersFetched, setAllOrdersFetched] = useState<boolean>(false)
  const [active, setActive] = useState(false)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const currentOption = translate('label.order.myOrdersText')

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

  useEffect(() => {
    if (router.query.view && view !== router.query.view) {
      setView(router.query.view)
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
        <link rel="canonical" id="canonical" href={SITE_ORIGIN_URL + router.asPath} />
        <title>{currentOption}</title>
        <meta name="title" content={currentOption} />
        <meta name="description" content={currentOption} />
        <meta name="keywords" content={currentOption} />
        <meta property="og:image" content="" />
        <meta property="og:title" content={currentOption} key="ogtitle" />
        <meta property="og:description" content={currentOption} key="ogdesc" />
      </NextHead>
      <section className="relative pb-10 text-gray-900">
        <div className="w-full px-0 mx-auto md:container sm:px-0 lg:px-0">
          {!isShowDetailedOrder && (
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
                <span className="leading-none">{translate('label.order.myOrdersText')}</span>
              </h3>
            </div>
          )}
          <div className="grid w-full grid-cols-12 px-4 sm:px-2 sm:pr-0 main-account-grid">
            {/* <div className="col-span-3 border-r border-gray-200 md:pl-2 sm:pl-2 tab-list-sm sm:pt-10 mob-hidden">
              <div className="sticky left-0 z-10 flex flex-col top-36">
                {config.map((item: any, idx: number) => (
                  <>
                    <div
                      key={`my-acc-${idx}`}
                      // href="#"
                      className={`hover:bg-white hover:text-indigo-600 border border-transparent text-md leading-3 font-medium text-gray-900 rounded-md focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60"}`}
                    >
                      <span className="pr-2 leading-none align-middle acc-mob-icon-i sm:absolute top-2/4 -translate-y-2/4">
                        <i
                          className={
                            item.text.toLowerCase() + ' ' + 'sprite-icon'
                          }
                        ></i>
                      </span>

                      {item.text == 'My Orders' ? (
                        <>
                          <div
                            key={`my-acc-${idx}`}
                            className={`relative ring-opacity-60 border-b border-slate-300 sm:border-0 cursor-pointer ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2  w-full text-14  leading-5 text-left pl-2 ${
                              item.text == 'My Orders'
                                ? 'bg-gray-200 text-black font-semibold border-l-4 sm:border-b-0 sm:border-l-4 sm:border-black opacity-full'
                                : 'font-medium'
                            }`}
                          >
                            <span className="pr-2 leading-none align-middle acc-mob-icon-i sm:absolute top-2/4 -translate-y-2/4">
                              <i
                                className={
                                  item.text.toLowerCase() + ' ' + 'sprite-icon'
                                }
                              ></i>
                            </span>
                            <Link
                              shallow={true}
                              href={item.href}
                              passHref
                              onClick={() => {
                                handleClick
                                setShow(false)
                              }}
                              className="inline-block w-full h-full py-4 text-sm text-primary"
                            >
                              <span className="inline-block text-black sm:hidden dark:text-black">
                                {item.mtext}
                              </span>
                              <span
                                className={`hidden sm:inline-block text-black dark:text-black ${
                                  item.text == 'My Orders' && 'font-display'
                                }`}
                              >
                                {item.text}
                              </span>
                            </Link>
                          </div>
                        </>
                      ) : (
                        <>
                          <Link
                            shallow={true}
                            href={item.href}
                            passHref
                            onClick={() => {
                              handleClick
                            }}
                            className="inline-block w-full h-full py-4 pl-2 text-sm transition text-primary hover:bg-gray-100"
                          >
                            <span className="inline-block text-black sm:hidden dark:text-black">
                              {item.mtext}
                            </span>
                            <span
                              className={`hidden sm:inline-block text-black dark:text-black ${
                                item.text == 'My Orders' && 'font-display'
                              }`}
                            >
                              {item.text}
                            </span>
                          </Link>
                        </>
                      )}
                    </div>
                  </>
                ))}
              </div>
            </div> */}
            <SideMenu
              handleClick={handleClick}
              setShow={setShow}
              currentOption={currentOption}
            />
            <div
              className={`relative col-span-9 lg:col-span-8 md:col-span-8 border-l tabpanel-sm mob-tab-full ${isShow ? `` : ''
                }`}
            >
              <div className={'orders bg-white my-2 sm:my-6 pl-2'}>
                <MyOrders
                  allOrders={allOrders}
                  handleInfiniteScroll={handleInfiniteScroll}
                  deviceInfo={deviceInfo}
                  isShowDetailedOrder={isShowDetailedOrder}
                  setIsShowDetailedOrder={setIsShowDetailedOrder}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

MyAccount.Layout = Layout

const PAGE_TYPE = PAGE_TYPES.Page

export async function getServerSideProps(context: any) {
  const { locale } = context
  const config = useConfig();
  const defaultIndex = config.findIndex((element: any) => element.props === context.query.view) || 0
  return {
    props: {
      ...(await serverSideTranslations(locale ?? BETTERCOMMERCE_DEFAULT_LANGUAGE!)),
      defaultView: defaultIndex,
    }, // will be passed to the page component as props
  }
}

export default withDataLayer(withAuth(MyAccount), PAGE_TYPE, true)
