import React from "react";
import Link from "next/link";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { removePrecedingSlash, sanitizeRelativeUrl } from "@framework/utils/app-util";

function Navigation({ navItems = [], featureToggle, subMenuPosition }: any) {
  return (
    <>
      <ul className="flex items-center nc-Navigation navigation-ul">
        {navItems?.map((item: any, itemIdx: number) => (
          <li className="flex-shrink-0 mt-0 menu-item menu-megamenu menu-megamenu--large group" key={`to-nav-${itemIdx}`}>
            <div className="flex items-center flex-shrink-0 h-20">
              <Link className="inline-flex items-center capitalize text-xs xl:text-[12px] 2xl:text-[15px] menu-font-size font-semibold text-slate-700 dark:text-slate-700 py-2.5 px-2 2xl:px-5 rounded-full hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-100 dark:hover:text-slate-900" href={`/${item?.hyperlink}`} >
                {item?.caption.toLowerCase()}
                {item?.navBlocks?.length > 0 && (
                  <ChevronDownIcon className="w-4 h-4 ml-1 -mr-1 text-slate-400" aria-hidden="true" />
                )}
              </Link>
              {item?.navBlocks?.length > 0 &&
                <div className={`absolute inset-x-0 z-50 invisible transform group-hover:visible sub-menu ${subMenuPosition}`}>
                  <div className="bg-white shadow-lg dark:bg-neutral-900">
                    <div className="container">
                      <div className="flex py-6 text-sm border-b border-slate-200 dark:border-slate-200">
                        <div className="grid flex-1 grid-cols-1 gap-6 pr-6 xl:gap-8 xl:pr-8">
                          {item?.navBlocks.map((navItem: any, navIndex: number) => (
                            <div key={`child-${navIndex}`}>
                              <p className="font-medium capitalize text-slate-900 dark:text-slate-900 menu__subheading">
                                {navItem?.boxTitle.toLowerCase()}
                              </p>
                              <ul className="grid grid-cols-5 mt-4 space-4">
                                {navItem?.navItems?.map((child: any, cIdx: number) => (
                                  <li key={cIdx} className={`${child?.itemType ? "menuIsNew" : ""}`}>
                                    <Link className="font-normal capitalize text-slate-600 hover:text-black dark:text-slate-600 dark:hover:text-black " href={navItem?.navBlockType == 9 ? `/collection${sanitizeRelativeUrl(child?.itemLink)}` : `/${sanitizeRelativeUrl(child?.itemLink)}`} >
                                      {child?.caption.toLowerCase()}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              }
            </div>
          </li>
        ))}
        {featureToggle?.features?.enableStoreLocator &&
          <li className="flex-shrink-0 mt-0 menu-item menu-megamenu menu-megamenu--large group" >
            <div className="flex items-center flex-shrink-0 h-20">
              <Link className="inline-flex items-center capitalize text-xs xl:text-[12px] 2xl:text-[15px] menu-font-size font-semibold text-slate-700 dark:text-slate-300 py-2.5 px-2 2xl:px-5 rounded-full hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-100 dark:hover:text-slate-900" href={`/store-locator`} >
                Stores
              </Link>
            </div>
          </li>
        }
      </ul>
    </>
  );
}

export default Navigation;
