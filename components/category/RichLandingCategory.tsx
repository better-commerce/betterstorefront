import { CURRENT_THEME, EngageEventTypes } from "@components/utils/constants";
import LandingFeaturedCategory from "./RichCategory/LandingFeaturedCategory";
import { sanitizeRelativeUrl } from "@framework/utils/app-util";
import FeaturedBanner from "./FeaturedBanner";
import FeaturedBrand from "./RichCategory/FeatureBrand";
import dynamic from "next/dynamic";
const ProductCard = dynamic(() => import('@components/ProductCard'))
import EngageProductCard from '@components/SectionEngagePanels/ProductCard'
import Link from "next/link";
import CategoryBanner from "./RichCategory/CategoryBanner";
import LinkGroup from "./RichCategory/LinkGroup";
import BuyingGuide from "./RichCategory/BuyingGuide";

export default function RichLandingCategory({ category, deviceInfo, filterBrandData, productDataToPass, onToggleBrandListPage, maxBasketItemsCount, config, featureToggle, defaultDisplayMembership, campaignData }: any) {
  return (
    <>
    <CategoryBanner data={category}/>
      <div className='w-full !px-0'>
        {category?.subCategories?.filter((x: any) => x.isFeatured == true).length > 0 &&
          <LandingFeaturedCategory featuredCategory={category?.subCategories} deviceInfo={deviceInfo} categoryname={category?.name}  />
        }
        <LinkGroup data={category?.linkGroups} deviceInfo={deviceInfo} />
        {productDataToPass?.results?.length > 0 &&
              <>
              <div className="container mx-auto px-4 py-8 border-b border-gray-200">
              <div className="flex gap-x-6 mb-6">
                    <h2 className="block text-lg font-semibold sm:text-xl lg:text-xl dark:text-black">Featured {category?.name}</h2>
                    <button onClick={onToggleBrandListPage} className='text-lg font-normal text-black underline'>See more</button>
                  </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
                  {productDataToPass?.results?.map((product: any, pIdx: number) => (
                    <div key={pIdx}>
                      <ProductCard data={product} deviceInfo={deviceInfo} maxBasketItemsCount={maxBasketItemsCount(config)} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership} />
                    </div>
                  ))}
                </div>
              </div>
              </>
            }
            {category?.additionalInfo1 && (
            <div className="w-full !px-0 py-8">
              <Link href="/sell-or-part-exchange" className="flex flex-col items-start justify-start w-full text-left">
              <img src={category?.additionalInfo1} alt="Banner Image" className="block w-full"/>
              </Link>
            </div>
            )}
             {category?.featuredBrand?.length > 0 &&
              <FeaturedBrand featuredBrand={category?.featuredBrand} filterBrandData={filterBrandData} categoryname={category?.name}/>
            }
            {category?.additionalInfo2 && (
            <div className="container mx-auto px-4 py-8 border-b">
               <img src={category?.additionalInfo2} alt="Banner Image" className="block w-full"/>
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