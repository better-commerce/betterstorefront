"use client";

import React, { FC, useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Logo, useUI } from "@components/ui";
import { vatIncluded } from "@framework/utils/app-util";
import { matchStrings, stringToBoolean } from "@framework/utils/parse-util";
import { useTranslation } from "@commerce/utils/use-translation";
import { IExtraProps } from "@components/Layout/Layout";
import EngagePromoBar from '@components/SectionEngagePanels/EngagePromoBar';
import { CURRENT_THEME } from "@components/utils/constants";
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
}

const MainNav: FC<Props & IExtraProps> = ({ config, configSettings, currencies, languages, defaultLanguage, defaultCountry, deviceInfo, maxBasketItemsCount, onIncludeVATChanged, keywords, pluginConfig = [], featureToggle }) => {
  const b2bSettings = configSettings?.find((x: any) => matchStrings(x?.configType, 'B2BSettings', true))?.configKeys || []
  const b2bEnabled = b2bSettings?.length ? stringToBoolean(b2bSettings?.find((x: any) => x?.key === 'B2BSettings.EnableB2B')?.value) : false
  const { setShowSearchBar, openBulkAdd, isGuestUser, user } = useUI()
  const { isMobile, isIPadorTablet } = deviceInfo
  const [scrollPosition, setScrollPosition] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentPosition = window.pageYOffset;
      setVisible(currentPosition < scrollPosition);
      setScrollPosition(currentPosition);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrollPosition]);
  let classTop = 'top-full'
  if (!isGuestUser && user.userId && featureToggle?.features?.enableMyStoreFeature) {
    classTop = 'top-[82px]'
  }
  const renderMagnifyingGlassIcon = () => {
    return (
      <SearchBar onClick={setShowSearchBar} keywords={keywords} />
    );
  };

  const renderContent = () => {
    const translate = useTranslation()
    return (
      <>
        <div  className={`${visible ? 'top-0' : 'td-visible top-0'} td-header fixed inset-x-0 z-20 w-full py-2 border-b theme-container sm:py-0 bg-white/90 backdrop-blur-lg border-slate-100 dark:border-gray-700/30 dark:bg-gray-900/90`}>
          {!isMobile &&
            <div className="container justify-between hidden mx-auto sm:flex">
              <div className="promotion-banner mob-marquee"></div>
              <div className="container flex justify-end w-full px-1 pt-1 mx-auto">
                {b2bEnabled && featureToggle?.features?.enableQuickOrderPad && (<BulkAddTopNav b2bSettings={b2bSettings} onClick={openBulkAdd} />)}
                {featureToggle?.features?.enablePriceIncVatToggle &&
                  <>
                    <div className="flex flex-col py-0 text-xs font-medium text-black sm:text-xs whitespace-nowrap">{translate('label.navBar.pricesIncludingVatText')}</div>
                    <div className="flow-root w-10 px-2 sm:w-12">
                      <div className="flex justify-center flex-1 mx-auto">
                        <ToggleSwitch className="include-vat" height={15} width={40} checked={vatIncluded()} checkedIcon={<div className="ml-1 include-vat-checked">{translate('common.label.yesText')}</div>} uncheckedIcon={<div className="mr-1 include-vat-unchecked">{translate('common.label.noText')}</div>} onToggleChanged={onIncludeVATChanged} />
                      </div>
                    </div>
                  </>
                }
              </div>
            </div>
          }
          <div className="container flex justify-between mx-auto theme-pt-3">
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
            {!isMobile && CURRENT_THEME != "green" &&
              <div className="flex-[2] justify-center mx-4 lg:flex">
                <Navigation subMenuPosition={classTop} navItems={config} featureToggle={featureToggle} />
              </div>
            }
            {!isMobile && CURRENT_THEME == "green" &&
              <div className="flex-[2] justify-center mx-4 lg:flex">
                <button className="items-center justify-center w-10 h-10 rounded-full theme-search-bar lg:flex sm:w-12 sm:h-12 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none">
                  {renderMagnifyingGlassIcon()}
                </button>
              </div>
            }
            <div className="flex items-center justify-end flex-1 text-slate-700 dark:text-slate-100">
              {featureToggle?.features?.enableLanguage &&
                <LangDropdown currencies={currencies} languages={languages} defaultLanguage={defaultLanguage} defaultCountry={defaultCountry} />
              }
              {CURRENT_THEME != "green" &&
                <button className="items-center justify-center w-10 h-10 rounded-full lg:flex sm:w-12 sm:h-12 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none">
                  {renderMagnifyingGlassIcon()}
                </button>
              }
              {featureToggle?.features?.enableMembership &&
                <Link href="/my-membership" passHref className="flex items-center justify-center w-10 h-10 rounded-full sm:w-12 sm:h-12 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none">
                  <img src="/images/loyalty.png" className="w-6 h-6" alt="Membership" />
                </Link>
              }
              <AvatarDropdown pluginConfig={pluginConfig} featureToggle={featureToggle} />
              <CartDropdown />
            </div>
          </div>
          {CURRENT_THEME == "green" &&
            <div className="container mx-auto">
              {!isMobile &&
                <div className="flex-[2] justify-center mx-4 lg:flex">
                  <Navigation subMenuPosition={classTop} navItems={config} featureToggle={featureToggle} />
                </div>
              }
            </div>
          }
          <EngagePromoBar />
        </div>
      </>
    );
  };
  return (
    <div className="bg-white border-b nc-MainNav2Logged dark:bg-neutral-900 border-slate-100 dark:border-slate-700">
      <div className="container ">{renderContent()}</div>
    </div>
  );
};
export default MainNav;