import { useReducer, useEffect, useState, useRef } from 'react'
import useSwr from 'swr'
import NextHead from 'next/head'
import Link from 'next/link'
import Glide from '@glidejs/glide'
import SwiperCore, { Navigation } from 'swiper'
import getAllBrandsStaticPath from '@framework/brand/get-all-brands-static-path'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import useFaqData from '@components/SectionBrands/faqData'
import useAnalytics from '@components/services/analytics/useAnalytics'
import commerce from '@lib/api/commerce'
import StandardBrandLanding from '@components/brand/StandardBrandLanding'
import StandardBrandListData from '@components/brand/StandardBrandListData'
import { useRouter } from 'next/router'
import { GetStaticPathsContext, GetStaticPropsContext } from 'next'
import { SCROLLABLE_LOCATIONS } from 'pages/_app'
import { parsePLPFilters, routeToPLPWithSelectedFilters, setPLPFilterSelection } from 'framework/utils/app-util'
import { maxBasketItemsCount, notFoundRedirect, setPageScroll } from '@framework/utils/app-util'
import { useTranslation } from '@commerce/utils/use-translation'
import { postData } from '@components/utils/clientFetcher'
import { BLOG_COLS, BLOG_PAGE_ID, EmptyObject, SITE_NAME, SITE_ORIGIN_URL } from '@components/utils/constants'
import { AnalyticsEventType } from '@components/services/analytics'
import { EVENTS, KEYS_MAP } from '@components/utils/dataLayer'
import { getSecondsInMinutes } from '@framework/utils/parse-util'
import { removeQueryString, serverSideMicrositeCookies } from '@commerce/utils/uri-util'
import { STATIC_PAGE_CACHE_INVALIDATION_IN_MINS } from '@framework/utils/constants'
import { useUI } from '@components/ui'
import { IPagePropsProvider } from '@framework/contracts/page-props/IPagePropsProvider'
import { getPagePropType, PagePropType } from '@framework/page-props'
import { getFeatureToggle } from 'pages/category/[category]'
import { isEqual } from 'lodash'

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

function BrandDetailPage({ query, setEntities, pageContents, recordEvent, brandDetails, slug, deviceInfo, config, collections, featureToggle, campaignData, defaultDisplayMembership }: any) {
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
  let resIc1: any = collections.resIc1

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
  const [blogData, setBlogData] = useState(null)
  //router.push({ pathname: router.pathname, query }, undefined, { shallow: true })

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
  // useEffect(() => {
  //   const handleRouteChange = (url: any) => {
  //     const currentSlug = url?.split('?')[0];
  //     if (currentSlug !== previousSlug) {
  //       dispatch({ type: RESET_STATE })
  //       setPreviousSlug(currentSlug);
  //     }
  //   };

  //   router.events.on('routeChangeComplete', handleRouteChange);

  //   // Cleanup the event listener on unmount
  //   return () => {
  //     router.events.off('routeChangeComplete', handleRouteChange);
  //   };
  // }, [previousSlug, router]);

  SwiperCore.use([Navigation])
  const swiperRef: any = useRef(null)
  const swiperRefIc1: any = useRef(null)
  const swiperRefPc1: any = useRef(null)
  const swiperRefPc2: any = useRef(null)
  const swiperRefPc3: any = useRef(null)

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
    const urlFilters = parsePLPFilters(router.asPath)
    const stateFilters = state?.filters || []

    // Prevent infinite loop by only updating URL when filters have actually changed
    const filtersAreSame = isEqual(urlFilters, stateFilters)

    if (!filtersAreSame && stateFilters.length) {
      routeToPLPWithSelectedFilters(router, stateFilters)
    }

    setPLPFilterSelection(stateFilters)
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
  const widgets = JSON.parse(brandDetails?.widgetsConfig)

  const pc1Title = widgets?.find((item: any) => item?.code == 'PC1')?.heading
  const pc2Title = widgets?.find((item: any) => item?.code == 'PC2')?.heading
  const pc3Title = widgets?.find((item: any) => item?.code == 'PC3')?.heading
  const ic1Title = widgets?.find((item: any) => item?.code == 'IC1')?.heading

  const brandGuidePages = pageContents?.pages?.filter((page: any) => page.fields?.brand === brandDetails?.name.toLowerCase());
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
        <StandardBrandLanding
          // Hero and Sliders
          resPcHero={resPcHero}
          resPc1={resPc1}
          resPc2={resPc2}
          resPc3={resPc3}
          resIc1={resIc1}
          swiperRef={swiperRef}
          swiperRefPc1={swiperRefPc1}
          swiperRefPc2={swiperRefPc2}
          swiperRefPc3={swiperRefPc3}
          sliderRefNew={sliderRefNew}
          swiperRefIc1={swiperRefIc1}
          ic1Title={ic1Title}
          pc1Title={pc1Title}
          pc2Title={pc2Title}
          pc3Title={pc3Title}
          brandGuidePages={brandGuidePages}


          // Brand & Video Info
          onToggleBrandListPage={onToggleBrandListPage}
          manufacturerStateVideoHeading={manufacturerStateVideoHeading}
          manufacturerStateVideoName={manufacturerStateVideoName}
          multipleBrandVideoName={multipleBrandVideoName}
          multipleBrandVideos={multipleBrandVideos}
          manufacturerStateTextHeading={manufacturerStateTextHeading}
          brandDetails={brandDetails}
          sanitizedDescription={brandDetails?.description}

          // Texts and UI Labels
          pHeading={pHeading}
          pText={pText}
          textNames={textNames}
          faq={faq}

          // Feature & Category Collections
          saleProductCollectionRes={saleProductCollectionRes}
          imgFeatureCollection={imgFeatureCollection}
          imageCategoryCollectionResponse={imageCategoryCollectionResponse}

          // Banners
          midBanners={midBanners}
          midBannerHeading={midBannerHeading}
          midBannerLink={midBannerLink}

          // Style
          bgColor={bgColor}
          textColor={textColor}

          // Feature Toggles
          featureToggle={featureToggle}
          emptyHtmlString={emptyHtmlString}

          // Filters & Pagination
          excludeOOSProduct={excludeOOSProduct}
          onEnableOutOfStockItems={onEnableOutOfStockItems}
          handleFilters={handleFilters}
          removeFilter={removeFilter}
          clearAll={clearAll}
          handleSortBy={handleSortBy}
          handlePageChange={handlePageChange}
          handleInfiniteScroll={handleInfiniteScroll}

          // Compare & Cart
          isProductCompare={isProductCompare}
          isCompared={isCompared}
          showCompareProducts={showCompareProducts}
          closeCompareProducts={closeCompareProducts}
          maxBasketItemsCount={maxBasketItemsCount}

          // Others
          isValidating={isValidating}
          handleClick={handleClick}
          config={config}
          productDataToPass={productDataToPass}
          data={data}
          state={state}
          deviceInfo={deviceInfo}
          campaignData={campaignData}
          defaultDisplayMembership={defaultDisplayMembership}
          hideListHeader={true}
        />
      ) : (
        <StandardBrandListData
          featureToggle={featureToggle}
          brandDetails={brandDetails}
          sanitizedDescription={brandDetails?.description}
          excludeOOSProduct={excludeOOSProduct}
          onEnableOutOfStockItems={onEnableOutOfStockItems}
          isProductCompare={isProductCompare}
          showCompareProducts={showCompareProducts}
          isValidating={isValidating}
          clearAll={clearAll}
          config={config}
          productDataToPass={productDataToPass}
          handlePageChange={handlePageChange}
          handleInfiniteScroll={handleInfiniteScroll}
          deviceInfo={deviceInfo}
          maxBasketItemsCount={maxBasketItemsCount}
          handleFilters={handleFilters}
          data={data}
          state={state}
          handleSortBy={handleSortBy}
          isCompared={isCompared}
          campaignData={campaignData}
          removeFilter={removeFilter}
          defaultDisplayMembership={defaultDisplayMembership}
          closeCompareProducts={closeCompareProducts}
          hideListHeader={false}
        />
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
  const featureToggle = await getFeatureToggle()
  const slug = featureToggle?.features?.enableEntityNameInPageSlug ? `brands/${brandSlug}` : brandSlug
  const props: IPagePropsProvider = getPagePropType({ type: PagePropType.BRAND_PLP })
  const cookies = serverSideMicrositeCookies(locale!)
  const pageProps = await props.getPageProps({ slug, cookies })
  const BlogContentsPromise = commerce.getBlogList({
    pagetypeId: BLOG_PAGE_ID, //Constant pageId,
    skip: 0, //skip,
    pagesize: 100, //pagesize,s
    sortby: 3, //sortby,
    sortorder: 1, //sortorder,
    cols: BLOG_COLS, //"blogheader.blogheader_mainimage",
  })
  const blogContents = await BlogContentsPromise
  if (pageProps?.notFound) {
    return { ...notFoundRedirect(), revalidate: getSecondsInMinutes(STATIC_PAGE_CACHE_INVALIDATION_IN_MINS), }
  }

  return {
    props: {
      ...pageProps,
      query: EmptyObject, //context.query,
      params: params,
      pageContents: blogContents ?? {},
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
