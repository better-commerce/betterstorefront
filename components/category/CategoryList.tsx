import dynamic from "next/dynamic";
import Link from "next/link";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "@commerce/utils/use-translation";
import { CURRENT_THEME, EngageEventTypes } from "@components/utils/constants";

const ProductGridWithFacet = dynamic(() => import('@components/Product/Grid'))
const ProductGrid = dynamic(() => import('@components/Product/Grid/ProductGrid'))
const BreadCrumbs = dynamic(() => import('@components/ui/BreadCrumbs'))
const ProductFiltersTopBar = dynamic(() => import('@components/Product/Filters/FilterTopBar'))
const ProductMobileFilters = dynamic(() => import('@components/Product/Filters'))
const ProductFilterRight = dynamic(() => import('@components/Product/Filters/filtersRight'))
const EngageProductCard = dynamic(() => import('@components/SectionEngagePanels/ProductCard'))
const FilterHorizontal = dynamic(() => import('@components/Product/Filters/filterHorizontal'))
const CompareSelectionBar = dynamic(() => import('@components/Product/ProductCompare/compareSelectionBar'))
const BrandFilterTop = dynamic(() => import('@components/Product/Filters/BrandFilterTop'))
const FeaturedBanner = dynamic(() => import('@components/category/FeaturedBanner'))
const FeaturedCategory = dynamic(() => import('@components/category/FeaturedCategory'))
const OutOfStockFilter = dynamic(() => import('@components/Product/Filters/OutOfStockFilter'))
const Loader = dynamic(() => import('@components/Loader'))

export default function CategoryList({ featureToggle, category, handleFilters, productDataToPass, state, data, excludeOOSProduct, handleInfiniteScroll, deviceInfo, maxBasketItemsCount, config, isCompared, defaultDisplayMembership, closeCompareProducts, onEnableOutOfStockItems, isValidating, isMobile, products, handleSortBy, clearAll, removeFilter, isProductCompare, showCompareProducts, handlePageChange, campaignData, shopAll }: any) {
  const translate = useTranslation()
  return (
    <div className="container mx-auto">
      {!featureToggle.features?.enableForPCSite &&
        <>
          <FeaturedBanner category={category} />
          {category?.subCategories?.filter((x: any) => x.isFeatured == true).length > 0 &&
            <FeaturedCategory featuredCategory={category?.subCategories} />
          }
          {category?.featuredBrand?.length > 0 &&
            <BrandFilterTop featuredBrand={category?.featuredBrand} handleFilters={handleFilters} products={productDataToPass} routerFilters={state.filters} />
          }
          {productDataToPass?.results?.length > 0 &&
            <>
              <div className='flex justify-between w-full pb-2 mt-1 mb-2 align-center'>
                <span className="inline-block text-xs font-medium text-slate-900 sm:px-0 dark:text-slate-900 result-count-text">  {productDataToPass?.total} {productDataToPass?.total > 1 ? translate('common.label.itemPluralText') : translate('common.label.itemSingularText')}</span>
                <div className="flex justify-end align-bottom">
                  <OutOfStockFilter excludeOOSProduct={excludeOOSProduct} onEnableOutOfStockItems={onEnableOutOfStockItems} />
                </div>
              </div>
              <hr className='border-slate-200 dark:border-slate-200' />
            </>
          }
        </>
      }
      {isValidating ? (
        <Loader />
      ) : (
        <>
          {productDataToPass?.results?.length > 0 ? (
            <div className="grid grid-cols-1 mx-auto sm:grid-cols-12">
              {!!productDataToPass && (productDataToPass?.filters?.length > 0 ? (
                <>
                  {isMobile ? (
                    <ProductMobileFilters handleFilters={handleFilters} products={products} routerFilters={state.filters} handleSortBy={handleSortBy} clearAll={clearAll} routerSortOption={state.sortBy} removeFilter={removeFilter} featureToggle={featureToggle} />
                  ) : (
                    !featureToggle?.features?.enableHorizontalFilter ? (
                      <ProductFilterRight handleFilters={handleFilters} products={productDataToPass} routerFilters={state.filters} />
                    ) : (
                      <FilterHorizontal handleFilters={handleFilters} products={data.products} routerFilters={state.filters} pageType="category" />
                    )
                  )}
                  <div className={`${CURRENT_THEME == 'green' ? 'sm:col-span-10 lg:col-span-10 md:col-span-10 product-grid-9' : featureToggle?.features?.enableHorizontalFilter ? 'sm:col-span-12 lg:col-span-12 md:col-span-12' : 'sm:col-span-9 lg:col-span-9 md:col-span-9 border-l border-gray-300 pl-6'}`}>
                    {featureToggle.features?.enableForPCSite &&
                      <>
                        <div className='grid items-center px-2 mt-2 lg:col-span-12 md:col-span-12 sm:col-span-12 sm:grid-cols-12 sm:gap-4 sm:mb-4'>
                          <div className='flex flex-col w-full gap-4 sm:col-span-9'>
                            {shopAll ? (
                              <div className="mt-2 bg-transparent dark:bg-white">
                                <ol role="list" className="flex items-center space-x-0 truncate sm:space-x-0 sm:px-0 md:px-0 lg:px-0 2xl:px-0 dark:bg-white" >
                                  <li className='flex items-center text-10-mob sm:text-sm'>
                                    <Link href="/category" passHref>
                                      <span className="font-light hover:text-gray-900 dark:text-slate-500 text-slate-500">Category</span>
                                    </Link>
                                  </li>
                                  <li className='flex items-center text-10-mob sm:text-sm'>
                                    <span className="inline-block mx-1 font-normal hover:text-gray-900 dark:text-black" >
                                      <ChevronRightIcon className='w-3 h-3'></ChevronRightIcon>
                                    </span>
                                  </li>
                                  <li className='flex items-center text-10-mob sm:text-sm'>
                                    <Link href={`/${category?.link}`} passHref>
                                      <span className="font-light hover:text-gray-900 dark:text-slate-500 text-slate-500" > {category?.name}</span>
                                    </Link>
                                  </li>
                                  <li className='flex items-center text-10-mob sm:text-sm'>
                                    <span className="inline-block mx-1 font-normal hover:text-gray-900 dark:text-black" >
                                      <ChevronRightIcon className='w-3 h-3'></ChevronRightIcon>
                                    </span>
                                  </li>
                                  <li className='flex items-center text-10-mob sm:text-sm'>
                                    <Link href="#" passHref>
                                      <span className="font-semibold hover:text-gray-900 dark:text-black text-slate-900" > All {category?.name}</span>
                                    </Link>
                                  </li>
                                </ol>
                              </div>
                            ) : (category?.breadCrumbs && (<BreadCrumbs items={category?.breadCrumbs} currentProduct={category} />))}
                            <h1 className={`block text-2xl font-semibold dark:text-black primary-text-blue sm:text-3xl lg:text-3xl`}>{category?.name}</h1>
                            {category?.description &&
                              <div className='flex w-full'>
                                <div className="block text-sm font-normal text-gray-800 dark:text-neutral-400 dynamic-html-data" dangerouslySetInnerHTML={{ __html: category?.description }}></div>
                              </div>
                            }
                          </div>
                          <div className='justify-center sm:col-span-3'>
                            {category?.image != "" && <img src={category?.image} className='object-cover object-top w-full h-auto rounded-lg' />}
                          </div>
                          <div className='flex justify-start w-full gap-3 p-2 mt-4 border border-[#D9D9D9] rounded sm:col-span-12'>
                            <div className='flex items-center justify-between w-full gap-0'>
                              <div className='flex justify-start gap-3'>
                                <span className="inline-block text-xs font-medium text-slate-900 sm:px-0 dark:text-slate-900 result-count-text"> {`${productDataToPass?.total ?? 0} items in ${category?.name}`}</span>
                              </div>
                              <ProductFiltersTopBar products={data.products} handleSortBy={handleSortBy} routerFilters={state.filters} clearAll={clearAll} routerSortOption={state.sortBy} removeFilter={removeFilter} featureToggle={featureToggle} />
                            </div>
                          </div>
                        </div>
                      </>
                    }
                    {isMobile ? null : (
                      !featureToggle.features?.enableForPCSite && <ProductFiltersTopBar products={productDataToPass} handleSortBy={handleSortBy} routerFilters={state.filters} clearAll={clearAll} routerSortOption={state.sortBy} removeFilter={removeFilter} featureToggle={featureToggle} />
                    )}
                    <ProductGridWithFacet products={productDataToPass} currentPage={state?.currentPage} handlePageChange={handlePageChange} handleInfiniteScroll={handleInfiniteScroll} deviceInfo={deviceInfo} maxBasketItemsCount={maxBasketItemsCount(config)} isCompared={isCompared} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership} />
                  </div>
                </>
              ) : (
                <div className="sm:col-span-12 p-[1px] sm:mt-0 mt-2">
                  <ProductFiltersTopBar products={productDataToPass} handleSortBy={handleSortBy} routerFilters={state.filters} clearAll={clearAll} routerSortOption={state.sortBy} removeFilter={removeFilter} featureToggle={featureToggle} />
                  <ProductGrid products={productDataToPass} currentPage={state?.currentPage} handlePageChange={handlePageChange} handleInfiniteScroll={handleInfiniteScroll} deviceInfo={deviceInfo} maxBasketItemsCount={maxBasketItemsCount(config)} isCompared={isCompared} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership} />
                </div>
              ))}
              <CompareSelectionBar name={category?.name} showCompareProducts={showCompareProducts} products={productDataToPass} isCompare={isProductCompare} maxBasketItemsCount={maxBasketItemsCount(config)} closeCompareProducts={closeCompareProducts} deviceInfo={deviceInfo} />
              <div className='flex flex-col w-full col-span-12 overflow-hidden'>
                <EngageProductCard type={EngageEventTypes.TRENDING_FIRST_ORDER} campaignData={campaignData} isSlider={true} productPerRow={4} productLimit={12} />
                <EngageProductCard type={EngageEventTypes.INTEREST_USER_ITEMS} campaignData={campaignData} isSlider={true} productPerRow={4} productLimit={12} />
                <EngageProductCard type={EngageEventTypes.TRENDING_COLLECTION} campaignData={campaignData} isSlider={true} productPerRow={4} productLimit={12} />
                <EngageProductCard type={EngageEventTypes.COUPON_COLLECTION} campaignData={campaignData} isSlider={true} productPerRow={4} productLimit={12} />
                <EngageProductCard type={EngageEventTypes.SEARCH} campaignData={campaignData} isSlider={true} productPerRow={4} productLimit={12} />
                <EngageProductCard type={EngageEventTypes.RECENTLY_VIEWED} campaignData={campaignData} isSlider={true} productPerRow={4} productLimit={12} />
              </div>
            </div>
          ) : (
            <div className="p-4 py-8 mx-auto text-center sm:p-32 max-w-7xl">
              <h4 className="text-3xl font-bold text-gray-300">
                {translate('common.label.noProductAvailableText')} {category?.name}
              </h4>
            </div>
          )}
        </>
      )}
    </div>
  )
}