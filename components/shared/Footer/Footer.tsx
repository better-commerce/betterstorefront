import { Logo, useUI } from "@components/ui";
import React, { useCallback, useEffect, useState } from "react";
import SocialsList1 from "@components/shared/SocialsList1/SocialsList1";
import Link from "next/link";
import { sanitizeHtmlContent } from "framework/utils/app-util";
import Newsletter from "../Newsletter";
import { Guid } from "@commerce/types";
import Router from "next/router";
import { NEXT_GET_ALL_STORES } from "@components/utils/constants";
import axios from "axios";


const Footer = ({ navItems = [], featureToggle }: any) => {
  const [domLoaded, setDOMLoaded] = useState<boolean>(false)
  const { user, isGuestUser, openLoginSideBar } = useUI();
  const [stores, setStores] = useState([])
  const [filteredStores, setFilteredStores]: any = useState([])
  useEffect(() => {
    getAllStores()
  }, [])
  const getAllStores = async () => {
    try {
      const { data }: any = await axios.get(NEXT_GET_ALL_STORES)
      let stores = data?.map((store: any) => {
        return {
          ...store,
          lat: Number(store?.latitude),
          lng: Number(store?.longitude),
        }
      })
      setFilteredStores(stores)
      setStores(stores)
    } catch (error) {
      console.error('err in fetching stores', error)
    }
  }
  const manageMyAccountLinks = useCallback(() => {
    const selector = "li.text-footer-clr a[href*='/my-account']";
    const lnkMyAccountLinks: NodeListOf<HTMLAnchorElement> = document.querySelectorAll(selector);

    lnkMyAccountLinks.forEach(lnkMyAccount => {
      const userLoggedIn = user?.userId && user?.userId !== Guid.empty && !isGuestUser;

      if (!userLoggedIn) {
        lnkMyAccount.setAttribute("href", "#");
      }

      lnkMyAccount.addEventListener("click", (ev: MouseEvent) => {
        if (!userLoggedIn) {
          ev.preventDefault();
          ev.stopImmediatePropagation();
          openLoginSideBar();
        } else {
          // Do nothing, the default action will proceed
        }
      });
    });

  }, [user, isGuestUser, openLoginSideBar]);

  useEffect(() => {
    if (domLoaded) {
      manageMyAccountLinks();
    }
  }, [domLoaded, manageMyAccountLinks]);

  useEffect(() => {
    setDOMLoaded(true);
  }, []);

  const renderWidgetMenuItem = (item: any, index: number) => {
    return (
      item?.navBlocks?.map((menu: any, index: number) => (
        <div key={index} className="text-sm footer-menu-links">
          <h2 className={`${featureToggle?.features?.enableForPCSite ? 'font-semibold text-body-small text-white dark:text-white' : 'font-bold text-[16px] text-black dark:text-black'}`}> {menu?.boxTitle} </h2>
          <ul role="list" className={`${featureToggle?.features?.enableForPCSite ? 'mt-0 space-y-2' : 'mt-0 space-y-6'}`}>
            <>
              {menu?.contentBody != '' && (
                <li className="mb-4 text-sm font-medium text-gray-900 text-footer-clr f-footer-weight dark:text-black" key={`li${index}`} dangerouslySetInnerHTML={{ __html: sanitizeHtmlContent(menu?.contentBody), }} />
              )}
              {menu?.navItems != '' && (
                <>
                  {menu?.navItems?.map((navItem: any, navItemIdx: number) => (
                    <li key={navItemIdx + 'navItem'} className={`${featureToggle?.features?.enableForPCSite ? 'text-body-small font-normal text-white mb-1' : 'mb-4 text-xs font-medium text-gray-900 text-footer-clr f-footer-weight'}`} >
                      <Link legacyBehavior passHref href={`/men/${navItem?.itemLink}`} >
                        <a href={`/men/${navItem?.itemLink}`} className=" dark:text-white" >
                          {navItem?.caption}
                        </a>
                      </Link>
                    </li>
                  ))}
                </>
              )}
            </>
          </ul>
        </div>
      ))
    );
  };

  useEffect(() => {
    setDOMLoaded(true)
  }, [])

  return (
    <>
      <Newsletter />

      {featureToggle?.features?.enableForPCSite ? (
        <div className="relative pt-16 pb-6 bg-neutral-50 nc-Footer lg:pt-16 lg:pb-6 dark:border-neutral-200 main-footer-section dark:bg-white">
          <div className="container grid grid-cols-1 sm:grid-cols-12">
            <div className="flex flex-col col-span-12 sm:col-span-3">
              <div className="col-span-2 md:col-span-1 footer-logo">
                <Logo />
              </div>
              <div className="flex justify-start gap-2 mt-10">
                <SocialsList1 className="flex items-center justify-start gap-4" featureToggle={featureToggle} />
              </div>
            </div>
            <div className="flex flex-col col-span-12 sm:col-span-6">
              <div className="grid grid-cols-2 gap-1">
                {domLoaded && navItems?.map(renderWidgetMenuItem)}
              </div>
            </div>
            <div className="flex flex-col col-span-12 gap-6 sm:col-span-3">
              {filteredStores?.length > 0 && filteredStores?.map((store: any, storeIdx: number) => (
                <div className="flex flex-col gap-2" key={`stores-${storeIdx}`}>
                  <div className="grid items-center grid-cols-12 gap-4">
                    <div className="col-span-4">
                      <img src={store?.image} className="object-cover w-auto h-20 border-2 border-white rounded-md shadow" alt={store?.name} />
                    </div>
                    <div className="flex flex-col w-full col-span-8">
                      <h4 className="mb-2 text-body-small font-semibold text-white">{store?.name}</h4>
                      <div dangerouslySetInnerHTML={{ __html: `${store?.address1}, ${store?.address2}` }} className="text-xs text-white sm:block" />
                      {store?.phoneNo != null && <span className="text-x-small text-white sm:block dark:text-black">Tel: {store?.phoneNo}</span>}
                    </div>
                  </div>
                </div>
              ))}

            </div>
          </div>
          <div className="container flex flex-col w-full pt-6 mt-6">
            <p className="text-x-small text-[#B3B3B3]">Technical specifications are for guidance only and cannot be guaranteed accurate. All offers subject to availability and while stocks last. Errors and omissions excepted. Registered Company No. 1449928. Park Cameras Limited is a credit broker, not a lender and is authorised and regulated by the Financial Conduct Authority (FRN 680161). We do not charge you for credit broking services. We will introduce you exclusively to Omni Capital finance products provided by Omni Capital Retail Finance Ltd.</p>
          </div>
          <div className="container flex flex-col w-full pt-6 mt-6 border-t border-gray-700">
            <p className="text-x-small text-[#B3B3B3]">&copy; 2025 Park Cameras, York Road, Burgess Hill, West Sussex, RH15 9TT | VAT No. GB 315 9441 58 | Registered Company No. 1449928</p>
          </div>
        </div>
      ) : (
        <div className="relative py-20 border-t border-gray-400 bg-neutral-50 nc-Footer lg:pt-28 lg:pb-24 dark:border-neutral-200 main-footer-section dark:bg-white">
          <div className="container grid grid-cols-2 gap-y-10 gap-x-5 sm:gap-x-8 md:grid-cols-4 lg:grid-cols-5 lg:gap-x-10 ">
            <div className="grid grid-cols-4 col-span-2 gap-5 md:col-span-4 lg:md:col-span-1 lg:flex lg:flex-col">
              <div className="col-span-2 md:col-span-1 footer-logo">
                <Logo />
              </div>
              <div className="flex items-center col-span-2 md:col-span-3 footer-social-links">
                <SocialsList1 className="flex items-center space-x-2 lg:space-x-0 lg:flex-col lg:space-y-3 lg:items-start" featureToggle={featureToggle} />
              </div>
            </div>
            {domLoaded && navItems?.map(renderWidgetMenuItem)}
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;
