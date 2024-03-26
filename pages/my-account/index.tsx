import { useState, useEffect, useMemo } from 'react'
import { Layout } from '@components/common'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import { useConfig } from '@components/utils/myAccount'
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
function MyAccount() {
  const [isShow, setShow] = useState(true)
  const config = useConfig();
  const { user, deleteUser, isGuestUser, referralProgramActive } = useUI()
  const router = useRouter()
  const translate = useTranslation()
  const { CustomerProfileViewed } = EVENTS_MAP.EVENT_TYPES
  const { Customer } = EVENTS_MAP.ENTITY_TYPES
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
        <meta name="title" content={translate('common.label.myAccountText')} />
        <meta name="description" content={translate('common.label.myAccountText')} />
        <meta name="keywords" content={translate('common.label.myAccountText')} />
        <meta property="og:image" content="" />
        <meta property="og:title" content={translate('common.label.myAccountText')} key="ogtitle" />
        <meta property="og:description" content={translate('common.label.myAccountText')} key="ogdesc" />
      </NextHead>
      <section className="relative pb-10 text-gray-900">
        <div className="container w-full">
          <div className="mt-14 sm:mt-20">
            <div className="max-w-4xl mx-auto">
              <div className="max-w-2xl">
                <h2 className="text-3xl xl:text-4xl font-semibold">Account</h2>
                <span className="block mt-4 text-neutral-500 dark:text-neutral-400 text-base sm:text-lg">
                  <span className="text-slate-900 dark:text-slate-200 font-semibold">
                    {user?.firstName},
                  </span>{" "}
                  {user.email}
                </span>
              </div>
              <hr className="mt-10 border-slate-200 dark:border-slate-700"></hr>
              <div className="flex space-x-8 md:space-x-13 overflow-x-auto hiddenScrollbar">
                {newConfig?.map((item: any, idx: number) => (
                  <>
                    {item.text == 'My Details' ? (
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
                          className={`block py-5 md:py-8 border-b-2 flex-shrink-0 text-sm sm:text-base ${item.text == 'My Details'
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
                          className="block py-5 md:py-8  flex-shrink-0 text-sm sm:text-base"
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
          <div className="max-w-4xl mx-auto pt-14 sm:pt-26 pb-24 lg:pb-32">
            <div
              className="relative col-span-12  mob-tab-full"
            >
              <div className={'orders bg-white'}>
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
  return {
    props: {
      ...(await serverSideTranslations(locale ?? BETTERCOMMERCE_DEFAULT_LANGUAGE!)),
    }, // will be passed to the page component as props
  }
}

export default withDataLayer(withAuth(MyAccount), PAGE_TYPE, true)
