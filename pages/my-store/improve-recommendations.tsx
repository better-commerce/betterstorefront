import { EngageEventTypes } from "@components/utils/constants";
import withDataLayer, { PAGE_TYPES } from "@components/withDataLayer";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import LayoutAccount from "@components/Layout/LayoutAccount";
import { useEffect, useState } from "react";
import { useUI } from "@components/ui";
import { useTranslation } from "@commerce/utils/use-translation";
import EngageRecommendationCard from "@components/SectionEngagePanels/EngageRecommendationCard";
import { IPagePropsProvider } from "@framework/contracts/page-props/IPagePropsProvider";
import { getPagePropType, PagePropType } from "@framework/page-props";

import useAnalytics from '@components/services/analytics/useAnalytics';
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

function ImproveRecommendations({ campaignData, featureToggle }: any) {
  const { recordAnalytics } = useAnalytics()
  const router = useRouter()
  const translate = useTranslation()
  const { user, isGuestUser, changeMyAccountTab } = useUI()
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

  recordAnalytics(AnalyticsEventType.PAGE_VIEWED, { entityName: PAGE_TYPES.MyStoreImproveRecommends, })

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
      <div className="mx-auto cart-recently-viewed mob-padding-0">
        <EngageRecommendationCard productLimit={15} type={EngageEventTypes.PURCHASE_HISTORY} campaignData={campaignData} title="Improve Your Recommendation" isSlider={false} productPerRow={5} forceDisplay={true} />
      </div>
    </>
  )
}

ImproveRecommendations.LayoutAccount = LayoutAccount
export default withDataLayer(ImproveRecommendations, PAGE_TYPES.MyStoreImproveRecommends, true, LayoutAccount)