import { Logo, useUI } from "@components/ui";
import React, { useCallback, useEffect, useState } from "react";
import SocialsList1 from "@components/shared/SocialsList1/SocialsList1";
import Link from "next/link";
import { sanitizeHtmlContent } from "framework/utils/app-util";
import Newsletter from "../Newsletter";
import { Guid } from "@commerce/types";
// import Router from "next/router";
import { CURRENT_THEME, NEXT_GET_ALL_STORES } from "@components/utils/constants";
import axios from "axios";
import ReviewSection from "@components/shared/ReviewSection/ReviewSection";


const Footer = ({ navItems = [], featureToggle }: any) => {
  const [domLoaded, setDOMLoaded] = useState<boolean>(false)
  const { user, isGuestUser, openLoginSideBar } = useUI();
  const [allStores, setAllStores]: any = useState([])
  const [mobileMenuAccordion, setMobileMenuAccordion] = useState<{ [key: string]: boolean }>({})
  const [isMobile, setIsMobile] = useState<boolean>(false)
  useEffect(() => {
    getAllStores()
  }, [])
  const getAllStores = async () => {
    try {
      const { data }: any = await axios.get(NEXT_GET_ALL_STORES)
      let storeData = data?.map((store: any) => {
        return {
          ...store,
          lat: Number(store?.latitude),
          lng: Number(store?.longitude),
        }
      })
      setAllStores(storeData)
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

  // Toggle accordion open/closed state
  const toggleAccordion = (accordionId: string) => {
    if (isMobile) {
      setMobileMenuAccordion(prev => ({
        ...prev,
        [accordionId]: !prev[accordionId]
      }))
    }
  }

  const renderWidgetMenuItem = (item: any, itemIndex: number) => {
    return (
      item?.navBlocks?.map((menu: any, index: number) => {
        const accordionId = `accordion-${itemIndex}-${index}`
        const isOpen = mobileMenuAccordion[accordionId] || !isMobile

        return (
          <div key={index} className="text-sm footer-menu-links">
            <h2
              className={`${featureToggle?.features?.enableForPCSite ? 'font-semibold text-body-small text-white dark:text-white' : 'font-bold text-[16px] text-black dark:text-black'}
                ${isMobile ? 'flex justify-between items-center cursor-pointer' : ''}`}
              onClick={() => toggleAccordion(accordionId)}
            >
              {menu?.boxTitle}
              {isMobile && (
                <span className="accordion-icon">
                  {isOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
                    </svg>
                  )}
                </span>
              )}
            </h2>
            <ul
              role="list"
              className={`${featureToggle?.features?.enableForPCSite ? 'mt-0 space-y-2' : 'mt-0 space-y-6'}
                ${isMobile ? 'accordion-content overflow-hidden transition-all duration-300 ease-in-out' : ''}`}
              style={isMobile ? { maxHeight: isOpen ? '1000px' : '0', opacity: isOpen ? 1 : 0, marginTop: isOpen ? '0.5rem' : '0' } : {}}
            >
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
        )
      })
    );
  };

  useEffect(() => {
    setDOMLoaded(true)

    // Check if we're on mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkMobile()

    // Add resize listener
    window.addEventListener('resize', checkMobile)

    // Initialize all accordions as closed on mobile
    if (window.innerWidth < 768) {
      // Small delay to ensure DOM is fully loaded
      setTimeout(() => {
        const initialAccordionState: { [key: string]: boolean } = {}
        navItems.forEach((item: any, itemIndex: number) => {
          item?.navBlocks?.forEach((menu: any, index: number) => {
            const accordionId = `accordion-${itemIndex}-${index}`
            initialAccordionState[accordionId] = false
          })
        })
        setMobileMenuAccordion(initialAccordionState)
      }, 100)
    }

    // Cleanup
    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  return (
    <>
      <Newsletter featureToggle={featureToggle} />
      {featureToggle?.features?.enableForPCSite ? (
        <div className="relative pt-16 pb-6 bg-neutral-50 nc-Footer lg:pt-16 lg:pb-6 dark:border-neutral-200 main-footer-section dark:bg-white">
          <div className="container grid grid-cols-1 sm:grid-cols-12">
            <div className="flex flex-col col-span-12 sm:col-span-3">
              <div className="col-span-2 md:col-span-1 footer-logo">
                <Logo />
              </div>
              <div className="flex justify-start gap-2 mt-10 sm:mb-4 -ml-[20px]">
                <ReviewSection templateId="53aa8807dec7e10d38f59f32" templateSize="S" widgetClass="trustpilot-widget" />
              </div>
              <div className="flex justify-start gap-2 mt-10">
                <SocialsList1 className="flex items-center justify-start gap-4" featureToggle={featureToggle} />
              </div>
            </div>
            <div className="flex flex-col col-span-12 mt-4 mb-4 sm:col-span-6 sm:mb-0 sm:mt-0">
              <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                {domLoaded && navItems?.map(renderWidgetMenuItem)}
              </div>
            </div>
            <div className="flex flex-col col-span-12 gap-6 sm:col-span-3">
              {allStores?.length > 0 && allStores?.map((store: any, storeIdx: number) => (
                <div className="flex flex-col gap-2" key={`stores-${storeIdx}`}>
                  <div className="grid items-center grid-cols-12 gap-4">
                    <div className="col-span-4">
                      <img src={store?.image} className="object-cover w-full" alt={store?.name} />
                    </div>
                    <div className="flex flex-col w-full col-span-8">
                      <h4 className="mb-2 font-semibold text-[#5A5A5A] text-body-small">{store?.name}</h4>
                      <div dangerouslySetInnerHTML={{ __html: `${store?.address1}, ${store?.address2}` }} className="text-xs text-[#5A5A5A] sm:block" />
                      {store?.phoneNo != null && <span className="text-white text-x-small sm:block dark:text-black">Tel: {store?.phoneNo}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="container flex flex-col w-full pt-6 mt-6">
            <p className="text-x-small text-[#5A5A5A]">Technical specifications are for guidance only and cannot be guaranteed accurate. All offers subject to availability and while stocks last. Errors and omissions excepted. Registered Company No. 1449928. Park Cameras Limited is a credit broker, not a lender and is authorised and regulated by the Financial Conduct Authority (FRN 680161). We do not charge you for credit broking services. We will introduce you exclusively to Omni Capital finance products provided by Omni Capital Retail Finance Ltd.</p>
          </div>
          <div className="container flex flex-col gap-y-4 sm:flex-row sm:justify-between items-center w-full pt-6 mt-6 border-t border-[#D9D9D9]">
            <p className="text-x-small text-[#5A5A5A]">&copy; {new Date().getFullYear()} Park Cameras, York Road, Burgess Hill, West Sussex, RH15 9TT | VAT No. GB 315 9441 58 | Registered Company No. 1449928</p>
             <img src={`/theme/${CURRENT_THEME}/image/payment-card-img.png`} alt="payment Logo" className="h-[25px]"/>
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
