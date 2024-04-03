import { useState, useEffect } from 'react'
import NextHead from 'next/head'
import Layout from '@components/Layout/Layout'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import { useConfig } from '@components/utils/myAccount'
import withAuth from '@components/utils/withAuth'
import { useRouter } from 'next/router'
import { EVENTS_MAP } from '@components/services/analytics/constants'
import useAnalytics from '@components/services/analytics/useAnalytics'
import { useUI } from '@components/ui/context'
import React from 'react'
import AddressBook from '@components/account/Address/AddressBook'
import SideMenu from '@components/account/MyAccountMenu'
import { BETTERCOMMERCE_DEFAULT_LANGUAGE, SITE_ORIGIN_URL } from '@components/utils/constants'
import { useTranslation } from '@commerce/utils/use-translation'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { removeQueryString } from '@commerce/utils/uri-util'

function MyAccount() {
  const [isShow, setShow] = useState(true)
  const { user, deleteUser, isGuestUser } = useUI()
  const router = useRouter()
  const translate = useTranslation()
  const { CustomerProfileViewed } = EVENTS_MAP.EVENT_TYPES
  const { Customer } = EVENTS_MAP.ENTITY_TYPES
  const currentOption = translate('label.myAccount.mySavedAddressText')

  useEffect(() => {
    if (isGuestUser) {
      router.push('/')
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
  const [active, setActive] = useState(false)

  const handleClick = () => {
    setActive(!active)
  }
  useAnalytics(CustomerProfileViewed, loggedInEventData)
  const cleanPath = removeQueryString(router.asPath)

  return (
    <>
      <NextHead>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <link rel="canonical" href={SITE_ORIGIN_URL + cleanPath} />
        <title>{translate('label.myAccount.mySavedAddressText')}</title>
        <meta name="title" content={translate('label.myAccount.mySavedAddressText')} />
        <meta name="description" content={translate('label.myAccount.mySavedAddressText')} />
        <meta name="keywords" content={translate('label.myAccount.mySavedAddressText')} />
        <meta property="og:image" content="" />
        <meta property="og:title" content={translate('label.myAccount.mySavedAddressText')} key="ogtitle" />
        <meta property="og:description" content={translate('label.myAccount.mySavedAddressText')} key="ogdesc" />
      </NextHead>

      <section className="container w-full">
        <div className="mt-14 sm:mt-20">
          <div className="max-w-4xl mx-auto">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold xl:text-4xl">Account</h2>
              <span className="block mt-4 text-base text-neutral-500 dark:text-neutral-400 sm:text-lg">
                <span className="font-semibold text-slate-900 dark:text-slate-200">
                  {user?.firstName},
                </span>{" "}
                {user.email}
              </span>
            </div>
            <hr className="mt-10 border-slate-200 dark:border-slate-700"></hr>
            <SideMenu
              handleClick={handleClick}
              setShow={setShow}
              currentOption={currentOption}
            />
            <hr className="border-slate-200 dark:border-slate-700"></hr>
          </div>
          <div
            className="max-w-4xl pb-24 mx-auto pt-14 sm:pt-26 lg:pb-32">
            <h2 className='text-2xl font-semibold sm:text-3xl'>Address Book</h2>
            <div className={'orders bg-white my-2 sm:my-6'}>
              <AddressBook />
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
