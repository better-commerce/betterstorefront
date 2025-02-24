import dynamic from 'next/dynamic'
import { FC, Fragment, useState, useRef, useEffect } from 'react'
import { classNames } from '../../utils'
import { Popover, Transition, Dialog, Tab, Disclosure } from '@headlessui/react'
import { Searchbar } from '@components/common'
import { Logo } from '@components/ui'
import Link from 'next/link'
import cn from 'classnames'
import { ChevronUpIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/router'
import { useUI } from '@components/ui'
import axios from 'axios'
import { EmptyString, NEXT_SET_CONFIG, SITE_ORIGIN_URL, SocialMediaType } from '@components/utils/constants'
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
const BulkAddTopNav = dynamic(() => import('@components/bulk-add/TopNav'))
import {
  getCurrentPage,
  getEnabledSocialLogins,
  removePrecedingSlash,
  vatIncluded,
} from '@framework/utils/app-util'
import { IExtraProps } from '../Layout/Layout'
import ToggleSwitch from '../ToggleSwitch'
import { getItem, setItem } from '@components/utils/localStorage'
import { signOut } from 'next-auth/react'
import { matchStrings, stringToBoolean } from '@framework/utils/parse-util'
import AppSearchAPIConnector from '@elastic/search-ui-app-search-connector'
import {
  buildAutocompleteQueryConfig,
  buildFacetConfigFromConfig,
  buildSearchOptionsFromConfig,
  getConfig,
} from '@components/config/config-helper'
import { Guid } from '@commerce/types'
import { useTranslation } from '@commerce/utils/use-translation'
import { AnalyticsEventType } from '@components/services/analytics'
import useAnalytics from '@components/services/analytics/useAnalytics'
import { EVENTS_MAP } from '@components/services/analytics/constants'
let connector: any
if (process.env.ELASTIC_ENGINE_NAME) {
  const { hostIdentifier, searchKey, endpointBase, engineName } = getConfig()
  connector = new AppSearchAPIConnector({
    searchKey,
    engineName,
    hostIdentifier,
    endpointBase,
  })
}

const elasticConfig = {
  searchQuery: {
    facets: buildFacetConfigFromConfig(),
    ...buildSearchOptionsFromConfig(),
  },
  autocompleteQuery: buildAutocompleteQueryConfig(),
  apiConnector: connector,
  alwaysSearchOnInitialLoad: true,
}
interface Props {
  config: []
  currencies: []
  languages: []
  configSettings: any
  keywords?: any
}


const Navbar: FC<Props & IExtraProps> = ({ config, configSettings, currencies, languages, deviceInfo, maxBasketItemsCount, onIncludeVATChanged, keywords, pluginConfig = [] }) => {
  const { recordAnalytics } = useAnalytics()
  const translate = useTranslation();
  const SOCIAL_LOGINS_ENABLED = getEnabledSocialLogins(pluginConfig)
  const socialLogins: Array<string> = SOCIAL_LOGINS_ENABLED.split(',')
  const router = useRouter()
  const { wishListItems, cartItems, isGuestUser, user, deleteUser, openCart, openWishlist, setShowSearchBar, openLoginSideBar, openBulkAdd, showSearchBar, } = useUI()
  let currentPage = getCurrentPage()
  const { isMobile, isIPadorTablet } = deviceInfo
  const [delayEffect, setDelayEffect] = useState(false)
  const b2bSettings = configSettings?.find((x: any) => matchStrings(x?.configType, 'B2BSettings', true))?.configKeys || []
  const b2bEnabled = b2bSettings?.length ? stringToBoolean(b2bSettings?.find((x: any) => x?.key === 'B2BSettings.EnableB2B')?.value) : false
  let deviceCheck = ''
  if (isMobile || isIPadorTablet) {
    deviceCheck = 'Mobile'
  } else {
    deviceCheck = 'Desktop'
  }

  const socialMediaConfigs = [
    {
        type: SocialMediaType.GOOGLE,
        title: translate('label.login.googleLoginText'),
        className: 'items-center max-w-xs text-black text-left flex-1 op-75 py-3 px-2 flex font-medium sm:w-full',
        head: (
            <svg xmlns="http://www.w3.org/2000/svg" className="inline-block w-4 h-4 mr-1 rounded google-plus-logo" fill="currentColor" viewBox="0 0 24 24">
                {' '}
                <path d="M7 11v2.4h3.97c-.16 1.029-1.2 3.02-3.97 3.02-2.39 0-4.34-1.979-4.34-4.42 0-2.44 1.95-4.42 4.34-4.42 1.36 0 2.27.58 2.79 1.08l1.9-1.83c-1.22-1.14-2.8-1.83-4.69-1.83-3.87 0-7 3.13-7 7s3.13 7 7 7c4.04 0 6.721-2.84 6.721-6.84 0-.46-.051-.81-.111-1.16h-6.61zm0 0 17 2h-3v3h-2v-3h-3v-2h3v-3h2v3h3v2z" fillRule="evenodd" clipRule="evenodd" />{' '}
            </svg>
        )
    },
    {
        type: SocialMediaType.FACEBOOK,
        title: translate('label.login.facebookLoginText'),
        className: 'items-center max-w-xs text-black text-left flex-1 op-75 py-3 px-2 flex font-medium sm:w-full',
        head: (
            <svg xmlns="http://www.w3.org/2000/svg" className="inline-block w-4 h-4 mr-1 rounded fb-logo" fill="currentColor" viewBox="0 0 24 24">
                {' '}
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />{' '}
            </svg>
        )
    },
    {
        type: SocialMediaType.APPLE,
        title: translate('label.login.appleLoginText'),
        className: 'items-center max-w-xs text-black text-left flex-1 op-75 py-3 px-2 flex font-medium sm:w-full',
        head: (
            <svg xmlns="http://www.w3.org/2000/svg" className="inline-block w-4 h-4 mr-1 rounded apple-logo" width="4" height="4" viewBox="0 0 496.255 608.728">
                {' '}
                <path d="M273.81 52.973C313.806.257 369.41 0 369.41 0s8.271 49.562-31.463 97.306c-42.426 50.98-90.649 42.638-90.649 42.638s-9.055-40.094 26.512-86.971zM252.385 174.662c20.576 0 58.764-28.284 108.471-28.284 85.562 0 119.222 60.883 119.222 60.883s-65.833 33.659-65.833 115.331c0 92.133 82.01 123.885 82.01 123.885s-57.328 161.357-134.762 161.357c-35.565 0-63.215-23.967-100.688-23.967-38.188 0-76.084 24.861-100.766 24.861C89.33 608.73 0 455.666 0 332.628c0-121.052 75.612-184.554 146.533-184.554 46.105 0 81.883 26.588 105.852 26.588z" />{' '}
            </svg>
        )
    }
 ];

  const accountDropDownConfigUnauthorized: any = [
    { href: '/my-account/login', title: translate('label.login.loginBtnText'), className: 'max-w-xs text-black text-left flex-1 font-medium py-3 px-2 flex sm:w-full', head: null, tail: null, },
    { href: '/my-account/register', title: translate('common.label.registerText'), className: 'max-w-xs text-black text-left flex-1 op-75 py-3 px-2 flex font-medium sm:w-full', head: null, tail: null, },  
  ]

  socialMediaConfigs?.forEach(socialMediaConfig => {
    if (socialLogins?.includes(socialMediaConfig?.type)) {
        accountDropDownConfigUnauthorized?.push({
            href: `/my-account/login/social/${socialMediaConfig.type}`,
            title: socialMediaConfig?.title,
            className: socialMediaConfig?.className,
            head: socialMediaConfig?.head,
            tail: null
        });
    }
  });

  const accountDropDownConfigAuthorized: any = [
    { href: '/my-account', title: translate('common.label.myAccountText'), className: 'text-left p-2 cursor-pointer', },
    { href: user?.companyId !== Guid?.empty ? '/my-account/my-company/orders' : '/my-account/orders', title: translate('label.order.myOrdersText'), className: 'text-left p-2 cursor-pointer', },
    {
      href: '/',
      onClick: async () => {
        deleteUser({ router: Router })
        if (user?.socialData?.socialMediaType) {
          await signOut()
        }
      },
      title: translate('label.common.signOutText'),
      className: 'text-left p-2 cursor-pointer text-red-600',
    },
  ]

  let accountDropdownConfig = accountDropDownConfigUnauthorized
  let title = !isGuestUser ? user.userId ? `Hi, ${user.firstName}` : translate('common.label.myAccountText') : ''
  if (!isGuestUser && user.userId) {
    accountDropdownConfig = accountDropDownConfigAuthorized
  }

  const configAction = async (pair: any) => {
    if (!pair) return
    const value: any = Object?.values(pair)[0]
    const key = Object?.keys(pair)[0]
    const { data: configActionResult } = await axios.post(NEXT_SET_CONFIG, { obj: pair, })
    Cookies.set(key, value)
    router.reload()
  }

  const hyperlinkHandler = (hyperlink: string) => { return hyperlink[0] === '/' ? hyperlink : `/${hyperlink}`}
  const [open, setOpen] = useState(false)
  const [openState, setOpenState] = useState(-1)
  const isProduction = process.env.NODE_ENV === 'production'
  const [renderState, setRenderState] = useState(isProduction)
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

  function handleWishlist() {
    try {
      const viewWishlist = () => {
        if (currentPage) {
          if (typeof window !== 'undefined') {
            //debugger
            recordAnalytics(AnalyticsEventType.VIEW_WISHLIST, { header: 'Menu Bar', currentPage, })
          }
        }
      }
      const objUser = localStorage.getItem('user')
      if (!objUser || isGuestUser) {
        //  setAlert({ type: 'success', msg:" Please Login "})
        openLoginSideBar()
        return
      }
      if (objUser) {
        openWishlist()
      }
    } catch (error) {
      console.log(error)
    }
  }

  function viewCart(cartItems: any) {
    if (currentPage) {
      if (typeof window !== 'undefined') {
        const extras = { originalLocation: SITE_ORIGIN_URL + router.asPath }
        recordAnalytics(AnalyticsEventType.VIEW_BASKET, { ...{ ...extras }, cartItems, currentPage, itemIsBundleItem: false, entityType: EVENTS_MAP.ENTITY_TYPES.Basket, })
      }
    }
  }

  const hamburgerMenu = () => {
    if (currentPage) {
      if (typeof window !== 'undefined') {
        //debugger
        recordAnalytics(AnalyticsEventType.HAMBURGER_MENU, { currentPage, deviceCheck, })
        //debugger
        recordAnalytics(AnalyticsEventType.HAMBURGER_ICON_CLICK, { header: 'Menu', subHeader: EmptyString, subHeader2: EmptyString, currentPage, deviceCheck, })
      }
    }
  }

  const hamburgerMenuClick = (item: any) => {
    if (currentPage) {
      if (typeof window !== 'undefined') {
        //debugger
        recordAnalytics(AnalyticsEventType.HAMBURGER_MENU_CLICK, { item, currentPage, deviceCheck, subHeader: EmptyString, subHeader2: EmptyString, })
      }
    }
  }

  const hamburgerMenuClickLevel2 = (item: any, subHeader: any) => {
    if (currentPage) {
      if (typeof window !== 'undefined') {
        //debugger
        recordAnalytics(AnalyticsEventType.HAMBURGER_MENU_CLICK, { item, currentPage, deviceCheck, subHeader, subHeader2: EmptyString, })
      }
    }
  }

  const hamburgerClickLevel3 = (item: any, subHeader: any, subHeader2: any) => {
    if (currentPage) {
      if (typeof window !== 'undefined') {
        //debugger
        recordAnalytics(AnalyticsEventType.HAMBURGER_MENU_CLICK, { item, currentPage, deviceCheck, subHeader, subHeader2, })
      }
    }
  }

  useEffect(() => {
    setDelayEffect(true)
  }, [])

  return (
    <>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 flex z-999 lg:hidden" onClose={setOpen}>
          <Transition.Child as={Fragment} enter="transition-opacity ease-linear duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="transition-opacity ease-linear duration-300" leaveFrom="opacity-100" leaveTo="opacity-0" >
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>
          <Transition.Child as={Fragment} enter="transition ease-in-out duration-300 transform" enterFrom="-translate-x-full" enterTo="translate-x-0" leave="transition ease-in-out duration-300 transform" leaveFrom="translate-x-0" leaveTo="-translate-x-full" >
            <div className="relative flex flex-col w-full max-w-xs pb-12 overflow-y-auto bg-white shadow-xl sm:max-w-xl md:max-w-xl bg-header-color z-9999">
              <div className="flex justify-between px-4 pt-5 pb-2 item-center">
                <div className="px-0 text-sm font-bold text-black sm:text-lg whitespace-nowrap ">
                  {translate('label.navBar.includeVatText')} 
                  <ToggleSwitch className="px-4 include-vat" height={15} width={40} checked={vatIncluded()} checkedIcon={<div className="ml-1 include-vat-checked">{translate('common.label.yesText')}</div>} uncheckedIcon={<div className="mr-1 include-vat-unchecked">{translate('common.label.noText')}</div>} onToggleChanged={onIncludeVATChanged} />
                </div>
                <button type="button" onClick={() => setOpen(false)} className="absolute inline-flex items-center justify-center p-0 -m-2 text-gray-400 rounded-md right-3 top-3" >
                  <span className="sr-only">{translate('common.label.closeMenuText')}</span>
                  <XMarkIcon className="mt-1 text-white w-7 h-7" aria-hidden="true" />
                </button>
              </div>
              <Tab.Group as="div" className="mt-2 border-b border-gray-200">
                {config?.map((item: any, idx: number) => {
                  return (
                    <div key={idx}>
                      {!item?.navBlocks?.length ? (
                        <Link key={idx} title={item?.caption} href={hyperlinkHandler(removePrecedingSlash(item?.hyperlink))} passHref onClick={() => { hamburgerMenuClick(item?.caption); setOpen(false) }} className="flex flex-col px-4 py-4 text-sm font-bold text-black border-t whitespace-nowrap" >
                          {item?.caption}
                        </Link>
                      ) : (
                        <Disclosure key={`disclosure-start-${item?.caption}`}>
                          {({ open }) => (
                            <>
                              <Disclosure.Button className="flex justify-between w-full px-0 -mb-px space-x-0 text-left border-t" onClick={() => hamburgerMenuClick(item?.caption)} >
                                <div className="flex flex-col px-4 py-4 text-sm font-bold text-black sm:text-lg whitespace-nowrap"> {item?.caption} </div>
                                <div className="pt-5 pr-3">
                                  <ChevronUpIcon className={`${!open ? 'transition-transform duration-150 rotate-180 transform' : 'transition-transform duration-150 rotate-0 transform'} h-5 w-5 text-black`} />
                                </div>
                              </Disclosure.Button>

                              <Disclosure.Panel as={Fragment} key={`disclosure-panel-${item?.caption}`} >
                                <div className="space-y-4">
                                  {item?.navBlocks?.length && item?.navBlocks?.map((navBlock: any, navIdx: number) => (
                                    <div key={`navbar-parent-${navIdx}`} className="grid grid-cols-1 px-5 py-2 border-b border-gray-200 sm:px-6 gap-y-0 gap-x-0 lg:gap-x-0" >
                                      <ul role="list" aria-labelledby="clothing-heading" className="col-span-1" >
                                        {navBlock?.navItems?.map((navItem: any, idx: any) => (
                                          <Link legacyBehavior key={`${navItem?.caption}-${idx}`} title={navItem?.caption} href={navBlock?.navBlockType == 9 ? `collection/${removePrecedingSlash(navItem?.itemLink)}` : `/${removePrecedingSlash(navItem?.itemLink)}`} passHref>
                                            <li onClick={() => { setOpen(false); hamburgerMenuClickLevel2(item?.caption, navBlock?.boxTitle) }} className="flex pb-2 my-3 text-sm text-gray-700 hover:text-gray-800 dark:text-gray-700" >
                                              {navItem?.caption}
                                            </li>
                                          </Link>
                                        ))}
                                      </ul>
                                    </div>
                                  ))}
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
          <div className="promotion-banner mob-marquee"></div>
          <div className="container flex justify-end w-full px-6 pt-1 mx-auto">
            {b2bEnabled && (<BulkAddTopNav b2bSettings={b2bSettings} onClick={openBulkAdd} />)}
            <div className="flex flex-col py-0 text-xs font-medium text-black text-invert sm:text-xs whitespace-nowrap"> {translate('label.navBar.pricesIncludingVatText')} </div>
            <div className="flow-root w-10 px-2 sm:w-12">
              <div className="flex justify-center flex-1 mx-auto">
                <ToggleSwitch className="include-vat" height={15} width={40} checked={vatIncluded()} checkedIcon={<div className="ml-1 include-vat-checked">{translate('common.label.yesText')}</div>} uncheckedIcon={<div className="mr-1 include-vat-unchecked">{translate('common.label.noText')}</div>} onToggleChanged={onIncludeVATChanged} />
              </div>
            </div>
          </div>
        </div>
      )}

      <header className={cn('fixed top-0 right-0 w-full bg-white shadow-md lg:top-6 sm:py-1 py-0 bg-header-color z-999 navbar-min-64', { fixed: showSearchBar })} >
        <nav aria-label="Top" className="container relative flex items-center justify-between w-full h-16 px-4 pb-0 mx-auto sm:pb-0 sm:px-4 md:px-4 lg:px-4 ipad-nav" >
          <button type="button" className="py-4 pl-2 pr-2 -ml-2 text-gray-400 bg-transparent rounded-md lg:hidden" onClick={() => { hamburgerMenu(); setOpen(true) }} >
            <span className="sr-only">{translate('common.label.openMenu')}</span>
            <Bars3Icon className="w-6 h-6 sm:h-8 sm:w-8 mob-menu-icon" aria-hidden="true" />
          </button>
          <Link href="/" title="BetterCommerce">
            <div className="flex w-20 cursor-pointer xl:w-20">
              <span className="sr-only">{translate('label.navBar.betterCommerceText')}</span>
              <Logo />
            </div>
          </Link>
          {renderState && (
            <Popover.Group className="absolute inset-x-0 bottom-0 hidden w-full h-16 gap-4 px-6 pb-px overflow-x-auto border-t sm:border-t-0 sm:justify-left sm:overflow-visible sm:pb-0 sm:static sm:self-stretch sm:flex sm:h-16 mob-landscape-hidden ">
              {config?.map((item: any, idx: number) => (
                <Popover key={`popover-fly-menu-${idx}`} className="flex" onMouseEnter={() => setOpenState(idx)} onMouseLeave={() => setOpenState(-1)} >
                  {({ open }) => (
                    <>
                      {!item?.navBlocks?.length ? (
                        <Popover.Button className={classNames(openState == idx ? 'border-indigo-600 text-indigo-600 text-hover-clr border-hover-clr' : 'border-transparent text-black hover:text-black text-header-clr', 'relative z-10 flex items-center sm:h-16 transition-colors ease-out duration-200 text-sm font-medium border-b-2 -mb-px pt-px')} >
                          <Link href={`/${removePrecedingSlash(item?.hyperlink)}`} className="relative flex items-center h-full text-header-clr" title={item?.caption} >
                            {item?.caption}
                          </Link>
                        </Popover.Button>
                      ) : (
                        <Popover.Button className={classNames(openState == idx ? 'border-indigo-600 text-indigo-600 text-hover-clr border-hover-clr' : 'border-transparent text-black hover:text-black text-header-clr', 'relative z-10 flex items-center sm:h-16 transition-colors ease-out uppercase hover:font-semibold duration-200 text-sm font-medium border-b-2 -mb-px pt-px')} >
                          {item?.caption}
                        </Popover.Button>
                      )}
                      {item?.navBlocks?.length ? (
                        <Transition show={openState == idx} as={Fragment} enter="transition ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100" leave="transition ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0" >
                          <Popover.Panel className="absolute inset-x-0 text-gray-500 bg-white top-full z-999 sm:text-sm">
                            <div className="relative grid items-start w-4/5 grid-cols-1 px-4 pt-10 pb-12 mx-auto bg-white sm:px-0 lg:px-0 gap-y-10 gap-x-6 md:grid-cols-1 lg:gap-x-8">
                              {item?.navBlocks?.map((navBlock: any, navIdx: number) => (
                                <div key={navIdx}>
                                  <h5 className="text-xl font-semibold text-gray-900 capitalize">{navBlock?.boxTitle}</h5>
                                  <div key={`navItems-${navIdx}`} className="grid grid-cols-5 pt-4 border-t border-gray-100 sm:pt-6 gap-y-1 gap-x-6 lg:gap-x-8" >
                                    {navBlock?.navItems?.map((navItem: any, idx: number) => (
                                      <Popover.Button key={`popover-button-${idx}`} className={classNames(openState == idx ? '' : 'border-gray-200 text-gray-700 hover:text-pink', 'relative z-10 flex my-2 items-center transition-colors ease-out duration-200 text-md font-normal text-gray-600 hover:text-pink hover:font-semibold -mb-px pt-px')} >
                                        <Link href={navBlock?.navBlockType == 9 ? `collection/${removePrecedingSlash(navItem?.itemLink)}` : `${removePrecedingSlash(navItem?.itemLink)}`} className="relative flex items-center h-full hover:text-pink" title={navItem?.caption} onClick={() => setOpenState(-1)} >
                                          {navItem?.caption}
                                        </Link>
                                      </Popover.Button>
                                    ))}
                                  </div>
                                </div>
                              ))}
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
            <Searchbar onClick={setShowSearchBar} keywords={keywords} />
            <Account title={title} config={accountDropdownConfig} deviceInfo={deviceInfo} />
            <div className="hidden sm:flex ">
              <CurrencySwitcher config={currencies} title={translate('label.navBar.selectCurrencyText')} action={configAction} />
              <LanguageSwitcher config={languages} title={translate('label.navBar.selectLanguageText')} action={configAction} />
            </div>
            <div className="relative flow-root w-10 px-1 text-left md:w-14 xl:w-16">
              <button className="relative grid flex-col items-center justify-center grid-cols-1 mx-auto text-center group icon-grp align-center" onClick={() => { handleWishlist() }} >
                <HeartIcon className="flex-shrink-0 block w-6 h-6 mx-auto text-black group-hover:text-red-600" aria-hidden="true" aria-label="Wishlist" />
                <span className="hidden text-sm font-normal text-black sm:block text-header-clr text-icon-display ">
                  {translate('label.wishlist.wishlistText')} </span>
                {wishListItems?.length > 0 && delayEffect && (
                  <span className="absolute hidden w-4 h-4 ml-2 text-xs font-semibold text-center text-white bg-black rounded-full -top-1 sm:block -right-1">
                    {wishListItems?.length}
                  </span>
                )}
                <span className="sr-only">{translate('label.basket.itemsCartViewBagText')}</span>
              </button>
            </div>

            <div className="relative flow-root w-10 px-1 text-left md:w-14 xl:w-16">
              <button className="relative grid flex-col items-center justify-center grid-cols-1 mx-auto text-center group icon-grp align-center" onClick={() => { viewCart(cartItems); openCart() }} >
                <ShoppingCartIcon className="flex-shrink-0 block w-6 h-6 mx-auto text-black group-hover:text-gray-500" aria-hidden="true" aria-label="Add to cart" />
                <span className="hidden text-sm font-normal text-black sm:block text-header-clr text-icon-display ">
                {translate('label.navBar.cartText')} </span>
                {renderState && (
                  <>
                    {cartItems?.lineItems?.length > 0 && (
                      <span className="absolute w-4 h-4 ml-2 text-xs font-medium text-center text-white bg-black rounded-full -top-1 -right-2">
                        {cartItems?.lineItems?.length}
                      </span>
                    )}
                    <span className="sr-only">{translate('label.basket.itemsCartViewBagText')}</span>
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
