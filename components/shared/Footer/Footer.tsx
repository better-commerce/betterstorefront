import { Logo } from "@components//ui";
import React from "react";
import SocialsList1 from "@components//shared/SocialsList1/SocialsList1";
import Link from "next/link";
import { sanitizeHtmlContent } from "framework/utils/app-util";


const Footer = ({navItems}:any) => {
  const renderWidgetMenuItem = (item: any, index: number) => {
    return (
      item?.navBlocks?.map((menu: any, index: number) => (
        <div key={index} className="text-sm">
          <h2 className="font-semibold text-neutral-700 dark:text-neutral-200"> {menu?.boxTitle} </h2>
          <ul role="list" className="mt-0 space-y-6">
            <>
              {menu?.contentBody != '' && (
                <li className="mb-4 text-sm font-medium text-gray-900 text-footer-clr f-footer-weight" key={`li${index}`} dangerouslySetInnerHTML={{ __html: sanitizeHtmlContent(menu?.contentBody), }} />
              )}
              {menu?.navItems != '' && (
                <>
                  {menu?.navItems?.map((navItem: any, navItemIdx: number) => (
                    <li key={navItemIdx + 'navItem'} className="mb-4 text-sm font-medium text-gray-900 text-footer-clr f-footer-weight" >
                      <Link passHref href={`/men/${navItem?.itemLink}`} >
                        <a href={`/men/${navItem?.itemLink}`} className="text-xs" >
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

  return (
    <div className="relative py-20 border-t nc-Footer lg:pt-28 lg:pb-24 border-neutral-200 dark:border-neutral-700">
      <div className="container grid grid-cols-2 gap-y-10 gap-x-5 sm:gap-x-8 md:grid-cols-4 lg:grid-cols-5 lg:gap-x-10 ">
        <div className="grid grid-cols-4 col-span-2 gap-5 md:col-span-4 lg:md:col-span-1 lg:flex lg:flex-col">
          <div className="col-span-2 md:col-span-1">
            <Logo />
          </div>
          <div className="flex items-center col-span-2 md:col-span-3">
            <SocialsList1 className="flex items-center space-x-2 lg:space-x-0 lg:flex-col lg:space-y-3 lg:items-start" />
          </div>
        </div>
        {navItems.map(renderWidgetMenuItem)}
      </div>
    </div>
  );
};

export default Footer;
