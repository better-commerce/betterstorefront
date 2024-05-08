import { BETTERCOMMERCE_DEFAULT_LANGUAGE, EngageEventTypes } from "@components/utils/constants";
import withDataLayer, { PAGE_TYPES } from "@components/withDataLayer";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import LayoutAccount from "@components/Layout/LayoutAccount";
import EngageProductCard from "@components/SectionEngagePanels/ProductCard";
import { useEffect, useState } from "react";
import { useUI } from "@components/ui";
import { useTranslation } from "@commerce/utils/use-translation";
import Link from "next/link";


const PAGE_TYPE = PAGE_TYPES.MyStore

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const { locale } = context
  return {
    props: {
      ...(await serverSideTranslations(locale ?? BETTERCOMMERCE_DEFAULT_LANGUAGE!)),
    },
  }
}

function Recommendations({  campaignData, featureToggle }: any) {
  const router = useRouter()
  const translate = useTranslation()
  const { user, isGuestUser,changeMyAccountTab } = useUI()
  const [nextPageTitle, setNextPageTitle] = useState('');
  const getPageTitle = (path: any) => {
    // Logic to get page title based on path (e.g., from a database or a predefined mapping)
    // For demonstration, let's just return hardcoded titles
    const titleMap: any = {
      '/my-store': 'My Store',
      '/my-store/recommendations': 'Your Recommendations',
      '/my-store/improve-recommendations': 'Improve Recommendations',
      '/my-account': 'My Account'
    };

    return titleMap[path] || '';
  };

  useEffect(()=>{
    changeMyAccountTab(translate('label.wishlist.myStore'))
  },[])

  useEffect(() => {
    const { pathname } = router;
    const title = getPageTitle(pathname);
    setNextPageTitle(title);
  }, [router]);
  return (
    <>
      <h2 className="text-3xl font-semibold xl:text-4xl dark:text-white">{translate('common.label.accountText')}</h2>
      {!isGuestUser && user.userId && featureToggle?.features?.enableMyStoreFeature &&
        <div className="flex-col hidden w-full px-4 mb-6 border-t bg-gradient-to-b from-slate-100 to-white sm:mb-10 border-slate-200 sm:block ">
          <ul className="flex items-center justify-start pl-0 mx-auto gap-x-4 sm:gap-x-8">
            <li className={`pt-1 mt-0 border-b-2 font-12 hover:border-sky-500 hover:text-sky-700 ${nextPageTitle === 'Your Recommendations' ? 'border-sky-500 text-sky-700 font-medium' : 'border-white text-black font-normal'}`}>
              <Link href={`/my-store/recommendations`} passHref>
                <span>Recommended For You</span>
              </Link>
            </li>
            <li className={`pt-1 mt-0 border-b-2 font-12 hover:border-sky-500 hover:text-sky-700 ${nextPageTitle === 'My Store' ? 'border-sky-500 text-sky-700 font-medium' : 'border-white text-black font-normal'}`}>
              <Link href={`/my-store`} passHref>
                <span>Browsing History</span>
              </Link>
            </li>
            <li className={`pt-1 mt-0 border-b-2 font-12 hover:border-sky-500 hover:text-sky-700 ${nextPageTitle === 'Improve Recommendations' ? 'border-sky-500 text-sky-700 font-medium' : 'border-white text-black font-normal'}`}>
              <Link href={`/my-store/improve-recommendations`} passHref>
                <span>Improve Your Recommendation</span>
              </Link>
            </li>
          </ul>
        </div>
      }
      <div className="mx-auto cart-recently-viewed mob-padding-0">
        <EngageProductCard productLimit={15} type={EngageEventTypes.TRENDING_FIRST_ORDER} campaignData={campaignData} title="Top picks for you" isSlider={false} productPerRow={5} forceDisplay={true} />
        <EngageProductCard productLimit={15} type={EngageEventTypes.TRENDING_COLLECTION} campaignData={campaignData} title="Style Spotlight: Editor's Choice" isSlider={true} productPerRow={5} forceDisplay={true} />
        <EngageProductCard productLimit={15} type={EngageEventTypes.COLLAB_ITEM_PURCHASE} campaignData={campaignData} title="Buy it again" isSlider={false} productPerRow={5} forceDisplay={true} />
        <EngageProductCard productLimit={15} type={EngageEventTypes.RECENTLY_VIEWED} campaignData={campaignData} title="Your browsing history" isSlider={true} productPerRow={5} forceDisplay={true} />
      </div>
    </>
  )
}

Recommendations.LayoutAccount = LayoutAccount
export default withDataLayer(Recommendations, PAGE_TYPE, true, LayoutAccount)