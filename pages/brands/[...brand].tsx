import dynamic from 'next/dynamic'
import NextHead from 'next/head'
import Link from 'next/link'
import useSwr from 'swr'
import SwiperCore, { Navigation } from 'swiper'
import Glide from '@glidejs/glide'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import Prev from '@components/shared/NextPrevIcon/Prev'
import Next from '@components/shared/NextPrevIcon/Next'
import { useReducer, useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import { SCROLLABLE_LOCATIONS } from 'pages/_app'
import { GetStaticPathsContext, GetStaticPropsContext } from 'next'
import { parsePLPFilters, routeToPLPWithSelectedFilters, sanitizeHtmlContent, setPLPFilterSelection } from 'framework/utils/app-util'
import { maxBasketItemsCount, notFoundRedirect, setPageScroll } from '@framework/utils/app-util'
import { useTranslation } from '@commerce/utils/use-translation'
import getAllBrandsStaticPath from '@framework/brand/get-all-brands-static-path'
import { EVENTS_MAP } from '@components/services/analytics/constants'
import { postData } from '@components/utils/clientFetcher'
import { CURRENT_THEME, EmptyObject, EngageEventTypes, SITE_NAME, SITE_ORIGIN_URL } from '@components/utils/constants'
import { IMG_PLACEHOLDER } from '@components/utils/textVariables'
import { EVENTS, KEYS_MAP } from '@components/utils/dataLayer'
import { useUI } from '@components/ui'
import { ImageBanner, ImageCollection, PlainText, Video } from '@components/SectionBrands'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import BrandBanner from '@components/brand/BrandBanner'
const HeadingWithButton = dynamic(() => import('@components/Heading/HeadingWithButton'))
const OutOfStockFilter = dynamic(() => import('@components/Product/Filters/OutOfStockFilter'))
const CompareSelectionBar = dynamic(() => import('@components/Product/ProductCompare/compareSelectionBar'))
const ProductCard = dynamic(() => import('@components/ProductCard'))
const ProductSort = dynamic(() => import('@components/Product/ProductSort'))
const ProductMobileFilters = dynamic(() => import('@components/Product/Filters'))
const ProductFilterRight = dynamic(() => import('@components/Product/Filters/filtersRight'))
const ProductFiltersTopBar = dynamic(() => import('@components/Product/Filters/FilterTopBar'))
const ProductGridWithFacet = dynamic(() => import('@components/Product/Grid'))
const ProductGrid = dynamic(() => import('@components/Product/Grid/ProductGrid'))
import useFaqData from '@components/SectionBrands/faqData'
import useAnalytics from '@components/services/analytics/useAnalytics'
import Slider from '@components/SectionBrands/Slider'
import BrandDisclosure from '@components/SectionBrands/Disclosure'
import RecentlyViewedProduct from '@components/Product/RelatedProducts/RecentlyViewedProducts'
import EngageProductCard from '@components/SectionEngagePanels/ProductCard'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import { IPagePropsProvider } from '@framework/contracts/page-props/IPagePropsProvider'
import { getPagePropType, PagePropType } from '@framework/page-props'
import Loader from '@components/Loader'
import { generateUri, removeQueryString, serverSideMicrositeCookies } from '@commerce/utils/uri-util'
import { Cookie, STATIC_PAGE_CACHE_INVALIDATION_IN_MINS } from '@framework/utils/constants'
import { AnalyticsEventType } from '@components/services/analytics'
import MultiBrandVideo from '@components/SectionBrands/MultiBrandVideo'
import FilterHorizontal from '@components/Product/Filters/filterHorizontal'
import { getSecondsInMinutes } from '@framework/utils/parse-util'

export const ACTION_TYPES = { SORT_BY: 'SORT_BY', PAGE: 'PAGE', SORT_ORDER: 'SORT_ORDER', CLEAR: 'CLEAR', HANDLE_FILTERS_UI: 'HANDLE_FILTERS_UI', SET_FILTERS: 'SET_FILTERS', ADD_FILTERS: 'ADD_FILTERS', REMOVE_FILTERS: 'REMOVE_FILTERS', RESET_STATE: 'RESET_STATE' }

interface actionInterface {
  type?: string
  payload?: object | any
}

interface stateInterface {
  sortBy?: string
  currentPage?: string | number
  sortOrder?: string
  filters: any
}

const IS_INFINITE_SCROLL = process.env.NEXT_PUBLIC_ENABLE_INFINITE_SCROLL === 'true'
const { SORT_BY, PAGE, SORT_ORDER, CLEAR, HANDLE_FILTERS_UI, SET_FILTERS, ADD_FILTERS, REMOVE_FILTERS, RESET_STATE } = ACTION_TYPES
const DEFAULT_STATE = { sortBy: '', sortOrder: 'asc', currentPage: 1, filters: [], }

function reducer(state: stateInterface, { type, payload }: actionInterface) {
  switch (type) {
    case SORT_BY:
      return { ...state, sortBy: payload, currentPage: 1 }
    case PAGE:
      return { ...state, currentPage: payload }
    case SORT_ORDER:
      return { ...state, sortOrder: payload }
    case CLEAR:
      return { ...state, currentPage: 1, filters: [] }
    case HANDLE_FILTERS_UI:
      return { ...state, areFiltersOpen: payload }
    case SET_FILTERS:
      return { ...state, filters: payload }
    case ADD_FILTERS:
      return { ...state, filters: [...state.filters, payload] }
    case RESET_STATE:
      return DEFAULT_STATE
    case REMOVE_FILTERS:
      return {
        ...state,
        filters: state.filters.filter(
          (item: any) => item.Value !== payload.Value
        ),
      }
    default:
      return { ...state }
  }
}

function BrandDetailPage({ query, setEntities, recordEvent, brandDetails, slug, deviceInfo, config, collections, featureToggle, campaignData, defaultDisplayMembership }: any) {
  const { recordAnalytics } = useAnalytics()
  const translate = useTranslation()
  const router = useRouter()
  const qsFilters = router.asPath
  const filters: any = parsePLPFilters(qsFilters as string)
  const [previousSlug, setPreviousSlug] = useState(router?.asPath?.split('?')[0]);
  const faq = useFaqData();
  const adaptedQuery = { ...query }
  const { isMobile, isOnlyMobile } = deviceInfo
  let imageBannerCollectionResponse: any = collections.imageBannerCollectionResponse
  let imageCategoryCollectionResponse: any = collections.imageCategoryCollection
  let imgFeatureCollection: any = collections.imgFeatureCollection
  let offerBannerResult: any = collections.offerBannerResult
  let productCollectionRes: any = collections.productCollection
  let saleProductCollectionRes: any = collections.saleProductCollection

  let resPcHero: any = collections.resPcHero
  let resPc1: any = collections.resPc1
  let resPc2: any = collections.resPc2
  let resPc3: any = collections.resPc3

  const [isShow, setIsShow] = useState(false);
  const sliderRef = useRef(null);
  const sliderRef3 = useRef(null);
  const sliderRefNew = useRef(null);
  useEffect(() => {
    const OPTIONS: Partial<Glide.Options> = {
      perView: 4, gap: 32, bound: true, breakpoints: { 1280: { perView: 4 - 1, }, 1024: { gap: 20, perView: 4 - 1, }, 768: { gap: 20, perView: 4 - 2, }, 640: { gap: 20, perView: 1.5, }, 500: { gap: 20, perView: 1.3, }, },
    };
    if (!sliderRef.current) return;
    let slider = new Glide(sliderRef.current, OPTIONS);
    slider.mount();
    setIsShow(true);
    return () => {
      slider.destroy();
    };
  }, [sliderRef]);

  useEffect(() => {
    const OPTIONS: Partial<Glide.Options> = {
      perView: 4, gap: 32, bound: true, breakpoints: { 1280: { perView: 4 - 1, }, 1024: { gap: 20, perView: 4 - 1, }, 768: { gap: 20, perView: 4 - 2, }, 640: { gap: 20, perView: 1.5, }, 500: { gap: 20, perView: 1.3, }, },
    };
    if (!sliderRefNew.current) return;
    let slider = new Glide(sliderRefNew.current, OPTIONS);
    slider.mount();
    setIsShow(true);
    return () => {
      slider.destroy();
    };
  }, [sliderRefNew]);

  useEffect(() => {
    const OPTIONS: Partial<Glide.Options> = {
      perView: 4, gap: 32, bound: true, breakpoints: { 1280: { perView: 4 - 1, }, 1024: { gap: 20, perView: 4 - 1, }, 768: { gap: 20, perView: 4 - 2, }, 640: { gap: 20, perView: 1.5, }, 500: { gap: 20, perView: 1.3, }, },
    };
    if (!sliderRef3.current) return;
    let slider = new Glide(sliderRef3.current, OPTIONS);
    slider.mount();
    setIsShow(true);
    return () => {
      slider.destroy();
    };
  }, [sliderRef3]);

  useAnalytics(AnalyticsEventType.BRAND_VIEWED, { brandDetails, entityName: PAGE_TYPE, })

  adaptedQuery.currentPage
    ? (adaptedQuery.currentPage = Number(adaptedQuery.currentPage))
    : false
  adaptedQuery.filters
    ? (adaptedQuery.filters = JSON.parse(adaptedQuery.filters))
    : false

  const initialState = {
    ...DEFAULT_STATE,
    // Setting initial filters if present in query string
    filters: filters.length > 0
      ? filters
      : [
        {
          Key: 'brand',
          Value: brandDetails?.name
        },
      ],
  }
  const [state, dispatch] = useReducer(reducer, initialState)

  const [productListMemory, setProductListMemory] = useState({
    products: {
      results: [],
      sortList: [],
      pages: 0,
      total: 0,
      currentPage: 1,
      filters: [],
      sortBy: null,
    },
  })
  const [manufacturerStateVideoName, setManufacturerStateVideoName] = useState('')
  const [manufacturerStateVideoHeading, setManufacturerStateVideoHeading] = useState('')
  const [manufacturerStateTextName, setManufacturerStateTextName] = useState('')
  const [midBannerHeading, setMidBannerHeading] = useState('')
  const [multipleBrandVideoName, setMultipleBrandVideoName] = useState('')
  const [multipleBrandVideos, setMultipleBrandVideos] = useState('')
  const [midBanners, setMidBanners] = useState('')
  const [midBannerLink, setMidBannerLink] = useState('')
  const [brandColor, setBrandColor] = useState('')
  const [manufacturerStateTextHeading, setManufacturerStateTextHeading] = useState('')
  const [pHeading, setPHeading] = useState('')
  const [pText, setPText] = useState('')
  const [textNames, setTextNames] = useState([])
  const [recommendedProducts, setRecommendedProducts] = useState([])
  const [showLandingPage, setShowLandingPage] = useState(true)
  const [isProductCompare, setProductCompare] = useState(false)
  const [excludeOOSProduct, setExcludeOOSProduct] = useState(true)
  const {
    data = {
      products: {
        results: [],
        sortList: [],
        pages: 0,
        total: 0,
        currentPage: 1,
        filters: state?.filters || [],
      },
    },
    error,
    isValidating
  } = useSwr(
    ['/api/catalog/products', { ...state, ...{ slug: slug, excludeOOSProduct } }],
    ([url, body]: any) => postData(url, body),
    {
      revalidateOnFocus: false,
    }
  )

  // reset state on slug change
  useEffect(() => {
    const handleRouteChange = (url: any) => {
      const currentSlug = url?.split('?')[0];
      if (currentSlug !== previousSlug) {
        dispatch({ type: RESET_STATE })
        setPreviousSlug(currentSlug);
      }
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    // Cleanup the event listener on unmount
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [previousSlug, router]);

  SwiperCore.use([Navigation])
  const swiperRef: any = useRef(null)

  const onEnableOutOfStockItems = (val: boolean) => {
    setExcludeOOSProduct(!val)
    // clearAll()
    dispatch({ type: PAGE, payload: 1 })
  }

  useEffect(() => {
    //if (IS_INFINITE_SCROLL) {
    if (
      data?.products?.currentPage !==
      productListMemory?.products?.currentPage ||
      data?.products?.total !== productListMemory?.products?.total ||
      data?.products?.sortBy !== productListMemory?.products?.sortBy
    ) {
      setProductListMemory((prevData: any) => {
        let dataClone = { ...data }
        if (state.currentPage > 1 && IS_INFINITE_SCROLL) {
          dataClone.products.results = [
            ...prevData?.products?.results,
            ...dataClone?.products?.results,
          ]
        }
        return dataClone
      })
    }
    //}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.products?.results?.length, data])

  useEffect(() => {
    if (state?.filters?.length) {
      routeToPLPWithSelectedFilters(router, state?.filters)
    }
    setPLPFilterSelection(state?.filters)
  }, [state?.filters])

  const handleClick = () => {
    router.push(`/brands/shop-all/${slug?.replace('brands/', '')}`)
  }

  const handlePageChange = (page: any, redirect = true) => {
    if (redirect) {
      router.push(
        {
          pathname: router.pathname,
          query: { ...router.query, currentPage: page.selected + 1 },
        },
        undefined,
        { shallow: true }
      )
    }
    dispatch({ type: PAGE, payload: page.selected + 1 })
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    })
  }

  const handleInfiniteScroll = () => {
    if (
      data?.products?.pages &&
      data?.products?.currentPage < data?.products?.pages
    ) {
      dispatch({ type: PAGE, payload: data.products.currentPage + 1 })
    }
  }

  const clearAll = () => {
    dispatch({ type: CLEAR })
    if (filters?.length) {
      routeToPLPWithSelectedFilters(router, initialState?.filters)
    }
    dispatch({ type: ADD_FILTERS, payload: { Key: 'brand', Value: brandDetails?.name }, })
  }


  const handleSortBy = (payload: any) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, sortBy: payload },
    })
    dispatch({
      type: SORT_BY,
      payload: payload,
    })
  }

  useEffect(() => {
    const entity = {
      allowFacet: true,
      brand: null,
      brandId: null,
      breadCrumb: null,
      category: null,
      categoryId: null,
      categoryIds: null,
      collection: null,
      collectionId: null,
      currentPage: state.currentPage,
      excludedBrandIds: null,
      excludedCategoryIds: null,
      facet: null,
      facetOnly: false,
      filters: state.filters,
      freeText: '',
      gender: null,
      ignoreDisplayInSearch: false,
      includeExcludedBrand: false,
      page: state.currentPage,
      pageSize: 0,
      promoCode: null,
      resultCount: data?.products?.total,
      sortBy: state?.sortBy,
      sortOrder: state?.sortOrder,
    }
    setEntities({
      [KEYS_MAP.entityId]: '',
      [KEYS_MAP.entityName]: '',
      [KEYS_MAP.entityType]: 'Search',
      [KEYS_MAP.entity]: JSON.stringify(entity),
    })

    recordEvent(EVENTS.FreeText)

    const trackScroll = (ev: any) => {
      setPageScroll(window?.location, ev.currentTarget.scrollX, ev.currentTarget.scrollY)
    }

    const isScrollEnabled = SCROLLABLE_LOCATIONS.find((x: string) => location.pathname.startsWith(x))
    if (isScrollEnabled) {
      window?.addEventListener('scroll', trackScroll)
      return () => {
        window?.removeEventListener('scroll', trackScroll)
      }
    } /*else {
      resetPageScroll()
    }*/

  }, [])

  useEffect(() => {
    setMidBanners('')
    setMidBannerHeading('')
    setMidBannerLink('')
    const Widgets = JSON.parse(brandDetails?.widgetsConfig || '[]')
    Widgets.map((val: any) => {
      if (val.manufacturerSettingType == 'Video' && val.code == 'BrandVideo') {
        setManufacturerStateVideoHeading(val.heading)
        setManufacturerStateVideoName(val.name)
      } else if (
        val.manufacturerSettingType == 'ImageBanner' &&
        val.code == 'MidBanner'
      ) {
        setMidBanners(val.name)
        setMidBannerHeading(val.heading)
        setMidBannerLink(val.buttonLink)
      } else if (
        val.manufacturerSettingType == 'Video' &&
        val.code === 'MultipleBrandVideos'
      ) {
        setMultipleBrandVideoName(val.name)
        setMultipleBrandVideos(val.heading)
      } else if (
        val.manufacturerSettingType == 'PlainText' &&
        val.code == 'BrandInnovations'
      ) {
        setManufacturerStateTextHeading(val.heading)
        setManufacturerStateTextName(val.name)
        if (val.name) {
          const TextNames = val.name.split('  ')
          setTextNames(TextNames)
        }
      } else if (
        val.manufacturerSettingType == 'Plain Text' &&
        val.code == 'PlainText'
      ) {
        setPHeading(val.heading)
        setPText(val.name)
        if (val.name) {
          const TextNames = val.name.split('  ')
          setTextNames(TextNames)
        }
      }
      return
    })
  }, [])

  //const productDataToPass = productListMemory.products
  const productDataToPass = IS_INFINITE_SCROLL
    ? productListMemory.products
    : data?.products

  useEffect(() => {
    if (productDataToPass?.results?.length > 0) {
      setRecommendedProducts(productDataToPass.results.slice(0, 8))
    }
  }, [productDataToPass])

  const showCompareProducts = () => {
    setProductCompare(true)
  }

  const closeCompareProducts = () => {
    setProductCompare(false)
  }
  const { isCompared } = useUI()
  // IMPLEMENT HANDLING FOR NULL OBJECT
  if (brandDetails === null) {
    return (
      <div className="container relative py-10 mx-auto text-center top-20">
        <h1 className="pb-6 text-3xl font-medium text-gray-400 font-30">
          {translate('common.label.badUrlText')}
          <Link href="/brands">
            <span className="px-3 text-indigo-500">{translate('common.label.allBrandsText')}</span>
          </Link>
        </h1>
      </div>
    )
  }
  let absPath = ''
  if (typeof window !== 'undefined') {
    absPath = window?.location?.href
  }

  const sanitizedDescription = sanitizeHtmlContent(brandDetails?.description)
  const onToggleBrandListPage = () => {
    router.push(`/brands/shop-all/${slug?.replace('brands/', '')}`)
  }
  const handleFilters = (filter: null, type: string) => {
    if (filters?.length == (1 + initialState?.filters?.length) && type == REMOVE_FILTERS) {
      routeToPLPWithSelectedFilters(router, initialState?.filters)
    }
    dispatch({
      type,
      payload: filter,
    })
    dispatch({ type: PAGE, payload: 1 })
  }
  const setFilter = (filters: any) => {
    dispatch({ type: SET_FILTERS, payload: filters })
  }
  const removeFilter = (key: string) => {
    if (filters?.length == (1 + initialState?.filters?.length)) {
      routeToPLPWithSelectedFilters(router, initialState?.filters)
    }
    dispatch({ type: REMOVE_FILTERS, payload: key })
  }
  let bgColor = "#dddddd"
  if (brandColor != "") {
    bgColor = brandColor
  }
  const [textColor, setTextColor] = useState('#ffffff'); // Default text color for dark background

  useEffect(() => {
    // Function to determine if the background color is dark
    const isColorDark = (color: any) => {
      // Convert hex color to RGB
      const rgb = parseInt(color.substring(1), 16);
      const r = (rgb >> 16) & 0xff;
      const g = (rgb >> 8) & 0xff;
      const b = (rgb >> 0) & 0xff;

      // Calculate luminance
      const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

      // Check if the luminance is below a certain threshold
      return luminance < 128; // Adjust the threshold as needed
    };

    // Change text color based on background color
    if (isColorDark(bgColor)) {
      setTextColor('#ffffff'); // Light text color for dark background      
    } else {
      setTextColor('#212530'); // Dark text color for light background
    }
  }, [bgColor]);
  const emptyHtmlString = "<html>\n<head>\n\t<title></title>\n</head>\n<body></body>\n</html>\n"
  const cleanPath = removeQueryString(router.asPath)
  return (
    <>
      <NextHead>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="canonical" href={SITE_ORIGIN_URL + cleanPath} />
        <title>{brandDetails?.metaTitle || brandDetails?.name}</title>
        <meta name="title" content={brandDetails?.metaTitle || brandDetails?.name} />
        <meta name="title" content={brandDetails?.name || translate('common.label.brandsText')} />
        <meta name="description" content={brandDetails?.metaDescription} />
        <meta name="keywords" content={brandDetails?.metaKeywords} />
        <meta property="og:image" content="" />
        <meta property="og:title" content={brandDetails?.metaTitle || brandDetails?.name} key="ogtitle" />
        <meta property="og:description" content={brandDetails?.metaDescription} key="ogdesc" />
        <meta property="og:site_name" content={SITE_NAME} key="ogsitename" />
        <meta property="og:url" content={absPath || SITE_ORIGIN_URL + cleanPath} key="ogurl" />
      </NextHead>
      {brandDetails?.showLandingPage && showLandingPage ? (
        <>
          <h1 className={`block text-2xl sr-only capitalize dark:text-black ${CURRENT_THEME == 'green' ? 'sm:text-4xl lg:text-5xl font-bold' : 'sm:text-3xl lg:text-4xl font-semibold'}`}>
            {brandDetails?.name}
          </h1>
          {featureToggle?.features?.enableForPCSite ? (
            resPcHero?.images?.length > 0 && (
              <div className='flex flex-col w-full mt-2'>
                <Swiper navigation={true} loop={true} className="flex items-center justify-center w-full mx-auto mt-0 mySwiper sm:px-0 sm:mt-0">
                  {resPcHero?.images?.map((img: any, idx: number) => (
                    <SwiperSlide key={`horizontal-slider-${idx}`}>
                      <Link href={img.link || '#'}>
                        <img
                          width={1920}
                          height={500}
                          src={generateUri(img.url, 'h=1000&fm=webp') || IMG_PLACEHOLDER}
                          alt={img?.name || 'Collection Banner'}
                          className="object-cover object-top w-full h-[500px] max-h-[500px] cursor-pointer"
                          loading={idx < 2 ? "eager" : "lazy"}
                        />
                      </Link>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )
          ) : (
            <></>
          )}
          <div className="container w-full pb-0 mx-auto bg-white md:pb-4">
            {featureToggle?.features?.enableForPCSite ? (
              <></>
            ) : (
              <div className="grid grid-cols-1 gap-5 mt-10 md:grid-cols-12">
                <div className="flex md:col-span-9 flex-col items-center px-4 sm:px-10 py-4 sm:py-10 rounded-xl brand-rounded-xl bg-teal-500 min-h-[350px] md:min-h-[85vh] lg:min-h-[55vh] justify-evenly pt-2">
                  <img alt="Brand Logo" src={brandDetails.logoImageName || IMG_PLACEHOLDER} width={212} height={200} loading="eager" className="w-[120px] md:w-[212px] h-auto rounded-2xl" />
                  {brandDetails?.shortDescription != emptyHtmlString &&
                    <div dangerouslySetInnerHTML={{ __html: brandDetails?.shortDescription }} className="w-3/4 py-5 text-2xl font-medium leading-10 text-center text-white uppercase" />
                  }
                  <button className="px-6 py-3 font-medium text-black uppercase bg-white rounded-md hover:opacity-80" onClick={handleClick} > {translate('common.label.shopNowText')} </button>
                </div>
                <ImageCollection range={1} AttrArray={imageCategoryCollectionResponse || []} showTitle={true} />
              </div>
            )}

            {resPc1?.length > 0 &&
              <div className="container flex flex-col !px-0 mx-auto bg-white sm:pt-10 pt-6 slider-btn-css">
                <div className='flex items-center justify-between gap-6 pb-4 sm:justify-start sm:pb-8'>
                  <h3 className="font-semibold text-black title-page">Top Categories</h3>
                </div>
                <div className='relative'>
                  <div className="flex justify-between mb-2 slider-out-btn">
                    <Prev onClickPrev={() => swiperRef.current?.swiper?.slidePrev()} />
                    <Next onClickNext={() => swiperRef.current?.swiper?.slideNext()} />
                  </div>
                  <Swiper slidesPerView={1.3} spaceBetween={16} ref={swiperRef} navigation={false} loop={true} className={deviceInfo?.isMobile ? 'mob-navigation-hide' : ''} breakpoints={{ 640: { slidesPerView: 1.3 }, 768: { slidesPerView: 3 }, 1024: { slidesPerView: 5 } }}>
                    {resPc1?.map((item: any, pId: number) => (
                      <SwiperSlide key={pId} className="relative inline-flex flex-col h-auto text-left cursor-pointer height-auto-slide group lg:w-auto">
                        <ProductCard data={item} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership} />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </div>
            }

            {resPc2?.length > 0 &&
              <div className="container flex flex-col !px-0 mx-auto bg-white sm:pt-10 pt-6 slider-btn-css">
                <div className='flex items-center justify-between gap-6 pb-4 sm:justify-start sm:pb-8'>
                  <h3 className="font-semibold text-black title-page">Top Cameras</h3>
                </div>
                <div className='relative'>
                  <div className="flex justify-between mb-2 slider-out-btn">
                    <Prev onClickPrev={() => swiperRef.current?.swiper?.slidePrev()} />
                    <Next onClickNext={() => swiperRef.current?.swiper?.slideNext()} />
                  </div>
                  <Swiper slidesPerView={1.3} spaceBetween={16} ref={swiperRef} navigation={false} loop={true} className={deviceInfo?.isMobile ? 'mob-navigation-hide' : ''} breakpoints={{ 640: { slidesPerView: 1.3 }, 768: { slidesPerView: 3 }, 1024: { slidesPerView: 5 } }}>
                    {resPc2?.map((item: any, pId: number) => (
                      <SwiperSlide key={pId} className="relative inline-flex flex-col h-auto text-left cursor-pointer height-auto-slide group lg:w-auto">
                        <ProductCard data={item} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership} />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </div>
            }

            {resPc3?.length > 0 &&
              <div className="container flex flex-col !px-0 mx-auto bg-white sm:pt-10 pt-6 slider-btn-css">
                <div className='flex items-center justify-between gap-6 pb-4 sm:justify-start sm:pb-8'>
                  <h3 className="font-semibold text-black title-page">Top Lenses</h3>
                </div>
                <div className='relative'>
                  <div className="flex justify-between mb-2 slider-out-btn">
                    <Prev onClickPrev={() => swiperRef.current?.swiper?.slidePrev()} />
                    <Next onClickNext={() => swiperRef.current?.swiper?.slideNext()} />
                  </div>
                  <Swiper slidesPerView={1.3} spaceBetween={16} ref={swiperRef} navigation={false} loop={true} className={deviceInfo?.isMobile ? 'mob-navigation-hide' : ''} breakpoints={{ 640: { slidesPerView: 1.3 }, 768: { slidesPerView: 3 }, 1024: { slidesPerView: 5 } }}>
                    {resPc3?.map((item: any, pId: number) => (
                      <SwiperSlide key={pId} className="relative inline-flex flex-col h-auto text-left cursor-pointer height-auto-slide group lg:w-auto">
                        <ProductCard data={item} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership} />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </div>
            }
            <div className='flex flex-col w-full gap-4 px-4 py-4 my-4 sm:my-10 bg-slate-100 rounded-xl sm:px-6 sm:py-8'>
              <h3 className="font-semibold text-black title-page">{pHeading}</h3>
              <p className='text-sm font-medium text-gray-700'>{pText}</p>
            </div> 

            {featureToggle?.features?.enableForPCSite &&
              <div className={`${featureToggle.features?.enableForPCSite ? ' pt-0 pb-0 mx-auto mt-0 bg-transparent sm:mt-0' : ' pt-2 pb-0 mx-auto mt-2 bg-transparent sm:mt-2'} fixing-main-section`}>
                {!featureToggle.features?.enableForPCSite &&
                  <>
                    <div className="max-w-screen-sm">
                      <ol role="list" className="flex items-center space-x-0 truncate sm:space-x-0 sm:mb-4 sm:px-0 md:px-0 lg:px-0 2xl:px-0" >
                        <li className='flex items-center text-10-mob sm:text-sm'>
                          <Link href="/brands" passHref>
                            <span className="flex items-end upper case font-12 dark:text-black">{translate('common.label.brandsText')}</span>
                          </Link>
                        </li>
                        <li className='flex items-center text-10-mob sm:text-sm'>
                          <span className="inline-block mx-1 font-normal hover:text-gray-900 dark:text-black" >
                            <ChevronRightIcon className='w-3 h-3'></ChevronRightIcon>
                          </span>
                        </li>
                        <li className='flex items-center text-10-mob sm:text-sm'>
                          <span className="font-semibold hover:text-gray-900 dark:text-black text-slate-900" > {brandDetails?.name}</span>
                        </li>
                      </ol>
                    </div>
                    <div className={`max-w-screen-sm max-t-full ${CURRENT_THEME == 'green' ? 'mx-auto text-center sm:py-0 py-3 -mt-4' : ''}`}>
                      <h1 className={`block text-2xl capitalize dark:text-black ${CURRENT_THEME == 'green' ? 'sm:text-4xl lg:text-5xl font-bold' : 'sm:text-3xl lg:text-4xl font-semibold'}`}>
                        {brandDetails?.name}
                      </h1>
                      {sanitizedDescription &&
                        <div className='w-full'>
                          <span className={`block text-neutral-500 dark:text-neutral-500 ${CURRENT_THEME == 'green' ? 'text-xs mt-2' : 'text-sm mt-4'}`}>
                            <span className="block mt-2 text-sm text-neutral-500 dark:text-neutral-500 sm:text-base" dangerouslySetInnerHTML={{ __html: sanitizedDescription }} ></span>
                          </span>
                        </div>
                      }
                    </div>
                    <div className='flex justify-between w-full pb-1 mt-1 mb-2 align-center'>
                      <span className="inline-block text-xs font-medium text-slate-500 sm:px-0 dark:text-slate-500 result-count-text brand-text-12"> {translate('label.search.resultCountText1')} {productDataToPass?.total} {translate('common.label.resultsText')} </span>
                      <div className="flex justify-end align-bottom">
                        <OutOfStockFilter excludeOOSProduct={excludeOOSProduct} onEnableOutOfStockItems={onEnableOutOfStockItems} />
                      </div>
                    </div>
                    <hr className='border-slate-200 dark:border-slate-200' />
                  </>
                }
                {
                  <div className={`grid grid-cols-1 gap-1 mt-2 overflow-hidden lg:grid-cols-12 sm:mt-0 pc-overflow-visible ${CURRENT_THEME == 'green' ? 'md:grid-cols-2 sm:grid-cols-2' : 'md:grid-cols-3 sm:grid-cols-3'}`}>
                    {isValidating ? (
                      <Loader />
                    ) : (
                      <>
                        {!!productDataToPass && (productDataToPass?.filters?.length > 0 ? (
                          <>
                            {!featureToggle.features?.enableForPCSite && <>
                              {isMobile ? (
                                <ProductMobileFilters isBrandPLP={true} handleFilters={handleFilters} products={data.products} routerFilters={state.filters} handleSortBy={handleSortBy} clearAll={clearAll} routerSortOption={state.sortBy} removeFilter={removeFilter} featureToggle={featureToggle} />
                              ) : (
                                <>
                                  {!featureToggle?.features?.enableHorizontalFilter ? (
                                    <ProductFilterRight featureToggle={featureToggle} handleFilters={handleFilters} products={productDataToPass} routerFilters={state.filters} />
                                  ) : (
                                    <FilterHorizontal handleFilters={handleFilters} products={data.products} routerFilters={state.filters} pageType="brand" />
                                  )}
                                </>
                              )}
                            </>}
                            <div className={`${CURRENT_THEME == 'green' ? 'sm:col-span-10 lg:col-span-10 md:col-span-10 product-grid-9' : featureToggle?.features?.enableHorizontalFilter ? 'sm:col-span-12 lg:col-span-12 md:col-span-12 col-span-12' : 'sm:col-span-9 lg:col-span-9 md:col-span-9 border-l border-gray-300 pl-6'}`}>
                              {featureToggle.features?.enableForPCSite &&
                                <>
                                  <div className={`${featureToggle.features?.enableForPCSite ? ' container !px-0' : ' w-full'} col-span-12`}>
                                    {isMobile ? (
                                      <ProductMobileFilters isBrandPLP={true} handleFilters={handleFilters} products={data.products} routerFilters={state.filters} handleSortBy={handleSortBy} clearAll={clearAll} routerSortOption={state.sortBy} removeFilter={removeFilter} featureToggle={featureToggle} />
                                    ) : (
                                      <>
                                        {!featureToggle?.features?.enableHorizontalFilter ? (
                                          <ProductFilterRight featureToggle={featureToggle} handleFilters={handleFilters} products={productDataToPass} routerFilters={state.filters} />
                                        ) : (
                                          <FilterHorizontal handleFilters={handleFilters} products={data.products} routerFilters={state.filters} pageType="brand" />
                                        )}
                                      </>
                                    )}
                                  </div>
                                  <div className='flex justify-start w-full gap-3 p-2 my-4 border border-[#D9D9D9] rounded sm:col-span-12'>
                                    <div className='flex items-center justify-between w-full gap-0'>
                                      <div className='flex justify-start gap-3'>
                                        <span className="inline-block text-xs font-medium text-slate-900 sm:px-0 dark:text-slate-900 result-count-text"> {`${productDataToPass?.total ?? 0} items in ${brandDetails?.name}`}</span>
                                      </div>
                                      <ProductFiltersTopBar products={data.products} handleSortBy={handleSortBy} routerFilters={state.filters} clearAll={clearAll} routerSortOption={state.sortBy} removeFilter={removeFilter} featureToggle={featureToggle} />
                                    </div>
                                  </div>
                                </>
                              }
                              {isMobile ? null : (
                                !featureToggle.features?.enableForPCSite && <ProductFiltersTopBar products={data?.products} handleSortBy={handleSortBy} routerFilters={state.filters} clearAll={clearAll} routerSortOption={state.sortBy} removeFilter={removeFilter} isBrandPLP={true} featureToggle={featureToggle} />
                              )}
                              <ProductGridWithFacet isPagination={true} products={productDataToPass} currentPage={state?.currentPage} handlePageChange={handlePageChange} handleInfiniteScroll={handleInfiniteScroll} deviceInfo={deviceInfo} maxBasketItemsCount={maxBasketItemsCount(config)} isCompared={isCompared} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership} />
                            </div>
                            {featureToggle.features?.enableForPCSite && <div className='col-span-12'>
                              <RecentlyViewedProduct deviceInfo={deviceInfo} config={config} productPerRow={5} featureToggle={featureToggle} />
                            </div>}
                            {/* <div className={`p-[1px] ${CURRENT_THEME == 'green' ? 'sm:col-span-10 product-grid-9' : 'sm:col-span-9'}`}>
                        {isMobile ? null : (
                          <ProductFiltersTopBar products={data.products} handleSortBy={handleSortBy} routerFilters={state.filters} clearAll={clearAll} routerSortOption={state.sortBy} removeFilter={removeFilter} featureToggle={featureToggle} isBrandPLP={true} />
                        )}
                        {productDataToPass?.results.length > 0 && <ProductGridWithFacet isPagination={true} products={productDataToPass} currentPage={state?.currentPage} handlePageChange={handlePageChange} handleInfiniteScroll={handleInfiniteScroll} deviceInfo={deviceInfo} maxBasketItemsCount={maxBasketItemsCount(config)} isCompared={isCompared} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership} />}
                      </div> */}
                          </>
                        ) : (
                          <div className="sm:col-span-12 p-[1px] sm:mt-0 mt-2">
                            {featureToggle.features?.enableForPCSite &&
                              <>
                                <div className='grid items-center px-2 mt-2 lg:col-span-12 md:col-span-12 sm:col-span-12 sm:grid-cols-12 sm:gap-4 sm:mb-4'>
                                  <div className='flex flex-col w-full gap-4 sm:col-span-12'>
                                    <div className="bg-transparent fixing-main-section dark:bg-white">
                                      <ol role="list" className="flex items-center space-x-0 truncate sm:space-x-0 sm:mb-4 sm:px-0 md:px-0 lg:px-0 2xl:px-0" >
                                        <li className='flex items-center text-10-mob sm:text-sm'>
                                          <Link href="/brands" passHref>
                                            <span className="flex items-end upper case font-12 dark:text-black">{translate('common.label.brandsText')}</span>
                                          </Link>
                                        </li>
                                        <li className='flex items-center text-10-mob sm:text-sm'>
                                          <span className="inline-block mx-1 font-normal hover:text-gray-900 dark:text-black" >
                                            <ChevronRightIcon className='w-3 h-3'></ChevronRightIcon>
                                          </span>
                                        </li>
                                        <li className='flex items-center text-10-mob sm:text-sm'>
                                          <span className="font-semibold hover:text-gray-900 dark:text-black text-slate-900" > {brandDetails?.name}</span>
                                        </li>
                                      </ol>
                                    </div>
                                    <BrandBanner props={brandDetails} deviceInfo={deviceInfo} description={sanitizedDescription} />
                                  </div>
                                  <div className='flex justify-start w-full gap-3 p-2 mt-1 border border-[#D9D9D9] rounded sm:col-span-12'>
                                    <div className='flex items-center justify-between w-full gap-0'>
                                      <div className='flex justify-start gap-3'>
                                        <span className="inline-block text-xs font-medium text-slate-900 sm:px-0 dark:text-slate-900 result-count-text"> {`${productDataToPass?.total ?? 0} items in ${brandDetails?.name}`}</span>
                                      </div>
                                      <ProductSort routerSortOption={state.sortBy} products={data.products} action={handleSortBy} featureToggle={featureToggle} />
                                    </div>
                                  </div>
                                </div>
                              </>
                            }
                            {!featureToggle.features?.enableForPCSite && <div className="flex justify-end w-full py-4">
                              <ProductSort routerSortOption={state.sortBy} products={data.products} action={handleSortBy} featureToggle={featureToggle} />
                            </div>}
                            <ProductGrid products={productDataToPass} currentPage={state.currentPage} handlePageChange={handlePageChange} handleInfiniteScroll={handleInfiniteScroll} deviceInfo={deviceInfo} maxBasketItemsCount={maxBasketItemsCount(config)} isCompared={isCompared} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership} />
                            {featureToggle.features?.enableForPCSite && <div className='col-span-12'>
                              <RecentlyViewedProduct deviceInfo={deviceInfo} config={config} productPerRow={5} featureToggle={featureToggle} />
                            </div>}
                          </div>
                        ))}
                      </>
                    )}
                    <CompareSelectionBar name={brandDetails?.name} showCompareProducts={showCompareProducts} products={productDataToPass} isCompare={isProductCompare} maxBasketItemsCount={maxBasketItemsCount(config)} closeCompareProducts={closeCompareProducts} deviceInfo={deviceInfo} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership} />
                  </div>
                }
                {/* <div className="cart-recently-viewed">
            <RecentlyViewedProduct deviceInfo={deviceInfo} config={config} productPerRow={4} />
          </div> */}
                <div className='flex flex-col w-full col-span-12'>
                  <EngageProductCard type={EngageEventTypes.TRENDING_FIRST_ORDER} campaignData={campaignData} isSlider={true} productPerRow={4} productLimit={12} />
                  <EngageProductCard type={EngageEventTypes.INTEREST_USER_ITEMS} campaignData={campaignData} isSlider={true} productPerRow={4} productLimit={12} />
                  <EngageProductCard type={EngageEventTypes.TRENDING_COLLECTION} campaignData={campaignData} isSlider={true} productPerRow={4} productLimit={12} />
                  <EngageProductCard type={EngageEventTypes.COUPON_COLLECTION} campaignData={campaignData} isSlider={true} productPerRow={4} productLimit={12} />
                  <EngageProductCard type={EngageEventTypes.SEARCH} campaignData={campaignData} isSlider={true} productPerRow={4} productLimit={12} />
                  <EngageProductCard type={EngageEventTypes.RECENTLY_VIEWED} campaignData={campaignData} isSlider={true} productPerRow={4} productLimit={12} />
                </div>
              </div>
            }

            {!featureToggle?.features?.enableForPCSite &&
              <>
                <PlainText textNames={textNames || []} heading={manufacturerStateTextHeading} />
                <div className="mt-0 md:mt-2">
                  <Video heading={manufacturerStateVideoHeading} name={manufacturerStateVideoName} />
                </div>

                <div className="w-full mt-10 md:mt-20">
                  {/* NOTE : manufacturerSettingType for this widget is 'ImageBanner' & code is 'MidBanner' */}
                  <ImageBanner midBanners={midBanners} heading={midBannerHeading} link={midBannerLink} bgColor={bgColor} textColor={textColor} />

                  {/* NOTE : manufacturerSettingType for this widget is 'Video' & code is 'MultipleBrandVideos' */}
                  {multipleBrandVideoName ?
                    <div className="mt-10 lg:mt-20">
                      <MultiBrandVideo videos={multipleBrandVideos || ''} name={multipleBrandVideoName || ''} />
                    </div> : null
                  }
                </div>
              </>
            }
          </div>

          {!featureToggle?.features?.enableForPCSite && <div className="container w-full mx-auto">
            {isOnlyMobile ? (
              <div className="mb-2 max-h-[30vh]">
                <Slider images={imgFeatureCollection?.images || []} isBanner={false} />
              </div>
            ) : (
              <div className="mb-2">
                <ImageCollection range={4} AttrArray={imgFeatureCollection?.images || []} />
              </div>
            )}
            {saleProductCollectionRes?.length > 0 && (
              <div className="mt-10 border-gray-200 border-y">
                <div className={`nc-SectionSliderProductCard`}>
                  <div ref={sliderRefNew} className={`flow-root`}>
                    <div className="flex justify-between">
                      <HeadingWithButton
                        className="mt-10 mb-6 capitalize lg:mb-8 text-neutral-900 dark:text-neutral-50"
                        desc=""
                        rightDescText="2024"
                        hasNextPrev
                        onButtonClick={onToggleBrandListPage}
                        buttonText="See All"
                      >
                        {translate('label.product.saleProductText')}
                      </HeadingWithButton>
                    </div>
                    <div className="glide__track" data-glide-el="track">
                      <ul className="glide__slides">
                        {saleProductCollectionRes?.map((item: any, index: number) => (
                          <li key={index} className={`glide__slide`}>
                            <ProductCard
                              data={item}
                              featureToggle={featureToggle}
                              defaultDisplayMembership={defaultDisplayMembership}
                            />
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="max-w-4xl mx-auto my-10">
              <p className="mb-6 text-3xl font-semibold capitalize md:text-4xl text-slate-900">{faq.title}</p>
              {faq?.results?.map((val: any, Idx: number) => {
                return (
                  <BrandDisclosure key={Idx} heading={val.faq} details={val.ans} />
                )
              })}
            </div>
          </div>}
        </>
      ) : (
        <div className={`${featureToggle.features?.enableForPCSite ? ' pt-0 pb-0 mx-auto mt-0 bg-transparent sm:mt-0' : ' pt-2 pb-0 mx-auto mt-2 bg-transparent sm:mt-2'} container fixing-main-section`}>
          {!featureToggle.features?.enableForPCSite &&
            <>
              <div className="max-w-screen-sm">
                <ol role="list" className="flex items-center space-x-0 truncate sm:space-x-0 sm:mb-4 sm:px-0 md:px-0 lg:px-0 2xl:px-0" >
                  <li className='flex items-center text-10-mob sm:text-sm'>
                    <Link href="/brands" passHref>
                      <span className="flex items-end upper case font-12 dark:text-black">{translate('common.label.brandsText')}</span>
                    </Link>
                  </li>
                  <li className='flex items-center text-10-mob sm:text-sm'>
                    <span className="inline-block mx-1 font-normal hover:text-gray-900 dark:text-black" >
                      <ChevronRightIcon className='w-3 h-3'></ChevronRightIcon>
                    </span>
                  </li>
                  <li className='flex items-center text-10-mob sm:text-sm'>
                    <span className="font-semibold hover:text-gray-900 dark:text-black text-slate-900" > {brandDetails?.name}</span>
                  </li>
                </ol>
              </div>
              <div className={`max-w-screen-sm max-t-full ${CURRENT_THEME == 'green' ? 'mx-auto text-center sm:py-0 py-3 -mt-4' : ''}`}>
                <h1 className={`block text-2xl capitalize dark:text-black ${CURRENT_THEME == 'green' ? 'sm:text-4xl lg:text-5xl font-bold' : 'sm:text-3xl lg:text-4xl font-semibold'}`}>
                  {brandDetails?.name}
                </h1>
                {sanitizedDescription &&
                  <div className='w-full'>
                    <span className={`block text-neutral-500 dark:text-neutral-500 ${CURRENT_THEME == 'green' ? 'text-xs mt-2' : 'text-sm mt-4'}`}>
                      <span className="block mt-2 text-sm text-neutral-500 dark:text-neutral-500 sm:text-base" dangerouslySetInnerHTML={{ __html: sanitizedDescription }} ></span>
                    </span>
                  </div>
                }
              </div>
              <div className='flex justify-between w-full pb-1 mt-1 mb-2 align-center'>
                <span className="inline-block text-xs font-medium text-slate-500 sm:px-0 dark:text-slate-500 result-count-text brand-text-12"> {translate('label.search.resultCountText1')} {productDataToPass?.total} {translate('common.label.resultsText')} </span>
                <div className="flex justify-end align-bottom">
                  <OutOfStockFilter excludeOOSProduct={excludeOOSProduct} onEnableOutOfStockItems={onEnableOutOfStockItems} />
                </div>
              </div>
              <hr className='border-slate-200 dark:border-slate-200' />
            </>
          }
          {
            <div className={`grid grid-cols-1 gap-1 mt-2 overflow-hidden lg:grid-cols-12 sm:mt-0 pc-overflow-visible ${CURRENT_THEME == 'green' ? 'md:grid-cols-2 sm:grid-cols-2' : 'md:grid-cols-3 sm:grid-cols-3'}`}>
              {isValidating ? (
                <Loader />
              ) : (
                <>
                  {!!productDataToPass && (productDataToPass?.filters?.length > 0 ? (
                    <>
                      {!featureToggle.features?.enableForPCSite && <>
                        {isMobile ? (
                          <ProductMobileFilters isBrandPLP={true} handleFilters={handleFilters} products={data.products} routerFilters={state.filters} handleSortBy={handleSortBy} clearAll={clearAll} routerSortOption={state.sortBy} removeFilter={removeFilter} featureToggle={featureToggle} />
                        ) : (
                          <>
                            {!featureToggle?.features?.enableHorizontalFilter ? (
                              <ProductFilterRight featureToggle={featureToggle} handleFilters={handleFilters} products={productDataToPass} routerFilters={state.filters} />
                            ) : (
                              <FilterHorizontal handleFilters={handleFilters} products={data.products} routerFilters={state.filters} pageType="brand" />
                            )}
                          </>
                        )}
                      </>}
                      <div className={`${CURRENT_THEME == 'green' ? 'sm:col-span-10 lg:col-span-10 md:col-span-10 product-grid-9' : featureToggle?.features?.enableHorizontalFilter ? 'sm:col-span-12 lg:col-span-12 md:col-span-12 col-span-12' : 'sm:col-span-9 lg:col-span-9 md:col-span-9 border-l border-gray-300 pl-6'}`}>
                        {featureToggle.features?.enableForPCSite &&
                          <>
                            <div className='flex flex-col w-full gap-4 sm:col-span-12'>
                              <div className="bg-transparent fixing-main-section dark:bg-white">
                                <ol role="list" className="flex items-center space-x-0 truncate sm:space-x-0 sm:mb-0 sm:px-0 md:px-0 lg:px-0 2xl:px-0" >
                                  <li className='flex items-center text-10-mob sm:text-sm'>
                                    <Link href="/brands" passHref>
                                      <span className="flex items-end upper case font-12 dark:text-black">{translate('common.label.brandsText')}</span>
                                    </Link>
                                  </li>
                                  <li className='flex items-center text-10-mob sm:text-sm'>
                                    <span className="inline-block mx-1 font-normal hover:text-gray-900 dark:text-black" >
                                      <ChevronRightIcon className='w-3 h-3'></ChevronRightIcon>
                                    </span>
                                  </li>
                                  <li className='flex items-center text-10-mob sm:text-sm'>
                                    <span className="font-semibold hover:text-gray-900 dark:text-black text-slate-900" > {brandDetails?.name}</span>
                                  </li>
                                </ol>
                              </div>
                              <BrandBanner props={brandDetails} deviceInfo={deviceInfo} description={sanitizedDescription} />
                            </div>
                            <div className={`${featureToggle.features?.enableForPCSite ? ' container !px-0' : ' w-full'} col-span-12`}>
                              {isMobile ? (
                                <ProductMobileFilters isBrandPLP={true} handleFilters={handleFilters} products={data.products} routerFilters={state.filters} handleSortBy={handleSortBy} clearAll={clearAll} routerSortOption={state.sortBy} removeFilter={removeFilter} featureToggle={featureToggle} />
                              ) : (
                                <>
                                  {!featureToggle?.features?.enableHorizontalFilter ? (
                                    <ProductFilterRight featureToggle={featureToggle} handleFilters={handleFilters} products={productDataToPass} routerFilters={state.filters} />
                                  ) : (
                                    <FilterHorizontal handleFilters={handleFilters} products={data.products} routerFilters={state.filters} pageType="brand" />
                                  )}
                                </>
                              )}
                            </div>
                            <div className='flex justify-start w-full gap-3 p-2 my-4 border border-[#D9D9D9] rounded sm:col-span-12'>
                              <div className='flex items-center justify-between w-full gap-0'>
                                <div className='flex justify-start gap-3'>
                                  <span className="inline-block text-xs font-medium text-slate-900 sm:px-0 dark:text-slate-900 result-count-text"> {`${productDataToPass?.total ?? 0} items in ${brandDetails?.name}`}</span>
                                </div>
                                <ProductFiltersTopBar products={data.products} handleSortBy={handleSortBy} routerFilters={state.filters} clearAll={clearAll} routerSortOption={state.sortBy} removeFilter={removeFilter} featureToggle={featureToggle} />
                              </div>
                            </div>
                          </>
                        }
                        {isMobile ? null : (
                          !featureToggle.features?.enableForPCSite && <ProductFiltersTopBar products={data?.products} handleSortBy={handleSortBy} routerFilters={state.filters} clearAll={clearAll} routerSortOption={state.sortBy} removeFilter={removeFilter} isBrandPLP={true} featureToggle={featureToggle} />
                        )}
                        <ProductGridWithFacet isPagination={true} products={productDataToPass} currentPage={state?.currentPage} handlePageChange={handlePageChange} handleInfiniteScroll={handleInfiniteScroll} deviceInfo={deviceInfo} maxBasketItemsCount={maxBasketItemsCount(config)} isCompared={isCompared} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership} />
                      </div>
                      {featureToggle.features?.enableForPCSite && <div className='col-span-12'>
                        <RecentlyViewedProduct deviceInfo={deviceInfo} config={config} productPerRow={5} featureToggle={featureToggle} />
                      </div>}
                      {/* <div className={`p-[1px] ${CURRENT_THEME == 'green' ? 'sm:col-span-10 product-grid-9' : 'sm:col-span-9'}`}>
                        {isMobile ? null : (
                          <ProductFiltersTopBar products={data.products} handleSortBy={handleSortBy} routerFilters={state.filters} clearAll={clearAll} routerSortOption={state.sortBy} removeFilter={removeFilter} featureToggle={featureToggle} isBrandPLP={true} />
                        )}
                        {productDataToPass?.results.length > 0 && <ProductGridWithFacet isPagination={true} products={productDataToPass} currentPage={state?.currentPage} handlePageChange={handlePageChange} handleInfiniteScroll={handleInfiniteScroll} deviceInfo={deviceInfo} maxBasketItemsCount={maxBasketItemsCount(config)} isCompared={isCompared} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership} />}
                      </div> */}
                    </>
                  ) : (
                    <div className="sm:col-span-12 p-[1px] sm:mt-0 mt-2">
                      {featureToggle.features?.enableForPCSite &&
                        <>
                          <div className='grid items-center px-2 mt-2 lg:col-span-12 md:col-span-12 sm:col-span-12 sm:grid-cols-12 sm:gap-4 sm:mb-4'>
                            <div className='flex flex-col w-full gap-4 sm:col-span-12'>
                              <div className="bg-transparent fixing-main-section dark:bg-white">
                                <ol role="list" className="flex items-center space-x-0 truncate sm:space-x-0 sm:mb-4 sm:px-0 md:px-0 lg:px-0 2xl:px-0" >
                                  <li className='flex items-center text-10-mob sm:text-sm'>
                                    <Link href="/brands" passHref>
                                      <span className="flex items-end upper case font-12 dark:text-black">{translate('common.label.brandsText')}</span>
                                    </Link>
                                  </li>
                                  <li className='flex items-center text-10-mob sm:text-sm'>
                                    <span className="inline-block mx-1 font-normal hover:text-gray-900 dark:text-black" >
                                      <ChevronRightIcon className='w-3 h-3'></ChevronRightIcon>
                                    </span>
                                  </li>
                                  <li className='flex items-center text-10-mob sm:text-sm'>
                                    <span className="font-semibold hover:text-gray-900 dark:text-black text-slate-900" > {brandDetails?.name}</span>
                                  </li>
                                </ol>
                              </div>
                              <BrandBanner props={brandDetails} deviceInfo={deviceInfo} description={sanitizedDescription} />
                            </div>
                            <div className='flex justify-start w-full gap-3 p-2 mt-1 border border-[#D9D9D9] rounded sm:col-span-12'>
                              <div className='flex items-center justify-between w-full gap-0'>
                                <div className='flex justify-start gap-3'>
                                  <span className="inline-block text-xs font-medium text-slate-900 sm:px-0 dark:text-slate-900 result-count-text"> {`${productDataToPass?.total ?? 0} items in ${brandDetails?.name}`}</span>
                                </div>
                                <ProductSort routerSortOption={state.sortBy} products={data.products} action={handleSortBy} featureToggle={featureToggle} />
                              </div>
                            </div>
                          </div>
                        </>
                      }
                      {!featureToggle.features?.enableForPCSite && <div className="flex justify-end w-full py-4">
                        <ProductSort routerSortOption={state.sortBy} products={data.products} action={handleSortBy} featureToggle={featureToggle} />
                      </div>}
                      <ProductGrid products={productDataToPass} currentPage={state.currentPage} handlePageChange={handlePageChange} handleInfiniteScroll={handleInfiniteScroll} deviceInfo={deviceInfo} maxBasketItemsCount={maxBasketItemsCount(config)} isCompared={isCompared} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership} />
                      {featureToggle.features?.enableForPCSite && <div className='col-span-12'>
                        <RecentlyViewedProduct deviceInfo={deviceInfo} config={config} productPerRow={5} featureToggle={featureToggle} />
                      </div>}
                    </div>
                  ))}
                </>
              )}
              <CompareSelectionBar name={brandDetails?.name} showCompareProducts={showCompareProducts} products={productDataToPass} isCompare={isProductCompare} maxBasketItemsCount={maxBasketItemsCount(config)} closeCompareProducts={closeCompareProducts} deviceInfo={deviceInfo} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership} />
            </div>
          }
          {/* <div className="cart-recently-viewed">
            <RecentlyViewedProduct deviceInfo={deviceInfo} config={config} productPerRow={4} />
          </div> */}
          <div className='flex flex-col w-full col-span-12'>
            <EngageProductCard type={EngageEventTypes.TRENDING_FIRST_ORDER} campaignData={campaignData} isSlider={true} productPerRow={4} productLimit={12} />
            <EngageProductCard type={EngageEventTypes.INTEREST_USER_ITEMS} campaignData={campaignData} isSlider={true} productPerRow={4} productLimit={12} />
            <EngageProductCard type={EngageEventTypes.TRENDING_COLLECTION} campaignData={campaignData} isSlider={true} productPerRow={4} productLimit={12} />
            <EngageProductCard type={EngageEventTypes.COUPON_COLLECTION} campaignData={campaignData} isSlider={true} productPerRow={4} productLimit={12} />
            <EngageProductCard type={EngageEventTypes.SEARCH} campaignData={campaignData} isSlider={true} productPerRow={4} productLimit={12} />
            <EngageProductCard type={EngageEventTypes.RECENTLY_VIEWED} campaignData={campaignData} isSlider={true} productPerRow={4} productLimit={12} />
          </div>
        </div>
      )}
    </>
  )
}

export async function getStaticProps({
  params,
  locale,
  locales,
  preview,
}: GetStaticPropsContext<{ brand: string }>) {
  let brandSlug: any = params!.brand;
  if (brandSlug?.length) {
    brandSlug = brandSlug.join('/');
  }
  const slug = `brands/${brandSlug}`
  const props: IPagePropsProvider = getPagePropType({ type: PagePropType.BRAND_PLP })
  const cookies = serverSideMicrositeCookies(locale!)
  const pageProps = await props.getPageProps({ slug, cookies })

  if (pageProps?.notFound) {
    return { ...notFoundRedirect(), revalidate: getSecondsInMinutes(STATIC_PAGE_CACHE_INVALIDATION_IN_MINS), }
  }

  return {
    props: {
      ...pageProps,
      query: EmptyObject, //context.query,
      params: params,
    }, // will be passed to the page component as props
    revalidate: getSecondsInMinutes(STATIC_PAGE_CACHE_INVALIDATION_IN_MINS),
  }
}

export async function getStaticPaths({ locales }: GetStaticPathsContext) {
  const paths: Array<string> = await getAllBrandsStaticPath()
  return {
    paths: paths?.map((x: any) => !x?.slug?.startsWith('/') ? `/${x?.slug}` : x?.slug),
    fallback: 'blocking',
  }
}

const PAGE_TYPE = PAGE_TYPES['Brand']

export default withDataLayer(BrandDetailPage, PAGE_TYPE)
