import React, { useState } from 'react'
import AppSearchAPIConnector from '@elastic/search-ui-app-search-connector'
import {
  ErrorBoundary,
  Facet,
  Results,
  PagingInfo,
  ResultsPerPage,
  Paging,
  Sorting,
  withSearch,
} from '@elastic/react-search-ui'
import { Layout } from '@elastic/react-search-ui-views'
import '@elastic/react-search-ui-views/lib/styles/styles.css'
import Image from 'next/image'
import { NoSymbolIcon, XMarkIcon } from '@heroicons/react/24/outline'
import {
  buildAutocompleteQueryConfig,
  buildFacetConfigFromConfig,
  buildSearchOptionsFromConfig,
  buildSortOptionsFromConfig,
  getConfig,
  getFacetFields,
} from '@components/config/config-helper'
import {
  cartItemsValidateAddToCart,
  getElasticSearchPriceColumn,
  vatIncluded,
} from '@framework/utils/app-util'
import ElasticSearchSuggestions from './ElasticSearchSuggestions'
import { CloudIcon } from '@heroicons/react/20/solid'
import Link from 'next/link'
import cn from 'classnames'
const SimpleButton = dynamic(() => import('@components/ui/Button'))
const Button = dynamic(() => import('@components/ui/IndigoButton'))
import { MAX_ADD_TO_CART_LIMIT, Messages } from '@components/utils/constants'
import {
  BTN_NOTIFY_ME,
  BTN_PRE_ORDER,
  GENERAL_ADD_TO_BASKET,
  GENERAL_INCLUDE_OUT_OF_STOCK_PRODUCT,
  QUICK_VIEW,
} from '@components/utils/textVariables'
import dynamic from 'next/dynamic'
import cartHandler from '@components/services/cart'
import { useUI } from '@components/ui'
import PLPQuickView from '@components/product/QuickView/PLPQuickView'
import SearchQuickView from '@components/product/QuickView/SearchQuickView'
import {
  deliveryDateFormat,
  matchStrings,
  priceFormat,
} from '@framework/utils/parse-util'
import { Switch } from '@headlessui/react'

let connector: any
if (process.env.ELASTIC_ENGINE_NAME) {
  const { hostIdentifier, searchKey, endpointBase, engineName } = getConfig()
  connector = new AppSearchAPIConnector({
    searchKey,
    engineName,
    hostIdentifier,
    endpointBase,
  })
}
const config = {
  searchQuery: {
    facets: buildFacetConfigFromConfig(),
    ...buildSearchOptionsFromConfig(),
  },
  autocompleteQuery: buildAutocompleteQueryConfig(),
  apiConnector: connector,
  alwaysSearchOnInitialLoad: true,
}
const isIncludeVAT = vatIncluded()
const CustomResultsView = ({ children }: any) => {
  return (
    <div className="relative ">
      {children.length > 0 ? (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">{children}</ul>
      ) : (
        <div className="flex items-center justify-center w-full py-6 mt-3 text-lg font-medium text-center text-black bg-gray-100">
          <div className="flex items-center gap-2">
            <NoSymbolIcon className="mx-auto text-gray-200 w-7 h-7" />
            No Product Found
          </div>
        </div>
      )}
    </div>
  )
}

const CustomResultView = (
  { result }: any,
  includeOutOfStockProduct: boolean,
  maxBasketItemsCount: any
) => {
  const {
    deviceInfo,
    basketId,
    user,
    addToWishlist,
    openWishlist,
    setCartItems,
    openNotifyUser,
    cartItems,
    wishListItems,
    isGuestUser,
    openLoginSideBar,
    setAlert,
    isCompared,
    compareProductList,
    setCompareProducts,
  } = useUI()

  const { isMobile } = deviceInfo
  const [quantity, setQuantity] = useState(1)
  const [quickViewData, setQuickViewData] = useState(null)
  const EtaDate = new Date()
  EtaDate.setDate(EtaDate.getDate() + 3)
  const handleQuickViewData = (data: any) => {
    setQuickViewData(data)
  }

  const handleCloseQuickView = () => {
    setQuickViewData(null)
  }
  const buttonTitle = () => {
    let buttonConfig: any = {
      title: GENERAL_ADD_TO_BASKET,
      validateAction: async () => {
        const cartLineItem: any = cartItems?.lineItems?.find((o: any) => {
          if (matchStrings(o.productId, result?.recordId, true) || matchStrings(o.productId, result?.productId, true)) {
            return o
          }
        })
        if (result?.currentStock === cartLineItem?.qty && !result?.fulfilFromSupplier && !result?.flags?.sellWithoutInventory) {
          setAlert({
            type: 'error',
            msg: Messages.Errors['CART_ITEM_QTY_MAX_ADDED'],
          })
          return false
        }
        const isValid = cartItemsValidateAddToCart(
          cartItems,
          maxBasketItemsCount
        )
        if (!isValid) {
          setAlert({
            type: 'error',
            msg: Messages.Errors['CART_ITEM_QTY_LIMIT_EXCEEDED'],
          })
          return false
        }
        return isValid
      },
      action: async () => {
        const item = await cartHandler()?.addToCart(
          {
            basketId,
            productId: result?.objectid?.raw,
            qty: quantity,
            manualUnitPrice:
              result?.[getElasticSearchPriceColumn(isIncludeVAT)]?.raw,
            stockCode: result?.stockCode?.raw,
            userId: user?.userId,
            isAssociated: user?.isAssociated,
          },
          'ADD',
          { result }
        )
        setCartItems(item)
      },
      shortMessage: '',
    }
    if (result?.webstock?.raw <= 0 && result?.itemvisibleonwebsite?.raw) {
      buttonConfig.title = BTN_NOTIFY_ME
      buttonConfig.isNotifyMeEnabled = true
      buttonConfig.action = async () => handleNotification()
      buttonConfig.buttonType = 'button'
    } else if (!result?.currentStock && result?.preOrder?.isEnabled) {
      buttonConfig.title = BTN_PRE_ORDER
      buttonConfig.isPreOrderEnabled = true
      buttonConfig.buttonType = 'button'
      buttonConfig.shortMessage = result?.preOrder?.shortMessage
    }
    return buttonConfig
  }
  const handleNotification = () => {
    openNotifyUser(result?.id?.raw)
  }
  const buttonConfig = buttonTitle()
  return (
    <>
      {(!includeOutOfStockProduct
        ? matchStrings(result?.availability?.raw, 'In stock', true)
        : true) && (
        <li className="relative grid grid-cols-12 p-4 mb-0 bg-white border border-gray-200 rounded-md sm:grid-cols-1 hover:border-orange-500 group-hover:border-gray-700 snap-start hover:text-blue-600 group">
          <div className="col-span-4 sm:col-span-12">
            <Link
              href={`/${result?.weburl?.raw}` || '#'}
              passHref
              legacyBehavior
            >
              <a>
                <div className="p-2 mb-4">
                  <img
                    src={result?.imageurl?.raw}
                    alt={result?.title?.raw || 'search-result'}
                    className="object-contain mx-auto sm:w-48 sm:h-48"
                  />
                </div>
              </a>
            </Link>
          </div>
          <div className="col-span-8 sm:col-span-12">
            <h5 className="mb-2 font-semibold text-black capitalize font-18">
              {priceFormat(
                result?.[getElasticSearchPriceColumn(isIncludeVAT)]?.raw
              )}
              <span className="pl-2 font-normal text-gray-400 line-through font-18">
                {isIncludeVAT
                  ? priceFormat(result?.rrp_uk?.raw)
                  : priceFormat(result?.rrp_uk?.raw)}
              </span>
            </h5>
            <Link
              href={`/${result?.weburl?.raw}` || '#'}
              passHref
              legacyBehavior
            >
              <a className="flex justify-between w-full px-0 mt-2 mb-1 font-semibold text-left text-black capitalize font-18 product-name hover:text-gray-950 min-prod-name-height light-font-weight prod-name-block">
                {result?.title?.raw}
              </a>
            </Link>
            {isMobile ? null : (
              <>
                <div className="flex items-center justify-between w-full px-0 py-2 mt-3 text-sm font-semibold text-left text-black border-t border-gray-200 h-9 product-name hover:text-gray-950">
                  <span>Get it by {deliveryDateFormat(EtaDate)}</span>
                </div>
                <div
                  className={cn(
                    'absolute flex flex-col button-position-absolute opacity-0 group-hover:opacity-100 gap-1 pr-0 mx-auto py-2 group-hover:flex bottom-0 duration-300 bg-transparent rounded-md'
                  )}
                >
                  <SimpleButton
                    variant="slim"
                    className="!p-1 flex-1 !bg-transparent btn-c btn-secondary font-14 uppercase"
                    onClick={() => handleQuickViewData(result)}
                  >
                    <span className="uppercase">{QUICK_VIEW}</span>
                  </SimpleButton>
                  <div className="grid items-center w-full grid-cols-12 gap-1 justify-stretch">
                    <div className="col-span-3">
                      <button
                        className="w-full rounded "
                        onClick={(e: any) => {
                          setQuantity(e.target.value)
                        }}
                      >
                        <select className="h-full py-3 px-2 w-full border-[1px] border-black rounded dark:bg-white dark:text-black">
                          {Array.from(Array(MAX_ADD_TO_CART_LIMIT).keys())
                            .map((x) => ({ id: x + 1, value: x + 1 }))
                            .map((quant: any) => (
                              <option value={quant.value} key={quant.id}>
                                {quant.value}
                              </option>
                            ))}
                        </select>
                      </button>
                    </div>
                    <div className="col-span-9">
                      <Button
                        title={buttonConfig.title}
                        action={buttonConfig.action}
                        validateAction={buttonConfig.validateAction}
                        type="button"
                        buttonType={buttonConfig.buttonType || 'cart'}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="col-span-12">
            {isMobile ? (
              <>
                <div className="w-full h-10 col-span-8 px-0 py-2 mb-3 text-sm font-semibold text-left text-black border-t border-b border-gray-200 product-name hover:text-gray-950">
                  <span>Get it by {deliveryDateFormat(EtaDate)}</span>
                </div>

                <div className="col-span-12">
                  <div className="grid grid-cols-2 gap-1 sm:mb-4 justify-evenly">
                    <Button
                      title={buttonConfig.title}
                      action={buttonConfig.action}
                      validateAction={buttonConfig.validateAction}
                      type="button"
                      buttonType={buttonConfig.buttonType || 'cart'}
                    />
                    <button
                      type="button"
                      onClick={() => handleQuickViewData(result)}
                      className="w-full text-primary btn-default text-white uppercase rounded dark:text-primary font-semibold text-[14px] sm:text-sm p-1.5 outline-none"
                    >
                      {QUICK_VIEW}
                    </button>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </li>
      )}
      <SearchQuickView
        isQuickview={Boolean(quickViewData)}
        setQuickview={() => {}}
        productData={quickViewData}
        isQuickviewOpen={Boolean(quickViewData)}
        setQuickviewOpen={handleCloseQuickView}
        deviceInfo={deviceInfo}
        maxBasketItemsCount={maxBasketItemsCount}
      />
    </>
  )
}

function ElasticSearchResult({
  closeWrapper,
  wasSearched,
  setSearchTerm,
  clearFilters,
  maxBasketItemsCount,
}: any) {
  const [includeOutOfStockProduct, setIncludeOutOfStockProduct] =
    useState(false)
  return (
    <div className="absolute z-10 w-screen h-auto border-b border-gray-300 shadow min-h-screen bg-white top-[63px] sm:top-[74px] search-wrapper">
      <div className="flex flex-col items-center justify-center w-full px-0 pb-5 mt-0 sm:mt-0 sm:px-0">
        <div className="App">
          <ErrorBoundary>
            <Layout
              sideContent={
                <div>
                  <div className="flex-col hidden sm:flex">
                    <ElasticSearchSuggestions />
                  </div>
                  {getFacetFields().map((field: any) => (
                    <Facet key={field} field={field} label={field} />
                  ))}
                </div>
              }
              bodyContent={
                <>
                  {wasSearched && (
                    <Results
                      titleField={getConfig().titleField}
                      urlField={getConfig().urlField}
                      thumbnailField={getConfig().titleField}
                      shouldTrackClickThrough={true}
                      view={CustomResultsView}
                      resultView={(result: any) => {
                        return CustomResultView(
                          result,
                          includeOutOfStockProduct,
                          maxBasketItemsCount
                        )
                      }}
                    />
                  )}
                </>
              }
              bodyHeader={
                <React.Fragment>
                  <div className="grid items-center w-full grid-cols-12 sm:gap-4 sm:grid-cols-12">
                    <div className="col-span-4 mb-2 sm:col-span-6">
                      {wasSearched && (
                        <>
                          <h3 className="font-semibold text-black uppercase font-18 sm:mb-0">
                            Product Suggestions
                          </h3>
                          <PagingInfo />
                        </>
                      )}
                    </div>
                    <div className="justify-end col-span-8 sm:col-span-6">
                      <div className="sm:flex sm:justify-end">
                        {/* show on desktop */}
                        <div className="items-center justify-end flex-1 hidden mx-auto mt-2 mr-4 md:flex">
                          <div className="flex flex-col py-0 pr-2 text-xs font-normal font-14 whitespace-nowrap">
                            {GENERAL_INCLUDE_OUT_OF_STOCK_PRODUCT}
                          </div>
                          <Switch
                            checked={includeOutOfStockProduct}
                            onChange={() => {
                              setIncludeOutOfStockProduct(
                                !includeOutOfStockProduct
                              )
                            }}
                            className={`${
                              includeOutOfStockProduct
                                ? 'bg-black'
                                : 'bg-gray-300'
                            } relative inline-flex h-[18px] w-[35px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                          >
                            <span
                              aria-hidden="true"
                              className={`${
                                includeOutOfStockProduct
                                  ? 'translate-x-4'
                                  : 'translate-x-0'
                              } pointer-events-none inline-block h-[15px] w-[15px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                            />
                          </Switch>
                        </div>{' '}
                        {wasSearched && (
                          <div>
                            <Sorting
                              sortOptions={buildSortOptionsFromConfig()}
                              className="cursor-pointer"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    {/* show on mobile */}
                    <div className="block col-span-12 md:hidden">
                      <div className="flex items-center justify-end flex-1 mx-auto mt-2 ">
                        <div className="flex flex-col py-0 pr-2 text-xs font-normal font-14 whitespace-nowrap">
                          {GENERAL_INCLUDE_OUT_OF_STOCK_PRODUCT}
                        </div>
                        <Switch
                          checked={includeOutOfStockProduct}
                          onChange={() => {
                            setIncludeOutOfStockProduct(
                              !includeOutOfStockProduct
                            )
                          }}
                          className={`${
                            includeOutOfStockProduct
                              ? 'bg-black'
                              : 'bg-gray-300'
                          } relative inline-flex h-[18px] w-[35px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                        >
                          <span
                            aria-hidden="true"
                            className={`${
                              includeOutOfStockProduct
                                ? 'translate-x-4'
                                : 'translate-x-0'
                            } pointer-events-none inline-block h-[15px] w-[15px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                          />
                        </Switch>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              }
              bodyFooter={<Paging />}
            />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  )
}

export default withSearch(({ wasSearched, setSearchTerm, clearFilters }) => ({
  wasSearched,
  setSearchTerm,
  clearFilters,
}))(ElasticSearchResult)
