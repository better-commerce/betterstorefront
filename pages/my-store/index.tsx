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

function MyStore({ campaignData, featureToggle }: any) {
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
      <h2 className="text-3xl font-semibold xl:text-4xl dark:text-white">My Store</h2>
      <EngageProductCard productLimit={40} type={EngageEventTypes.RECENTLY_VIEWED} campaignData={campaignData} title="Your Browsing History" isSlider={false} productPerRow={5} />
    </>
  )
}

MyStore.LayoutAccount = LayoutAccount
export default withDataLayer(MyStore, PAGE_TYPE, true, LayoutAccount)