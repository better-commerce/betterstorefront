import { BETTERCOMMERCE_DEFAULT_LANGUAGE, EngageEventTypes, SITE_ORIGIN_URL } from "@components/utils/constants";
import withDataLayer, { PAGE_TYPES } from "@components/withDataLayer";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import NextHead from 'next/head'
import { useRouter } from "next/router";
import LayoutAccount from "@components/Layout/LayoutAccount";
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

function MyStore({ deviceInfo, config, campaignData }: any) {
  const router = useRouter()
  return (
    <>
      <NextHead>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="canonical" id="canonical" href={SITE_ORIGIN_URL + router.asPath} />
        <title>My Store</title>
        <meta name="title" content="My Store" />
        <meta name="description" content="My Store" />
        <meta name="keywords" content="My Store" />
        <meta property="og:image" content="My Store" />
        <meta property="og:title" content="My Store" key="ogtitle" />
        <meta property="og:description" content="My Store" key="ogdesc" />
      </NextHead>
      <div className="py-6 mx-auto mt-6 sm:container cart-recently-viewed sm:py-10 sm:mt-10">
        <EngageProductCard productLimit={40} type={EngageEventTypes.RECENTLY_VIEWED} campaignData={campaignData} title="Your Browsing History" isSlider={false} productPerRow={5} />
      </div>
    </>
  )
}

MyStore.LayoutAccount = LayoutAccount
export default withDataLayer(MyStore, PAGE_TYPE, true, LayoutAccount)