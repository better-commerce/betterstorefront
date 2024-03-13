"use client";

import React, { createRef, FC, useState } from "react";
import AvatarDropdown from "./AvatarDropdown";
import CartDropdown from "./CartDropdown";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import MenuBar from "../shared/MenuBar/MenuBar";
import Navigation from "../shared/Navigation/Navigation";
import { IExtraProps } from "@components/common/Layout/Layout";
import { Logo, useUI } from "@components/ui";
import Link from "next/link";
import { Searchbar } from "@components/common";
import LangDropdown from "./LangDropdown";
import dynamic from "next/dynamic";
import ToggleSwitch from "@components/common/ToggleSwitch";
import { vatIncluded } from "@framework/utils/app-util";
import { matchStrings, stringToBoolean } from "@framework/utils/parse-util";
const BulkAddTopNav = dynamic(() => import('@components/bulk-add/TopNav'))
export interface MainNav2LoggedProps { }
interface Props {
  config: []
  currencies: []
  languages: []
  configSettings: any
  keywords?: any
}

const MainNav2Logged: FC<Props & IExtraProps> = ({ config, configSettings, currencies, languages, deviceInfo, maxBasketItemsCount, onIncludeVATChanged, keywords, }) => {
  const inputRef = createRef<HTMLInputElement>();
  const [showSearchForm, setShowSearchForm] = useState(false);
  const router = useRouter();
  const b2bSettings = configSettings?.find((x: any) => matchStrings(x?.configType, 'B2BSettings', true))?.configKeys || []
  const b2bEnabled = b2bSettings?.length ? stringToBoolean(b2bSettings?.find((x: any) => x?.key === 'B2BSettings.EnableB2B')?.value) : false
  const { setShowSearchBar, openBulkAdd } = useUI()
  const renderMagnifyingGlassIcon = () => {
    return (
      <Searchbar onClick={setShowSearchBar} keywords={keywords} />
    );
  };

  const renderSearchForm = () => {
    return (
      <form
        className="flex-1 py-2 text-slate-900 dark:text-slate-100"
        onSubmit={(e) => {
          e.preventDefault();
          router.push("/search");
          inputRef.current?.blur();
        }}
      >
        <div className="bg-slate-50 dark:bg-slate-800 flex items-center space-x-1.5 px-5 h-full rounded">
          {renderMagnifyingGlassIcon()}
          <input ref={inputRef} type="text" placeholder="Type and press enter" className="w-full text-base bg-transparent border-none focus:outline-none focus:ring-0" autoFocus />
          <button type="button" onClick={() => setShowSearchForm(false)}>
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        <input type="submit" hidden value="" />
      </form>
    );
  };

  const renderContent = () => {
    return (
      <>
        <div className="fixed top-0 left-0 z-40 flex justify-between w-full h-20 border-b border-gray-200 bg-slate-200">
          <div className="container flex justify-between mx-auto">
            <div className="promotion-banner mob-marquee"></div>
            <div className="container flex justify-end w-full px-6 pt-1 mx-auto">
              {b2bEnabled && (<BulkAddTopNav b2bSettings={b2bSettings} onClick={openBulkAdd} />)}
              <div className="flex flex-col py-0 text-xs font-medium text-black sm:text-xs whitespace-nowrap"> Prices inc VAT </div>
              <div className="flow-root w-10 px-2 sm:w-12">
                <div className="flex justify-center flex-1 mx-auto">
                  <ToggleSwitch className="include-vat" height={15} width={40} checked={vatIncluded()} checkedIcon={<div className="ml-1 include-vat-checked">Yes</div>} uncheckedIcon={<div className="mr-1 include-vat-unchecked">No</div>} onToggleChanged={onIncludeVATChanged} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="fixed left-0 z-40 flex justify-between w-full h-20 bg-white border-gray-200 border-y top-6">
          <div className="container flex justify-between mx-auto">
            <div className="flex items-center flex-1 lg:hidden"> <MenuBar /> </div>

            <div className="flex items-center lg:flex-1">
              <Link href="/" passHref>
                <Logo className="flex-shrink-0" />
              </Link>
            </div>

            <div className="flex-[2] hidden lg:flex justify-center mx-4">
              <Navigation navItems={config} />
            </div>

            <div className="flex items-center justify-end flex-1 text-slate-700 dark:text-slate-100">
              <LangDropdown />
              <button className="items-center justify-center hidden w-10 h-10 rounded-full lg:flex sm:w-12 sm:h-12 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none">
                {renderMagnifyingGlassIcon()}
              </button>
              <AvatarDropdown />
              <CartDropdown />
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="relative z-10 bg-white border-b nc-MainNav2Logged dark:bg-neutral-900 border-slate-100 dark:border-slate-700">
      <div className="container ">{renderContent()}</div>
    </div>
  );
};

export default MainNav2Logged;
