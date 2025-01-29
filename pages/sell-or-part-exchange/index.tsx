import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import NextHead from 'next/head'
import axios from 'axios'
import os from 'os'
import type { GetStaticPropsContext } from 'next'
import { EmptyGuid, SITE_ORIGIN_URL } from '@components/utils/constants'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import useAnalytics from '@components/services/analytics/useAnalytics'
import { Cookie, STATIC_PAGE_CACHE_INVALIDATION_IN_MINS, TRADE_IN_PAGE_ID, TRADE_IN_PAGE_SLUG } from '@framework/utils/constants'
import { getCurrency, getCurrentCurrency, isB2BUser, maxBasketItemsCount, obfuscateHostName, sanitizeRelativeUrl, setCurrentCurrency } from '@framework/utils/app-util'
import { getSecondsInMinutes, matchStrings, } from '@framework/utils/parse-util'
import { useTranslation } from '@commerce/utils/use-translation'
import Layout from '@components/Layout/Layout'
import { useUI } from '@components/ui/context'
import { IPagePropsProvider } from '@framework/contracts/page-props/IPagePropsProvider'
import { PagePropType, getPagePropType } from '@framework/page-props'
// @ts-ignore
import Glide from "@glidejs/glide/dist/glide.esm";
import { removeQueryString, serverSideMicrositeCookies } from '@commerce/utils/uri-util'
import { Guid } from '@commerce/types';
import { AnalyticsEventType } from '@components/services/analytics'
import Link from 'next/link'
import Login from '@components/shared/Login'
import TradeInLogin from '@components/shared/Login/TradeInLogin'
import PromotionInput from '@components/SectionCheckoutJourney/cart/PromotionInput'
import { CheckIcon } from '@heroicons/react/24/solid'
import AddItems from '@components/trade-in/AddItems'
import ConfirmDetails from '@components/trade-in/ConfirmDetail'
import GetQuote from '@components/trade-in/GetQuote'
const Loader = dynamic(() => import('@components/ui/LoadingDots'))
declare const window: any
const steps = [
  { "step": "1", "name": "Enter your items" },
  { "step": "2", "name": "Confirm your details" },
  { "step": "3", "name": "Get your quote" },
  { "step": "4", "name": "Shipping Options" },
  { "step": "5", "name": "Postage Details" }
];

const conditions = [
  { "name": "Like New", "desc": "Your equipment is in the condition as if you have just bought it.", "icon": "https://liveocxstorage.blob.core.windows.net/testpc/cms-media/home/cam-icon.svg", "id": "1" },
  { "name": "Excellent", "desc": "The item may have some small cosmetic blemishes that lower its grade.", "icon": "https://liveocxstorage.blob.core.windows.net/testpc/cms-media/home/cam-icon.svg", "id": "2" },
  { "name": "Very Good", "desc": "Your item may have some cosmetic wear to the paintwork.", "icon": "https://liveocxstorage.blob.core.windows.net/testpc/cms-media/home/cam-icon.svg", "id": "3" },
  { "name": "Good", "desc": "Equipment is showing more obvious signs of cosmetic wear.", "icon": "https://liveocxstorage.blob.core.windows.net/testpc/cms-media/home/cam-icon.svg", "id": "4" },
  { "name": "Well Used", "desc": "Your equipment will be showing significant signs of wear.", "icon": "https://liveocxstorage.blob.core.windows.net/testpc/cms-media/home/cam-icon.svg", "id": "5" }
]

const accessories = [
  {
    name: "Boxed?", icon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" className="w-12 h-auto fill-current">
        <path d="M256 48c0-26.5 21.5-48 48-48H592c26.5 0 48 21.5 48 48V464c0 26.5-21.5 48-48 48H381.3c1.8-5 2.7-10.4 2.7-16V253.3c18.6-6.6 32-24.4 32-45.3V176c0-26.5-21.5-48-48-48H256V48zM571.3 347.3c6.2-6.2 6.2-16.4 0-22.6l-64-64c-6.2-6.2-16.4-6.2-22.6 0l-64 64c-6.2 6.2-6.2 16.4 0 22.6s16.4 6.2 22.6 0L480 310.6V432c0 8.8 7.2 16 16 16s16-7.2 16-16V310.6l36.7 36.7c6.2 6.2 16.4 6.2 22.6 0zM0 176c0-8.8 7.2-16 16-16H368c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H16c-8.8 0-16-7.2-16-16V176zm352 80V480c0 17.7-14.3 32-32 32H64c-17.7 0-32-14.3-32-32V256H352zM144 320c-8.8 0-16 7.2-16 16s7.2 16 16 16h96c8.8 0 16-7.2 16-16s-7.2-16-16-16H144z"></path>
      </svg>
    ),
    id: "1"
  },
  {
    name: "Battery?", icon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-12 h-auto fill-current">
        <path d="M80 96c0-17.7 14.3-32 32-32h64c17.7 0 32 14.3 32 32l96 0c0-17.7 14.3-32 32-32h64c17.7 0 32 14.3 32 32h16c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V160c0-35.3 28.7-64 64-64l16 0zm304 96c0-8.8-7.2-16-16-16s-16 7.2-16 16v32H320c-8.8 0-16 7.2-16 16s7.2 16 16 16h32v32c0 8.8 7.2 16 16 16s16-7.2 16-16V256h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H384V192zM80 240c0 8.8 7.2 16 16 16h96c8.8 0 16-7.2 16-16s-7.2-16-16-16H96c-8.8 0-16 7.2-16 16z"></path>
      </svg>
    ),
    id: "2"
  },
  {
    name: "Charger?", icon: () => (
      <svg className="w-12 h-auto fill-current" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 24 24"><path d="M19,0H15a2.5,2.5,0,0,0-2.45,2H11A1.5,1.5,0,0,0,9.59,3H8A.5.5,0,0,0,8,4H9.5V7H8A.5.5,0,0,0,8,8H9.59A1.5,1.5,0,0,0,11,9h1.5v3.5A2.5,2.5,0,0,0,15,15h1.5v5a3,3,0,0,1-6,0V17a3,3,0,0,0-6,0H4a1.5,1.5,0,0,0-1.5,1.5v3A.5.5,0,0,0,3,22h.5v1.5A.5.5,0,0,0,4,24H6a.5.5,0,0,0,.5-.5V22H7a.5.5,0,0,0,.5-.5v-3A1.5,1.5,0,0,0,6,17H5.5a2,2,0,1,1,4,0v3a4,4,0,0,0,8,0V15H19a2.5,2.5,0,0,0,2.5-2.5V2.5A2.5,2.5,0,0,0,19,0ZM12.5,8H11a.5.5,0,0,1-.5-.5v-4A.5.5,0,0,1,11,3h1.5Zm-7,15h-1V22h1ZM6,18a.5.5,0,0,1,.5.5V21h-3V18.5A.5.5,0,0,1,4,18Zm14.5-5.5A1.5,1.5,0,0,1,19,14H15a1.5,1.5,0,0,1-1.5-1.5V2.5A1.5,1.5,0,0,1,15,1h4a1.5,1.5,0,0,1,1.5,1.5ZM17.65,4.15l-2,2a.5.5,0,0,0,.11.79L17,7.62,15.48,9.15a.5.5,0,1,0,.71.71l2-2a.5.5,0,0,0-.11-.79l-1.25-.68,1.53-1.53a.5.5,0,0,0-.71-.71Z"></path></svg>
    ),
    id: "3"
  }
];

export async function getStaticProps({ preview, locale, locales, }: GetStaticPropsContext) {
  const hostName = os.hostname()
  let slug = TRADE_IN_PAGE_SLUG;
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

function SellOrPartExchange({ setEntities, recordEvent, ipAddress, pageContentsWeb, pageContentsMobileWeb, config, hostName, deviceInfo, campaignData, featureToggle, defaultDisplayMembership }: any) {
  const router = useRouter()
  const { user, isGuestUser } = useUI()
  const { isMobile } = deviceInfo
  const currencyCode = getCurrency()
  const translate = useTranslation()
  const homePageContents = isMobile ? pageContentsMobileWeb?.find((x: any) => x?.key === currencyCode)?.value || [] : pageContentsWeb?.find((x: any) => x?.key === currencyCode)?.value || []
  const [pageContents, setPageContents] = useState<any>(homePageContents)
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [selectedAccIndexes, setSelectedAccIndexes] = useState<number[]>([]);
  const [isGuest, setIsGuest] = useState<any>(false);
  const handleAccessoryClick = (index: number) => {
    setSelectedAccIndexes(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const setGuestCheckout = () => {
    setIsGuest(true)
  }

  useEffect(() => {
    const currentCurrency = getCurrentCurrency()
    if (!matchStrings(currencyCode, currentCurrency, true)) {
      axios
        .post('/api/page-preview-content', {
          id: '',
          slug: TRADE_IN_PAGE_SLUG,
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
      window.ch_index_page_view_before({ item_id: "index", bc_user_id: user?.userId || EmptyGuid })
    }
  }, [])

  useAnalytics(AnalyticsEventType.PAGE_VIEWED, { ...pageContents, entityName: PAGE_TYPES.Home, })

  if (!pageContents) {
    return (
      <div className="flex w-full text-center flex-con"> <Loader /> </div>
    )
  }

  const cleanPath = removeQueryString(router.asPath)
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
      <div className="relative overflow-hidden bg-[#f8f8f8] nc-PageHome homepage-main dark:bg-white">
        <div className='container flex flex-col justify-center gap-4 mx-auto text-center'>
          {pageContents?.heroheading?.length > 0 && pageContents?.heroheading?.map((heading: any, hIdx: number) => (
            <div className='flex flex-col justify-center w-full mt-6 text-center sm:mt-8' key={`heading-${hIdx}`}>
              <h1 className='mb-4 text-xl font-semibold uppercase sm:text-3xl text-[#2d4d9c] sm:mb-6'>{heading?.heroheading_title}</h1>
            </div>
          ))}
          {pageContents?.sellguide?.length > 0 &&
            <div className='grid grid-cols-1 gap-6 mb-4 sm:grid-cols-3 sm:mb-8'>
              {
                pageContents?.sellguide?.map((step: any, stepIdx: number) => (
                  <div className='flex flex-col justify-center w-full gap-4 p-4 text-center rounded bg-[#2d4d9c] sm:p-6' key={`sell-${stepIdx}`}>
                    <img src={step?.sellguide_image} className='w-auto h-16' alt={step?.sellguide_title} />
                    <h3 className='text-xl font-semibold text-white uppercase'>{step?.sellguide_title}</h3>
                    <div className='text-xl font-normal text-white' dangerouslySetInnerHTML={{ __html: step?.sellguide_description }}></div>
                  </div>
                ))
              }
            </div>
          }
          {pageContents?.sellingdescription != "" && <div className='w-full mx-auto mb-4 text-xl font-normal text-black sm:w-10/12 sm:mb-8 cms-para-xl' dangerouslySetInnerHTML={{ __html: pageContents?.sellingdescription }}></div>}
          <div className="flex flex-col w-full gap-6 p-6 mx-auto bg-white border border-gray-200">
            {/* Steps Indicator */}

            <div className="flex flex-col w-8/12 mx-auto mt-10 mb-10">
              <div className='step-indicator'>
                {steps.map((step: any, index: number) => (
                  <>
                    <button onClick={() => setCurrentStep(index)} className={`step step${index + 1} ${currentStep >= index ? "active" : ""}`} >
                      <div className='step-icon'>{step.step}</div>
                      <p className='text-sm !font-semibold'>{step.name}</p>
                    </button>
                    {index < steps.length - 1 && (
                      <div id={`StepLine${index + 1}`} className={`indicator-line ${currentStep >= index + 1 ? "active" : ""}`} ></div>
                    )}
                  </>
                ))}
              </div>
            </div>

            {/* Step Content */}
            <div className="flex flex-col justify-start gap-4">
              {steps[currentStep].step === "1" &&
                <AddItems conditions={conditions} accessories={accessories} nextStep={nextStep} steps={steps} selectedIndex={selectedIndex} selectedAccIndexes={selectedAccIndexes} setSelectedIndex={setSelectedIndex} handleAccessoryClick={handleAccessoryClick} currentStep={currentStep} />
              }
              {steps[currentStep].step === "2" &&
                <ConfirmDetails setCurrentStep={setCurrentStep} currentStep={currentStep} steps={steps} nextStep={nextStep} setGuestCheckout={setGuestCheckout} isGuest={isGuest} />
              }
              {steps[currentStep].step === "3" &&
                <GetQuote nextStep={nextStep} currentStep={currentStep} steps={steps} />
              }
            </div>
          </div>
          {pageContents?.guide?.length > 0 &&
            <div className='flex flex-col w-full'>
              {pageContents?.guide?.map((data: any, dataIdx: number) => (
                <div className='flex flex-col w-full' key={`guide-${dataIdx}`}>
                  <iframe src={data?.guide_videolink} frameBorder={0} className='w-full mx-auto h-[580px]'></iframe>
                  <div className='flex flex-col justify-start w-full p-6 mt-6 bg-white border border-gray-200'>
                    <h3 className='text-3xl font-semibold text-[#2d4d9c] uppercase'>{data?.guide_title}</h3>
                    <div className='w-full mx-auto mb-4 text-xl font-normal text-left text-black sm:w-full sm:mb-8 cms-para-xl' dangerouslySetInnerHTML={{ __html: data?.guide_guidedescription }}></div>
                  </div>
                </div>
              ))}
            </div>
          }
        </div>

        {pageContents?.service?.length > 0 &&
          <div className='flex flex-col w-full mt-6 bg-white sm:mt-8'>
            {pageContents?.service?.map((data: any, dataIdx: number) => (
              <div className='container flex items-center w-full gap-10 mx-auto justify-normal' key={`service-${dataIdx}`}>
                <div><img src={data?.service_image} className='w-48 h-auto' alt={data?.service_title} /></div>
                <div className='flex flex-col justify-start w-full p-6 mt-6'>
                  <h3 className='text-2xl font-semibold text-[#2d4d9c] uppercase'>{data?.service_title}</h3>
                  <div className='w-full mx-auto mb-4 text-xl font-normal text-left text-black sm:w-full sm:mb-8 cms-para-xl' dangerouslySetInnerHTML={{ __html: data?.service_description }}></div>
                  <div className='flex flex-1'>
                    <Link href={data?.service_buttonlink} passHref legacyBehavior>
                      <a className='flex items-center justify-center h-10 px-6 text-xs font-medium text-center text-white uppercase bg-[#2d4d9c] hover:bg-sky-900 rounded'>{data?.service_buttontext}</a>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        }
      </div>
    </>
  )
}
SellOrPartExchange.Layout = Layout
export default withDataLayer(SellOrPartExchange, PAGE_TYPE)