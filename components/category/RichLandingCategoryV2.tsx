import dynamic from "next/dynamic";
import Link from "next/link";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "@commerce/utils/use-translation";
import { CURRENT_THEME, EngageEventTypes } from "@components/utils/constants";
import RecentlyViewedProduct from "@components/Product/RelatedProducts/RecentlyViewedProducts";
import CategoryBanner from "./RichCategory/CategoryBanner";
import LandingFeaturedCategory from "./RichCategory/LandingFeaturedCategory";
import LinkGroup from "./RichCategory/LinkGroup";
import { generateUri } from "@commerce/utils/uri-util";
import { IMG_PLACEHOLDER } from "@components/utils/textVariables";
import { sanitizeRelativeUrl } from "@framework/utils/app-util";
import { useCallback, useMemo } from "react";
import ProductCard from "@components/ProductCard";

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

export default function RichLandingCategoryV2({ featureToggle, category, handleFilters, productDataToPass, state, data, excludeOOSProduct, handleInfiniteScroll, deviceInfo, maxBasketItemsCount, config, isCompared, defaultDisplayMembership, closeCompareProducts, onEnableOutOfStockItems, isValidating, isMobile, products, handleSortBy, clearAll, removeFilter, isProductCompare, showCompareProducts, handlePageChange, campaignData, shopAll, blogList, filterBrandData, onToggleBrandListPage }: any) {
  const translate = useTranslation()
  const topFeaturedProduct = useMemo(() => {
    return productDataToPass?.results?.filter((p: any) => [1, 2, 3].includes(p.displayOrder))
  }, [productDataToPass?.results])
  // Memoize the featured product renderer for better performance
  const renderFeaturedProduct = useCallback(() => {
    return (
      <>
        {productDataToPass?.results?.length > 0 &&
          <div className='flex flex-col w-full gap-4 mb-4 p-2 bg-[#F5F5F5] border-t-2 sm:col-span-12 border-sky-700'>
            <div className='flex flex-col justify-end w-full text-right'>
              <h4 className='text-xs font-semibold primary-text-blue'>Featured Products</h4>
            </div>
            <div className='grid grid-cols-3 gap-3 p-2'>
              {productDataToPass?.results?.slice(0, 3)?.map((product: any, pIdx: number) => (
                <div className='grid items-center grid-cols-12 gap-2' key={`featured-${pIdx}`}>
                  <div className='col-span-4'>
                    <Link href={sanitizeRelativeUrl(`/${product?.slug || product?.link}`)} passHref>
                      <img
                        src={generateUri(product?.image, 'h=400&fm=webp') || IMG_PLACEHOLDER}
                        className={`${featureToggle?.features?.enableForPCSite ? 'object-contain object-top w-full h-full' : 'object-cover object-top w-full h-full drop-shadow-xl'}`}
                        alt={product?.name}
                        width={400}
                        height={400}
                        loading="lazy"
                      />
                    </Link>
                  </div>
                  <div className='flex flex-col col-span-8 gap-3'>
                    <Link href={sanitizeRelativeUrl(`/${product?.slug || product?.link}`)} passHref>
                      <h4 className='text-sm font-normal text-black hover:underline hover:primary-text-blue'>{product?.name}</h4>
                    </Link>
                    <div className='flex items-center justify-start gap-1 text-xs'>
                      <span className='text-lg font-semibold text-black'>{product?.price?.formatted?.withTax}</span>
                      <span className='text-gray-400 line-through'>{product?.listPrice?.formatted?.withTax}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        }
      </>
    );
  }, [topFeaturedProduct, featureToggle?.features?.enableForPCSite]);
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
      {isValidating ? (<Loader />) : (
        <>
          {productDataToPass?.results?.length > 0 ? (
            <div className="grid grid-cols-1 mx-auto sm:grid-cols-12">
              {!!productDataToPass && (productDataToPass?.filters?.length > 0 ? (
                <>
                  {isMobile ? (
                    <ProductMobileFilters handleFilters={handleFilters} products={products} routerFilters={state.filters} handleSortBy={handleSortBy} clearAll={clearAll} routerSortOption={state.sortBy} removeFilter={removeFilter} featureToggle={featureToggle} />
                  ) : (
                    !featureToggle?.features?.enableHorizontalFilter ? (
                      <ProductFilterRight featureToggle={featureToggle} handleFilters={handleFilters} products={productDataToPass} routerFilters={state.filters} />
                    ) : (
                      <FilterHorizontal handleFilters={handleFilters} products={data.products} routerFilters={state.filters} pageType="category" />
                    )
                  )}
                  <div className={`${CURRENT_THEME == 'green' ? 'sm:col-span-10 lg:col-span-10 md:col-span-10 product-grid-9' : featureToggle?.features?.enableHorizontalFilter ? 'sm:col-span-12 lg:col-span-12 md:col-span-12' : 'sm:col-span-9 lg:col-span-9 md:col-span-9 border-l border-gray-300 pl-6'}`}>
                    {featureToggle.features?.enableForPCSite &&
                      <>
                        <div className='grid items-center px-2 lg:col-span-12 md:col-span-12 sm:col-span-12 sm:grid-cols-12'>
                          <div className='flex flex-col w-full sm:col-span-12'>
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
                            <div className="flex flex-col col-span-12">
                              <section className="relative">
                                <div className="relative h-64 md:h-64">
                                  {/* Background Image */}
                                  <img src={generateUri(category?.image, 'h=400&fm=webp') || IMG_PLACEHOLDER} alt="Banner Image" className="absolute inset-0 object-cover w-full h-full bg-gray-100" />
                                </div>
                              </section>
                              <h1 className={`block title-page font-bold pb-4 dark:text-black primary-text-blue pt-8`}>{category?.name}</h1>
                              {category?.description &&
                                <div className='flex w-full'>
                                  <div className="block text-sm font-normal text-gray-800 text-x-small dark:text-neutral-400 dynamic-html-data" dangerouslySetInnerHTML={{ __html: category?.description }}></div>
                                </div>
                              }
                              {category?.subCategories?.filter((x: any) => x.isFeatured == true).length > 0 &&
                                <LandingFeaturedCategory featuredCategory={category?.subCategories} deviceInfo={deviceInfo} categoryName={category?.name} />
                              }
                              <LinkGroup data={category?.linkGroups} deviceInfo={deviceInfo} />
                              {blogList?.length > 0 && (
                                <div className="container !px-0 mx-auto pt-4 mt-6 border-t border-gray-400 heading">
                                  <h2 className="mb-6 font-semibold heading">
                                    Our {category?.name} buying guides
                                  </h2>
                                  <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-4">
                                    {blogList
                                      ?.sort(
                                        (a: any, b: any) =>
                                          new Date(b?.lastUpdated).getTime() - new Date(a?.lastUpdated)?.getTime()
                                      )
                                      ?.slice(0, 4)
                                      ?.map((post: any, idx: number) => (
                                        <div key={idx} className="flex flex-col h-full">
                                          <Link
                                            href={sanitizeRelativeUrl(post?.slug)}
                                            className="inline-flex items-center link-clr font-medium hover:text-teal-800 relative w-full shadow-lg transition-all duration-300 hover:shadow-xl hover:translate-y-[-5px] overflow-hidden"
                                          >
                                            <img
                                              src={post?.fields?.hero?.[0]?.hero_image || IMG_PLACEHOLDER}
                                              alt={post?.title}
                                              className="object-cover"
                                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                          </Link>
                                        </div>
                                      ))}
                                  </div>
                                </div>
                              )}
                              {category?.additionalInfo1 && (
                                <div className="w-full !px-0 pt-8 pb-4">
                                  <Link href="/sell-or-part-exchange" className="flex flex-col items-start justify-start w-full text-left">
                                    <img src={generateUri(category?.additionalInfo1, 'h=400&fm=webp') || IMG_PLACEHOLDER} alt="Banner Image" className="block w-full" />
                                  </Link>
                                </div>
                              )}
                            </div>
                            {renderFeaturedProduct()}
                          </div>

                          <div className='flex justify-start mb-4 w-full gap-3 p-2 border border-[#D9D9D9] rounded sm:col-span-12'>
                            <div className='flex items-center justify-between w-full gap-0'>
                              <div className='flex justify-start gap-3'>
                                <span className="inline-block text-xs font-medium text-slate-900 sm:px-0 dark:text-slate-900 result-count-text"> {`${products?.total ?? 0} items in ${category?.name}`}</span>
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
                    <ProductGridWithFacet isPagination={false} products={products} currentPage={state?.currentPage} handlePageChange={handlePageChange} handleInfiniteScroll={handleInfiniteScroll} deviceInfo={deviceInfo} maxBasketItemsCount={maxBasketItemsCount(config)} isCompared={isCompared} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership} />
                    <button onClick={onToggleBrandListPage} className='flex items-center justify-center w-full col-span-12 py-2 mb-6 text-sm font-semibold text-black bg-gray-300'>See all products</button>
                  </div>
                </>
              ) : (
                <div className="sm:col-span-12 p-[1px] sm:mt-0 mt-2">
                  <ProductFiltersTopBar products={productDataToPass} handleSortBy={handleSortBy} routerFilters={state.filters} clearAll={clearAll} routerSortOption={state.sortBy} removeFilter={removeFilter} featureToggle={featureToggle} />
                  <ProductGrid products={productDataToPass} currentPage={state?.currentPage} handlePageChange={handlePageChange} handleInfiniteScroll={handleInfiniteScroll} deviceInfo={deviceInfo} maxBasketItemsCount={maxBasketItemsCount(config)} isCompared={isCompared} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership} />
                  {featureToggle.features?.enableForPCSite && <div className='col-span-12'>
                    <RecentlyViewedProduct deviceInfo={deviceInfo} config={config} productPerRow={4} featureToggle={featureToggle} />
                  </div>}
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