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
import { IMG_PLACEHOLDER } from "@components/utils/textVariables";

export default function RichLandingCategory({ category, deviceInfo, filterBrandData, productDataToPass, onToggleBrandListPage, maxBasketItemsCount, config, featureToggle, defaultDisplayMembership, campaignData, blogList }: any) {
  return (
    <>
      <div className='w-full !px-0 pb-8'>
        <CategoryBanner data={category}/>
        {category?.subCategories?.filter((x: any) => x.isFeatured == true).length > 0 &&
          <LandingFeaturedCategory featuredCategory={category?.subCategories} deviceInfo={deviceInfo} categoryname={category?.name}  />
        }
        <LinkGroup data={category?.linkGroups} deviceInfo={deviceInfo} />
        {productDataToPass?.results?.length > 0 &&
              <>
              <div className="container mx-auto px-4 pt-8">
              <div className="flex gap-x-6 mb-6 heading-border-top">
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
            <div className="container mx-auto px-4 py-8">
               <img src={category?.additionalInfo2} alt="Banner Image" className="block w-full"/>
            </div>
            )}
            {blogList?.length > 0 && (
              <div className="container mx-auto px-4 pt-8">
                <h2 className="block text-lg font-semibold sm:text-xl lg:text-xl dark:text-black mb-4">
                  Our {category?.name} buying guides
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-8">
                  {blogList
                    ?.sort(
                      (a: any, b: any) =>
                        new Date(b?.lastUpdated).getTime() - new Date(a?.lastUpdated)?.getTime()
                    )
                    ?.slice(0, 4)
                    ?.map((post: any, idx: number) => (
                      <div key={idx} className="flex flex-col h-full">
                        <Link
                          href={`/${post?.slug}`}
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