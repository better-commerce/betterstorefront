import { useCallback, useEffect, useState } from 'react'
import type { GetServerSideProps } from 'next'
import sortBy from 'lodash/sortBy'
import NextHead from 'next/head'
import cn from 'classnames'
import cookie from 'cookie'
import axios from 'axios'

//
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import { Layout } from '@components/common'
import {
  categoryByBrandPlatform,
  kitBrandPlatform,
  productByBrandPlatform,
} from '@framework/api/endpoints/kitbuilder'
import BrandProduct from '@components/kit/BrandProduct'
import BrandCategory from '@components/kit/BrandCategory'
import { Switch } from '@headlessui/react'
import { useRouter } from 'next/router'
import { BETTERCOMMERCE_DEFAULT_CURRENCY, EmptyGuid, EmptyString, NEXT_BULK_ADD_TO_CART, SITE_NAME, SITE_ORIGIN_URL } from '@components/utils/constants'
import { matchStrings, stringToBoolean, tryParseJson } from '@framework/utils/parse-util'
import KitCartSidebar from '@components/cart/KitCartSidebar'
import { useUI } from '@components/ui'
import { BASKET_TYPES, Cookie } from '@framework/utils/constants'
import useAnalytics from '@components/services/analytics/useAnalytics'
import { EVENTS_MAP } from '@components/services/analytics/constants'
import { decrypt } from '@framework/utils/cipher'
import useCart from '@components/services/cart'
import Cookies from 'js-cookie'
import { removeQueryString } from '@commerce/utils/uri-util'
import { IPagePropsProvider } from '@framework/contracts/page-props/IPagePropsProvider'
import { PagePropType, getPagePropType } from '@framework/page-props'
import { GENERAL_ITEMS_NOT_AVAILABLE } from '@components/utils/textVariables'

function KitBrandPage({
  relatedBrand,
  relatedPlatform,
  products,
  categories,
  categoryFilters,
  deviceInfo,
  config,
  appConfig,
}: any) {
  const router: any = useRouter()
  const { basketId, setKitBasket, setKitBasketId, setOverlayLoaderState, hideOverlayLoaderState, openActiveKitAlert } = useUI()
  const [brandInfo, setBrandInfo] = useState<any>({})
  const [selectedCatId, setSelectedCatId] = useState('')
  const [enabledOutOfStockItems, setEnabledOutOfStockItems] = useState(false)
  const cleanPath = removeQueryString(router.asPath)
  const [catFilters, setCatFilters] = useState({
    allFilters: [],
    selectedFilters: [],
  })
  const [cartLineItems, setCartLineItems] = useState<any>(null)
  const [currency, setCurrency] = useState<any>(null)
  const { getCart } = useCart()

  const getKitBasket = useCallback(async (id: string) => {
    setOverlayLoaderState({ visible: true, message: 'Loading...' })
    const basketRes = await getCart({ basketId: id })
    setKitBasket(basketRes)
    setKitBasketId(id)
    if (!basketRes || basketRes?.id === EmptyGuid) {
      createKitBasket()
    } else {
      hideOverlayLoaderState()
    }
    return basketRes
  }, [])

  useEffect(() => {
    if (router.query?.basketItemGroupId) {
      getKitBasket(router.query?.basketItemGroupId)
    } else if (Cookies.get(Cookie.Key.KIT_BASKET_ID)) {
      openActiveKitAlert()
    }
  }, [router.query])

  const createKitBasket = async () => {
    const kitBasketId = router.query?.basketItemGroupId
    try {
      const basketRes = await getCart({ basketId })
      const bulkUpdatePayload: any = {
        basketId: kitBasketId,
        basketName: BASKET_TYPES.KIT,
        products: [],
      }
      basketRes?.lineItems?.filter((item: any) => matchStrings(item?.basketItemGroupId, kitBasketId, true))?.forEach((item: any) => {
        bulkUpdatePayload.products.push({
          productId: item?.productId,
          name: item?.name,
          stockCode: item?.stockCode,
          manualUnitPrice: item?.price?.raw?.withoutTax,
          qty: item?.qty,
          displayOrder: item?.displayOrder,
          basketItemGroupId: item?.basketItemGroupId,
          basketItemGroupData: item?.basketItemGroupData,
        })
      })
      const { data: basketRes2 }: any = await axios.post(NEXT_BULK_ADD_TO_CART, {
        data: bulkUpdatePayload,
      })
      
      setKitBasket(basketRes2)
      setKitBasketId(kitBasketId)
      hideOverlayLoaderState()
    } catch (error) {
      // console.log(error)
    }
  }

  const handleSelectCatId = (catId: string) => {
    setSelectedCatId(catId)
  }

  useEffect(() => {
    // save all category filters
    setCatFilters((v) => ({
      ...v,
      allFilters: categoryFilters,
    }))
  }, [])

  useEffect(() => {
    if (!appConfig) return
    appConfig = tryParseJson(decrypt(appConfig))
    if (appConfig?.currencies?.length) {
      setCurrency(
        appConfig?.currencies?.find((currency: any) => {
          return currency?.currencyCode === BETTERCOMMERCE_DEFAULT_CURRENCY
        })
      )
    }
  }, [appConfig])

  useEffect(() => {
    setBrandInfo((v: any) => ({
      ...v,
      brandName: relatedBrand?.brandName,
      platformName: relatedPlatform?.name,
      brandImgUrl: relatedBrand?.logoImageName,
      brandId: relatedBrand?.id,
      platformId: relatedPlatform?.id,
    }))
    setEnabledOutOfStockItems(
      stringToBoolean(router.query?.includeOutOfStockItems)
    )
  }, [router.query])

  const handleEnableOutOfStockItems = (val: boolean) => {
    setEnabledOutOfStockItems(val)
    let url = new URL(window.location.origin + router.asPath)
    url.searchParams.set('includeOutOfStockItems', val + '')
    const replacePath = url.pathname + url.search
    // 'replace' method refreshes the server-side props
    router.replace(replacePath, undefined, {
      scroll: false,
    })
  }

  const handleChangeFilters = (filterVal: string) => {
    let selectedFilters: any = catFilters?.selectedFilters
    if (filterVal === 'All') {
      // empty all selected filters
      selectedFilters = []
    } else if (selectedFilters.includes(filterVal)) {
      // remove the selected filter from all
      selectedFilters = selectedFilters.filter(
        (value: string) => value !== filterVal
      )
    } else {
      // add new filter into all
      selectedFilters.push(filterVal)
    }
    // update filters state
    setCatFilters((v: any) => ({
      ...v,
      selectedFilters: selectedFilters,
    }))
    let url = new URL(window.location.origin + router.asPath)
    url.searchParams.set('productApplication', selectedFilters)
    const replacePath = url.pathname + url.search
    // 'replace' method refreshes the server-side props
    router.replace(replacePath, undefined, {
      scroll: false,
    })
    setSelectedCatId('')
  }

  let absPath = ''
  if (typeof window !== 'undefined') {
    absPath = window?.location?.href
  }
  
  return (
    <>
      <NextHead>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="canonical" id="canonical" href={SITE_ORIGIN_URL + cleanPath} />
        <title>BetterTools Cordless Power Tool Kit Builder</title>
        <meta name="title" content="BetterTools Cordless Power Tool Kit Builder" />
        <meta name="description" content="Discover your power tool kit builder featuring top brands like Dewalt, Makita, Milwaukee, Festool, Bosch, Metabo, Hikoki, Trend, and Draper. Create your customised toolkit with ease, ensuring you have the perfect tools for any project. Simplify your toolbox selection process and elevate your craftsmanship today." />
        <meta name="keywords" content="power tool kit builder, Dewalt, Makita, Milwaukee, Festool, Bosch, Metabo, Hikoki, Trend, Draper, customised toolkit, DIY, professionals, home renovation, top brands, streamline, craftsmanship" />
        <meta property="og:image" content="" />
        <meta property="og:title" content="BetterTools Cordless Power Tool Kit Builder" key="ogtitle" />
        <meta property="og:description" content="Discover your power tool kit builder featuring top brands like Dewalt, Makita, Milwaukee, Festool, Bosch, Metabo, Hikoki, Trend, and Draper. Create your customised toolkit with ease, ensuring you have the perfect tools for any project. Simplify your toolbox selection process and elevate your craftsmanship today." key="ogdesc" />
        <meta property="og:site_name" content={SITE_NAME} key="ogsitename" />
        <meta property="og:url" content={absPath || SITE_ORIGIN_URL + cleanPath} key="ogurl" />
      </NextHead>
      <section className="w-full pt-0 sm:pt-0">
        <div className="flex flex-col w-full py-10 mt-0 sm:py-20 sm:mt-0 bg-teal">
          <h1 className="text-xl font-semibold text-center text-white sm:text-3xl">MY CUSTOM KIT</h1>
          <h2 className="mt-3 font-semibold text-center text-yellow-400 capitalize font-24">
            {' '}
            {brandInfo?.brandName} {brandInfo?.platformName}
          </h2>
          <div className="flex items-center justify-center flex-1 mx-auto mt-4">
            <div className="flex flex-col py-0 pr-2 text-xs font-normal text-white font-14 whitespace-nowrap">
              Include out of stock products
            </div>
            <Switch
              checked={enabledOutOfStockItems}
              onChange={handleEnableOutOfStockItems}
              className={`${enabledOutOfStockItems ? '!bg-emerald-600' : '!bg-gray-400'
                } relative inline-flex h-[18px] w-[35px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
            >
              <span className="sr-only">Compare Items</span>
              <span
                aria-hidden="true"
                className={`${enabledOutOfStockItems ? 'translate-x-4' : 'translate-x-0'
                  } pointer-events-none inline-block h-[15px] w-[15px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
              />
            </Switch>
          </div>
        </div>
        <div className="flex flex-col w-full py-2 mt-0 sm:py-4 sm:mt-0 bg-tan">
          <h4 className="font-semibold text-center text-black font-18">
            START ADDING ITEMS TO BUILD YOUR KIT
          </h4>
        </div>
        {!products?.length && <h4 className="font-semibold text-center text-gray-300 font-32 p-20"> {GENERAL_ITEMS_NOT_AVAILABLE} </h4>}  
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-12">
          <div className="pl-4 pr-4 sm:pr-0 sm:col-span-9 sm:pl-10 mob-col-full">
            <div className="flex flex-col w-full mt-4 sm:mt-6">
              {sortBy(products, 'displayOrder')?.map((product: any) => (
                <BrandProduct key={product.tierId} product={product} brandInfo={brandInfo} cartLineItems={cartLineItems} setCartLineItems={setCartLineItems} />
              ))}
            </div>
            <div className="flex flex-col w-full mt-4 sm:mt-6">
              {catFilters.allFilters?.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    onClick={() => handleChangeFilters('All')}
                    className={cn(
                      'p-[5px_15px] bg-[#F8F8F7] rounded-full cursor-pointer text-xs',
                      {
                        '!bg-[#F58826] !text-white':
                          catFilters?.selectedFilters?.length < 1,
                      }
                    )}
                  >
                    All
                  </span>
                  {catFilters.allFilters?.map((filter: any, idx: number) => (
                    <span
                      key={idx}
                      onClick={() => handleChangeFilters(filter.value)}
                      className={cn(
                        'p-[5px_15px] bg-[#F8F8F7] rounded-full cursor-pointer text-xs',
                        {
                          '!bg-[#F58826] !text-white':
                            catFilters?.selectedFilters?.findIndex(
                              (value: any) => value === filter.value
                            ) > -1,
                        }
                      )}
                    >
                      {filter.key}
                    </span>
                  ))}
                </div>
              )}
              {sortBy(categories, 'displayOrder')?.map((category: any) => (
                <BrandCategory
                  key={category?.tierId}
                  category={category}
                  brandId={relatedBrand?.id}
                  platformId={relatedPlatform?.id}
                  deviceInfo={deviceInfo}
                  selectedCatId={selectedCatId}
                  handleSelectCatId={handleSelectCatId}
                  queryParams={router.query}
                  brandInfo={brandInfo}
                  cartLineItems={cartLineItems}
                  setCartLineItems={setCartLineItems}
                />
              ))}
            </div>
          </div>
          <div className="sm:col-span-3">
            <KitCartSidebar
              deviceInfo={deviceInfo}
              brandInfo={brandInfo}
              config={config}
              currency={currency}
            />
          </div>
        </div>
      </section>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const props: IPagePropsProvider = getPagePropType({ type: PagePropType.COMMON })
  const pageProps = await props.getPageProps({ cookies: context?.req?.cookies })
  try {
    const { ctx }: any = context
    const req: any = ctx?.req
    const {
      brand = null,
      platform = null,
      includeOutOfStockItems = 'false',
      productApplication = '',
      c,
    }: any = context?.query || {}
    const cookies = cookie.parse((context?.req && context?.req?.headers?.cookie) || EmptyString)

    const brandPlatforms = await kitBrandPlatform({ cookies });
    const { platforms, ...relatedBrand } = brandPlatforms?.find((brandItem: any) => {
      if (brand?.length > 0) return matchStrings(brandItem?.brandName, brand[0], true)
    }) || {}
    const relatedPlatform = platforms?.find((platformItem: any) => {
      return matchStrings(platformItem?.name, platform, true)
    }) || {}

    let products = await productByBrandPlatform({
      query: {
        brandId: relatedBrand?.id,
        platformId: relatedPlatform?.id,
        includeOutOfStockItems,
      },
      headers: {
        [Cookie.Key.CURRENCY]: c
      },
      cookies,
    })

    const params = {
      brandId: relatedBrand?.id,
      platformId: relatedPlatform?.id,
      includeOutOfStockItems,
      productApplication,
    }

    let { tierKitCategory: categories, filters } =
      await categoryByBrandPlatform({
        query: params,
        cookies,
      })

    // sort by order
    products = sortBy(products, 'displayOrder')
    categories = sortBy(categories, 'displayOrder')

    return {
      props: {
        ...pageProps,
        relatedBrand,
        relatedPlatform,
        products,
        categories,
        categoryFilters: filters,
      },
    }
  } catch (error) {
    return {
      props: {
        ...pageProps,
        relatedBrand: {},
        relatedPlatform: {},
        products: [],
        categories: [],
        categoryFilters: [],
      },
    }
  }
}

KitBrandPage.Layout = Layout

const PAGE_TYPE = PAGE_TYPES['Brand']

export default withDataLayer(KitBrandPage, PAGE_TYPE)
