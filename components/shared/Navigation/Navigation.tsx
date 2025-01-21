import React, { useState } from "react";
import Link from "next/link";
import { removePrecedingSlash, sanitizeRelativeUrl } from "@framework/utils/app-util";
import { groupBy, isEmpty } from "lodash";
import { CURRENT_THEME } from "@components/utils/constants";
import { removeTitleTags } from "framework/utils/app-util";

function Navigation({ navItems = [], featureToggle, subMenuPosition }: any) {
  const [hoveredItemIndex, setHoveredItemIndex] = useState<number | null>(null);
  const [hoveredChildIndex, setHoveredChildIndex] = useState<number | null>(null);

  const handleMouseEnterItem = (index: number) => {
    setHoveredItemIndex(index);
    setHoveredChildIndex(null); // Reset child index when switching top-level items
  };

  const handleMouseLeaveItem = () => {
    setHoveredItemIndex(null);
    setHoveredChildIndex(null);
  };

  const handleMouseEnterChild = (childIndex: number) => {
    setHoveredChildIndex(childIndex);
  };

  const handleMouseLeaveChild = () => {
    setHoveredChildIndex(null);
  };

  const handleLinkClick = () => {
    setHoveredItemIndex(null);
    setHoveredChildIndex(null);
  };
  const handleMouseLeave = () => {
    setHoveredItemIndex(null);
  };

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
          <li className="flex-shrink-0 mt-0 menu-item menu-megamenu menu-megamenu--large group" onMouseEnter={() => handleMouseEnterItem(itemIdx)} onMouseLeave={handleMouseLeaveItem} key={`to-nav-${itemIdx}`} >
            <div className="flex items-center flex-shrink-0 h-16">
              <Link href={`${sanitizeRelativeUrl(item?.hyperlink)}`} className="inline-flex items-center capitalize text-sm lg:text-[12px] 2xl:text-[14px] menu-font-size font-semibold text-slate-700 dark:text-slate-700 py-2.5 px-4 xl:px-4 rounded-full hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-100 dark:hover:text-slate-900 group-hover:bg-slate-100 group-hover:text-black menu-custom-padding header-nav-font" >
                {item?.caption.toLowerCase()}
              </Link>
              {item?.childSiteNavs?.length > 0 &&
                <div className={`absolute inset-x-0 z-50 transform bg-base ${hoveredItemIndex === itemIdx ? 'visible' : 'invisible'} sub-menu ${subMenuPosition}`}>
                  <ul className="container flex items-center gap-4 mx-auto justify-normal">
                    {item?.childSiteNavs?.map((child: any, childIdx: number) => (
                      <li key={`child-menu-${childIdx}`} className="flex-shrink-0 py-4 mt-0 group" onMouseEnter={() => handleMouseEnterChild(childIdx)} onMouseLeave={handleMouseLeaveChild} >
                        <Link href={`${sanitizeRelativeUrl(child?.hyperlink)}`} className="py-4 text-sm font-normal text-black capitalize hover:underline" >
                          {child?.caption.toLowerCase()}
                        </Link>
                        {child?.navBlocks?.length > 0 && (
                          <div className={`absolute inset-x-0 z-50 transform ${hoveredItemIndex === itemIdx && hoveredChildIndex === childIdx ? 'visible' : 'invisible'} ${subMenuPosition}`}>
                            <div className="bg-white shadow-lg tool-bg-transparent dark:bg-white inner-container">
                              <div className="container py-10 tool-container-white">
                                <div className="relative grid items-start w-full grid-cols-1 mx-auto gap-y-4 gap-x-6 md:grid-cols-1 lg:gap-x-0">
                                  <div className="grid grid-flow-col gap-4 auto-cols-auto max-list-panel max-mega-height ">
                                    {getWidgets(child?.navBlocks)?.map((grp: any, grpIdx: number) => (
                                      <div className={(CURRENT_THEME === 'green' || CURRENT_THEME === 'tool') ? 'block' : 'grid grid-cols-4'} key={`nav-Blocks-Grp-${grpIdx}`}>
                                        {grp?.widgets?.map((navItem: any, kdx: number) => (
                                          <div key={`navItems-items-top-${kdx}`}>
                                            <h3 className="mb-3 text-lg font-semibold text-black capitalize font-text-size">
                                              {navItem?.boxTitle?.toLowerCase()}
                                            </h3>
                                            {navItem?.navItems && navItem?.navItems.length ? (
                                              <ul className="mx-0 mt-0 mb-6 font-ul-size">
                                                {navItem?.navItems.sort((a: any, b: any) => a?.caption.localeCompare(b?.caption)).map((item: any, idx: number) => (
                                                  <li key={`navItems-items-${idx}`} className="mt-0 mb-2">
                                                    <Link
                                                      href={navItem?.navBlockType === 9 ? `/collection${sanitizeRelativeUrl(`/${item?.itemLink}`)}` : `${sanitizeRelativeUrl(`/${item?.itemLink}`)}`}
                                                      className="relative flex items-center h-full font-normal text-gray-700 capitalize hover:underline hover:text-black"
                                                      title={item?.caption}
                                                      onClick={handleLinkClick}
                                                    >
                                                      {item?.caption?.toLowerCase()}
                                                    </Link>
                                                  </li>
                                                ))}
                                              </ul>
                                            ) : (
                                              <div className="w-full menu-html menu-data" dangerouslySetInnerHTML={{ __html: removeTitleTags(navItem?.contentBody) }}></div>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="menu-overlay" onMouseEnter={handleMouseLeaveItem} />
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              }
              {item?.navBlocks?.length > 0 && (
                <div className={`absolute inset-x-0 z-50 transform ${hoveredItemIndex === itemIdx ? 'visible' : 'invisible'} sub-menu ${subMenuPosition}`} >
                  <div className="bg-white shadow-lg dark:bg-white inner-container">
                    <div className="container py-10">
                      <div className="relative grid items-start w-full grid-cols-1 mx-auto gap-y-4 gap-x-6 md:grid-cols-1 lg:gap-x-0">
                        <div className="grid grid-flow-col gap-4 auto-cols-auto max-list-panel max-mega-height">
                          {getWidgets(item?.navBlocks)?.map((grp: any, grpIdx: number) => (
                            <div className={CURRENT_THEME === 'green' ? 'block' : 'grid grid-cols-4'} key={`nav-Blocks-Grp-${grpIdx}`} >
                              {grp?.widgets?.map((navItem: any, kdx: number) => (
                                <div key={`navItems-items-top-${kdx}`}>
                                  <h3 className="mb-3 text-lg font-semibold text-black capitalize font-text-size">
                                    {navItem?.boxTitle?.toLowerCase()}
                                  </h3>
                                  {navItem?.navItems && navItem?.navItems.length ? (
                                    <ul className="mx-0 mt-0 mb-6">
                                      {navItem?.navItems.sort((a: any, b: any) => a?.caption.localeCompare(b?.caption)).map((item: any, idx: number) => (
                                        <li key={`navItems-items-${idx}`} className="mt-0 mb-2" >
                                          <Link
                                            href={
                                              navItem?.navBlockType === 9
                                                ? `/collection${sanitizeRelativeUrl(`/${item?.itemLink}`)}`
                                                : `${sanitizeRelativeUrl(`/${item?.itemLink}`)}`
                                            }
                                            className="relative flex items-center h-full font-normal text-gray-700 capitalize hover:underline hover:text-black"
                                            title={item?.caption}
                                            onClick={handleLinkClick}
                                          >
                                            {item?.caption?.toLowerCase()}
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  ) : (
                                    <div className="w-full menu-html menu-data" dangerouslySetInnerHTML={{ __html: removeTitleTags(navItem?.contentBody), }} ></div>
                                  )}
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="menu-overlay" onMouseEnter={handleMouseLeave} />
                </div>
              )}
            </div>
          </li>
        ))}
        {featureToggle?.features?.enableStoreLocator && (
          <li className="flex-shrink-0 mt-0 menu-item menu-megamenu menu-megamenu--large group">
            <div className="flex items-center flex-shrink-0 h-16">
              <Link className="inline-flex items-center capitalize text-sm lg:text-[12px] 2xl:text-[14px] menu-font-size font-semibold text-slate-700 dark:text-slate-700 py-2.5 px-4 xl:px-4 rounded-full hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-100 dark:hover:text-slate-900 group-hover:bg-slate-100 group-hover:text-black menu-custom-padding header-nav-font"
                href={`/store-locator`}>
                Stores
              </Link>
            </div>
          </li>
        )}
      </ul>
    </>
  );
}

export default Navigation;
