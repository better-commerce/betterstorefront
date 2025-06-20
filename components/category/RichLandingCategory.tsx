import { EngageEventTypes } from "@components/utils/constants";
import LandingFeaturedCategory from "./RichCategory/LandingFeaturedCategory";
import { sanitizeRelativeUrl } from "@framework/utils/app-util";
import FeaturedBrand from "./RichCategory/FeatureBrand";
import dynamic from "next/dynamic";
const ProductCard = dynamic(() => import('@components/ProductCard'))
import EngageProductCard from '@components/SectionEngagePanels/ProductCard'
import Link from "next/link";
import CategoryBanner from "./RichCategory/CategoryBanner";
import LinkGroup from "./RichCategory/LinkGroup";
const ProductGridWithFacet = dynamic(() => import('@components/Product/Grid'))
import { IMG_PLACEHOLDER } from "@components/utils/textVariables";
import { generateUri } from "@commerce/utils/uri-util";
const ProductFiltersTopBar = dynamic(() => import('@components/Product/Filters/FilterTopBar'))
const ProductMobileFilters = dynamic(() => import('@components/Product/Filters'))
const ProductFilterRight = dynamic(() => import('@components/Product/Filters/filtersRight'))
const FilterHorizontal = dynamic(() => import('@components/Product/Filters/filterHorizontal'))
export default function RichLandingCategory({ category, deviceInfo, filterBrandData, isMobile, handleFilters, products, productDataToPass, handleSortBy, clearAll, removeFilter, data, state, handlePageChange, onToggleBrandListPage, maxBasketItemsCount, config, featureToggle, defaultDisplayMembership, campaignData, blogList, handleInfiniteScroll, isCompared }: any) {
  return (
    <>
      <div className='w-full !px-0 pb-8'>
        <CategoryBanner data={category} />
        {category?.subCategories?.filter((x: any) => x.isFeatured == true).length > 0 &&
          <LandingFeaturedCategory featuredCategory={category?.subCategories} deviceInfo={deviceInfo} categoryName={category?.name} />
        }
        <LinkGroup data={category?.linkGroups} deviceInfo={deviceInfo} />
        {productDataToPass?.results?.length > 0 &&
          <div className="container !px-4 pt-8 mx-auto">
            <div className="flex pt-4 mb-2 border-t border-gray-400 gap-x-6">
              <h2 className="block font-semibold text-black heading dark:text-black">Featured {category?.name}</h2>
              {!featureToggle.features?.enableForPCSite && <button onClick={onToggleBrandListPage} className='text-lg font-normal text-black underline'>See more</button>}
            </div>

            {featureToggle?.features?.enableForPCSite ?
              <>
                <div className={`${featureToggle.features?.enableForPCSite ? ' container !px-0' : ' w-full'} col-span-12 mb-2`}>
                  {isMobile ? (
                    <ProductMobileFilters handleFilters={handleFilters} products={products} routerFilters={state.filters} handleSortBy={handleSortBy} clearAll={clearAll} routerSortOption={state.sortBy} removeFilter={removeFilter} featureToggle={featureToggle} />
                  ) : (
                    !featureToggle?.features?.enableHorizontalFilter ? (
                      <ProductFilterRight featureToggle={featureToggle} handleFilters={handleFilters} products={productDataToPass} routerFilters={state.filters} />
                    ) : (
                      <FilterHorizontal handleFilters={handleFilters} products={data.products} routerFilters={state.filters} pageType="" />
                    )
                  )}
                </div>
                {isMobile ? null : (
                  featureToggle.features?.enableForPCSite && <ProductFiltersTopBar products={productDataToPass} handleSortBy={handleSortBy} routerFilters={state.filters} clearAll={clearAll} routerSortOption={state.sortBy} removeFilter={removeFilter} featureToggle={featureToggle} />
                )}
                <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-1">
                  <ProductGridWithFacet isPagination={true} products={productDataToPass} currentPage={state?.currentPage} handlePageChange={handlePageChange} handleInfiniteScroll={handleInfiniteScroll} deviceInfo={deviceInfo} maxBasketItemsCount={maxBasketItemsCount(config)} isCompared={isCompared} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership} />
                </div>
              </>
              :
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
                {productDataToPass?.results?.map((product: any, pIdx: number) => (
                  <div key={pIdx}>
                    <ProductCard data={product} deviceInfo={deviceInfo} maxBasketItemsCount={maxBasketItemsCount(config)} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership} />
                  </div>
                ))}
              </div>
            }
          </div>
        }
        {category?.additionalInfo1 && (
          <div className="w-full !px-0 py-8">
            <Link href="/sell-or-part-exchange" className="flex flex-col items-start justify-start w-full text-left">
              <img src={generateUri(category?.additionalInfo1, 'h=500&fm=webp') || IMG_PLACEHOLDER} alt="Banner Image" className="block w-full" />
            </Link>
          </div>
        )}
        {category?.featuredBrand?.length > 0 &&
          <FeaturedBrand featuredBrand={category?.featuredBrand} filterBrandData={filterBrandData} categoryName={category?.name} />
        }
        {category?.additionalInfo2 && (
          <div className="container px-4 py-8 mx-auto">
            <img src={generateUri(category?.additionalInfo2, 'h=500&fm=webp') || IMG_PLACEHOLDER} alt="Banner Image" className="block w-full" />
          </div>
        )}
        {blogList?.length > 0 && (
          <div className="container px-4 mx-auto">
            <h2 className="mb-6 font-semibold heading">
              Our {category?.name} buying guides
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-6">
              {blogList?.sort((a: any, b: any) => new Date(b?.lastUpdated).getTime() - new Date(a?.lastUpdated)?.getTime())?.slice(0, 4)?.map((post: any, idx: number) => (
                <div key={idx} className="flex flex-col h-full">
                  {post?.fields?.hero?.map((hero: any, heroIdx: number) => (
                    <Link href={sanitizeRelativeUrl(post?.slug)} key={`hero-${heroIdx}`} className="inline-flex items-center link-clr font-medium hover:text-teal-800 relative w-full shadow-lg transition-all duration-300 hover:shadow-xl hover:translate-y-[-5px] overflow-hidden" >
                      <img src={generateUri(hero?.hero_image, 'h=300&fm=webp') || IMG_PLACEHOLDER} alt={post?.title} className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className='flex flex-col w-full col-span-12 overflow-hidden'>
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