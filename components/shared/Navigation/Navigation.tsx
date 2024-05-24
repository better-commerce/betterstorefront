import React from "react";
import Link from "next/link";
import { removePrecedingSlash, sanitizeRelativeUrl } from "@framework/utils/app-util";
import { groupBy, isEmpty } from "lodash";
import { CURRENT_THEME } from "@components/utils/constants";

function Navigation({ navItems = [], featureToggle, subMenuPosition }: any) {
  const getWidgets = (navGroupWidget: any) => {
    let widgets = [];
    const groupedWidgets = groupBy(navGroupWidget, 'sectionTitle');
    if (!isEmpty(groupedWidgets)) {
      for (const widthPct in groupedWidgets) {
        widgets.push({ groupName: widthPct, widgets: groupedWidgets[widthPct] });
      }
    }
    return widgets;
  };
  return (
    <>
      <ul className="flex items-center nc-Navigation navigation-ul">
        {navItems?.map((item: any, itemIdx: number) => (
          <li className="flex-shrink-0 mt-0 menu-item menu-megamenu menu-megamenu--large group" key={`to-nav-${itemIdx}`}>
            <div className="flex items-center flex-shrink-0 h-20">
              <Link href={`${sanitizeRelativeUrl(item?.hyperlink)}`} className="inline-flex items-center capitalize text-sm lg:text-[15px] menu-font-size font-semibold text-slate-700 dark:text-slate-300 py-2.5 px-4 xl:px-5 rounded-full hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-100 dark:hover:text-slate-900 group-hover:bg-slate-100">
                {item?.caption.toLowerCase()}
              </Link>
              {item?.navBlocks?.length > 0 &&
                <div className={`absolute inset-x-0 z-50 invisible transform group-hover:visible sub-menu ${subMenuPosition}`}>
                  <div className="bg-white shadow-lg dark:bg-neutral-900">
                    <div className="container py-10">
                      <div className="relative grid items-start w-full grid-cols-1 mx-auto gap-y-4 gap-x-6 md:grid-cols-1 lg:gap-x-0">
                        <div className="grid grid-flow-col gap-4 auto-cols-auto max-list-panel max-mega-height">
                          {getWidgets(item?.navBlocks)?.map((grp: any, grpIdx: number) => (
                            <div className={CURRENT_THEME == 'green' ? 'block':'grid grid-cols-4'} key={`nav-Blocks-Grp-${grpIdx}`}>
                              {grp?.widgets?.map((navItem: any, kdx: number) => (
                                <div key={`navItems-items-top-${kdx}`}>
                                  <h3 className='mb-3 text-lg font-semibold text-black capitalize'>{navItem?.boxTitle?.toLowerCase()}</h3>
                                  {navItem?.navItems && navItem?.navItems?.length ? (
                                    <ul className='mx-0 mt-0 mb-6'>
                                      {navItem?.navItems?.sort((a: { caption: any }, b: { caption: any }) => (a?.caption).localeCompare(b?.caption)).map((item: any, idx: number) => (
                                        <li key={`navItems-items-${idx}`} className="mt-0 mb-2">
                                          <Link
                                            href={navItem?.navBlockType == 9 ? `/collection${sanitizeRelativeUrl(`/${item?.itemLink}`)}` : `${sanitizeRelativeUrl(`/${item?.itemLink}`)}`}
                                            className="relative flex items-center h-full font-normal text-gray-700 capitalize hover:underline hover:text-black"
                                            title={item?.caption}
                                          >
                                            {item?.caption?.toLowerCase()}
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  ) : (
                                    <div className='w-full menu-html' dangerouslySetInnerHTML={{ __html: navItem?.contentBody }}></div>
                                  )}
                                </div>
                              ))}
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
              <Link className="inline-flex items-center capitalize text-sm lg:text-[15px] menu-font-size font-semibold text-slate-700 dark:text-slate-300 py-2.5 px-4 xl:px-5 rounded-full hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-100 dark:hover:text-slate-900" href={`/store-locator`} >
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
