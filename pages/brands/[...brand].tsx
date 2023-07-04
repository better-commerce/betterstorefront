import dynamic from 'next/dynamic'
import { useReducer, useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import useSwr from 'swr'
import NextHead from 'next/head'
import { postData } from '@components/utils/clientFetcher'
import { GetServerSideProps } from 'next'
import Image from 'next/image'
import faq from '@components/brand/faqData.json'
const ProductGrid = dynamic(
  () => import('@components/product/Grid/ProductGrid')
)
import cn from 'classnames'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper.min.css'
import SwiperCore, { Navigation } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'
const ProductSort = dynamic(() => import('@components/product/ProductSort'))
import getBrandBySlug from '@framework/api/endpoints/catalog/getBrandBySlug'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import { EVENTS, KEYS_MAP } from '@components/utils/dataLayer'
import { EVENTS_MAP } from '@components/services/analytics/constants'
import useAnalytics from '@components/services/analytics/useAnalytics'
import Link from 'next/link'
import commerce from '@lib/api/commerce'
import Slider from '@components/brand/Slider'
import {
  BTN_RECOMMENDED_PROD,
  BTN_SEE_ALL,
  FEATURES_HEADING,
  IMG_PLACEHOLDER,
  RESULTS,
  SHOP_NOW,
} from '@components/utils/textVariables'
import { maxBasketItemsCount } from '@framework/utils/app-util'
import brands from '.'
import Disclosure from '@components/brand/Disclosure'
import { ImageCollection, PlainText, Video } from '@components/brand'
import { before, indexOf } from 'lodash'
import getCollectionById from '@framework/api/content/getCollectionById'
import ProductCard from '@components/product/ProductCard/ProductCard'
import { Product } from '@commerce/types'
import RecommendedProductCollection from '@components/brand/RecommendedProductCollection'
import ImageBanner from '@components/brand/ImageBanner'
import MultiBrandVideo from '@components/brand/MultiBrandVideo'
import axios from 'axios'
import { NEXT_GET_COLLECTION_BY_ID } from '@components/utils/constants'
import OfferCard from '@components/brand/OfferCard'
import { tryParseJson } from '@framework/utils/parse-util'

export const ACTION_TYPES = {
  SORT_BY: 'SORT_BY',
  PAGE: 'PAGE',
  SORT_ORDER: 'SORT_ORDER',
  CLEAR: 'CLEAR',
  HANDLE_FILTERS_UI: 'HANDLE_FILTERS_UI',
  ADD_FILTERS: 'ADD_FILTERS',
  REMOVE_FILTERS: 'REMOVE_FILTERS',
}

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

const IS_INFINITE_SCROLL =
  process.env.NEXT_PUBLIC_ENABLE_INFINITE_SCROLL === 'true'

const {
  SORT_BY,
  PAGE,
  SORT_ORDER,
  CLEAR,
  HANDLE_FILTERS_UI,
  ADD_FILTERS,
  REMOVE_FILTERS,
} = ACTION_TYPES

const DEFAULT_STATE = {
  sortBy: '',
  sortOrder: 'asc',
  currentPage: 1,
  filters: [],
}

function reducer(state: stateInterface, { type, payload }: actionInterface) {
  switch (type) {
    case SORT_BY:
      return { ...state, sortBy: payload }
    case PAGE:
      return { ...state, currentPage: payload }
    case SORT_ORDER:
      return { ...state, sortOrder: payload }
    case CLEAR:
      return { ...state, filters: [] }
    case HANDLE_FILTERS_UI:
      return { ...state, areFiltersOpen: payload }
    case ADD_FILTERS:
      return { ...state, filters: [...state.filters, payload] }
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

function BrandDetailPage({
  query,
  setEntities,
  recordEvent,
  brandDetails,
  slug,
  deviceInfo,
  config,
  collections, // ...for Image Collection api response
}: any) {
  const adaptedQuery = { ...query }
  const { BrandViewed, PageViewed } = EVENTS_MAP.EVENT_TYPES

  let imageBannerCollectionResponse: any =
    collections.imageBannerCollectionResponse
  let imageCategoryCollectionResponse: any =
    collections.imageCategoryCollectionResponse
  let imageCollectionResponse: any = collections.imageCollectionResponse
  let offerBannerResult: any = collections.offerBannerResult

  useAnalytics(BrandViewed, {
    entity: JSON.stringify({
      id: brandDetails?.id,
      name: brandDetails?.name || '',
      manufName: brandDetails?.manufacturerName,
    }),
    entityName: PAGE_TYPE,
    pageTitle: brandDetails?.manufacturerName,
    entityType: 'Brand',
    eventType: 'BrandViewed',
  })

  adaptedQuery.currentPage
    ? (adaptedQuery.currentPage = Number(adaptedQuery.currentPage))
    : false
  adaptedQuery.filters
    ? (adaptedQuery.filters = JSON.parse(adaptedQuery.filters))
    : false

  const initialState = {
    ...DEFAULT_STATE,
    ...{
      filters: [
        {
          Key: 'brandNoAnlz',
          Value: brandDetails?.name,
          IsSelected: true,
        },
      ],
    },
  }

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

  const router = useRouter()
  const [state, dispatch] = useReducer(reducer, initialState)
  const [manufacturerStateVideoName, setManufacturerStateVideoName] =
    useState('')
  const [manufacturerStateVideoHeading, setManufacturerStateVideoHeading] =
    useState('')
  const [
    manufacturerSettingTypeImgBanner,
    setManufacturerSettingTypeImgBanner,
  ] = useState(IMG_PLACEHOLDER)
  const [manufImgBannerLink, setManufImgBannerLink] = useState('')
  const [manufacturerImgBannerHeading, setManufacturerImgBannerHeading] =
    useState('')
  const [
    manufacturerStateMultiBrandVidNames,
    setManufacturerStateMultiBrandVidNames,
  ] = useState('')
  const [multiBrandVidHeading, setMultiBrandVidHeading] = useState('')
  const [manufacturerStateTextName, setManufacturerStateTextName] = useState('')
  const [manufacturerStateTextHeading, setManufacturerStateTextHeading] =
    useState('')
  const [textNames, setTextNames] = useState([])
  const [recommendedProducts, setRecommendedProducts] = useState([])
  const [showLandingPage, setShowLandingPage] = useState(true)
  const {
    data = {
      products: {
        results: [],
        sortList: [],
        pages: 0,
        total: 0,
        currentPage: 1,
        filters: [],
      },
    },
    error,
  } = useSwr(
    ['/api/catalog/products', { ...state, ...{ slug: slug } }],
    ([url, body]: any) => postData(url, body),
    {
      revalidateOnFocus: false,
    }
  )

  SwiperCore.use([Navigation])
  const swiperRef: any = useRef(null)

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

  const handleClick = () => {
    setShowLandingPage(false)
    window.scrollTo(0, 0)
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
      data.products.pages &&
      data.products.currentPage < data.products.pages
    ) {
      dispatch({ type: PAGE, payload: data.products.currentPage + 1 })
    }
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
      ignoreDisplayInSerach: false,
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
  })

  useEffect(() => {
    const Widgets = JSON.parse(brandDetails.widgetsConfig || '[]')
    Widgets.map((val: any) => {
      if (val.manufacturerSettingType == 'Video' && val.code == 'BrandVideo') {
        setManufacturerStateVideoHeading(val.heading)
        setManufacturerStateVideoName(val.name)
      } else if (
        val.manufacturerSettingType == 'ImageBanner' &&
        val.code == 'MidBannerKitBuilder'
      ) {
        setManufacturerSettingTypeImgBanner(val.name)
        setManufacturerImgBannerHeading(val.heading)
        setManufImgBannerLink(val.buttonLink)
      } else if (
        val.manufacturerSettingType == 'Video' &&
        val.code === 'MultipleBrandVideos'
      ) {
        setManufacturerStateMultiBrandVidNames(val.name)
        setMultiBrandVidHeading(val.heading)
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
      }
      return
    })
  }, [])

  const productDataToPass = productListMemory.products
  /*const productDataToPass = IS_INFINITE_SCROLL
    ? productListMemory.products
    : data.products*/

  useEffect(() => {
    setRecommendedProducts(productDataToPass.results.slice(0, 8))
  }, [productDataToPass])

  // IMPLEMENT HANDLING FOR NULL OBJECT
  if (brandDetails === null) {
    return (
      <div className="container relative py-10 mx-auto text-center top-20">
        <h4 className="pb-6 text-3xl font-medium text-gray-400">
          This is a bad url. please go back to
          <Link href="/brands">
            <span className="px-3 text-indigo-500">All brands</span>
          </Link>
        </h4>
      </div>
    )
  }
  let absPath = ''
  if (typeof window !== 'undefined') {
    absPath = window?.location?.href
  }

  return (
    <>
      <NextHead>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
        <link rel="canonical" id="canonical" href={absPath} />
        <title>{brandDetails?.name || 'Brands'}</title>
        <meta name="title" content={brandDetails?.name || 'Brands'} />
        <meta name="description" content={brandDetails?.metaDescription} />
        <meta name="keywords" content={brandDetails?.metaKeywords} />
        <meta property="og:image" content="" />
        <meta property="og:title" content={brandDetails?.name} key="ogtitle" />
        <meta
          property="og:description"
          content={brandDetails?.metaDescription}
          key="ogdesc"
        />
      </NextHead>
      {brandDetails?.showLandingPage && showLandingPage ? (
        <>
          <div className="w-full px-4 pb-20 mx-auto bg-white md:w-4/5 lg:px-0 sm:px-10">
            <div className="grid grid-cols-1 gap-5 mt-20 md:grid-cols-2">
              <div className="flex flex-col items-center bg-[#FEBD18] min-h-full md:min-h-[85vh] lg:min-h-[55vh] justify-evenly pt-2">
                <Image
                  alt="Brand Logo"
                  src={
                    brandDetails.images.length !== 0
                      ? brandDetails.images[0]
                      : '/dummyLogo.svg'
                  }
                  width={212}
                  height={200}
                />
                <div
                  dangerouslySetInnerHTML={{
                    __html: brandDetails?.description,
                  }}
                  className="text-[18px] text-center leading-6 py-5"
                />
                <button
                  className="px-6 py-3 font-semibold text-white uppercase bg-black rounded-md hover:opacity-80"
                  onClick={handleClick}
                >
                  {SHOP_NOW}
                </button>
              </div>
              <ImageCollection
                range={2}
                ImageArray={imageBannerCollectionResponse?.images || []}
                showTitle={true}
              />
            </div>

            <div className="mt-10">
              <Video
                heading={manufacturerStateVideoHeading}
                name={manufacturerStateVideoName}
              />
            </div>

            <div className="mt-10">
              <Slider images={imageCategoryCollectionResponse || []} />
            </div>

            <div className="mt-10">
              <div className="flex flex-col gap-4">
                <div className="flex flex-row justify-between">
                  <p className="font-semibold uppercase cursor-default font-lg">
                    {BTN_RECOMMENDED_PROD}
                  </p>
                  <button
                    className="font-semibold uppercase cursor-pointer font-lg hover:underline"
                    onClick={handleClick}
                  >
                    {BTN_SEE_ALL}
                  </button>
                </div>

                <RecommendedProductCollection
                  recommendedProducts={recommendedProducts}
                  deviceInfo={deviceInfo}
                  config={config}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 my-10 md:grid-cols-2">
              {offerBannerResult?.map((val: any, Idx: number) => (
                <OfferCard
                  key={Idx}
                  index={Idx}
                  title={val.title}
                  description={val.description}
                  src={val.url}
                  link={val.link}
                />
              ))}
            </div>
          </div>

          <div className="w-full mt-10">
            <ImageBanner
              manufacturerSettingTypeImgBanner={
                manufacturerSettingTypeImgBanner
              }
              heading={manufacturerImgBannerHeading}
              link={manufImgBannerLink}
            />
            <div className="mt-10">
              <MultiBrandVideo
                heading={multiBrandVidHeading || ''}
                name={manufacturerStateMultiBrandVidNames || ''}
              />
            </div>
          </div>

          <div className="w-full px-4 pb-20 mx-auto md:w-4/5 lg:px-0 sm:px-10">
            <div className="flex justify-between pb-10 mt-4">
              <p className="font-semibold uppercase cursor-default font-lg">
                {FEATURES_HEADING}
                {` `}
                {brandDetails.name}
              </p>
              <button
                className="hidden font-semibold uppercase cursor-pointer font-lg md:block hover:underline"
                onClick={handleClick}
              >
                {BTN_SEE_ALL}
              </button>
            </div>
            <div className="mb-10">
              <ImageCollection
                range={4}
                ImageArray={imageCollectionResponse?.images || []}
                showTitle={false}
              />
            </div>
            <PlainText
              textNames={textNames}
              heading={manufacturerStateTextHeading}
            />

            <div className="flex justify-between py-10">
              <p className="font-semibold uppercase cursor-default font-lg">
                {BTN_RECOMMENDED_PROD}
              </p>
              <button
                className="font-semibold uppercase cursor-pointer font-lg hover:underline"
                onClick={handleClick}
              >
                {BTN_SEE_ALL}
              </button>
            </div>
            <ImageCollection
              range={4}
              ImageArray={imageCollectionResponse?.images || []}
              showTitle={false}
            />

            <div className="mb-20">
              <p className="font-semibold my-10 uppercase cursor-default font-lg">
                {faq.title}
              </p>
              {faq?.results?.map((val: any, Idx: number) => {
                return (
                  <Disclosure key={Idx} heading={val.faq} details={val.ans} />
                )
              })}
            </div>
          </div>
        </>
      ) : (
        <div className="pb-0 mx-auto mt-4 bg-transparent md:w-4/5 sm:mt-6">
          <div className="px-3 py-3 text-left sm:py-1 sm:px-0">
            <Link href="/brands" passHref>
              <span className="flex items-end upper case">Brands</span>
            </Link>
            <div className="">
              <h1 className="inline-block text-black">{brandDetails?.name}</h1>
              <span className="inline-block ml-2 text-sm font-semibold text-black">
                Showing {data?.products?.total} {RESULTS}
              </span>
            </div>
            <div
              dangerouslySetInnerHTML={{ __html: brandDetails?.description }}
              className="mt-2 text-black sm:mt-5"
            />
          </div>
          <div className="flex justify-end w-full">
            <ProductSort
              routerSortOption={state.sortBy}
              products={data.products}
              action={handleSortBy}
            />
          </div>
          <ProductGrid
            products={productDataToPass}
            currentPage={state.currentPage}
            handlePageChange={handlePageChange}
            handleInfiniteScroll={handleInfiniteScroll}
            deviceInfo={deviceInfo}
            maxBasketItemsCount={maxBasketItemsCount(config)}
          />
        </div>
      )}
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const slug = `brands/${context.query.brand[0]}`
  const response = await getBrandBySlug(slug, context.req.cookies)
  const infraPromise = commerce.getInfra()
  const infra = await infraPromise

  const obj: any = {
    imageBannerCollectionResponse: [],
    imageCategoryCollectionResponse: [],
    imageCollectionResponse: [],
    offerBannerResult: [],
  }

  const widgets: any = tryParseJson(response?.result?.widgetsConfig)

  if (widgets) {
    for (var i = 0; i < widgets?.length; i++) {
      if (
        widgets[i].manufacturerSettingType == 'ImageCollection' &&
        widgets[i].code == 'ImageBanner'
      ) {
        obj.imageBannerCollectionResponse = await getCollectionById(
          widgets[i].recordId
        )
      } else if (
        widgets[i].manufacturerSettingType == 'ImageCollection' &&
        widgets[i].code == 'MultipleImagesBanner'
      ) {
        const res = await getCollectionById(widgets[i].recordId)
        obj.imageCategoryCollectionResponse = res?.images
      } else if (
        widgets[i].manufacturerSettingType == 'ImageCollection' &&
        widgets[i].code == 'FeaturedDewaltImageList'
      ) {
        obj.imageCollectionResponse = await getCollectionById(
          widgets[i].recordId
        )
      } else if (
        widgets[i].manufacturerSettingType == 'ImageCollection' &&
        widgets[i].code == 'FFXOffers'
      ) {
        const res = await getCollectionById(widgets[i].recordId)
        obj.offerBannerResult = res.images
      }
    }
  }

  return {
    props: {
      query: context.query,
      params: context.params,
      slug: slug,
      brandDetails: response.result,
      globalSnippets: infra?.snippets ?? [],
      snippets: response?.snippets ?? [],
      collections: obj ?? [],
    }, // will be passed to the page component as props
  }
}

const PAGE_TYPE = PAGE_TYPES['Brand']

export default withDataLayer(BrandDetailPage, PAGE_TYPE)
