import { Logo, useUI } from "@components/ui";
import React, { useCallback, useEffect, useState } from "react";
import SocialsList1 from "@components/shared/SocialsList1/SocialsList1";
import Link from "next/link";
import { sanitizeHtmlContent } from "framework/utils/app-util";
import Newsletter from "../Newsletter";
import { Guid } from "@commerce/types";
import Router from "next/router";


const Footer = ({ navItems = [] }: any) => {
  const [domLoaded, setDOMLoaded] = useState<boolean>(false)
  const { user, isGuestUser, openLoginSideBar } = useUI();

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
          <h2 className="font-bold text-[16px] text-black dark:text-black"> {menu?.boxTitle} </h2>
          <ul role="list" className="mt-0 space-y-6">
            <>
              {menu?.contentBody != '' && (
                <li className="mb-4 text-sm font-medium text-gray-900 text-footer-clr f-footer-weight dark:text-black" key={`li${index}`} dangerouslySetInnerHTML={{ __html: sanitizeHtmlContent(menu?.contentBody), }} />
              )}
              {menu?.navItems != '' && (
                <>
                  {menu?.navItems?.map((navItem: any, navItemIdx: number) => (
                    <li key={navItemIdx + 'navItem'} className="mb-4 text-sm font-medium text-gray-900 text-footer-clr f-footer-weight" >
                      <Link legacyBehavior passHref href={`/men/${navItem?.itemLink}`} >
                        <a href={`/men/${navItem?.itemLink}`} className="text-xs dark:text-white" >
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
      <div className="relative py-20 border-t border-gray-400 bg-neutral-50 nc-Footer lg:pt-28 lg:pb-24 dark:border-neutral-200 main-footer-section dark:bg-white">
        <div className="container grid grid-cols-2 gap-y-10 gap-x-5 sm:gap-x-8 md:grid-cols-4 lg:grid-cols-5 lg:gap-x-10 ">
          <div className="grid grid-cols-4 col-span-2 gap-5 md:col-span-4 lg:md:col-span-1 lg:flex lg:flex-col">
            <div className="col-span-2 md:col-span-1 footer-logo">
              <Logo />
            </div>
            <div className="flex items-center col-span-2 md:col-span-3 footer-social-links">
              <SocialsList1 className="flex items-center space-x-2 lg:space-x-0 lg:flex-col lg:space-y-3 lg:items-start" />
            </div>
          </div>
          {domLoaded && navItems?.map(renderWidgetMenuItem)}
        </div>
      </div>
    </>
  );
};

export default Footer;
