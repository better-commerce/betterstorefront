import { useTranslation } from "@commerce/utils/use-translation"
import Loader from "@components/Loader"
import OutOfStockFilter from "@components/Product/Filters/OutOfStockFilter"
import { CURRENT_THEME, EngageEventTypes } from "@components/utils/constants"
import { ChevronRightIcon } from "@heroicons/react/24/outline"
import dynamic from "next/dynamic"
import Link from "next/link"
const ProductMobileFilters = dynamic(() => import('@components/Product/Filters'))
const ProductFilterRight = dynamic(() => import('@components/Product/Filters/filtersRight'))
const ProductFiltersTopBar = dynamic(() => import('@components/Product/Filters/FilterTopBar'))
const ProductGridWithFacet = dynamic(() => import('@components/Product/Grid'))
const CompareSelectionBar = dynamic(() => import('@components/Product/ProductCompare/compareSelectionBar'))
const ProductGrid = dynamic(() => import('@components/Product/Grid/ProductGrid'))
const ProductSort = dynamic(() => import('@components/Product/ProductSort'))
import FilterHorizontal from '@components/Product/Filters/filterHorizontal'
import BrandBanner from '@components/brand/BrandBanner'
import EngageProductCard from '@components/SectionEngagePanels/ProductCard'
import RecentlyViewedProduct from '@components/Product/RelatedProducts/RecentlyViewedProducts'

export default function StandardBrandListData({ featureToggle, brandDetails, sanitizedDescription, excludeOOSProduct, onEnableOutOfStockItems, isProductCompare, showCompareProducts, isValidating, clearAll, config, productDataToPass, handlePageChange, handleInfiniteScroll, deviceInfo, maxBasketItemsCount, handleFilters, data, state, handleSortBy, isCompared, campaignData, removeFilter, defaultDisplayMembership, closeCompareProducts, hideListHeader }: any) {
  const translate = useTranslation()
  const { isMobile } = deviceInfo
  return (
    <>
      <div className={`${featureToggle.features?.enableForPCSite ? ' pt-0 pb-0 mx-auto mt-0 bg-transparent sm:mt-0' : ' pt-2 pb-0 mx-auto mt-2 bg-transparent sm:mt-2'} ${hideListHeader ? '' : 'container'} fixing-main-section`}>
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
                          {!hideListHeader && <div className='flex flex-col w-full gap-4 sm:col-span-12'>
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
                          </div>}
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
        <div className='flex flex-col w-full col-span-12'>
          <EngageProductCard type={EngageEventTypes.TRENDING_FIRST_ORDER} campaignData={campaignData} isSlider={true} productPerRow={4} productLimit={12} />
          <EngageProductCard type={EngageEventTypes.INTEREST_USER_ITEMS} campaignData={campaignData} isSlider={true} productPerRow={4} productLimit={12} />
          <EngageProductCard type={EngageEventTypes.TRENDING_COLLECTION} campaignData={campaignData} isSlider={true} productPerRow={4} productLimit={12} />
          <EngageProductCard type={EngageEventTypes.COUPON_COLLECTION} campaignData={campaignData} isSlider={true} productPerRow={4} productLimit={12} />
          <EngageProductCard type={EngageEventTypes.SEARCH} campaignData={campaignData} isSlider={true} productPerRow={4} productLimit={12} />
          <EngageProductCard type={EngageEventTypes.RECENTLY_VIEWED} campaignData={campaignData} isSlider={true} productPerRow={4} productLimit={12} />
        </div>
      </div>
    </>
  )
}