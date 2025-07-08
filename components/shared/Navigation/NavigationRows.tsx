import React, { useState } from "react";
import Link from "next/link";
import { sanitizeRelativeUrl } from "@framework/utils/app-util";
import { groupBy, isEmpty } from "lodash";
import { CURRENT_THEME } from "@components/utils/constants";
import { ChevronRightIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { generateUri } from "@commerce/utils/uri-util";
import { IMG_PLACEHOLDER } from "@components/utils/textVariables";

function NavigationRows({ navItems = [], featureToggle, subMenuPosition }: any) {
  const [hoveredItemIndex, setHoveredItemIndex] = useState<number | null>(null);
  const [hoveredChildIndex, setHoveredChildIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  const handleMouseEnterItem = (index: number) => {
    if (index !== hoveredItemIndex) {
      const navBlocks = navItems?.[index]?.navBlocks?.filter(
        (block: any) => block?.navBlockType !== 7
      );
      const firstCategoryTitle =
        navBlocks?.flatMap((block: any) => block?.widgets || [])
          ?.find((widget: any) => widget?.navItems?.length > 0 && !widget?.blockUrl)?.boxTitle;

      setHoveredItemIndex(index);
      setHoveredChildIndex(null);
      setSelectedCategory(firstCategoryTitle || null);
      setHoveredTab(null);
    } else {
      setHoveredItemIndex(index);
    }
  };


  const handleMouseLeaveItem = () => {
    setHoveredItemIndex(null);
    setHoveredChildIndex(null);
    setSelectedCategory(null);
    setHoveredTab(null);
  };

  const handleMouseEnterChild = (childIndex: number) => {
    setHoveredChildIndex(childIndex);
  };

  const handleMouseLeaveChild = () => {
    setHoveredChildIndex(null);
  };

  const handleTabHover = (category: string) => {
    setSelectedCategory(category);
    setHoveredTab(category);
  };

  const handleTabLeave = () => {
    setHoveredTab(null);
  };

  const handleLinkClick = () => {
    setHoveredItemIndex(null);
    setHoveredChildIndex(null);
    setSelectedCategory(null);
    setHoveredTab(null);
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

  const sanitizeContent = (htmlString: string): string => {
    if (!htmlString) return '';
    return htmlString
      .replace(/<title[\s\S]*?>[\s\S]*?<\/title>/gi, '')
      .replace(/<head[\s\S]*?>[\s\S]*?<\/head>/gi, '')
      .replace(/<body[\s\S]*?>|<\/body>/gi, '')
      .replace(/<html[\s\S]*?>|<\/html>/gi, '');
  };

  return (
    <>
      <ul className="flex items-center gap-10 small-sm-gap nc-Navigation navigation-ul nav-ul-li-height">
        {navItems?.map((item: any, itemIdx: number) => (
          <li className="flex-shrink-0 mt-0 menu-item menu-megamenu menu-megamenu--large group" onMouseEnter={() => handleMouseEnterItem(itemIdx)} onMouseLeave={handleMouseLeaveItem} key={`to-nav-${itemIdx}`}>
            <div className="flex items-center flex-shrink-0 h-16 height-div-nav">
              <Link href={`${sanitizeRelativeUrl(item?.hyperlink)}`} className="inline-flex items-center capitalize text-sm lg:text-[12px] 2xl:text-[14px] menu-font-size font-semibold text-slate-700 dark:text-slate-700 py-2.5 px-4 xl:px-4 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-100 dark:hover:text-slate-900 group-hover:bg-slate-100 group-hover:text-black menu-custom-padding header-nav-font" prefetch={false}>
                {item?.caption.toLowerCase()}
              </Link>
              {item?.childSiteNavs?.length > 0 &&
                <div className={`absolute inset-x-0 z-50 transform bg-base ${hoveredItemIndex === itemIdx ? 'visible' : 'invisible'} sub-menu ${subMenuPosition}`}>
                  <ul className="container flex items-center gap-4 mx-auto justify-normal">
                    {item?.childSiteNavs?.map((child: any, childIdx: number) => (
                      <li key={`child-menu-${childIdx}`} className="flex-shrink-0 py-4 mt-0 group" onMouseEnter={() => handleMouseEnterChild(childIdx)} onMouseLeave={handleMouseLeaveChild} >
                        <Link href={`${sanitizeRelativeUrl(child?.hyperlink)}`} className="py-4 text-sm font-normal text-black capitalize hover:underline" prefetch={false}>
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
                                                      href={
                                                        navItem?.navBlockType === 9
                                                          ? item?.itemLink?.startsWith("/category") || item?.itemLink?.startsWith("category/")
                                                            ? sanitizeRelativeUrl(`/${item?.itemLink}`)
                                                            : `/collection${sanitizeRelativeUrl(`/${item?.itemLink}`)}`
                                                          : sanitizeRelativeUrl(`/${item?.itemLink}`)
                                                      }
                                                      className="relative flex items-center h-full font-normal text-gray-700 capitalize hover:underline hover:text-black"
                                                      title={item?.caption}
                                                      onClick={handleLinkClick}
                                                      prefetch={false}
                                                    >
                                                      {item?.caption?.toLowerCase()}
                                                    </Link>
                                                  </li>
                                                ))}
                                              </ul>
                                            ) : (
                                              <div className="w-full menu-html menu-data" dangerouslySetInnerHTML={{ __html: sanitizeContent(navItem?.contentBody) }}></div>
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
                <div className={`absolute inset-x-0 z-50 transform mega_menu_Section ${hoveredItemIndex === itemIdx ? 'visible' : 'invisible'} sub-menu ${subMenuPosition}`}>
                  <div className="bg-white shadow-lg dark:bg-white inner-container">
                    <div className="container px-6 pt-0 pb-6">
                      <div className="relative flex w-full mx-auto">
                        <div className="w-64 max-list-panel max-mega-height">
                          {getWidgets(item?.navBlocks?.filter((block: any) => block?.navBlockType !== 7))?.map((grp: any, grpIdx: number) => (
                            <div key={`category-tab-${grpIdx}`}>
                              {grp?.widgets?.map((navItem: any, kdx: number) => {
                                return (
                                  navItem?.navItems?.length > 0 && navItem?.blockUrl === "" ?
                                    <div
                                      key={`category-btn-${kdx}`}
                                      onMouseEnter={() => handleTabHover(navItem?.boxTitle)}
                                      onMouseLeave={handleTabLeave}
                                      className={`w-full capitalize px-3 py-3 flex justify-between items-center border-link-bottom text-sm font-bold text-black text-left transition-colors ${selectedCategory === navItem?.boxTitle
                                        ? 'text-black bg-[#F5F5F5]'
                                        : 'border-transparent text-black hover:bg-[#F5F5F5]'
                                        }`}>
                                      <span>{navItem?.boxTitle?.toLowerCase()}</span>
                                      <ChevronRightIcon className={`inline-block w-4 h-4 ml-2 ${selectedCategory === navItem?.boxTitle || hoveredTab === navItem?.boxTitle ? 'block' : 'hidden'}`} />
                                    </div>
                                    : <Link href={navItem?.blockUrl != "" ? sanitizeRelativeUrl(`/${navItem?.blockUrl}`) : '#'} onMouseEnter={() => handleTabHover(navItem?.boxTitle)} onMouseLeave={handleTabLeave} onClick={handleLinkClick} passHref className={`w-full capitalize px-3 py-3 flex justify-between items-center border-link-bottom text-sm font-bold text-black text-left transition-colors hover:bg-[#F5F5F5]`}><span>{navItem?.boxTitle?.toLowerCase()}</span></Link>
                                )
                              })}
                            </div>
                          ))}
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 pt-6 pl-6">
                          {/* Category Content */}
                          {selectedCategory && selectedCategory !== "featured" && (
                            <div className="space-y-6">
                              {getWidgets(item?.navBlocks?.filter((block: any) => block?.navBlockType !== 7))?.map((grp: any) =>
                                grp?.widgets?.filter((navItem: any) => navItem?.boxTitle === selectedCategory)?.map((navItem: any, kdx: number) => (
                                  <div key={`category-content-${kdx}`} className="mid-mega-container">
                                    <h3 className="mb-6 font-semibold capitalize text-center text-xs text-[#757575]">
                                      {navItem?.boxTitle?.toLowerCase()}
                                    </h3>
                                    {navItem?.navItems?.length ? (
                                      <ul className="grid grid-cols-4 gap-4">
                                        {navItem?.navItems.sort((a: any, b: any) => a?.caption?.localeCompare(b?.caption)).map((item: any, idx: number) => (
                                          <li key={`category-link-${idx}`}>
                                            <Link
                                              href={navItem?.navBlockType === 9 ? item?.itemLink?.startsWith('/category') || item?.itemLink?.startsWith('category/') ? sanitizeRelativeUrl(`/${item?.itemLink}`) : `/collection${sanitizeRelativeUrl(`/${item?.itemLink}`)}` : sanitizeRelativeUrl(`/${item?.itemLink}`)}
                                              className="flex flex-col justify-center w-full text-sm font-semibold text-center text-black capitalize hover:text-black hover:underline"
                                              onClick={handleLinkClick}
                                              prefetch={false}
                                            >
                                              {item?.itemImageSrc && item?.itemImageSrc != "" && <img src={generateUri(item?.itemImageSrc, 'h=200&fm=webp') || IMG_PLACEHOLDER} alt={item?.caption?.toLowerCase()} className="object-contain w-24 h-16 mx-auto" />}
                                              <span className="w-full">{item?.caption?.toLowerCase()}</span>
                                            </Link>
                                          </li>
                                        ))}
                                      </ul>
                                    ) : (
                                      <div className="menu-html menu-data" dangerouslySetInnerHTML={{ __html: sanitizeContent(navItem?.contentBody) }}></div>
                                    )}
                                  </div>
                                ))
                              )}
                            </div>
                          )}
                        </div>

                        {/* Popular Brands Section - Fixed Right */}
                        {getWidgets(item?.navBlocks?.filter((block: any) => block?.navBlockType === 8))?.length > 0 &&
                          getWidgets(item?.navBlocks?.filter((block: any) => block?.navBlockType === 8))?.some((grp: any) =>
                            grp?.widgets?.some((navItem: any) => navItem?.navItems?.length > 0)
                          ) && (
                            <div className="w-64 pl-6 border-l">
                              {getWidgets(
                                item?.navBlocks?.filter((block: any) => block?.navBlockType === 8)
                              )?.[0]?.widgets?.[0]?.boxTitle && (
                                  <h3 className="mt-2 mb-3 text-sm font-bold text-left text-black capitalize">
                                    {getWidgets(
                                      item?.navBlocks?.filter((block: any) => block?.navBlockType === 8)
                                    )?.[0]?.widgets?.[0]?.boxTitle?.toLowerCase()}
                                  </h3>
                                )}
                              {getWidgets(
                                item?.navBlocks?.filter((block: any) => block?.navBlockType === 8)
                              )?.map((grp: any, grpIdx: number) => (
                                <div key={`popular-brands-${grpIdx}`}>
                                  {grp?.widgets?.map((navItem: any, kdx: number) => (
                                    navItem?.navItems?.length > 0 && (
                                      <div key={`brand-section-${kdx}`}>
                                        <ul className="space-y-2">
                                          {navItem?.navItems
                                            ?.filter((item: any) => item?.caption && item?.itemLink)
                                            ?.sort((a: any, b: any) => (a?.caption || '').localeCompare(b?.caption || ''))
                                            ?.map((item: any, idx: number) => (
                                              <li key={`brand-${idx}`}>
                                                <Link
                                                  href={sanitizeRelativeUrl(`/${item?.itemLink || ''}`)}
                                                  className="text-sm font-medium text-black capitalize hover:text-black hover:underline"
                                                  onClick={handleLinkClick}
                                                  prefetch={false}
                                                >
                                                  {(item?.caption || '').toLowerCase()}
                                                </Link>
                                              </li>
                                            ))}
                                        </ul>
                                      </div>
                                    )
                                  ))}
                                </div>
                              ))}
                            </div>
                          )}

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
            <div className="flex items-center flex-shrink-0 h-16 height-div-nav">
              <Link className="inline-flex items-center capitalize text-sm lg:text-[12px] 2xl:text-[14px] menu-font-size font-semibold text-slate-700 dark:text-slate-700 py-2.5 px-4 xl:px-4 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-100 dark:hover:text-slate-900 group-hover:bg-slate-100 group-hover:text-black menu-custom-padding header-nav-font"
                href={`/store-locator`}>
                {featureToggle?.features?.enableForPCSite && <MapPinIcon className="inline-block w-5 h-5" />} Stores
              </Link>
            </div>
          </li>
        )}
      </ul>
    </>
  );
}

export default NavigationRows;
