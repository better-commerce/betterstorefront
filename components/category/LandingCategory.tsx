import { CURRENT_THEME, EngageEventTypes } from "@components/utils/constants";
import LandingFeaturedCategory from "./LandingFeaturedCategory";
import { sanitizeRelativeUrl } from "@framework/utils/app-util";
import FeaturedBanner from "./FeaturedBanner";
import FeaturedBrand from "./FeaturedBrand";
import dynamic from "next/dynamic";
const ProductCard = dynamic(() => import('@components/ProductCard'))
import EngageProductCard from '@components/SectionEngagePanels/ProductCard'
import Link from "next/link";

export default function LandingCategory({ category, deviceInfo, filterBrandData, productDataToPass, onToggleBrandListPage, maxBasketItemsCount, config, featureToggle, defaultDisplayMembership, campaignData }: any) {
  return (
    <>
      <div className='container mx-auto category-container'>
        {category?.subCategories?.filter((x: any) => x.isFeatured == true).length > 0 &&
          <LandingFeaturedCategory featuredCategory={category?.subCategories} deviceInfo={deviceInfo} />
        }
        <div className='grid grid-cols-1 gap-4 px-4 sm:grid-cols-12 sm:gap-10 sm:px-0'>
          <div className={`${CURRENT_THEME != 'green' ? 'sm:col-span-3' : 'sm:col-span-2'}`}>
            <div className="pt-2 sm:pb-8">
              {category?.linkGroups?.map((grp: any, grpIdx: number) => (
                <div className="mx-auto sm:mb-4" key={`linkGrp-${grpIdx}`}>
                  <h2 className="block mb-4 text-lg font-semibold sm:text-xl lg:text-xl dark:text-black">{grp?.name}</h2>
                  {grp?.items?.length > 0 && grp?.items?.map((item: any, cdx: number) => (
                    <Link href={item?.link != null ? sanitizeRelativeUrl(`/${item?.link}`) : `#`} className="flex justify-start w-full py-1 text-left text-black font-14 hover:underline" key={cdx}>
                      <span>{item?.name}</span>
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className={`${CURRENT_THEME != 'green' ? 'space-y-6 sm:col-span-9' : 'space-y-6 sm:col-span-10'}`}>
            <FeaturedBanner category={category} />
            {category?.featuredBrand?.length > 0 &&
              <FeaturedBrand featuredBrand={category?.featuredBrand} filterBrandData={filterBrandData} />
            }
            {productDataToPass?.results?.length > 0 &&
              <>
                <div className='flex justify-between mb-2'>
                  <h2 className="block text-lg font-semibold sm:text-xl lg:text-xl dark:text-black">Featured Products</h2>
                  <button onClick={onToggleBrandListPage} className='text-lg font-medium text-black hover:underline'>See All</button>
                </div>
                <div className={`${CURRENT_THEME != 'green' ? 'grid grid-cols-1 gap-4 sm:grid-cols-3' : 'grid grid-cols-1 gap-4 sm:grid-cols-5'}`}>
                  {productDataToPass?.results?.map((product: any, pIdx: number) => (
                    <div key={pIdx}>
                      <ProductCard data={product} deviceInfo={deviceInfo} maxBasketItemsCount={maxBasketItemsCount(config)} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership} />
                    </div>
                  ))}
                </div>
              </>
            }
          </div>
        </div>
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