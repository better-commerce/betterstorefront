import { EngageEventTypes } from "@components/utils/constants";
import withDataLayer, { PAGE_TYPES } from "@components/withDataLayer";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import LayoutAccount from "@components/Layout/LayoutAccount";
import EngageProductCard from "@components/SectionEngagePanels/ProductCard";
import { useEffect, useState } from "react";
import { useUI } from "@components/ui";
import { useTranslation } from "@commerce/utils/use-translation";
import { IPagePropsProvider } from "@framework/contracts/page-props/IPagePropsProvider";
import { getPagePropType, PagePropType } from "@framework/page-props";


const PAGE_TYPE = PAGE_TYPES.MyStore
import useAnalytics from '@components/services/analytics/useAnalytics';
import { EVENTS_MAP } from '@components/services/analytics/constants';
import { AnalyticsEventType } from "@components/services/analytics";

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const { locale } = context
  const props: IPagePropsProvider = getPagePropType({ type: PagePropType.COMMON })
  const pageProps = await props.getPageProps({ cookies: context?.req?.cookies })

  return {
    props: {
      ...pageProps,
    },
  }
}

function Recommendations({  campaignData, featureToggle }: any) {
  const { recordAnalytics } = useAnalytics()
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

  recordAnalytics(AnalyticsEventType.PAGE_VIEWED, {
    entityName: PAGE_TYPES.MyStoreRecommends,
    entityType: EVENTS_MAP.ENTITY_TYPES.Page,
    eventType: AnalyticsEventType.PAGE_VIEWED,
  })

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
      <h2 className="text-3xl font-semibold xl:text-4xl dark:text-black">{translate('label.store.yourRecommendationsText')}</h2>
      <div className="mx-auto cart-recently-viewed mob-padding-0">
        <EngageProductCard productLimit={15} type={EngageEventTypes.TRENDING_FIRST_ORDER} campaignData={campaignData} title="Top picks for you" isSlider={false} productPerRow={4} forceDisplay={true} />
        <EngageProductCard productLimit={15} type={EngageEventTypes.TRENDING_COLLECTION} campaignData={campaignData} title="Style Spotlight: Editor's Choice" isSlider={true} productPerRow={4} forceDisplay={true} />
        <EngageProductCard productLimit={15} type={EngageEventTypes.COLLAB_ITEM_PURCHASE} campaignData={campaignData} title="Buy it again" isSlider={false} productPerRow={4} forceDisplay={true} />
        <EngageProductCard productLimit={15} type={EngageEventTypes.RECENTLY_VIEWED} campaignData={campaignData} title="Your browsing history" isSlider={true} productPerRow={4} forceDisplay={true} />
      </div>
    </>
  )
}

Recommendations.LayoutAccount = LayoutAccount
export default withDataLayer(Recommendations, PAGE_TYPES.MyStoreRecommends, true, LayoutAccount)