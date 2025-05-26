import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import NextHead from 'next/head'
import Image from 'next/image'
import axios from 'axios'
import os from 'os'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import type { GetStaticPropsContext } from 'next'
import { CURRENT_THEME, EmptyGuid, EngageEventTypes, SITE_ORIGIN_URL } from '@components/utils/constants'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import useAnalytics from '@components/services/analytics/useAnalytics'
import { HOME_PAGE_NEW_SLUG, HOME_PAGE_SLUG, STATIC_PAGE_CACHE_INVALIDATION_IN_MINS, TOOLS_HOME_PAGE_SLUG } from '@framework/utils/constants'
import { getCurrency, getCurrentCurrency, isB2BUser, maxBasketItemsCount, obfuscateHostName, sanitizeRelativeUrl, setCurrentCurrency } from '@framework/utils/app-util'
import { getSecondsInMinutes, matchStrings, } from '@framework/utils/parse-util'
import { useTranslation } from '@commerce/utils/use-translation'
import Layout from '@components/Layout/Layout'
import { useUI } from '@components/ui/context'
import EngageProductCard from '@components/SectionEngagePanels/ProductCard'
import SectionBrandCard from '@components/SectionBrandCard'
import { IPagePropsProvider } from '@framework/contracts/page-props/IPagePropsProvider'
import { PagePropType, getPagePropType } from '@framework/page-props'
import Heading from '@components/Heading/Heading'
// @ts-ignore - Ignore missing type definitions for Glide
import Glide from "@glidejs/glide/dist/glide.esm";
import Link from 'next/link'
import { IMAGE_CDN_URL, IMG_PLACEHOLDER } from '@components/utils/textVariables'
import { generateUri, removeQueryString, serverSideMicrositeCookies } from '@commerce/utils/uri-util'
import { Hero } from '@components/ui'
import { Guid } from '@commerce/types';
import { AnalyticsEventType } from '@components/services/analytics'
import DealProduct from '@components/home/DealProduct'
import BrandList from '@components/home/BrandList'
import BestSellerProduct from '@components/home/Bestseller'
// import { ArrowRight } from '@components/icons' // Not used
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import HeroLeft from '@components/ui/Hero/HeroLeft'
import SectionHomeProductCardNew from '@components/SectionHomeProductCardNew'
import RecentlyViewedProduct from '@components/Product/RelatedProducts/RecentlyViewedProducts'
import ImageCollection from '@components/home/ImageCollection'
import ProductTabs from '@components/Product/ProductTabs'
// Optimize dynamic imports with loading priorities
const SectionHero2 = dynamic(() => import('@components/SectionHero/SectionHero2'), { ssr: true })
const Loader = dynamic(() => import('@components/ui/LoadingDots'), { ssr: true })

// Defer non-critical components
const DiscoverMoreSlider = dynamic(() => import('@components/DiscoverMoreSlider'), { ssr: false })
const SectionSliderProductCard = dynamic(() => import('@components/SectionSliderProductCard'), { ssr: false })
const BackgroundSection = dynamic(() => import('@components/BackgroundSection/BackgroundSection'), { ssr: false })
const SectionSliderLargeProduct = dynamic(() => import('@components/SectionSliderLargeProduct'), { ssr: false })
const SectionSliderCategories = dynamic(() => import('@components/SectionSliderCategories/SectionSliderCategories'), { ssr: false })
const ImageBanner = dynamic(() => import('@components/home/ImageBanner'), { ssr: false })
const ChooseList = dynamic(() => import('@components/home/ChooseList'), { ssr: false })
const CategoryList = dynamic(() => import('@components/home/CategoryList'), { ssr: false })
// const SectionPromo3 = dynamic(() => import('@components/SectionPromo3'), { ssr: false }) // Not used
const ContentEditorJS = dynamic(() => import("@components/content-editor"), {
  ssr: false,
});
declare const window: any

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  const hostName = os.hostname()
  let slug = HOME_PAGE_SLUG;
  if (CURRENT_THEME == "black") {
    slug = HOME_PAGE_NEW_SLUG
  } else if (CURRENT_THEME == "orange") {
    slug = HOME_PAGE_SLUG
  } else if (CURRENT_THEME == "tool") {
    slug = TOOLS_HOME_PAGE_SLUG
  } else {
    slug = HOME_PAGE_SLUG;
  }
  const props: IPagePropsProvider = getPagePropType({ type: PagePropType.HOME })
  const cookies = serverSideMicrositeCookies(locale!)
  const pageProps = await props.getPageProps({ slug, cookies })

  return {
    props: {
      ...pageProps,
      hostName: obfuscateHostName(hostName),
    },
    revalidate: getSecondsInMinutes(STATIC_PAGE_CACHE_INVALIDATION_IN_MINS)
  }
}

const PAGE_TYPE = PAGE_TYPES.Home

function Home({ pageContentsWeb, pageContentsMobileWeb, config, hostName, deviceInfo, campaignData, featureToggle, defaultDisplayMembership }: any) {
  const router = useRouter()
  const { user, isGuestUser } = useUI()
  const { isMobile } = deviceInfo
  const currencyCode = getCurrency()
  const translate = useTranslation()
  // State management
  const [activeTab, setActiveTab] = useState("specialOffers");
  const homePageContents = isMobile ? pageContentsMobileWeb?.find((x: any) => x?.key === currencyCode)?.value || [] : pageContentsWeb?.find((x: any) => x?.key === currencyCode)?.value || []
  const [pageContents, setPageContents] = useState<any>(homePageContents)
  let Page_Slug = HOME_PAGE_SLUG;
  if (CURRENT_THEME == "black") {
    Page_Slug = HOME_PAGE_NEW_SLUG
  } else if (CURRENT_THEME == "orange") {
    Page_Slug = HOME_PAGE_SLUG
  } else if (CURRENT_THEME == "tool") {
    Page_Slug = TOOLS_HOME_PAGE_SLUG
  } else {
    Page_Slug = HOME_PAGE_SLUG;
  }
  // Optimize API call with useCallback
  const fetchPageContents = useCallback(() => {
    const currentCurrency = getCurrentCurrency()
    if (!matchStrings(currencyCode, currentCurrency, true)) {
      axios
        .post('/api/page-preview-content', {
          id: '',
          slug: Page_Slug,
          workingVersion: process.env.NODE_ENV === 'production' ? true : true,
          channel: isMobile ? 'MobileWeb' : 'Web',
          cachedCopy: true,
          currencyCode,
        })
        .then((res: any) => {
          if (res?.data) setPageContents(res?.data)
        })
      setCurrentCurrency(currencyCode)
    }
  }, [currencyCode, isMobile, Page_Slug])

  // Fetch page contents on currency or device change
  useEffect(() => {
    fetchPageContents()
  }, [fetchPageContents])

  useEffect(() => {
    if (typeof window !== "undefined" && window?.ch_session) {
      window.ch_index_page_view_before({ item_id: "index", bc_user_id: user?.userId || EmptyGuid })
    }
  }, [])

  useAnalytics(AnalyticsEventType.PAGE_VIEWED, { ...pageContents, entityName: PAGE_TYPES.Home, })

  if (!pageContents) {
    return (
      <div className="flex w-full text-center flex-con"> <Loader /> </div>
    )
  }
  const sliderRef = useRef(null);
  const sliderRefCmp = useRef(null);
  const [isShow, setIsShow] = useState(false);
  // Memoize Glide options to prevent unnecessary recalculations
  const glideOptions = useMemo((): Partial<Glide.Options> => {
    return {
      perView: featureToggle?.features?.enableForPCSite ? 3 : 6,
      gap: 16,
      bound: true,
      breakpoints: {
        1280: { gap: 16, perView: featureToggle?.features?.enableForPCSite ? 3 : 6, },
        1279: { gap: 16, perView: featureToggle?.features?.enableForPCSite ? 3 : 6, },
        1023: { gap: 16, perView: featureToggle?.features?.enableForPCSite ? 3 : 6, },
        768: { gap: 16, perView: featureToggle?.features?.enableForPCSite ? 3 : 6, },
        500: { gap: 16, perView: 1.5, },
      },
    };
  }, [featureToggle?.features?.enableForPCSite]);

  // Initialize Glide sliders with memoized options
  useEffect(() => {
    if (!sliderRef.current) return;

    let slider = new Glide(sliderRef.current, glideOptions);
    let sliderCmf = new Glide(sliderRefCmp.current, glideOptions);
    slider.mount();
    sliderCmf.mount();
    setIsShow(true);
    return () => {
      slider.destroy();
      sliderCmf.destroy();
    };
  }, [sliderRef, glideOptions]);
  // Add tab change handlers
  const handleTabChange = useCallback((tabName: string) => {
    setActiveTab(tabName);
  }, [setActiveTab]);

  const handleSpecialOffersClick = useCallback(() => {
    handleTabChange("specialOffers");
  }, [handleTabChange]);

  const handleNewProductsClick = useCallback(() => {
    handleTabChange("newProducts");
  }, [handleTabChange]);

  const cleanPath = removeQueryString(router.asPath)
  const redirectHref = useMemo(() => {
    if (!isGuestUser && user?.userId && user?.id !== Guid.empty && isB2BUser(user)) { // if loggedIn with B2b user
      return '/my-account/my-company/quotes';
    } else if (!isGuestUser && user?.userId && user?.id !== Guid.empty) {  // if loggedIn user
      return 'tel:+442086915794';
    } else {
      return '/my-account/login';
    }
  }, [isGuestUser, user]);
  const productTabs = [
    pageContents?.cameraslist && {
      id: 'Cameras',
      label: 'Cameras',
      content: (
        <div className="space-y-4">
          <SectionHomeProductCardNew onlyImage={false} products={pageContents?.cameraslist} productPerColumn={featureToggle?.features?.enableRichPDPTabs ? 5 : 4} deviceInfo={deviceInfo} featureToggle={featureToggle} />
        </div>
      )
    },
    pageContents?.usedcameraslist && {
      id: 'UsedCameras',
      label: 'Used Cameras',
      content: (
        <div className="space-y-4">
          <SectionHomeProductCardNew onlyImage={false} products={pageContents?.usedcameraslist} productPerColumn={featureToggle?.features?.enableRichPDPTabs ? 5 : 4} deviceInfo={deviceInfo} featureToggle={featureToggle} />
        </div>
      )
    },
    pageContents?.lenseslist && {
      id: 'Lenses',
      label: 'Lenses',
      content: (
        <div className="space-y-4">
          <SectionHomeProductCardNew onlyImage={false} products={pageContents?.lenseslist} productPerColumn={featureToggle?.features?.enableRichPDPTabs ? 5 : 4} deviceInfo={deviceInfo} featureToggle={featureToggle} />
        </div>
      )
    },
    pageContents?.usedlenseslist && {
      id: 'UsedLenses',
      label: 'Used Lenses',
      content: (
        <div className="space-y-4">
          <SectionHomeProductCardNew onlyImage={false} products={pageContents?.usedlenseslist} productPerColumn={featureToggle?.features?.enableRichPDPTabs ? 5 : 4} deviceInfo={deviceInfo} featureToggle={featureToggle} />
        </div>
      )
    },
    pageContents?.bagslist && {
      id: 'Bags',
      label: 'Bags',
      content: (
        <div className="space-y-4">
          <SectionHomeProductCardNew onlyImage={false} products={pageContents?.bagslist} productPerColumn={featureToggle?.features?.enableRichPDPTabs ? 5 : 4} deviceInfo={deviceInfo} featureToggle={featureToggle} />
        </div>
      )
    },
    pageContents?.tripodslist && {
      id: 'Tripods',
      label: 'Tripods',
      content: (
        <div className="space-y-4">
          <SectionHomeProductCardNew onlyImage={false} products={pageContents?.tripodslist} productPerColumn={featureToggle?.features?.enableRichPDPTabs ? 5 : 4} deviceInfo={deviceInfo} featureToggle={featureToggle} />
        </div>
      )
    },
    pageContents?.videolist && {
      id: 'Video',
      label: 'Video',
      content: (
        <div className="space-y-4">
          <SectionHomeProductCardNew onlyImage={false} products={pageContents?.videolist} productPerColumn={featureToggle?.features?.enableRichPDPTabs ? 5 : 4} deviceInfo={deviceInfo} featureToggle={featureToggle} />
        </div>
      )
    },
    pageContents?.accessorieslist && {
      id: 'Accessories',
      label: 'Accessories',
      content: (
        <div className="space-y-4">
          <SectionHomeProductCardNew onlyImage={false} products={pageContents?.accessorieslist} productPerColumn={featureToggle?.features?.enableRichPDPTabs ? 5 : 4} deviceInfo={deviceInfo} featureToggle={featureToggle} />
        </div>
      )
    },
  ].filter(Boolean);
  return (
    <>
      {(pageContents?.metatitle || pageContents?.metadescription || pageContents?.metakeywords) && (
        <NextHead>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
          <link rel="canonical" id="canonical" href={pageContents?.canonical || SITE_ORIGIN_URL + cleanPath} />
          <title>{pageContents?.metatitle || translate('common.label.homeText')}</title>
          <meta name="title" content={pageContents?.metatitle || translate('common.label.homeText')} />
          {pageContents?.metadescription && (<meta name="description" content={pageContents?.metadescription} />)}
          {pageContents?.metakeywords && (<meta name="keywords" content={pageContents?.metakeywords} />)}
          <meta property="og:image" content={pageContents?.image} />
          {pageContents?.metatitle && (<meta property="og:title" content={pageContents?.metatitle} key="ogtitle" />)}
          {pageContents?.metadescription && (<meta property="og:description" content={pageContents?.metadescription} key="ogdesc" />)}
        </NextHead>
      )}

      {hostName && <input className="inst" type="hidden" value={hostName} />}
      <div className="relative overflow-hidden nc-PageHome homepage-main dark:bg-white">
        {/* Conditionally render based on feature toggle */}
        {featureToggle?.features?.enableForPCSite ? (
          <>
            <div className='grid grid-cols-2 gap-2 sm:grid-cols-12'>
              <div className='col-span-12 sm:col-span-8'>
                <HeroLeft banners={pageContents?.banner} featureToggle={featureToggle} deviceInfo={deviceInfo} />
              </div>
              <div className='col-span-12 sm:col-span-4'>
                {pageContents?.usedproduct?.length > 0 && pageContents?.usedproduct?.map((usd: any, uIdx: number) => (
                  <div className='relative flex flex-col items-center justify-center w-full gap-2 sm:min-h-[480px] py-4 overflow-hidden' key={`used-product-${uIdx}`}>
                    <img
                      src={generateUri(usd?.usedproduct_bgpattern, 'h=500&fm=webp') || IMG_PLACEHOLDER}
                      className='absolute top-0 left-0 w-full h-full z-1'
                      alt="Background pattern"
                      sizes="100vw"
                      loading={uIdx === 0 ? "eager" : "lazy"}
                    />
                    <div className='relative flex flex-col items-center justify-center w-full gap-2 bg-transparent z-2 '>
                      <h2 className='font-bold uppercase primary-text-blue title-page'>{usd?.usedproduct_title}</h2>
                      <div className='mx-auto text-[14px] font-semibold primary-text-blue text-center sm:w-8/12' dangerouslySetInnerHTML={{ __html: usd?.usedproduct_description }}></div>
                      <div className='h-48 col-span-12 sm:h-56'>
                        <img
                          src={generateUri(usd?.usedproduct_image, 'h=500&fm=webp') || IMG_PLACEHOLDER}
                          alt={usd?.usedproduct_title}
                          className='object-cover w-full h-40 sm:h-56'
                          width={500}
                          height={224}
                          loading="lazy"
                        />
                      </div>
                    </div>
                    <Link href={usd?.usedproduct_primarybuttonlink} className='flex absolute bottom-4 items-center justify-center gap-1 px-4 py-2 text-sm font-semibold bg-transparent border rounded border-[#294384] text-[#294384]'>{usd?.usedproduct_primarybutton} <ArrowRightIcon className='w-4 h-4' /></Link>
                  </div>
                ))}
              </div>
            </div>
            <div className='flex flex-col w-full bg-[#EAEDF5] sm:py-10 py-6 px-4 justify-center text-center gap-2'>
              <h3 className='font-semibold text-black heading'>Get an instant quote for your camera kit.</h3>
              <p className='font-normal text-black text-x-small'>Find out how much your equipment is worth.</p>
              <div className='flex-1 mx-auto mt-4'>
                <Link href="/sell-or-part-exchange" passHref legacyBehavior>
                  <a className='px-10 py-2 rounded-full btn-c btn-primary'>Check out here now</a>
                </Link>
              </div>
            </div>
            <div className='container relative flex flex-col pt-6 mt-0 sm:pt-20 mb-7 sm:mb-8 lg:mb-12'>
              {pageContents?.about?.length > 0 && pageContents?.about?.map((ab: any, aIdx: number) => (
                <div className='grid items-center gap-4 sm:gap-12 sm:grid-cols-12' key={`about-${aIdx}`}>
                  <div className='order-2 col-span-12 sm:col-span-4 sm:order-1'>
                    <div className='col-span-12'>
                      <img
                        src={generateUri(ab?.about_image, 'h=500&fm=webp') || IMG_PLACEHOLDER}
                        alt={ab?.about_title}
                        className='object-cover w-full h-full'
                        width={500}
                        height={500}
                        loading="lazy"
                      />
                    </div>
                  </div>
                  <div className='order-1 col-span-12 sm:col-span-8 sm:order-2'>
                    <div className='flex flex-col justify-start w-full gap-4'>
                      <h2 className='font-semibold text-black heading'>{ab?.about_title}</h2>
                      <div className='font-normal text-black sm:w-full text-body-small' dangerouslySetInnerHTML={{ __html: ab?.about_description }}></div>
                    </div>
                  </div>
                </div>
              ))}
              {pageContents?.shopwithus?.length > 0 && pageContents?.shopwithus?.map((swu: any, sIdx: number) => (
                <div className='grid items-end grid-cols-12 gap-1 pt-6 border-b border-gray-200 sm:items-center sm:pt-0 sm:gap-12 sm:grid-cols-12' key={`swu-${sIdx}`}>
                  <span className='w-[100px] sm:h-0 sm:mb-0 mb-4 h-[2px] col-span-12 bg-black mx-auto'></span>
                  <div className='order-1 col-span-7 sm:col-span-8 sm:order-1'>
                    <div className='flex flex-col justify-center w-full gap-1 sm:gap-4'>
                      <span className='w-[100px] sm:h-1 h-0 bg-black mx-auto'></span>
                      <h2 className='font-semibold text-left text-black sm:text-center sub-heading'>{swu?.shopwithus_title}</h2>
                      <div className='mx-auto font-normal sm:text-center text-left !leading-relaxed text-gray-600 sm:w-10/12' dangerouslySetInnerHTML={{ __html: swu?.shopwithus_description }}></div>
                    </div>
                  </div>
                  <div className='order-2 col-span-5 sm:col-span-4 sm:order-2'>
                    <div className='col-span-12'>
                      <img
                        src={generateUri(swu?.shopwithus_image, 'h=500&fm=webp') || IMG_PLACEHOLDER}
                        alt={swu?.shopwithus_title}
                        className='object-cover w-full h-full'
                        width={500}
                        height={500}
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
              ))}
              {/* Related items section */}
              {/* {pageContents?.relateditems?.length > 0 && (
                <div className="container flex flex-col !px-0 mx-auto bg-white border-t border-gray-200 sm:pt-10 pt-6 slider-btn-css slider-btn-css">
                  {pageContents?.relateditemheading?.length > 0 && pageContents?.relateditemheading?.map((heading: any, hIdx: number) => (
                    <h3 className="pb-6 font-semibold text-black title-page sm:pb-10 dark:text-black" key={`related-${hIdx}`}>{heading?.relateditemheading_title}</h3>
                  ))}
                  <SectionHomeProductCardNew onlyImage={true} products={pageContents?.relateditems} productPerColumn={featureToggle?.features?.enableRichPDPTabs ? 5 : 4} deviceInfo={deviceInfo} featureToggle={featureToggle} />
                </div>
              )} */}
              <RecentlyViewedProduct isHome={true} deviceInfo={deviceInfo} config={config} productPerRow={4} featureToggle={featureToggle} />
              {/* Featured deals section */}
              {pageContents?.featureddeal?.length > 0 && (
                <div className="container flex flex-col !px-0 mx-auto bg-white border-t border-gray-200 sm:pt-10 pt-6 slider-btn-css slider-btn-css">
                  {pageContents?.featureditemheading?.length > 0 && pageContents?.featureditemheading?.map((heading: any, hIdx: number) => (
                    <h3 className="pb-6 font-semibold text-black title-page sm:pb-10 dark:text-black" key={`feature-${hIdx}`}>{heading?.featureditemheading_title}</h3>
                  ))}
                  <SectionHomeProductCardNew onlyImage={false} products={pageContents?.featureddeal} productPerColumn={featureToggle?.features?.enableRichPDPTabs ? 5 : 4} deviceInfo={deviceInfo} featureToggle={featureToggle} />
                </div>
              )}
            </div>
            {/* brand Image collection list start */}
            {pageContents?.brandlist?.length > 0 && (<><ImageCollection data={pageContents?.brandlist} deviceInfo={deviceInfo}/></>)}
            {/* brand Image collection list End */}
            {Array.isArray(productTabs) && productTabs.length > 0 && (
              <div className='container py-6 pb-0 tab-padding-none slider-btn-css'>
                {pageContents?.featureproductsheading?.length > 0 && pageContents?.featureproductsheading?.map((heading: any, hIdx: number) => (
                    <h3 className="pb-3 font-semibold text-black title-page sm:pb-4 dark:text-black" key={`feature-${hIdx}`}>{heading?.featureproductsheading_title}</h3>
                ))}
               <ProductTabs tabs={productTabs} defaultActiveTab="Cameras" />
              </div>
            )}
            {/* Brands section */}
            {pageContents?.brands?.length > 0 && (
                <div className='flex flex-col w-full pt-4 mt-2 sm:mt-4'>
                  <div className='container flex flex-col gap-4 mx-auto'>
                    {pageContents?.brandheading?.map((h: any, iIdx: number) => (
                      <div className='relative flex flex-col justify-between mb-4 nc-Section-Heading sm:flex-row sm:items-end lg:mb-6 text-neutral-900 dark:text-neutral-50' key={`heading-brand-${iIdx}`}>
                        <h2 className='font-semibold text-black title-page'>{h?.brandheading_title}</h2>
                      </div>
                    ))}
                    <div className='grid items-center justify-center grid-cols-4 gap-2 text-left sm:grid-cols-6'>
                      {pageContents?.brands?.map((item: any, itemIdx: number) => (
                        <Link href={item?.brands_link} passHref key={`brands-${itemIdx}`} className='flex flex-col items-start justify-start w-full text-left'>
                          <img
                            src={generateUri(item?.brands_image, 'h=300&fm=webp') || IMG_PLACEHOLDER}
                            alt={item?.brands_name}
                            className='w-full h-auto p-0 sm:p-2'
                            width={300}
                            height={150}
                            loading="lazy"
                          />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
            )}
            {pageContents?.tradeinbanner?.length > 0 && pageContents?.tradeinbanner?.map((trade: any, tradeIdx: number) => (
              <div className='relative sm:min-h-[480px] flex flex-col items-center justify-center w-full gap-2 py-4 overflow-hidden' key={`trade-in-${tradeIdx}`}>
                <img
                  src={generateUri(trade?.tradeinbanner_image, 'h=500&fm=webp') || IMG_PLACEHOLDER}
                  className='absolute top-0 left-0 w-full h-[480px] object-cover z-0'
                  alt="Trade-in banner"
                  sizes="100vw"
                  loading="lazy"
                />
                <div className='absolute top-0 left-0 w-full h-[480px] bg-[#294384] opacity-50 z-1'></div>
                <div className='container relative flex flex-col items-start justify-start w-full gap-10 pl-6 mx-auto bg-transparent z-2 sm:pl-20'>
                  <div className='flex flex-col justify-start w-full gap-1'>
                    <img src="/theme/camera/image/trade-in-icon.svg" className="w-10 !fill-white trade-icon h-auto" alt="Trade In" />
                    <h2 className='mt-4 font-semibold text-white uppercase title-page sm:w-10/12'>{trade?.tradeinbanner_title}</h2>
                  </div>
                  <div className='font-medium heading !leading-relaxed text-white sm:w-8/12' dangerouslySetInnerHTML={{ __html: trade?.tradeinbanner_description }}></div>
                  <Link href={trade?.tradeinbanner_buttonlink} className='px-4 py-2 text-sm font-semibold text-[#294384] bg-white border border-[#294384] rounded' >
                    {trade?.tradeinbanner_buttontext}
                  </Link>
                </div>
              </div>
            ))}
            <div className='container relative flex flex-col mt-0 mb-7 sm:mb-8 lg:mb-12'>
              {pageContents?.tocategoryinspired?.length > 0 &&
                <div className="container flex flex-col !px-0 mx-auto bg-white sm:pt-10 pt-6 slider-btn-css">
                  {pageContents?.beinspiredheading?.length > 0 && pageContents?.beinspiredheading?.map((heading: any, hIdx: number) => (
                    <div className='flex items-center justify-between gap-6 pb-4 sm:justify-start sm:pb-8' key={`be-inspired-${hIdx}`}>
                      <h3 className="font-semibold text-black title-page">{heading?.beinspiredheading_title}</h3>
                      <Link href={heading?.beinspiredheading_buttonlink} className='justify-end w-24 text-xs font-normal text-right text-black underline' passHref>See more</Link>
                    </div>
                  ))}
                  <Swiper slidesPerView={1.3} spaceBetween={4} navigation={true} loop={true} className={deviceInfo?.isMobile ? 'mob-navigation-hide' : ''} breakpoints={{ 640: { slidesPerView: 1.3 }, 768: { slidesPerView: 3 }, 1024: { slidesPerView: 3 } }}>
                    {pageContents?.tocategoryinspired?.map((item: any, pId: number) => (
                      <SwiperSlide key={pId} className="relative inline-flex flex-col h-auto text-left cursor-pointer sm:pr-12 height-auto-slide group lg:w-auto">
                        <div key={pId} className={`product-card-item home-product-card`}>
                          <Link href={sanitizeRelativeUrl(`/${item?.tocategoryinspired_link}`)}>
                            <div className='relative flex flex-col rounded-lg'>
                              <img alt={item?.tocategoryinspired_title} src={generateUri(item?.tocategoryinspired_image, 'h=450&fm=webp') || IMG_PLACEHOLDER} className='object-contain object-top w-full h-auto' />
                            </div>
                          </Link>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              }
              {pageContents?.competitioncard?.length > 0 &&
                <div className="container flex flex-col !px-0 mx-auto bg-white sm:pt-10 pt-6 slider-btn-css slider-btn-css">
                  {pageContents?.competitionheading?.length > 0 && pageContents?.competitionheading?.map((heading: any, hIdx: number) => (
                    <div className='flex items-center justify-between gap-6 pb-4 sm:justify-start sm:pb-8' key={`be-inspired-${hIdx}`}>
                      <h3 className="font-semibold text-black title-page">{heading?.competitionheading_title}</h3>
                      <Link href={heading?.competitionheading_buttonlink} className='justify-end w-24 text-xs font-normal text-right text-black underline' passHref>See more</Link>
                    </div>
                  ))}
                  <Swiper slidesPerView={1.3} spaceBetween={4} navigation={true} loop={true} className={deviceInfo?.isMobile ? 'mob-navigation-hide' : ''} breakpoints={{ 640: { slidesPerView: 1.3 }, 768: { slidesPerView: 3 }, 1024: { slidesPerView: 3 } }}>
                    {pageContents?.competitioncard?.map((item: any, pId: number) => (
                      <SwiperSlide key={pId} className="relative inline-flex flex-col h-auto text-left cursor-pointer sm:pr-12 height-auto-slide group lg:w-auto">
                        <div key={pId} className={`product-card-item home-product-card`}>
                          <Link href={sanitizeRelativeUrl(`/${item?.competitioncard_link}`)}>
                            <div className='relative flex flex-col rounded-lg'>
                              <img
                                alt={item?.competitioncard_title}
                                src={generateUri(item?.competitioncard_image, 'h=450&fm=webp') || IMG_PLACEHOLDER}
                                className='object-contain object-top w-full h-auto'
                                width={450}
                                height={450}
                                loading="lazy"
                              />
                              <span className='flex flex-col w-full py-2 text-black'>
                                {item?.competitioncard_description != "" && <div className='w-full !text-xs pt-2 font-medium text-left text-gray-800 uppercase' dangerouslySetInnerHTML={{ __html: item?.competitioncard_description }} ></div>}
                              </span>
                            </div>
                          </Link>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              }
            </div>
            <div className='flex flex-col justify-center gap-4 pt-6 pb-20 text-center'>
              <h3 className='font-semibold text-black heading'>See personalised recommendation</h3>
              <div className='flex-1 mx-auto btn-primary-clr'>
                <Link href="/my-account/register" passHref legacyBehavior>
                  <a className='px-10 py-2 rounded-full btn-c btn-primary'>Sign in</a>
                </Link>
              </div>
              <p className='text-x-small'>Haven't got an account?
                <Link href="/my-account/login" passHref legacyBehavior><a className='pl-1 primary-text-blue hover:underline'>Start here</a></Link>.</p>
            </div>
          </>
        ) : (
          <>
            {featureToggle?.features?.enableFullBanner ? <Hero banners={pageContents?.banner} featureToggle={featureToggle} deviceInfo={deviceInfo} /> : <SectionHero2 data={pageContents?.banner} />}
            {featureToggle?.features?.enableToolsHome &&
              <div className='container relative flex flex-col pt-10 mt-0 mb-7 sm:mb-8 lg:mb-12'>
                <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
                  {pageContents?.fixingoffers?.length > 0 && pageContents?.fixingoffers?.map((fo: any, fIdx: number) => (
                    <div className={`grid items-center justify-center grid-cols-12 gap-10 p-4 rounded shadow mobile-flex  ${fIdx === 0 || fIdx === 3 || fIdx === 5 || fIdx === 7  ? 'bg-gray-200 text-black' : 'bg-orange-500 bg-green-light bg-light-skyblue text-white'}`} key={`data-${fIdx}`}>
                      <div className='flex flex-col col-span-7 gap-5'>
                        <h2 className='text-3xl font-semibold uppercase textcapitalize'>{fo?.fixingoffers_title}</h2>
                        <p className='text-sm font-normal'>{fo?.fixingoffers_shortdescription}</p>
                        <Link href={fo?.fixingoffers_buttonlink || '#'} legacyBehavior passHref>
                          <a href={fo?.fixingoffers_buttonlink} className='btn btn-primary'>{fo?.fixingoffers_buttontitle}</a>
                        </Link>
                      </div>
                      <div className='col-span-5'>
                        <img
                        src={generateUri(fo?.fixingoffers_image, 'h=500&fm=webp') || IMG_PLACEHOLDER}
                        alt={fo?.fixingoffers_title}
                        className='object-cover object-pos-right w-full h-56'
                        width={500}
                        height={224}
                        loading="lazy"
                      />
                      </div>
                    </div>
                  ))}
                </div>
                {Array.isArray(pageContents?.fixingheading) && pageContents?.fixingheading?.some( (item: any) => item?.fixingheading_title?.trim() || item?.fixingheading_description?.trim()    
                 ) && (
                    <div className="flex flex-col justify-center mb-6 text-center sm:mb-10">
                      {pageContents.fixingheading.map( (heading: any, hIdx: number) => {
                          const hasTitle = heading?.fixingheading_title?.trim();
                          const hasDescription = heading?.fixingheading_description?.trim();
                          if (!hasTitle && !hasDescription) return null;
                          return (
                            <div  key={`heading-${hIdx}`} className="flex flex-col justify-center gap-4 mt-6 sm:mt-10" >
                              {hasTitle && (  <h2 className="text-3xl font-semibold text-black uppercase">  {heading.fixingheading_title} </h2>)}
                              {hasDescription && (
                                <div className="mx-auto text-sm font-normal !leading-relaxed text-gray-600 cms-para sm:w-10/12" dangerouslySetInnerHTML={{   __html: heading.fixingheading_description, }} />
                              )}
                            </div>
                          );
                        }
                      )}
                    </div>
                  )}
                {/* Tabs */}
                {(pageContents?.specialofferproducts?.length > 0 || pageContents?.newproducts?.length > 0) && (
                <div className="flex justify-center gap-6 mb-4 sm:mb-10">
                  <button className={`px-4 py-2 text-md uppercase rounded font-semibold ${activeTab === "specialOffers" ? "bg-orange-500 bg-active-clr border-blue-500 text-white" : "text-gray-600 bg-gray-100" }`}  onClick={handleSpecialOffersClick}> Special Offers </button>
                  <button className={`px-4 py-2 text-md uppercase rounded font-semibold ${activeTab === "newProducts" ? "bg-orange-500 bg-active-clr border-blue-500 text-white" : "text-gray-600 bg-gray-100" }`} onClick={handleNewProductsClick} > New Products </button>
                </div>
               )}
                {/* Tab content */}
                {activeTab === "specialOffers" && pageContents?.specialofferproducts?.length > 0 && (
                  <SectionSliderProductCard
                    deviceInfo={deviceInfo}
                    onlyImage={false}
                    data={pageContents?.specialofferproducts}
                    heading={pageContents?.offerproductheading}
                    featureToggle={featureToggle}
                    defaultDisplayMembership={defaultDisplayMembership}
                  />
                )}
                {activeTab === "newProducts" && pageContents?.newproducts?.length > 0 && (
                  <SectionSliderProductCard
                    deviceInfo={deviceInfo}
                    onlyImage={false}
                    data={pageContents?.newproducts}
                    heading={pageContents?.newproductheading}
                    featureToggle={featureToggle}
                    defaultDisplayMembership={defaultDisplayMembership}
                  />
                )}
                <div className='grid grid-cols-1 gap-6 my-6 sm:grid-cols-1 sm:my-10'>
                  {pageContents?.fixingdelivery?.length > 0 && pageContents?.fixingdelivery?.map((fo: any, fIdx: number) => (
                    <div className={`grid items-center relative justify-center grid-cols-12 gap-10 p-4 rounded mobile-flex shadow ${fIdx == 0 ? 'bg-gray-200 text-white' : 'bg-orange-500 text-white'}`} key={`data-${fIdx}`}>
                      <div className='relative z-10 flex flex-col col-span-7 gap-5 pt-4 sm:pt-6 text-black-clr-sec'>
                        <h2 className='text-3xl font-semibold uppercase'>{fo?.fixingdelivery_title}</h2>
                        <p className='text-sm font-normal'>{fo?.fixingdelivery_shortdescription}</p>
                        <Link href={fo?.fixingdelivery_buttonlink || '#' }  legacyBehavior passHref>
                          <a href={fo?.fixingdelivery_buttonlink} className='text-sm font-semibold text-left text-link-white-clr text-orange-400 underline'>{fo?.fixingdelivery_buttontitle}</a>
                        </Link>
                      </div>
                      <div className='absolute top-0 right-0 left-0 z-0 col-span-12 mob-static'>
                        <img
                          src={generateUri(fo?.fixingdelivery_image, 'h=500&fm=webp') || IMG_PLACEHOLDER}
                          alt={fo?.fixingdelivery_title}
                          className='object-cover object-right w-full h-auto invert-1'
                          width={500}
                          height={300}
                          loading="lazy"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            }
            {featureToggle?.features?.enableCustomHomeWidget &&
              <>
                {pageContents?.brandlist?.length > 0 && <BrandList info={pageContents?.brandheading} data={pageContents?.brandlist} />}
                {pageContents?.category?.length > 0 && <CategoryList data={pageContents?.category} deviceInfo={deviceInfo} />}
                {pageContents?.featureproduct?.length > 0 &&
                  <section className="relative py-6 z-index-neg">
                    <div className="product-border-square"></div>
                    <div className="container">
                      {pageContents?.featureheading?.map((heading: any, cdhId: number) => (
                        <h4 className="block font-semibold uppercase text-brand-red sm:hidden" key={cdhId}>{heading?.featureheading_title}</h4>
                      ))}
                      <DealProduct data={pageContents} deviceInfo={deviceInfo} maxBasketItemsCount={maxBasketItemsCount(config)} dealOfTheWeekProductPromoDetails={pageContents?.featureproduct[0]} config={config} />
                    </div>
                    <div className="dot-div">
                      <img
                        src={`${IMAGE_CDN_URL}/cms-media/dot-image.png?fm=webp&h=220`}
                        alt="dot image"
                        width={245}
                        height={220}
                        loading="lazy"
                      />
                    </div>
                  </section>
                }
                <BestSellerProduct config={pageContents} deviceInfo={deviceInfo} maxBasketItemsCount={maxBasketItemsCount(config)} />
                {pageContents?.imagelist?.length > 0 && <ImageBanner data={pageContents?.imagelist} deviceInfo={deviceInfo} />}
              </>
            }
            {pageContents?.chooselist?.length > 0 && <ChooseList info={pageContents?.whychoose} data={pageContents?.chooselist} />}
            {pageContents?.about?.length > 0 && pageContents?.about?.map((data: any, dataIdx: number) => (
              <div key={dataIdx} className='container relative flex flex-col pt-10 mt-0 mb-7 sm:mb-8 lg:mb-12'>
                <div className='grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-30'>
                  <div className='flex flex-col justify-center gap-6 text-center sm:gap-10'>
                    <h3 className='text-5xl font-semibold text-orange-600'>{data?.about_title}</h3>
                    <div className='text-2xl font-normal text-black cms-para' dangerouslySetInnerHTML={{ __html: data?.about_description }}></div>
                    <div>
                      <Link href={redirectHref || '#' } className='px-10 py-3 text-sm font-semibold text-white bg-orange-600 rounded-full hover:bg-orange-500'>Request for Quote!</Link>
                    </div>
                  </div>
                  <div className='flex flex-col sm:p-20'>
                    <img
                      alt={data?.about_title}
                      src={generateUri(data?.about_image, 'h=500&fm=webp') || IMG_PLACEHOLDER}
                      className='object-cover object-top w-full h-full rounded-xl'
                      width={500}
                      height={500}
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            ))}
            {pageContents?.allcategories?.length > 0 &&
              <div className='container relative flex flex-col pt-10 mt-0 mb-7 sm:mb-8 lg:mb-12'>
                <div className='grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6'>
                  {pageContents?.allcategories?.map((data: any, dataIdx: number) => (
                    <div className='flex flex-col justify-center p-4 text-center rounded-lg shadow-md hover:bg-white hover:shadow-xl bg-slate-50' key={`data-${dataIdx}`}>
                      <div className='h-60'>
                        <img
                          alt={data?.allcategories_name}
                          src={generateUri(data?.allcategories_image, 'h=300&fm=webp') || IMG_PLACEHOLDER}
                          className='object-cover object-top w-full h-60 rounded-xl'
                          width={300}
                          height={240}
                          loading="lazy"
                        />
                      </div>
                      <Link href={data?.allcategories_link || '#' } className='flex items-center justify-center w-full font-semibold text-orange-600 h-14 text-md'>{data?.allcategories_name}</Link>
                    </div>
                  ))}
                </div>
              </div>
            }
            {pageContents?.brandheading?.length > 0 &&
              <div className={`container relative flex flex-col pt-10 mt-0 mb-1 sm:mb-1 ${featureToggle?.features?.enableCustomHomeWidget ? 'hidden' : ''}`}>
                <div className='grid justify-center grid-cols-1 sm:grid-cols-1'>
                  {pageContents?.brandheading?.map((data: any, dataIdx: number) => (
                    <h4 key={dataIdx} className='text-3xl font-semibold text-center text-black'>{data?.brandheading_title}</h4>
                  ))}
                </div>
              </div>
            }
            {pageContents?.allbrands?.length > 0 &&
              <div className='container relative flex flex-col pt-10 mt-0 mb-7 sm:mb-8 lg:mb-12'>
                <div className='grid grid-cols-2 gap-4 sm:grid-cols-6 sm:gap-6'>
                  {pageContents?.allbrands?.map((data: any, dataIdx: number) => (
                    <div className='flex flex-col justify-center p-4 text-center bg-white rounded-lg shadow-md hover:shadow-xl' key={`data-${dataIdx}`}>
                      <div className='h-32'>
                        <img
                          alt={data?.allbrands_name}
                          src={generateUri(data?.allbrands_image, 'h=300&fm=webp') || IMG_PLACEHOLDER}
                          className='object-cover object-center w-full h-32 rounded-xl'
                          width={300}
                          height={128}
                          loading="lazy"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            }
            {pageContents?.promotionbanner != "" && CURRENT_THEME == 'etag' &&
              <div className='flex flex-col pt-10 mt-0'>
                <img
                  alt="Banner"
                  src={generateUri(pageContents?.promotionbanner, 'h=400&fm=webp') || IMG_PLACEHOLDER}
                  className='object-cover object-center w-full h-full'
                  width={1920}
                  height={400}
                  loading="lazy"
                />
              </div>
            }
            {CURRENT_THEME === 'etag' &&
              <div className='flex flex-col w-full mt-10 bg-orange-600 sm:mt-20'>
                <div className='container relative flex items-center justify-between py-4'>
                  <span className='text-sm font-normal text-white sm:text-xl'>Ready to take your order now</span>
                  <Link href="tel:02086915794" className='text-xl font-semibold text-white sm:text-5xl'>020 869 15794</Link>
                </div>
              </div>
            }
            {pageContents?.shopbygender?.length > 0 &&
              <div className='container relative flex flex-col pt-10 mt-0 sm:mt-24 mb-7 sm:mb-8 lg:mb-12'>
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                  {pageContents?.shopbygender?.map((item: any, itemIdx: number) => (
                    <div key={`banner-${itemIdx}`}>
                      <Link href={sanitizeRelativeUrl(`/${item?.link}`)} passHref legacyBehavior>
                        <a className='relative flex flex-col items-center justify-center w-full image-overlay-container rounded-xl'>
                          <img
                            alt={item?.title}
                            src={generateUri(item?.url, 'h=1000&fm=webp') || IMG_PLACEHOLDER}
                            className='object-cover object-top w-full h-full rounded-xl'
                            width={1000}
                            height={600}
                            loading="lazy"
                          />
                          <div className='absolute z-10 flex flex-col justify-center space-y-2 text-center top-1/2'>
                            <span className='font-bold text-white sm:text-5xl'>{item?.title}</span>
                            <span className='font-semibold text-white sm:text-xl'>Shop Now</span>
                          </div>
                        </a>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            }

            {pageContents?.shopbycategory?.length > 0 &&
              <div className={`nc-SectionSliderProductCard product-card-slider container pl-4 sm:pl-0 sm:mt-8 sm:pt-8 pt-4 relative`}>
                <div ref={sliderRef} className={`flow-root ${isShow ? "" : "invisible"}`}>
                  {pageContents?.shopbycategoryheading?.map((h: any, iIdx: number) => (
                    <Heading key={iIdx} className="mb-4 lg:mb-6 text-neutral-900 dark:text-neutral-50" desc="" rightDescText={h?.shopbycategoryheading_subtitle} hasNextPrev >
                      {h?.shopbycategoryheading_title}
                    </Heading>
                  ))}
                  <div className="glide__track" data-glide-el="track">
                    <ul className="glide__slides">
                      {pageContents?.shopbycategory?.map((item: any, index: number) => (
                        <li key={index} className={`glide__slide product-card-item home-product-card`}>
                          <Link href={sanitizeRelativeUrl(`/${item?.link}`)}>
                            <div className='relative flex flex-col rounded-lg'>
                              <img
                                alt={item?.title}
                                src={generateUri(item?.url, 'h=450&fm=webp') || IMG_PLACEHOLDER}
                                className='object-cover object-top w-full rounded-lg h-96'
                                width={450}
                                height={384}
                                loading="lazy"
                              />
                              <span className='absolute flex flex-col w-full px-2 py-4 space-y-2 text-center text-white rounded bg-red-600/80 bottom-2 left-2 image-name-overlay'>
                                <span className='text-lg font-semibold sm:text-xl'>{item?.title}</span>
                                <span className='text-2xl font-semibold sm:text-3xl'>{item?.description}</span>
                                <span>Shop Now</span>
                              </span>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            }
            {featureToggle?.features?.enableCategory && pageContents?.category?.length > 0 &&
              <div className='flex flex-col justify-center gap-4 py-6 text-center bg-white sm:py-10'>
                <div className='container flex flex-col justify-center gap-4 mx-auto text-center'>
                  {pageContents?.categoryheading?.length > 0 && pageContents?.categoryheading?.map((heading: any, hIdx: number) => (
                    <h3 className='mb-4 text-xl font-semibold sm:text-3xl text-sky-700 sm:mb-6' key={`heading-${hIdx}`}>{heading?.categoryheading_title}</h3>
                  ))}
                  <div className='grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-6'>
                    {pageContents?.category?.map((item: any, itemIdx: number) => (
                      <Link href={item?.category_link || '#' } passHref
                        className='flex flex-col gap-5 p-2 bg-white border border-gray-200 rounded shadow sm:p-6 group hover:border-gray-400 zoom-section'
                        key={`category-${itemIdx}`}
                      >
                        <div className='flex flex-col w-full'>
                          <img
                            src={generateUri(item?.category_image, 'h=400&fm=webp') || IMG_PLACEHOLDER}
                            alt={item?.category_title}
                            className='w-full h-full'
                            width={400}
                            height={300}
                            loading="lazy"
                          />
                        </div>
                        <div className='flex flex-col gap-5'>
                          <h3 className='flex items-center justify-center w-full h-10 p-1 text-xs font-medium text-center text-white uppercase bg-red-700 rounded sm:h-auto sm:p-2 sm:text-sm'>
                            {item?.category_title}
                          </h3>
                          <p className='text-xs font-normal text-black sm:text-sm sm:min-h-16 min-h-16'>
                            {item?.category_subtitle}
                          </p>
                        </div>
                        <div className='items-end justify-center flex-1'>
                          <div className='px-6 py-2 text-xs font-medium text-white uppercase rounded sm:py-3 sm:text-sm bg-[#2d4d9c] group-hover:bg-[#223f8b]'>
                            {item?.category_buttontext}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            }
            {pageContents?.bannerimage && pageContents?.bannerimage != "" &&
              <div className='flex flex-col w-full'>
                <img
                  src={pageContents?.bannerimage}
                  className='w-full h-full'
                  alt='Promotion'
                  width={1920}
                  height={400}
                  loading="lazy"
                />
              </div>
            }

            {pageContents?.brandcategory?.length > 0 &&
              <div className='flex flex-col justify-center gap-4 py-6 text-center bg-gray-50 sm:py-10'>
                <div className='container grid grid-cols-2 gap-2 mx-auto sm:grid-cols-4 sm:gap-6'>
                  {pageContents?.brandcategory?.map((item: any, itemIdx: number) => (
                    <Link href={item?.brandcategory_link ||'#' } passHref className='flex flex-col gap-5 p-2 bg-white border border-gray-200 rounded shadow sm:p-6 group hover:border-gray-400 zoom-section' key={`brand-category-${itemIdx}`}>
                      <div className='flex flex-col w-full'>
                        <img
                          src={generateUri(item?.brandcategory_image, 'h=400&fm=webp') || IMG_PLACEHOLDER}
                          alt={item?.brandcategory_title}
                          className='w-full h-full'
                          width={400}
                          height={300}
                          loading="lazy"
                        />
                      </div>
                      <div className='flex flex-col gap-5'>
                        <h3 className='flex items-center justify-center w-full h-10 p-1 text-xs font-medium text-center text-white uppercase bg-red-700 rounded'>{item?.brandcategory_title}</h3>
                        <p className='text-xs font-normal text-black sm:text-sm sm:min-h-16 min-h-16'>{item?.brandcategory_subtitle}</p>
                      </div>
                      <div className='items-end justify-center flex-1'>
                        <div className='px-6 py-2 text-xs font-medium text-white uppercase rounded sm:py-3 sm:text-sm bg-[#2d4d9c] group-hover:bg-[#223f8b]'>
                          {item?.brandcategory_buttontext}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            }
            {pageContents?.promobanner && pageContents?.promobanner != "" &&
              <div className='flex flex-col w-full'>
                <img
                  src={pageContents?.promobanner}
                  className='w-full h-full'
                  alt='Promotion'
                  width={1920}
                  height={400}
                  loading="lazy"
                />
              </div>
            }

            {pageContents?.brands?.length > 0 &&
              <div className='flex flex-col w-full py-6 bg-gray-50 sm:py-10'>
                <div className='container flex flex-col gap-4 mx-auto'>
                  {pageContents?.brandheading?.length > 0 && pageContents?.brandheading?.map((heading: any, hIdx: number) => (
                    <h3 className='mb-4 text-xl font-semibold text-center uppercase sm:text-3xl text-sky-700 sm:mb-6' key={hIdx}>{heading?.brandheading_title}</h3>
                  ))}
                  <div className='grid items-center grid-cols-4 gap-4 text-center'>
                    {pageContents?.brands?.map((item: any, itemIdx: number) => (
                      <Link href={item?.brands_link ||'#' } passHref key={`brands-${itemIdx}`} className='flex flex-col items-center justify-center text-center w-ful'>
                        <img
                          src={generateUri(item?.brands_image, 'h=300&fm=webp') || IMG_PLACEHOLDER}
                          alt={item?.brands_name}
                          className='w-full h-auto p-0 sm:p-10'
                          width={300}
                          height={150}
                          loading="lazy"
                        />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            }
            {featureToggle?.features?.enableTrendingCategory &&
              <div className={`mt-14 sm:mt-24 lg:mt-32 ${featureToggle?.features?.enableCustomHomeWidget ? 'hidden' : ''}`}
              >
                <DiscoverMoreSlider heading={pageContents?.categoryheading} data={pageContents?.category} />
              </div>
            }

            {pageContents?.newarrivals?.length > 0 &&
              <div className='container flex flex-col pt-5 mx-auto bg-white sm:pt-10'>
                <SectionSliderProductCard onlyImage={false} deviceInfo={deviceInfo} data={pageContents?.newarrivals} heading={pageContents?.newarrivalheading} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership} />
              </div>
            }

            {pageContents?.shoprange?.length > 0 && pageContents?.range?.map((heading: any, hIdx: number) => (
              <div className='container flex flex-col pt-5 mx-auto bg-white sm:pt-10' key={`range-heading-${hIdx}`}>
                <h3 className='mb-4 text-xl font-semibold text-center uppercase sm:text-3xl text-sky-700 sm:mb-6'>{heading?.range_title}</h3>
                {pageContents?.newarrivals?.length > 0 || pageContents?.shoprange?.length > 0 &&
                  <SectionSliderProductCard onlyImage={false} deviceInfo={deviceInfo} data={pageContents?.shoprange} heading={pageContents?.newarrivalheading} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership} />
                }
              </div>
            ))}
            {pageContents?.branddescription && pageContents?.branddescription != "" &&
              <div className='container flex flex-col pt-5 mx-auto bg-white sm:pt-10'>
                <div className='flex flex-col w-full'>
                  <div className='pt-4 text-xs font-normal text-gray-500 border-t border-gray-200 sm:pt-6 cms-para' dangerouslySetInnerHTML={{ __html: pageContents?.branddescription }}></div>
                </div>
              </div>
            }
            {(CURRENT_THEME != 'etag' && !featureToggle?.features?.enableCustomHomeWidget) &&
              <div className={`${(CURRENT_THEME != 'green' && CURRENT_THEME != 'robots') ? 'space-y-16 sm:space-y-24 lg:space-y-32 my-16 sm:my-24 lg:my-32' : ' my-0 sm:my-5 lg:my-8'} ${CURRENT_THEME === 'cam' && 'space-y-0 sm:space-y-0 lg:space-y-0 my-0 sm:my-0 lg:my-0'} container relative product-collections`}>
                {pageContents?.brand?.length > 0 &&
                  <div className='flex flex-col w-full p-8 bg-emerald-100 nc-brandCard'>
                    {pageContents?.brand?.slice(0, 1).map((b: any, bIdx: number) => (
                      <div key={`brands-${bIdx}`}>
                        <SectionBrandCard data={b} />
                      </div>
                    ))}
                  </div>
                }
                {pageContents?.departments?.length > 0 &&
                  <div className="relative py-10 sm:py-16 lg:py-20 bg-section-hide">
                    <BackgroundSection />
                    <SectionSliderCategories data={pageContents?.departments} heading={pageContents?.departmentheading} />
                  </div>
                }
                {pageContents?.newlookbook?.length > 0 &&
                  <SectionSliderLargeProduct data={pageContents?.newlookbook} heading={pageContents?.lookbookheading} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership} cardStyle="style2" />
                }
                {pageContents?.brand?.length > 0 &&
                  <div className='flex flex-col w-full p-8 bg-yellow-100 nc-brandCard'>
                    {pageContents?.brand?.slice(1, 2).map((b: any, bIdx: number) => (
                      <SectionBrandCard data={b} key={bIdx} />
                    ))}
                  </div>
                }
                {pageContents?.nevermisssale?.length > 0 &&
                  <SectionSliderProductCard onlyImage={false} deviceInfo={deviceInfo} data={pageContents?.nevermisssale} heading={pageContents?.saleheading} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership} />
                }
                {pageContents?.brand?.length > 0 &&
                  <div className='flex flex-col w-full p-8 bg-gray-50 nc-brandCard'>
                    {pageContents?.brand?.slice(2, 3).map((b: any, bIdx: number) => (
                      <SectionBrandCard data={b} key={bIdx} />
                    ))}
                  </div>
                }
                {pageContents?.popular?.length > 0 &&
                  <SectionSliderProductCard onlyImage={false} deviceInfo={deviceInfo} data={pageContents?.popular} heading={pageContents?.popularheading} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership} />
                }

                {pageContents?.ContentEditor && pageContents?.ContentEditor != "" && <ContentEditorJS value={JSON.parse(pageContents?.ContentEditor)} />}
                <div className='flex flex-col w-full engage-product-card-section'>
                  <EngageProductCard type={EngageEventTypes.TRENDING_FIRST_ORDER} campaignData={campaignData} isSlider={true} productPerRow={4} productLimit={12} />
                  <EngageProductCard type={EngageEventTypes.RECENTLY_VIEWED} campaignData={campaignData} isSlider={true} productPerRow={4} productLimit={12} />
                  <EngageProductCard type={EngageEventTypes.INTEREST_USER_ITEMS} campaignData={campaignData} isSlider={true} productPerRow={4} productLimit={12} />
                  <EngageProductCard type={EngageEventTypes.TRENDING_COLLECTION} campaignData={campaignData} isSlider={true} productPerRow={4} productLimit={12} />
                  <EngageProductCard type={EngageEventTypes.COUPON_COLLECTION} campaignData={campaignData} isSlider={true} productPerRow={4} productLimit={12} />
                  <EngageProductCard type={EngageEventTypes.SEARCH} campaignData={campaignData} isSlider={true} productPerRow={4} productLimit={12} />
                </div>
              </div>
            }
          </>
        )}
      </div>
    </>
  )
}
Home.Layout = Layout
export default withDataLayer(Home, PAGE_TYPE)