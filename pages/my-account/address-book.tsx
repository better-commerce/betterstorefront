import { useState, useEffect } from 'react'
import NextHead from 'next/head'
import { Layout } from '@components/common'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import { config } from '@components/utils/myAccount'
import withAuth from '@components/utils/withAuth'
import { useRouter } from 'next/router'
import { EVENTS_MAP } from '@components/services/analytics/constants'
import useAnalytics from '@components/services/analytics/useAnalytics'
import { useUI } from '@components/ui/context'
import React from 'react'
import AddressBook from '@components/account/Address/AddressBook'
import SideMenu from '@components/account/MyAccountMenu'
import { SITE_ORIGIN_URL } from '@components/utils/constants'
import { useTranslation } from '@commerce/utils/use-translation'

function MyAccount({ defaultView, isLoggedIn }: any) {
  const [isShow, setShow] = useState(true)
  const [view, setView] = useState(defaultView)
  const { user, deleteUser, isGuestUser } = useUI()
  const router = useRouter()
  const translate = useTranslation()
  const { CustomerProfileViewed } = EVENTS_MAP.EVENT_TYPES
  const { Customer } = EVENTS_MAP.ENTITY_TYPES
  const currentOption = 'My Saved Address'

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

  return (
    <> 
      <NextHead>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <link rel="canonical" href={SITE_ORIGIN_URL+router.asPath} />
        <title>{translate('label.myAccount.mySavedAddressText')}</title>
        <meta name="title" content={translate('label.myAccount.mySavedAddressText')} />
        <meta name="description" content={translate('label.myAccount.mySavedAddressText')} />
        <meta name="keywords" content={translate('label.myAccount.mySavedAddressText')} />
        <meta property="og:image" content="" />
        <meta property="og:title" content={translate('label.myAccount.mySavedAddressText')} key="ogtitle" />
        <meta property="og:description" content={translate('label.myAccount.mySavedAddressText')} key="ogdesc" />
      </NextHead>
  
      <section className="relative pb-10 text-gray-900 sm:text-sm">
        <div className="w-full px-0 mx-auto md:container sm:px-0 lg:px-0">
          {/* <div className="px-2 py-4 mx-5 mb-4 border-b mob-header md:hidden full-m-header">
            <h3 className="flex max-w-4xl gap-1 mx-5 mt-2 text-xl font-semibold text-black">
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
              <Link
                href="/my-account"
                passHref
                legacyBehavior
                className="mx-2 mr-2 leading-none"
              >
                My Saved Address
              </Link>
            </h3>
          </div> */}
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

                      {item.text == 'My Saved Address' ? (
                        <>
                          <div
                            key={`my-acc-${idx}`}
                            className={`relative ring-opacity-60 border-b border-slate-300 sm:border-0 cursor-pointer ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2  w-full text-14  leading-5 text-left pl-2 ${
                              item.text == 'My Saved Address'
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
                                className={`hidden sm:inline-block text-black dark:text-black${
                                  item.text == 'My Saved Address' &&
                                  'font-display'
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
                            <span className="inline-block text-black capitalize sm:hidden dark:text-black">
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
            </div> */}
            <SideMenu
              handleClick={handleClick}
              setShow={setShow}
              currentOption={currentOption}
            />
            <div
              className={`relative col-span-9 border-l tabpanel-sm mob-tab-full ${
                isShow ? `` : ''
              }`}
            >
              <div className={'orders bg-white my-2 sm:my-6 pl-2'}>
                <AddressBook />
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
  const defaultIndex =
    config.findIndex((element: any) => element.props === context.query.view) ||
    0
  return {
    props: { defaultView: defaultIndex }, // will be passed to the page component as props
  }
}

export default withDataLayer(withAuth(MyAccount), PAGE_TYPE, true)
