import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import NextHead from 'next/head'
import axios from 'axios'
import os from 'os'
import type { GetStaticPropsContext } from 'next'
import { CURRENT_THEME, EmptyString, EngageEventTypes, SITE_ORIGIN_URL } from '@components/utils/constants'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import { EVENTS_MAP } from '@components/services/analytics/constants'
import useAnalytics from '@components/services/analytics/useAnalytics'
import { HOME_PAGE_NEW_SLUG, HOME_PAGE_SLUG, STATIC_PAGE_CACHE_INVALIDATION_IN_MINS } from '@framework/utils/constants'
import { getCurrency, getCurrentCurrency, obfuscateHostName, sanitizeRelativeUrl, setCurrentCurrency } from '@framework/utils/app-util'
import { getSecondsInMinutes, matchStrings, } from '@framework/utils/parse-util'
import { useTranslation } from '@commerce/utils/use-translation'
import Layout from '@components/Layout/Layout'
import { useUI } from '@components/ui/context'
import EngageProductCard from '@components/SectionEngagePanels/ProductCard'
import SectionBrandCard from '@components/SectionBrandCard'
import { IPagePropsProvider } from '@framework/contracts/page-props/IPagePropsProvider'
import { PagePropType, getPagePropType } from '@framework/page-props'
import Heading from '@components/Heading/Heading'
// @ts-ignore
import Glide from "@glidejs/glide/dist/glide.esm";
import Link from 'next/link'
import { IMG_PLACEHOLDER } from '@components/utils/textVariables'
import { generateUri } from '@commerce/utils/uri-util'
const SectionHero2 = dynamic(() => import('@components/SectionHero/SectionHero2'))
const DiscoverMoreSlider = dynamic(() => import('@components/DiscoverMoreSlider'))
const SectionSliderProductCard = dynamic(() => import('@components/SectionSliderProductCard'))
const BackgroundSection = dynamic(() => import('@components/BackgroundSection/BackgroundSection'))
const SectionSliderLargeProduct = dynamic(() => import('@components/SectionSliderLargeProduct'))
const SectionSliderCategories = dynamic(() => import('@components/SectionSliderCategories/SectionSliderCategories'))
const SectionPromo3 = dynamic(() => import('@components/SectionPromo3'))
const Loader = dynamic(() => import('@components/ui/LoadingDots'))

declare const window: any

export async function getStaticProps({ preview, locale, locales, }: GetStaticPropsContext) {
  const hostName = os.hostname()
  let slug = HOME_PAGE_SLUG;
  if (CURRENT_THEME == "black") {
    slug = HOME_PAGE_NEW_SLUG
  } else if (CURRENT_THEME == "orange") {
    slug = HOME_PAGE_SLUG
  } else {
    slug = HOME_PAGE_SLUG;
  }
  const props: IPagePropsProvider = getPagePropType({ type: PagePropType.HOME })
  const pageProps = await props.getPageProps({ slug, cookies: {} })

  return {
    props: {
      ...pageProps,
      hostName: obfuscateHostName(hostName),
    },
    revalidate: getSecondsInMinutes(STATIC_PAGE_CACHE_INVALIDATION_IN_MINS)
  }
}

const PAGE_TYPE = PAGE_TYPES.Home

function Home({ setEntities, recordEvent, ipAddress, pageContentsWeb, pageContentsMobileWeb, hostName, deviceInfo, campaignData, featureToggle, defaultDisplayMembership }: any) {
  const router = useRouter()
  const { user } = useUI()
  const { PageViewed } = EVENTS_MAP.EVENT_TYPES
  const { isMobile } = deviceInfo
  const currencyCode = getCurrency()
  const translate = useTranslation()
  const homePageContents = isMobile ? pageContentsMobileWeb?.find((x: any) => x?.key === currencyCode)?.value || [] : pageContentsWeb?.find((x: any) => x?.key === currencyCode)?.value || []
  const [pageContents, setPageContents] = useState<any>(homePageContents)
  let Page_Slug = HOME_PAGE_SLUG;
  if (CURRENT_THEME == "black") {
    Page_Slug = HOME_PAGE_NEW_SLUG
  } else if (CURRENT_THEME == "orange") {
    Page_Slug = HOME_PAGE_SLUG
  } else {
    Page_Slug = HOME_PAGE_SLUG;
  }
  useEffect(() => {
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
  }, [currencyCode, isMobile])

  useEffect(() => {
    if (typeof window !== "undefined" && window?.ch_session) {
      window.ch_index_page_view_before({ item_id: "index", bc_user_id: user?.userId || EmptyString })
    }
  }, [])

  useAnalytics(PageViewed, {
    entity: JSON.stringify({
      id: '',
      name: pageContents?.metatitle,
      metaTitle: pageContents?.metaTitle,
      MetaKeywords: pageContents?.metaKeywords,
      MetaDescription: pageContents?.metaDescription,
      Slug: pageContents?.slug,
      Title: pageContents?.metatitle,
      ViewType: 'Page View',
    }),
    entityName: PAGE_TYPE,
    pageTitle: pageContents?.metaTitle,
    entityType: 'Page',
    entityId: '',
    eventType: 'PageViewed',
  })

  if (!pageContents) {
    return (
      <div className="flex w-full text-center flex-con"> <Loader /> </div>
    )
  }
  const sliderRef = useRef(null);
  const [isShow, setIsShow] = useState(false);
  useEffect(() => {
    const OPTIONS: Partial<Glide.Options> = {
      perView: 6, gap: 16, bound: true,
      breakpoints: {
        1280: { gap: 16, perView: 6, },
        1279: { gap: 16, perView: 6, },
        1023: { gap: 16, perView: 5, },
        768: { gap: 16, perView: 4, },
        500: { gap: 16, perView: 1.5, },
      },
    };
    if (!sliderRef.current) return;

    let slider = new Glide(sliderRef.current, OPTIONS);
    slider.mount();
    setIsShow(true);
    return () => {
      slider.destroy();
    };
  }, [sliderRef]);
  return (
    <>
      {(pageContents?.metatitle || pageContents?.metadescription || pageContents?.metakeywords) && (
        <NextHead>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
          <link rel="canonical" id="canonical" href={pageContents?.canonical || SITE_ORIGIN_URL + router.asPath} />
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
        <SectionHero2 data={pageContents?.banner} />
        {pageContents?.shopbygender?.length > 0 &&
          <div className='container relative flex flex-col pt-10 mt-0 sm:mt-24 mb-7 sm:mb-8 lg:mb-12'>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              {pageContents?.shopbygender?.map((item: any, itemIdx: number) => (
                <div key={`banner-${itemIdx}`}>
                  <Link href={sanitizeRelativeUrl(`/${item?.link}`)} passHref legacyBehavior>
                    <a className='relative flex flex-col items-center justify-center w-full image-overlay-container rounded-xl'>
                      <img alt={item?.title} src={generateUri(item?.url, 'h=1000&fm=webp') || IMG_PLACEHOLDER} className='object-cover object-top w-full h-full rounded-xl' />
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
                          <img alt={item?.title} src={generateUri(item?.url, 'h=450&fm=webp') || IMG_PLACEHOLDER} className='object-cover object-top w-full rounded-lg h-96' />
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
        {featureToggle?.features?.enableTrendingCategory &&
          <div className="mt-14 sm:mt-24 lg:mt-32">
            <DiscoverMoreSlider heading={pageContents?.categoryheading} data={pageContents?.category} />
          </div>
        }
        <div className={`${CURRENT_THEME != 'green' ? 'space-y-16 sm:space-y-24 lg:space-y-32' : ''} container relative my-16 sm:my-24 lg:my-32 product-collections`}>
          {pageContents?.brand?.length > 0 &&
            <div className='flex flex-col w-full p-8 bg-emerald-100 nc-brandCard'>
              {pageContents?.brand?.slice(0, 1).map((b: any, bIdx: number) => (
                <div key={`brands-${bIdx}`}>
                  <SectionBrandCard data={b} />
                </div>
              ))}
            </div>
          }
          {pageContents?.newarrivals?.length > 0 &&
            <SectionSliderProductCard data={pageContents?.newarrivals} heading={pageContents?.newarrivalheading} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership} />
          }
          <div className="relative py-10 sm:py-16 lg:py-20 bg-section-hide">
            <BackgroundSection />
            <SectionSliderCategories data={pageContents?.departments} heading={pageContents?.departmentheading} />
          </div>
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
            <SectionSliderProductCard data={pageContents?.nevermisssale} heading={pageContents?.saleheading} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership} />
          }
          {pageContents?.brand?.length > 0 &&
            <div className='flex flex-col w-full p-8 bg-gray-50 nc-brandCard'>
              {pageContents?.brand?.slice(2, 3).map((b: any, bIdx: number) => (
                <SectionBrandCard data={b} key={bIdx} />
              ))}
            </div>
          }
          {pageContents?.popular?.length > 0 &&
            <SectionSliderProductCard data={pageContents?.popular} heading={pageContents?.popularheading} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership} />
          }
          <div className='flex flex-col w-full engage-product-card-section'>
            <EngageProductCard type={EngageEventTypes.TRENDING_FIRST_ORDER} campaignData={campaignData} isSlider={true} productPerRow={4} productLimit={12} />
            <EngageProductCard type={EngageEventTypes.RECENTLY_VIEWED} campaignData={campaignData} isSlider={true} productPerRow={4} productLimit={12} />
            <EngageProductCard type={EngageEventTypes.INTEREST_USER_ITEMS} campaignData={campaignData} isSlider={true} productPerRow={4} productLimit={12} />
            <EngageProductCard type={EngageEventTypes.TRENDING_COLLECTION} campaignData={campaignData} isSlider={true} productPerRow={4} productLimit={12} />
            <EngageProductCard type={EngageEventTypes.COUPON_COLLECTION} campaignData={campaignData} isSlider={true} productPerRow={4} productLimit={12} />
            <EngageProductCard type={EngageEventTypes.SEARCH} campaignData={campaignData} isSlider={true} productPerRow={4} productLimit={12} />
          </div>
          <SectionPromo3 data={pageContents?.subscription} />
        </div>
      </div>
    </>
  )
}
Home.Layout = Layout
export default withDataLayer(Home, PAGE_TYPE)