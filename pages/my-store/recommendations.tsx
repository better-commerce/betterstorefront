import { BETTERCOMMERCE_DEFAULT_LANGUAGE, EngageEventTypes, SITE_ORIGIN_URL } from "@components/utils/constants";
import withDataLayer, { PAGE_TYPES } from "@components/withDataLayer";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import NextHead from 'next/head'
import { useRouter } from "next/router";
import LayoutAccount from "@components/Layout/LayoutAccount";
import BrowsingHistoryProducts from "@components/Product/RelatedProducts/BrowsingHistory";
import EngageProductCard from "@components/SectionEngagePanels/ProductCard";

const PAGE_TYPE = PAGE_TYPES.MyStore

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const { locale } = context
  return {
    props: {
      ...(await serverSideTranslations(locale ?? BETTERCOMMERCE_DEFAULT_LANGUAGE!)),
    },
  }
}

function Recommendations({ deviceInfo, config, campaignData }: any) {
  const router = useRouter()
  return (
    <>
      <NextHead>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="canonical" id="canonical" href={SITE_ORIGIN_URL + router.asPath} />
        <title>Your Store</title>
        <meta name="title" content="Your Store" />
        <meta name="description" content="Your Store" />
        <meta name="keywords" content="Your Store" />
        <meta property="og:image" content="Your Store" />
        <meta property="og:title" content="Your Store" key="ogtitle" />
        <meta property="og:description" content="Your Store" key="ogdesc" />
      </NextHead>
      <div className="container py-6 mx-auto mt-6 cart-recently-viewed sm:py-10 sm:mt-10">
        <EngageProductCard type={EngageEventTypes.TRENDING_FIRST_ORDER} campaignData={campaignData} title="Trending" isSlider={false} />
        <EngageProductCard type={EngageEventTypes.SIMILAR_PRODUCTS} campaignData={campaignData} title="Trending" isSlider={false} />
        <EngageProductCard type={EngageEventTypes.ALSO_BOUGHT} campaignData={campaignData} title="Trending" isSlider={false} />
        <EngageProductCard type={EngageEventTypes.BOUGHT_TOGETHER} campaignData={campaignData} title="Trending" isSlider={false} />
      </div>
    </>
  )
}

Recommendations.LayoutAccount = LayoutAccount
export default withDataLayer(Recommendations, PAGE_TYPE, true, LayoutAccount)