"use client";

import React, { FC, useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Logo, useUI } from "@components/ui";
import { getCurrentPage, vatIncluded } from "@framework/utils/app-util";
import { matchStrings, stringToBoolean } from "@framework/utils/parse-util";
import { useTranslation } from "@commerce/utils/use-translation";
import { IExtraProps } from "@components/Layout/Layout";
import EngagePromoBar from '@components/SectionEngagePanels/EngagePromoBar';
import { ChevronDownIcon, HeartIcon, ShoppingCartIcon, StarIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { AnalyticsEventType } from "@components/services/analytics";
import useAnalytics from "@components/services/analytics/useAnalytics";
import { isMicrosite } from "@commerce/utils/uri-util";
import { CameraIcon } from "@heroicons/react/24/outline";
import NavigationRows from "@components/shared/Navigation/NavigationRows";
const SearchBar = dynamic(() => import('@components/shared/Search/SearchBar'))
const AvatarDropdown = dynamic(() => import('@components/Header/AvatarDropdown'))
const LangDropdown = dynamic(() => import('@components/Header/LangDropdown'))
const CartDropdown = dynamic(() => import('@components/Header/CartDropdown'))
const MenuBar = dynamic(() => import('@components/shared/MenuBar/MenuBar'))
const Navigation = dynamic(() => import('@components/shared/Navigation/Navigation'))
const ToggleSwitch = dynamic(() => import('@components/shared/ToggleSwitch/ToggleSwitch'))
const BulkAddTopNav = dynamic(() => import('@components/SectionCheckoutJourney/bulk-add/TopNav'))
interface Props {
  config: []
  currencies: []
  languages: []
  configSettings: any
  keywords?: any
  defaultLanguage: string
  defaultCountry: string
  locale: string
}

const MainNav: FC<Props & IExtraProps> = ({ config, configSettings, currencies, languages, defaultLanguage, defaultCountry, deviceInfo, maxBasketItemsCount, onIncludeVATChanged, keywords, pluginConfig = [], featureToggle, locale }) => {
  const { recordAnalytics } = useAnalytics()
  const b2bSettings = configSettings?.find((x: any) => matchStrings(x?.configType, 'B2BSettings', true))?.configKeys || []
  const b2bEnabled = b2bSettings?.length ? stringToBoolean(b2bSettings?.find((x: any) => x?.key === 'B2BSettings.EnableB2B')?.value) : false
  const searchSetting = configSettings?.find((x: any) => matchStrings(x?.configType, 'SearchSettings', true))?.configKeys || []
  const searchDefaultSortBy = searchSetting?.length ? searchSetting?.find((x: any) => x?.key === 'SearchSettings.DefaultSortBy')?.value : "3"
  const { setShowSearchBar, openBulkAdd, isGuestUser, user, wishListItems, openLoginSideBar } = useUI()
  const { isMobile, isIPadorTablet } = deviceInfo
  const [visible, setVisible] = useState(true);
  const router = useRouter()
  let currentPage = getCurrentPage()
  const [scrollPosition, setScrollPosition] = useState(0); // Initialize to 0
  const [delayEffect, setDelayEffect] = useState(false)
  useEffect(() => {
    setDelayEffect(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const currentPosition = window.pageYOffset;
      setVisible(currentPosition <= scrollPosition);
      setScrollPosition(currentPosition);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrollPosition]);
  let classTop = 'top-full'
  if (!isGuestUser && user?.userId && featureToggle?.features?.enableMyStoreFeature) {
    classTop = 'top-[82px]'
  }
  const renderMagnifyingGlassIcon = () => {
    return (
      <SearchBar onClick={setShowSearchBar} keywords={keywords} searchDefaultSortBy={searchDefaultSortBy} />
    );
  };
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
        router.push('/my-account/wishlist')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const renderContent = () => {
    const translate = useTranslation()
    return (
      <>
        <div className={`top-0 td-header bg-header-clr fixed inset-x-0 z-20 w-full py-2 border-b theme-container sm:py-0 bg-white/90 backdrop-blur-lg border-slate-100 dark:border-gray-700/30 dark:bg-gray-900/90 dark:bg-white`}>
          {!isMobile &&
            <>
              {featureToggle?.features?.enablePCTopHeader ? <>
                <div className="justify-between hidden sm:flex bg-top-toggle">
                  <div className="container mx-auto">
                    <div className="flex justify-between w-full">
                      <div className="flex items-center justify-start">
                        <span className="flex items-center text-xs font-light text-white">Free Delivery Over £50 <ChevronDownIcon className="w-3 h-3" /> </span>
                        <span className="pl-4 text-xs font-light text-white">Call us 01444 237070</span>
                      </div>
                      <div className="flex items-center justify-end gap-4">
                        {b2bEnabled && featureToggle?.features?.enableB2BHeader && (<BulkAddTopNav b2bSettings={b2bSettings} onClick={openBulkAdd} />)}
                        {featureToggle?.features?.enablePriceIncVatToggle &&
                          <>
                            <div className="flex flex-col py-0 text-xs font-light text-white text-invert sm:text-xs whitespace-nowrap">{translate('label.navBar.pricesIncludingVatText')}</div>
                            <div className="flow-root w-10 px-2 sm:w-12">
                              <div className="flex justify-center flex-1 mx-auto">
                                <ToggleSwitch className="include-vat" height={15} width={40} checked={vatIncluded()} checkedIcon={<div className="ml-1 include-vat-checked">{translate('common.label.yesText')}</div>} uncheckedIcon={<div className="mr-1 include-vat-unchecked">{translate('common.label.noText')}</div>} onToggleChanged={onIncludeVATChanged} />
                              </div>
                            </div>
                          </>
                        }
                        <AvatarDropdown pluginConfig={pluginConfig} featureToggle={featureToggle} deviceInfo={deviceInfo} />
                        <span className="relative flex items-center gap-1 pl-4 text-xs font-light text-white cursor-pointer hover:underline" onClick={() => { handleWishlist(); }}>Wishlist <HeartIcon className="w-4 h-4" aria-hidden="true" aria-label="Wishlist" />
                          {wishListItems?.length > 0 && delayEffect && (
                            <span className="absolute top-0 hidden w-4 h-4 ml-2 text-xs font-semibold text-center text-white rounded-full bg-sky-500 sm:block -right-2">
                              {wishListItems?.length}
                            </span>
                          )}
                        </span>
                        <CartDropdown featureToggle={featureToggle} />
                      </div>
                    </div>
                  </div>
                </div>
              </> :
                <div className="justify-between hidden sm:flex bg-top-toggle">
                  <div className="container mx-auto">
                    <div className="promotion-banner mob-marquee"></div>
                    <div className="container flex justify-end w-full px-1 pt-1 mx-auto">
                      {b2bEnabled && featureToggle?.features?.enableB2BHeader && (<BulkAddTopNav b2bSettings={b2bSettings} onClick={openBulkAdd} />)}
                      {featureToggle?.features?.enablePriceIncVatToggle &&
                        <>
                          <div className="flex flex-col py-0 text-xs font-medium text-black text-invert sm:text-xs whitespace-nowrap">{translate('label.navBar.pricesIncludingVatText')}</div>
                          <div className="flow-root w-10 px-2 sm:w-12">
                            <div className="flex justify-center flex-1 mx-auto">
                              <ToggleSwitch className="include-vat" height={15} width={40} checked={vatIncluded()} checkedIcon={<div className="ml-1 include-vat-checked">{translate('common.label.yesText')}</div>} uncheckedIcon={<div className="mr-1 include-vat-unchecked">{translate('common.label.noText')}</div>} onToggleChanged={onIncludeVATChanged} />
                            </div>
                          </div>
                        </>
                      }
                    </div>
                  </div>
                </div>
              }
            </>
          }
          {featureToggle?.features?.enableSeparateMenu ? (
            <>
              <div className="w-full">
                <div className="container">
                  <div className="flex justify-between mx-auto mt-2 mob-container">
                    {isMobile &&
                      <div className="flex items-center flex-1">
                        <MenuBar navItems={config} featureToggle={featureToggle} />
                      </div>
                    }
                    <div className="flex items-center lg:flex-1">
                      <Link href="/" passHref>
                        <Logo className="flex-shrink-0" />
                      </Link>
                    </div>
                    {!isMobile &&
                      <div className="search-icon-box flex-[2] hidden sm:flex">
                        <button className="items-center justify-center w-full h-10 rounded-full lg:flex sm:h-12 text-slate-700 dark:text-slate-700 search-top hover:bg-slate-100 dark:hover:bg-slate-100 focus:outline-none">
                          {renderMagnifyingGlassIcon()}
                        </button>
                      </div>
                    }
                    <div className="flex items-center justify-end flex-1 ml-5 text-slate-700 dark:text-slate-100 sm:ml-0 icon-div-menu">
                      {!isMicrosite(locale) && featureToggle?.features?.enableLanguage &&
                        <LangDropdown currencies={currencies} languages={languages} defaultLanguage={defaultLanguage} defaultCountry={defaultCountry} />
                      }
                      {isMobile &&
                        <button className="items-center justify-center h-10 rounded-full w-7 lg:flex sm:w-12 sm:h-12 text-slate-700 dark:text-slate-700 search-top hover:bg-slate-100 dark:hover:bg-slate-100 focus:outline-none">
                          {renderMagnifyingGlassIcon()}
                        </button>
                      }
                      {!featureToggle?.features?.enablePCTopHeader && featureToggle?.features?.enableHeaderWishlist &&
                        <div className="relative flow-root w-10 px-1 text-left md:w-14 xl:w-14 mob-line-height-none">
                          <button onClick={() => { handleWishlist(); }} className="items-center justify-center w-10 h-10 rounded-full wish-hover-icon lg:flex sm:w-12 sm:h-12 text-slate-700 dark:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-100 focus:outline-none">
                            <HeartIcon className="flex-shrink-0 block mx-auto text-black w-7 h-7 group-hover:text-red-600" aria-hidden="true" aria-label="Wishlist" />
                            {wishListItems?.length > 0 && delayEffect && (
                              <span className="absolute hidden w-4 h-4 ml-2 text-xs font-semibold text-center text-white rounded-full bg-sky-500 top-2 sm:block right-2">
                                {wishListItems?.length}
                              </span>
                            )}
                          </button>
                        </div>
                      }
                      {featureToggle?.features?.enableTradeIn &&
                        <>
                          <div className="relative flex flex-col items-center justify-center px-1 text-left mob-line-height-none sm:pr-10">
                            <Link href="/sell-or-part-exchange" className="flex flex-col items-center justify-center w-auto h-10 gap-1 text-white rounded-full wish-hover-icon lg:flex sm:w-full sm:h-12 dark:text-slate-700 focus:outline-none">
                              <img src="/theme/camera/image/trade-in-icon.svg" className="w-6 !fill-white trade-icon h-auto mx-auto" alt="Trade In" />
                              <span className="text-xs font-light">Discover Trade-In</span>
                            </Link>
                          </div>
                          <div className="relative flex flex-col items-center justify-center px-1 text-left mob-line-height-none sm:pr-10">
                            <Link href="/" className="flex flex-col items-center justify-center w-auto h-10 gap-1 text-white rounded-full wish-hover-icon lg:flex sm:w-full sm:h-12 dark:text-slate-700 focus:outline-none">
                              <img src="/theme/camera/image/expert.svg" className="w-6 !fill-white trade-icon h-auto mx-auto" alt="Ask an Expert" />
                              <span className="text-xs font-light">Ask an Expert</span>
                            </Link>
                          </div>
                        </>
                      }
                      {!featureToggle?.features?.enablePCTopHeader && <AvatarDropdown pluginConfig={pluginConfig} featureToggle={featureToggle} deviceInfo={deviceInfo} />}
                      {!featureToggle?.features?.enablePCTopHeader && <CartDropdown featureToggle={featureToggle} />}
                      {featureToggle?.features?.enableMembership &&
                        <Link href="/my-membership" passHref className="flex items-center justify-center w-10 h-10 rounded-full sm:w-12 sm:h-12 text-slate-700 dark:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-100 focus:outline-none">
                          <StarIcon className="w-7 h-7 text-slate-700" title="Membership" />
                        </Link>
                      }
                    </div>
                  </div>
                </div>
                {!isMobile &&
                  <div className="w-full mt-2 bg-header-nav-clr">
                    <div className="container flex-[2] justify-center lg:flex custom-padding-nav">
                      {featureToggle?.features?.enableForPCSite ? (<>
                        <NavigationRows subMenuPosition={classTop} navItems={config} featureToggle={featureToggle} />
                      </>) : (<>
                        <Navigation subMenuPosition={classTop} navItems={config} featureToggle={featureToggle} />
                      </>)}
                    </div>
                  </div>
                }
              </div>
            </>
          ) : (
            <>
              <div className="container flex justify-between mx-auto mob-container">
                {isMobile &&
                  <div className="flex items-center flex-1">
                    <MenuBar navItems={config} featureToggle={featureToggle} />
                  </div>
                }
                <div className="flex items-center lg:flex-1">
                  <Link href="/" passHref>
                    <Logo className="flex-shrink-0" />
                  </Link>
                </div>
                {!isMobile &&
                  <div className="flex-[2] justify-center mx-4 lg:flex custom-padding-nav">
                    {featureToggle?.features?.enableForPCSite ? (<>
                      <NavigationRows subMenuPosition={classTop} navItems={config} featureToggle={featureToggle} />
                    </>) : (<>
                      <Navigation subMenuPosition={classTop} navItems={config} featureToggle={featureToggle} />
                    </>)}
                  </div>
                }

                <div className="flex items-center justify-end flex-1 ml-5 text-slate-700 dark:text-slate-100 sm:ml-0 icon-div-menu">
                  {!isMicrosite(locale) && featureToggle?.features?.enableLanguage &&
                    <LangDropdown currencies={currencies} languages={languages} defaultLanguage={defaultLanguage} defaultCountry={defaultCountry} />
                  }
                  <button className="items-center justify-center h-10 rounded-full w-7 lg:flex sm:w-12 sm:h-12 text-slate-700 dark:text-slate-700 search-top hover:bg-slate-100 dark:hover:bg-slate-100 focus:outline-none">
                    {renderMagnifyingGlassIcon()}
                  </button>

                  {featureToggle?.features?.enableHeaderWishlist &&
                    <div className="relative flow-root w-10 px-1 text-left md:w-14 xl:w-14 mob-line-height-none">
                      <button onClick={() => { handleWishlist(); }} className="items-center justify-center w-10 h-10 rounded-full wish-hover-icon lg:flex sm:w-12 sm:h-12 text-slate-700 dark:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-100 focus:outline-none">
                        <HeartIcon className="flex-shrink-0 block mx-auto text-black w-7 h-7 group-hover:text-red-600" aria-hidden="true" aria-label="Wishlist" />
                        {wishListItems?.length > 0 && delayEffect && (
                          <span className="absolute hidden w-4 h-4 ml-2 text-xs font-semibold text-center text-white rounded-full bg-sky-500 top-2 sm:block right-2">
                            {wishListItems?.length}
                          </span>
                        )}
                      </button>
                    </div>
                  }
                  {!featureToggle?.features?.enablePCTopHeader && <AvatarDropdown pluginConfig={pluginConfig} featureToggle={featureToggle} deviceInfo={deviceInfo} />}
                  {!featureToggle?.features?.enablePCTopHeader && <CartDropdown featureToggle={featureToggle} />}
                  {featureToggle?.features?.enableMembership &&
                    <Link href="/my-membership" passHref className="flex items-center justify-center w-10 h-10 rounded-full sm:w-12 sm:h-12 text-slate-700 dark:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-100 focus:outline-none">
                      <StarIcon className="w-7 h-7 text-slate-700" title="Membership" />
                    </Link>
                  }
                </div>
              </div>
            </>
          )}
          {featureToggle?.features?.enableEngage && <EngagePromoBar />}
        </div>
      </>
    );
  };
  return (
    <div className="bg-white border-b nc-MainNav2Logged dark:bg-neutral-900 border-slate-100 dark:border-slate-100">
      <div className="container ">{renderContent()}</div>
    </div>
  );
};
export default MainNav;