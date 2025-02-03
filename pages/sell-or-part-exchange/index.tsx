import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import NextHead from 'next/head'
import axios from 'axios'
import os from 'os'
import type { GetStaticPropsContext } from 'next'
import { EmptyGuid, SITE_ORIGIN_URL } from '@components/utils/constants'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import useAnalytics from '@components/services/analytics/useAnalytics'
import { STATIC_PAGE_CACHE_INVALIDATION_IN_MINS, TRADE_IN_PAGE_SLUG } from '@framework/utils/constants'
import { getCurrency, getCurrentCurrency, obfuscateHostName, setCurrentCurrency } from '@framework/utils/app-util'
import { getSecondsInMinutes, matchStrings, } from '@framework/utils/parse-util'
import { useTranslation } from '@commerce/utils/use-translation'
import Layout from '@components/Layout/Layout'
import { useUI } from '@components/ui/context'
import { IPagePropsProvider } from '@framework/contracts/page-props/IPagePropsProvider'
import { PagePropType, getPagePropType } from '@framework/page-props'
// @ts-ignore
import { removeQueryString, serverSideMicrositeCookies } from '@commerce/utils/uri-util'
import { AnalyticsEventType } from '@components/services/analytics'
const AddItems = dynamic(() => import('@components/trade-in/AddItems'))
const ConfirmDetails = dynamic(() => import('@components/trade-in/ConfirmDetail'))
const GetQuote = dynamic(() => import('@components/trade-in/GetQuote'))
const ShippingDetail = dynamic(() => import('@components/trade-in/ShippingDetail'))
const PostgreDetail = dynamic(() => import('@components/trade-in/PostgreDetail'))
const SellingGuide = dynamic(() => import('@components/trade-in/SellingGuide'))
const JourneyVideo = dynamic(() => import('@components/trade-in/JourneyVideo'))
const Service = dynamic(() => import('@components/trade-in/Service'))
const Steps = dynamic(() => import('@components/trade-in/Steps'))
const Loader = dynamic(() => import('@components/ui/LoadingDots'))
import data from '@components/trade-in/data.json'
declare const window: any

export async function getStaticProps({ preview, locale, locales, }: GetStaticPropsContext) {
  const hostName = os.hostname()
  let slug = TRADE_IN_PAGE_SLUG;
  const props: IPagePropsProvider = getPagePropType({ type: PagePropType.TRADE_IN })
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
  }]
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
  const [isStore, setStore] = useState<any>("0");
  const [isGuest, setIsGuest] = useState<any>(false);
  const [showDpdStore, setShowDpdStore] = useState<any>(false);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    fetch('https://api.mockaroo.com/api/da82c2e0?count=0&key=2d403e40')
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);



  const handleAccessoryClick = (index: number) => {
    setSelectedAccIndexes(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };
  const nextStep = () => {
    if (currentStep < data?.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const setSelectedStore = (id: any) => {
    setStore(id)
  }

  const showStores = () => {
    setShowDpdStore(true)
  }
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
            <SellingGuide data={pageContents?.sellguide} />
          }
          {pageContents?.sellingdescription != "" && <div className='w-full mx-auto mb-4 text-xl font-normal text-black sm:w-10/12 sm:mb-8 cms-para-xl' dangerouslySetInnerHTML={{ __html: pageContents?.sellingdescription }}></div>}
          <div className="flex flex-col w-full gap-6 p-6 mx-auto bg-white border border-gray-200">
            <Steps data={data?.steps} setCurrentStep={setCurrentStep} currentStep={currentStep} />

            {/* Step Content */}
            <div className="flex flex-col justify-start gap-4">
              {data?.steps[currentStep].step === "1" &&
                <AddItems
                  selectedItems={selectedItems}
                  products={products}
                  setSelectedItems={setSelectedItems}
                  conditions={data?.conditions}
                  images={data?.images}
                  accessories={accessories}
                  nextStep={nextStep}
                  steps={data?.steps}
                  selectedIndex={selectedIndex}
                  selectedAccIndexes={selectedAccIndexes}
                  setSelectedIndex={setSelectedIndex}
                  handleAccessoryClick={handleAccessoryClick}
                  currentStep={currentStep} />
              }
              {data?.steps[currentStep].step === "2" &&
                <ConfirmDetails
                  selectedItems={selectedItems}
                  setCurrentStep={setCurrentStep}
                  steps={data?.steps}
                  nextStep={nextStep}
                  setGuestCheckout={setGuestCheckout}
                  currentStep={currentStep}
                  isGuest={isGuest} />
              }
              {data?.steps[currentStep].step === "3" &&
                <GetQuote
                  selectedItems={selectedItems}
                  setCurrentStep={setCurrentStep}
                  nextStep={nextStep}
                  currentStep={currentStep}
                  steps={data?.steps}
                />
              }
              {data?.steps[currentStep].step === "4" &&
                <ShippingDetail
                  shipping={data?.shipping}
                  isStore={isStore}
                  setSelectedStore={setSelectedStore}
                  showStores={showStores}
                  showDpdStore={showDpdStore}
                  dpd={data?.dpd}
                  stores={data?.stores}
                  nextStep={nextStep} />
              }
              {data?.steps[currentStep].step === "5" &&
                <PostgreDetail data={data?.stores} />
              }
            </div>
          </div>
          {pageContents?.guide?.length > 0 &&
            <JourneyVideo data={pageContents?.guide} />
          }
        </div>

        {pageContents?.service?.length > 0 &&
          <Service services={pageContents?.service} />
        }
      </div>
    </>
  )
}
SellOrPartExchange.Layout = Layout
export default withDataLayer(SellOrPartExchange, PAGE_TYPE)