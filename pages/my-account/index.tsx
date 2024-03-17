import { useState, useEffect } from 'react'
import { Layout } from '@components/common'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import { config } from '@components/utils/myAccount'
import withAuth from '@components/utils/withAuth'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { EVENTS_MAP } from '@components/services/analytics/constants'
import useAnalytics from '@components/services/analytics/useAnalytics'
import { useUI } from '@components/ui/context'
import React from 'react'
import MyDetails from '@components/account/MyDetails'
import { Guid } from '@commerce/types'
import NextHead from 'next/head'
import { BETTERCOMMERCE_DEFAULT_LANGUAGE, SITE_ORIGIN_URL } from '@components/utils/constants'
import { useTranslation } from '@commerce/utils/use-translation'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
function MyAccount({ defaultView, isLoggedIn }: any) {
  const [isShow, setShow] = useState(true)
  const [view, setView] = useState(defaultView)
  const { user, deleteUser, isGuestUser, referralProgramActive } = useUI()
  const router = useRouter()
  const translate = useTranslation()
  const { CustomerProfileViewed } = EVENTS_MAP.EVENT_TYPES
  const { Customer } = EVENTS_MAP.ENTITY_TYPES
  let newConfig: any = []
  if (config && typeof window !== 'undefined') {
    let isB2B = user?.companyId !== Guid.empty
    const hasMyCompany = config.some(
      (item: any) => item?.props === 'my-company'
    )
    const hasReferral = config.some(
      (item: any) => item?.props === 'refer-a-friend'
    )
    newConfig = [...config]
    if (isB2B) {
      let i = newConfig.length
      if (referralProgramActive) {
        if (!hasReferral) {
          newConfig.push({
            type: 'tab',
            text: 'Refer a Friend',
            mtext: 'Refer a Friend',
            props: 'refer-a-friend',
            href: "/my-account/refer-a-friend"
          })
        }
      }
      while (i--) {
        if (
          newConfig[i]?.props === 'address-book' ||
          newConfig[i]?.props === 'orders'
        ) {
          newConfig.splice(i, 1)
        }
      }
    }
    if (!isB2B) {
      if (referralProgramActive) {
        if (!hasReferral) {
          newConfig = [...config]
          newConfig.push({
            type: 'tab',
            text: 'Refer a Friend',
            mtext: 'Refer a Friend',
            props: 'refer-a-friend',
            href: "/my-account/refer-a-friend"
          })
        }
      } else {
        newConfig = [...config]
      }
    } else if (!hasMyCompany) {
      newConfig.push({
        type: 'tab',
        text: 'My Company',
        mtext: 'My Company',
        props: 'my-company',
        href: '/my-account/my-company',
      })
    }
  }

  useEffect(() => {
    if (isGuestUser) {
      router.push('/')
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
  const [active, setActive] = useState(false)
  const handleClick = () => {
    setActive(!active)
  }
  useAnalytics(CustomerProfileViewed, loggedInEventData)

  const handleToggleShowState = () => {
    setShow(!isShow)
  }

  // return(<h1>helow wprdls</h1>)
  return (
    <>
      <NextHead>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="canonical" href={SITE_ORIGIN_URL + router.asPath} />
        <title>{translate('common.label.myAccountText')}</title>
        <meta name="title" content="My Account" />
        <meta name="description" content="My Account" />
        <meta name="keywords" content="My Account" />
        <meta property="og:image" content="" />
        <meta property="og:title" content="My Account" key="ogtitle" />
        <meta property="og:description" content="My Account" key="ogdesc" />
      </NextHead>
      <section className="relative pb-10 text-gray-900">
        <div className="w-full px-0 mx-auto md:container sm:px-0 lg:px-0">
          <div className="grid w-full grid-cols-12 sm:px-2 sm:pr-0 main-account-grid">
            <div
              className={`col-span-3 md:pl-2 sm:pl-2 border-r border-gray-200 tab-list-sm sm:pt-10 mob-tab-full ${isShow ? `` : 'mob-hidden'
                }`}
            >
              <div className="sticky left-0 z-10 flex flex-col top-36">
                {newConfig?.map((item: any, idx: number) => (
                  <>
                    <div
                      key={`my-acc-${idx}`}
                      className={`pl-2 text-md leading-3 font-medium text-red-900 rounded-md focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60"}`}
                    >
                      {/* <span className="pr-2 leading-none align-middle acc-mob-icon-i sm:absolute top-2/4 -translate-y-2/4">
                        <i
                          className={
                            item.text.toLowerCase() + ' ' + 'sprite-icon'
                          }
                        ></i>
                      </span> */}

                      {item.text == 'My Details' ? (
                        <div
                          key={`my-acc-${idx}`}
                          className={`relative ring-opacity-60 border-b border-slate-300 sm:border-0 cursor-pointer ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2  w-full text-14  leading-5 text-left pl-2 ${item.text == 'My Details'
                              ? 'bg-gray-200 text-black font-semibold border-l-4 sm:border-b-0 sm:border-l-4 sm:border-black opacity-full'
                              : 'font-medium'
                            }`}
                        >
                          {/* <span className="pr-2 leading-none align-middle acc-mob-icon-i sm:absolute top-2/4 -translate-y-2/4">
                            <i
                              className={
                                item.text.toLowerCase() + ' ' + 'sprite-icon'
                              }
                            ></i>
                          </span> */}
                          <Link
                            shallow={true}
                            href={item.href}
                            passHref
                            onClick={() => {
                              handleClick()
                              handleToggleShowState()
                            }}
                            className="inline-block w-full h-full py-4 pl-2 text-sm transition text-primary hover:bg-gray-100"
                          >
                            <span className="inline-block text-black sm:hidden dark:text-black">
                              {item.mtext}
                            </span>
                            <span
                              className={`hidden sm:inline-block text-black dark:text-black ${item.text == 'My Details' && 'font-display'
                                }`}
                            >
                              {item.text}
                            </span>
                          </Link>
                        </div>
                      ) : (
                        <>
                          <Link
                            shallow={true}
                            href={item.href}
                            passHref
                            onClick={() => {
                              handleClick()
                            }}
                            className="inline-block w-full h-full py-4 pl-2 text-sm transition text-primary hover:bg-gray-100"
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
                    </div>
                  </>
                ))}
              </div>
            </div>

            <div
              className={`relative col-span-9 border-l tabpanel-sm mob-tab-full ${isShow ? `mob-hidden` : ''
                }`}
            >
              <div className={'orders bg-white my-2 sm:my-6 px-4'}>
                <MyDetails handleToggleShowState={handleToggleShowState} />
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
  const defaultIndex = config.findIndex((element: any) => element.props === context.query.view) || 0
  return {
    props: {
      ...(await serverSideTranslations(locale ?? BETTERCOMMERCE_DEFAULT_LANGUAGE!)),
      defaultView: defaultIndex,
    }, // will be passed to the page component as props
  }
}

export default withDataLayer(withAuth(MyAccount), PAGE_TYPE, true)
