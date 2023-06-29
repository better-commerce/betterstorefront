import dynamic from 'next/dynamic'
import { FC, Fragment, useState, useRef, useEffect } from 'react'
import { classNames } from '../../utils'
import { Popover, Transition, Dialog, Tab, Disclosure } from '@headlessui/react'
import { Searchbar } from '@components/common'
import { Logo } from '@components/ui'
import Link from 'next/link'
//
import { ChevronUpIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'

import { useRouter } from 'next/router'
import { useUI } from '@components/ui'
import axios from 'axios'
import { NEXT_SET_CONFIG, SocialMediaType } from '@components/utils/constants'
import Router from 'next/router'
import Cookies from 'js-cookie'
import {
  Bars3Icon,
  XMarkIcon,
  ShoppingCartIcon,
  HeartIcon,
} from '@heroicons/react/24/outline'
const Account = dynamic(() => import('./AccountDropdown'))
const CurrencySwitcher = dynamic(() => import('./CurrencySwitcher'))
const LanguageSwitcher = dynamic(() => import('./LanguageSwitcher'))
import {
  BTN_SIGN_OUT,
  GENERAL_LOGIN,
  GENERAL_MY_ORDERS,
  GENERAL_RECENTLY_VIEWED,
  GENERAL_REGISTER,
  MY_ACCOUNT_TITLE,
  GENERAL_WORKFLOW_TITLE,
  SELECT_CURRENCY,
  SELECT_LANGUAGE,
  GENERAL_ITEM_IN_CART,
  SOCIAL_REGISTER_GOOGLE,
  SOCIAL_REGISTER_FACEBOOK,
} from '@components/utils/textVariables'
import {
  getCurrentPage,
  removePrecedingSlash,
  vatIncluded,
} from '@framework/utils/app-util'
import { recordGA4Event } from '@components/services/analytics/ga4'
import { IExtraProps } from '../Layout/Layout'
import ToggleSwitch from '../ToggleSwitch'
import { getItem, setItem } from '@components/utils/localStorage'
import { signOut } from 'next-auth/react'

interface Props {
  config: []
  currencies: []
  languages: []
}

const accountDropDownConfigUnauthorized: any = [
  {
    href: '/my-account/login',
    title: GENERAL_LOGIN,
    className:
      'max-w-xs text-black text-left flex-1 font-medium py-3 px-2 flex sm:w-full',
    head: null,
    tail: null,
  },
  {
    href: '/my-account/register',
    title: GENERAL_REGISTER,
    className:
      'max-w-xs text-black text-left flex-1 op-75 py-3 px-2 flex font-medium sm:w-full',
    head: null,
    tail: null,
  },
  {
    href: `/my-account/login/social/${SocialMediaType.GOOGLE}`,
    title: SOCIAL_REGISTER_GOOGLE,
    className:
      'items-center max-w-xs text-black text-left flex-1 op-75 py-3 px-2 flex font-medium sm:w-full',
    head: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="inline-block w-4 h-4 mr-1 rounded google-plus-logo"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          d="M7 11v2.4h3.97c-.16 1.029-1.2 3.02-3.97 3.02-2.39 0-4.34-1.979-4.34-4.42 0-2.44 1.95-4.42 4.34-4.42 1.36 0 2.27.58 2.79 1.08l1.9-1.83c-1.22-1.14-2.8-1.83-4.69-1.83-3.87 0-7 3.13-7 7s3.13 7 7 7c4.04 0 6.721-2.84 6.721-6.84 0-.46-.051-.81-.111-1.16h-6.61zm0 0 17 2h-3v3h-2v-3h-3v-2h3v-3h2v3h3v2z"
          fill-rule="evenodd"
          clip-rule="evenodd"
        />
      </svg>
    ),
    tail: null,
  },
  {
    href: `/my-account/login/social/${SocialMediaType.FACEBOOK}`,
    title: SOCIAL_REGISTER_FACEBOOK,
    className:
      'items-center max-w-xs text-black text-left flex-1 op-75 py-3 px-2 flex font-medium sm:w-full',
    head: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="inline-block w-4 h-4 mr-1 rounded fb-logo"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
      </svg>
    ),
    tail: null,
  },
]

const Navbar: FC<Props & IExtraProps> = ({
  config,
  currencies,
  languages,
  deviceInfo,
  maxBasketItemsCount,
  onIncludeVATChanged,
}) => {
  const router = useRouter()

  const {
    wishListItems,
    cartItems,
    isGuestUser,
    user,
    deleteUser,
    openCart,
    openWishlist,
    setShowSearchBar,
  } = useUI()

  let currentPage = getCurrentPage()
  const { isMobile, isIPadorTablet } = deviceInfo
  const [delayEffect, setDelayEffect] = useState(false)

  let deviceCheck = ''
  if (isMobile || isIPadorTablet) {
    deviceCheck = 'Mobile'
  } else {
    deviceCheck = 'Desktop'
  }

  const accountDropDownConfigAuthorized: any = [
    {
      href: '/my-account',
      title: MY_ACCOUNT_TITLE,
      className: 'text-left p-2 cursor-pointer',
    },
    {
      href: '/my-account/orders',
      title: GENERAL_MY_ORDERS,
      className: 'text-left p-2 cursor-pointer',
    },
    {
      href: '/my-account',
      title: GENERAL_RECENTLY_VIEWED,
      className: 'text-left p-2 cursor-pointer',
    },
    {
      href: '/',
      onClick: async () => {
        deleteUser({
          router: Router,
        })

        if (user?.socialData?.socialMediaType) {
          await signOut()
        }
      },
      title: BTN_SIGN_OUT,
      className: 'text-left p-2 cursor-pointer text-red-600',
    },
  ]

  let accountDropdownConfig = accountDropDownConfigUnauthorized
  let title = !isGuestUser
    ? user.userId
      ? `Hi, ${user.firstName}`
      : 'My account'
    : ''

  if (!isGuestUser && user.userId) {
    accountDropdownConfig = accountDropDownConfigAuthorized
  }

  const configAction = (pair: any) => {
    const value: any = Object.values(pair)[0]
    const key = Object.keys(pair)[0]
    const { pathname, asPath, query } = Router
    Cookies.set(key, value)
    axios
      .post(NEXT_SET_CONFIG, { obj: pair })
      .then(() => {
        Router.reload()
      })
      .catch((err: any) => console.log(err))
  }

  const hyperlinkHandler = (hyperlink: string) => {
    return hyperlink[0] === '/' ? hyperlink : `/${hyperlink}`
  }

  const [open, setOpen] = useState(false)

  const buttonRef = useRef<HTMLButtonElement>(null) // useRef<HTMLButtonElement>(null)
  const [openState, setOpenState] = useState(-1)
  const isProduction = process.env.NODE_ENV === 'production'
  const [renderState, setRenderState] = useState(isProduction)

  // update 'renderState' to check whether the component is rendered or not
  // used for removing hydration errors
  useEffect(() => {
    if (!isProduction) {
      setRenderState(true)
      setIncludeVATToggle()
    }
  }, [])

  const setIncludeVATToggle = () => {
    const elemSwitch: any = document.querySelector(
      "div.include-vat input[role='switch']"
    )
    if (elemSwitch && getItem('includeVAT') === 'true') {
      setItem('includeVAT', 'false')
      setTimeout(() => {
        if (elemSwitch.click) {
          elemSwitch.click()
        } else if (elemSwitch.onClick) {
          elemSwitch.onClick()
        }
      }, 100)
    }
  }

  const viewWishlist = () => {
    if (currentPage) {
      if (typeof window !== 'undefined') {
        recordGA4Event(window, 'wishlist', {
          ecommerce: {
            header: 'Menu Bar',
            current_page: currentPage,
          },
        })
      }
    }
  }

  function viewCart(cartItems: any) {
    if (currentPage) {
      if (typeof window !== 'undefined') {
        recordGA4Event(window, 'view_cart', {
          ecommerce: {
            items: cartItems?.lineItems?.map((items: any, itemId: number) => ({
              item_name: items?.name,
              item_id: items?.sku,
              price: items?.price?.raw?.withTax,
              item_brand: items?.brand,
              item_category2: items?.categoryItems?.length
                ? items?.categoryItems[1]?.categoryName
                : '',
              item_variant: items?.colorName,
              item_list_name: items?.categoryItems?.length
                ? items?.categoryItems[0]?.categoryName
                : '',
              item_list_id: '',
              index: itemId,
              quantity: items?.qty,
              item_var_id: items?.stockCode,
            })),
            device: deviceCheck,
            current_page: currentPage,
          },
        })
      }
    }
  }

  const hamburgerMenu = () => {
    if (currentPage) {
      if (typeof window !== 'undefined') {
        recordGA4Event(window, 'hamburger_menu', {
          current_page: currentPage,
          device: deviceCheck,
        })
        recordGA4Event(window, 'hamburger_icon_click', {
          header: 'Menu',
          sub_header: '',
          sub_header2: '',
          current_page: currentPage,
          device: deviceCheck,
        })
      }
    }
  }

  const hamburgerMenuClick = (item: any) => {
    if (currentPage) {
      if (typeof window !== 'undefined') {
        recordGA4Event(window, 'hamgurger_menu_click', {
          header: item,
          sub_header: '',
          sub_header2: '',
          current_page: currentPage,
          device: deviceCheck,
        })
      }
    }
  }

  const hamburgerMenuClickLevel2 = (item: any, subHeader: any) => {
    if (currentPage) {
      if (typeof window !== 'undefined') {
        recordGA4Event(window, 'hamgurger_menu_click', {
          header: item,
          sub_header: subHeader,
          sub_header2: '',
          current_page: currentPage,
          device: deviceCheck,
        })
      }
    }
  }

  const hamburgerMenuClickLevel3 = (
    item: any,
    subHeader: any,
    subHeader2: any
  ) => {
    if (currentPage) {
      if (typeof window !== 'undefined') {
        recordGA4Event(window, 'hamgurger_menu_click', {
          header: item,
          sub_header: subHeader,
          sub_header2: subHeader2,
          current_page: currentPage,
          device: deviceCheck,
        })
      }
    }
  }

  useEffect(() => {
    setDelayEffect(true)
  }, [])

  return (
    <>
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 flex z-999 lg:hidden"
          onClose={setOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div className="relative flex flex-col w-full max-w-xs pb-12 overflow-y-auto bg-white shadow-xl z-9999">
              <div className="flex justify-between px-4 pt-5 pb-2 item-center">
                <div className="px-0 text-sm font-bold text-black sm:text-lg whitespace-nowrap">
                  INC VAT
                  <ToggleSwitch
                    className="px-4 include-vat"
                    height={15}
                    width={40}
                    checked={vatIncluded()}
                    checkedIcon={
                      <div className="ml-1 include-vat-checked">Yes</div>
                    }
                    uncheckedIcon={
                      <div className="mr-1 include-vat-unchecked">No</div>
                    }
                    onToggleChanged={onIncludeVATChanged}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="absolute inline-flex items-center justify-center p-2 -m-2 text-gray-400 rounded-md right-3 top-3"
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon
                    className="mt-1 text-black w-7 h-7"
                    aria-hidden="true"
                  />
                </button>
              </div>

              <Tab.Group as="div" className="mt-2 border-b border-gray-200">
                {config?.map((item: any, idx: number) => {
                  return (
                    <div key={idx}>
                      {!item.navBlocks.length ? (
                        <Link
                          key={idx}
                          title={item.caption}
                          href={hyperlinkHandler(
                            removePrecedingSlash(item.hyperlink)
                          )}
                          passHref
                          onClick={() => {
                            hamburgerMenuClick(item.caption)
                            setOpen(false)
                          }}
                          className="flex flex-col px-4 py-4 text-sm font-bold text-black border-t whitespace-nowrap"
                        >
                          {item.caption}
                        </Link>
                      ) : (
                        <Disclosure key={`disclosure-start-${item.caption}`}>
                          {({ open }) => (
                            <>
                              <Disclosure.Button
                                className="flex justify-between w-full px-0 -mb-px space-x-0 text-left border-t"
                                onClick={() => hamburgerMenuClick(item.caption)}
                              >
                                <div className="flex flex-col px-4 py-4 text-sm font-bold text-black sm:text-lg whitespace-nowrap">
                                  {item.caption}
                                </div>
                                <div className="pt-5 pr-3">
                                  <ChevronUpIcon
                                    className={`${
                                      !open
                                        ? 'transition-transform duration-150 rotate-180 transform'
                                        : 'transition-transform duration-150 rotate-0 transform'
                                    } h-5 w-5 text-black`}
                                  />
                                </div>
                              </Disclosure.Button>

                              <Disclosure.Panel
                                as={Fragment}
                                key={`disclosure-panel-${item.caption}`}
                              >
                                <div className="space-y-4">
                                  {item.navBlocks.length
                                    ? item.navBlocks.map(
                                        (navBlock: any, navIdx: number) => {
                                          return (
                                            <div
                                              key={`navbar-parent-${navIdx}`}
                                              className="grid grid-cols-1 px-5 py-2 border-t border-gray-200 sm:px-0 gap-y-0 gap-x-0 lg:gap-x-0"
                                            >
                                              <ul
                                                role="list"
                                                aria-labelledby="clothing-heading"
                                                className="col-span-1"
                                              >
                                                {navBlock.navItems.map(
                                                  (navItem: any, idx: any) => (
                                                    <Link
                                                      legacyBehavior
                                                      key={`${navItem.caption}-${idx}`}
                                                      title={navItem.caption}
                                                      href={`/${removePrecedingSlash(
                                                        navItem.itemLink
                                                      )}`}
                                                      passHref
                                                    >
                                                      <li
                                                        onClick={() => {
                                                          setOpen(false)
                                                          hamburgerMenuClickLevel2(
                                                            item.caption,
                                                            navBlock.boxTitle
                                                          )
                                                        }}
                                                        className="flex pb-2 my-3 text-sm text-gray-700 hover:text-gray-800 dark:text-gray-700"
                                                      >
                                                        {navItem.caption}
                                                      </li>
                                                    </Link>
                                                  )
                                                )}
                                              </ul>
                                            </div>
                                          )
                                        }
                                      )
                                    : null}
                                </div>
                              </Disclosure.Panel>
                            </>
                          )}
                        </Disclosure>
                      )}
                    </div>
                  )
                })}
              </Tab.Group>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition.Root>
      {!isMobile && !isIPadorTablet && (
        <div className="fixed top-0 w-full h-6 bg-gray-300 z-999">
          <div className="container flex justify-end w-full px-6 pt-1 mx-auto">
            <div className="flex flex-col py-0 text-xs font-medium text-black sm:text-xs whitespace-nowrap">
              Prices inc VAT
            </div>
            <div className="flow-root w-10 px-2 sm:w-12">
              <div className="flex justify-center flex-1 mx-auto">
                <ToggleSwitch
                  className="include-vat"
                  height={15}
                  width={40}
                  checked={vatIncluded()}
                  checkedIcon={
                    <div className="ml-1 include-vat-checked">Yes</div>
                  }
                  uncheckedIcon={
                    <div className="mr-1 include-vat-unchecked">No</div>
                  }
                  onToggleChanged={onIncludeVATChanged}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      <header className="fixed top-0 right-0 w-full bg-white shadow-md sm:top-6 bg-header-color z-999 navbar-min-64">
        <nav
          aria-label="Top"
          className="flex items-center justify-between w-full h-16 px-4 pb-0 mx-auto sm:pb-0 md:w-4/5 sm:px-0 lg:px-0"
        >
          <button
            type="button"
            className="py-4 pl-2 pr-2 -ml-2 text-gray-400 bg-transparent rounded-md sm:hidden"
            onClick={() => {
              hamburgerMenu()
              setOpen(true)
            }}
          >
            <span className="sr-only">Open menu</span>
            <Bars3Icon className="w-6 h-6 mob-menu-icon" aria-hidden="true" />
          </button>

          <Link href="/" title="BetterCommerce">
            <div className="flex w-32 cursor-pointer">
              <span className="sr-only">{GENERAL_WORKFLOW_TITLE}</span>
              <Logo />
            </div>
          </Link>

          {renderState && (
            <Popover.Group className="absolute inset-x-0 bottom-0 hidden w-full h-16 px-6 pb-px space-x-8 overflow-x-auto border-t sm:border-t-0 sm:justify-left sm:overflow-visible sm:pb-0 sm:static sm:self-stretch sm:flex sm:h-16">
              {config?.map((item: any, idx: number) => (
                <Popover
                  key={`popover-fly-menu-${idx}`}
                  className="flex"
                  onMouseEnter={() => setOpenState(idx)}
                  onMouseLeave={() => setOpenState(-1)}
                >
                  {({ open }) => (
                    <>
                      {!item.navBlocks.length ? (
                        <Popover.Button
                          className={classNames(
                            openState == idx
                              ? 'border-indigo-600 text-indigo-600 text-hover-clr border-hover-clr'
                              : 'border-transparent text-black hover:text-black text-header-clr',
                            'relative z-10 flex items-center sm:h-16 transition-colors ease-out duration-200 text-sm font-medium border-b-2 -mb-px pt-px'
                          )}
                        >
                          <Link
                            href={`/${removePrecedingSlash(item.hyperlink)}`}
                            className="relative flex items-center h-full text-header-clr"
                            title={item.caption}
                          >
                            {item.caption}
                          </Link>
                        </Popover.Button>
                      ) : (
                        <Popover.Button
                          className={classNames(
                            openState == idx
                              ? 'border-indigo-600 text-indigo-600 text-hover-clr border-hover-clr'
                              : 'border-transparent text-black hover:text-black text-header-clr',
                            'relative z-10 flex items-center sm:h-16 transition-colors ease-out uppercase hover:font-semibold duration-200 text-sm font-medium border-b-2 -mb-px pt-px'
                          )}
                        >
                          {item.caption}
                        </Popover.Button>
                      )}
                      {item.navBlocks.length ? (
                        <Transition
                          show={openState == idx}
                          as={Fragment}
                          enter="transition ease-out duration-200"
                          enterFrom="opacity-0"
                          enterTo="opacity-100"
                          leave="transition ease-in duration-150"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <Popover.Panel className="absolute inset-x-0 text-gray-500 bg-white top-full z-999 sm:text-sm">
                            <div className="relative grid items-start w-4/5 grid-cols-1 px-4 pt-10 pb-12 mx-auto bg-white sm:px-0 lg:px-0 gap-y-10 gap-x-6 md:grid-cols-1 lg:gap-x-8">
                              {item.navBlocks.map(
                                (navBlock: any, navIdx: number) => (
                                  <>
                                    <h5 className="text-xl font-semibold text-gray-900 capitalize">
                                      {navBlock.boxTitle}
                                    </h5>
                                    <div
                                      key={`navItems-${navIdx}`}
                                      className="grid grid-cols-5 pt-4 border-t border-gray-100 sm:pt-6 gap-y-1 gap-x-6 lg:gap-x-8"
                                    >
                                      {navBlock.navItems.map(
                                        (navItem: any, idx: number) => (
                                          <Popover.Button
                                            key={`popover-button-${idx}`}
                                            className={classNames(
                                              openState == idx
                                                ? ''
                                                : 'border-gray-200 text-gray-700 hover:text-pink',
                                              'relative z-10 flex my-2 items-center transition-colors ease-out duration-200 text-md font-normal text-gray-600 hover:text-pink hover:font-semibold -mb-px pt-px'
                                            )}
                                          >
                                            <Link
                                              href={`/${removePrecedingSlash(
                                                navItem.itemLink
                                              )}`}
                                              className="relative flex items-center h-full hover:text-pink"
                                              title={navItem.caption}
                                            >
                                              {navItem.caption}
                                            </Link>
                                          </Popover.Button>
                                        )
                                      )}
                                    </div>
                                  </>
                                )
                              )}
                            </div>
                          </Popover.Panel>
                        </Transition>
                      ) : null}
                    </>
                  )}
                </Popover>
              ))}
            </Popover.Group>
          )}
          <div className="flex items-center justify-end flex-1 cart-icon-dark-white">
            <Searchbar onClick={setShowSearchBar} />
            <Account
              title={title}
              config={accountDropdownConfig}
              deviceInfo={deviceInfo}
            />
            <div className="hidden sm:flex">
              <CurrencySwitcher
                config={currencies}
                title={SELECT_CURRENCY}
                action={configAction}
              />
              <LanguageSwitcher
                config={languages}
                title={SELECT_LANGUAGE}
                action={configAction}
              />
            </div>
            <div className="flow-root w-10 px-1 sm:w-16">
              <button
                className="relative grid flex-col items-center justify-center grid-cols-1 mx-auto text-center group icon-grp align-center"
                onClick={() => {
                  viewWishlist()
                  openWishlist()
                }}
              >
                <HeartIcon
                  className="flex-shrink-0 block w-6 h-6 mx-auto text-black group-hover:text-red-600"
                  aria-hidden="true"
                  aria-label="Wishlist"
                />
                <span className="hidden text-sm font-normal text-black sm:block text-header-clr text-icon-display">
                  Wishlist
                </span>
                {wishListItems.length > 0 && delayEffect && (
                  <span className="absolute top-0 hidden w-4 h-4 ml-2 text-xs font-semibold text-center text-white bg-black rounded-full sm:block -right-0">
                    {wishListItems.length}
                  </span>
                )}
                <span className="sr-only">{GENERAL_ITEM_IN_CART}</span>
              </button>
            </div>

            <div className="flow-root w-10 px-1 sm:w-16">
              <button
                className="relative grid flex-col items-center justify-center grid-cols-1 mx-auto text-center group icon-grp align-center"
                onClick={() => {
                  viewCart(cartItems)
                  openCart()
                }}
              >
                <ShoppingCartIcon
                  className="flex-shrink-0 block w-6 h-6 mx-auto text-black group-hover:text-gray-500"
                  aria-hidden="true"
                  aria-label="Add to cart"
                />
                <span className="hidden text-sm font-normal text-black sm:block text-header-clr text-icon-display">
                  Cart
                </span>
                {renderState && (
                  <>
                    {cartItems.lineItems?.length > 0 && (
                      <span className="absolute w-4 h-4 ml-2 text-xs font-medium text-center text-white bg-gray-500 rounded-full -top-1 -right-2">
                        {cartItems.lineItems?.length}
                      </span>
                    )}
                    <span className="sr-only">{GENERAL_ITEM_IN_CART}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </nav>
      </header>
    </>
  )
}
export default Navbar
