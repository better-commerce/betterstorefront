import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import NextHead from 'next/head'
import axios from 'axios'
import os from 'os'
import type { GetStaticPropsContext } from 'next'
import { EmptyGuid, NEXT_TRADE_IN_GET_QUOTE_BY_ID, NEXT_TRADE_IN_PRODUCTS, NEXT_TRADE_IN_USER_TOKEN, SITE_ORIGIN_URL, TradeInSteps } from '@components/utils/constants'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import useAnalytics from '@components/services/analytics/useAnalytics'
import { STATIC_PAGE_CACHE_INVALIDATION_IN_MINS, TRADE_IN_PAGE_SLUG } from '@framework/utils/constants'
import { getCurrency, getCurrentCurrency, logError, obfuscateHostName, setCurrentCurrency } from '@framework/utils/app-util'
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
const QuoteDetails = dynamic(() => import('@components/trade-in/QuoteDetails'))
const SellingGuide = dynamic(() => import('@components/trade-in/SellingGuide'))
const JourneyVideo = dynamic(() => import('@components/trade-in/JourneyVideo'))
const Service = dynamic(() => import('@components/trade-in/Service'))
const Steps = dynamic(() => import('@components/trade-in/Steps'))
const Loader = dynamic(() => import('@components/ui/LoadingDots'))
import data from '@components/trade-in/data.json'
import { useDebounce } from 'hooks/useDebounce'
import { updateQueryParams } from 'framework/utils/app-util'
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
const PAGE_TYPE = PAGE_TYPES.Home

function SellOrPartExchange({ pageContentsWeb, pageContentsMobileWeb, hostName, deviceInfo }: any) {
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
  const [searchText, setSearchText] = useState({})
  const [quoteData, setQuoteData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [shippingData, setShippingData] = useState<any>([])
  const fetchData = useCallback(
    useDebounce(async (searchText: any) => {
      try {
        const { data }: any = await axios.post(NEXT_TRADE_IN_PRODUCTS, { searchText })
        setProducts(data)
      } catch (error) {
        logError(error)
      }
    }, 1000),
    []
  )

  const onChangeSearch = (e: any, id: number) => {
    setSearchText((v: any) => ({
      ...v,
      [id]: e.target.value,
    }))
    if (!e.target.value || e.target.value?.length === 0 || e.target.value?.length >= 2) {
      fetchData(e.target.value)
    }
  }
  const handleNextStep = (data?: any) => {
    if (data) {
      setQuoteData(data);
    }
    setCurrentStep((prev) => prev + 1);
  };
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

  const startNewTrade = () => {
    setQuoteData(null);
    setSelectedItems([]);
    setSearchText({});
    setProducts([]);
    setCurrentStep(0);
    updateQueryParams(router, {}, ['quoteId'])
  };

  const fetchQuoteDetails = async (quoteId: string) => {
    setIsLoading(true)
    try {
      const { data: quoteDetails } = await axios.post(NEXT_TRADE_IN_GET_QUOTE_BY_ID, { data: { id: quoteId } })
      if (!quoteDetails?.isSuccess) return setCurrentStep(0)

      setQuoteData(quoteDetails)

      if (quoteDetails?.value?.shippingMethod) {
        setCurrentStep(4)
      } else if (['QuoteAccepted', 'Quoted'].includes(quoteDetails?.value?.status)) {
        setCurrentStep(2)
      } else {
        setCurrentStep(0)
      }
      setIsLoading(false)
    } catch (error) {
      console.error("Error fetching quote:", error);
      setIsLoading(false)
    }
  };

  // useEffect(() => {
  //   if (router.query?.quoteId && !quoteData) {
  //     fetchQuoteDetails(router.query?.quoteId as string)
  //   }
  // }, [router])

  const cleanPath = removeQueryString(router.asPath)
  return (
    <>
      {isLoading && <Loader />}
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
          <div id='step-component' className="flex flex-col w-full gap-6 p-6 mx-auto bg-white border border-gray-200">
            <Steps data={data?.steps} setCurrentStep={setCurrentStep} currentStep={currentStep} />

            {/* Step Content */}
            <div className="flex flex-col justify-start gap-4">
              {data?.steps[currentStep]?.step === TradeInSteps.ENTER_ITEM &&
                <AddItems
                  searchText={searchText}
                  onChangeSearch={onChangeSearch}
                  selectedItems={selectedItems}
                  products={products}
                  setSelectedItems={setSelectedItems}
                  images={data?.images}
                  nextStep={nextStep}
                  steps={data?.steps}
                  selectedIndex={selectedIndex}
                  selectedAccIndexes={selectedAccIndexes}
                  setSelectedIndex={setSelectedIndex}
                  handleAccessoryClick={handleAccessoryClick}
                  currentStep={currentStep} />
              }
              {data?.steps[currentStep]?.step === TradeInSteps.CONFIRM_DETAIL &&
                <ConfirmDetails setCurrentStep={setCurrentStep} selectedItems={selectedItems} steps={data?.steps} nextSteps={handleNextStep} currentStep={currentStep} />
              }
              {data?.steps[currentStep]?.step === TradeInSteps.GET_QUOTE &&
                <GetQuote setCurrentStep={setCurrentStep} user={user} startNewTrade={startNewTrade} currentStep={currentStep} nextSteps={handleNextStep} steps={data?.steps} quoteData={quoteData} setShippingData={setShippingData} />
              }
              {data?.steps[currentStep]?.step === TradeInSteps.SHIPPING_DETAILS &&
                <ShippingDetail
                  shipping={data?.shipping}
                  isStore={isStore}
                  setSelectedStore={setSelectedStore}
                  showStores={showStores}
                  showDpdStore={showDpdStore}
                  dpd={data?.dpd}
                  shippingData={shippingData}
                  stores={data?.stores} nextSteps={handleNextStep}
                  setCurrentStep={setCurrentStep} quoteData={quoteData} />
              }
              {data?.steps[currentStep]?.step === TradeInSteps.FINAL_DETAILS &&
                <QuoteDetails data={data?.stores} quoteData={quoteData} startNewTrade={startNewTrade} />
              }
            </div>
          </div>
          {/* {pageContents?.guide?.length > 0 &&
            <JourneyVideo data={pageContents?.guide} />
          } */}
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