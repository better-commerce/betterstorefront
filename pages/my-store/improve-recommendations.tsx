import { BETTERCOMMERCE_DEFAULT_LANGUAGE, EngageEventTypes, SITE_ORIGIN_URL } from "@components/utils/constants";
import withDataLayer, { PAGE_TYPES } from "@components/withDataLayer";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import NextHead from 'next/head'
import { useRouter } from "next/router";
import LayoutAccount from "@components/Layout/LayoutAccount";
import EngageRecommendationCard from "@components/SectionEngagePanels/EngageRecommendationCard";
const PAGE_TYPE = PAGE_TYPES.MyStore

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const { locale } = context
  return {
    props: {
      ...(await serverSideTranslations(locale ?? BETTERCOMMERCE_DEFAULT_LANGUAGE!)),
    },
  }
}

function ImproveRecommendations({ deviceInfo, config, campaignData }: any) {
  const router = useRouter()
  return (
    <>
      <NextHead>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="canonical" id="canonical" href={SITE_ORIGIN_URL + router.asPath} />
        <title>Improve Recommendations</title>
        <meta name="title" content="Improve Recommendations" />
        <meta name="description" content="Improve Recommendations" />
        <meta name="keywords" content="Improve Recommendations" />
        <meta property="og:image" content="Improve Recommendations" />
        <meta property="og:title" content="Improve Recommendations" key="ogtitle" />
        <meta property="og:description" content="Improve Recommendations" key="ogdesc" />
      </NextHead>
      <div className="container py-6 mx-auto mt-10 cart-recently-viewed sm:py-10 sm:mt-4">
        <EngageRecommendationCard type={EngageEventTypes.RECENTLY_VIEWED} campaignData={campaignData} title="Improve Your Recommendation" isSlider={false} productPerRow={5} />
      </div>
    </>
  )
}

ImproveRecommendations.LayoutAccount = LayoutAccount
export default withDataLayer(ImproveRecommendations, PAGE_TYPE, true, LayoutAccount)