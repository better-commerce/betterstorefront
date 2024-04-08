import Layout from "@components/Layout/Layout";
import RecentlyViewedProduct from "@components/Product/RelatedProducts/RecentlyViewedProducts";
import { SITE_ORIGIN_URL } from "@components/utils/constants";
import withDataLayer, { PAGE_TYPES } from "@components/withDataLayer";
import NextHead from 'next/head'
import { useRouter } from "next/router";
const PAGE_TYPE = PAGE_TYPES.YourStore
function ImproveRecommendations({ deviceInfo, config }: any) {
  const router = useRouter()
  return (
    <>
      <NextHead>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="canonical" id="canonical" href={SITE_ORIGIN_URL + router.asPath} />
        <title>Improve Your Recommendation</title>
        <meta name="title" content="Improve Your Recommendation" />
        <meta name="description" content="Improve Your Recommendation" />
        <meta name="keywords" content="Improve Your Recommendation" />
        <meta property="og:image" content="Improve Your Recommendation" />
        <meta property="og:title" content="Improve Your Recommendation" key="ogtitle" />
        <meta property="og:description" content="Improve Your Recommendation" key="ogdesc" />
      </NextHead>
      <div className="container py-6 mx-auto cart-recently-viewed sm:py-10">
        <RecentlyViewedProduct deviceInfo={deviceInfo} config={config} productPerRow={4} />
      </div>
    </>
  )
}

ImproveRecommendations.Layout = Layout
export default withDataLayer(ImproveRecommendations, PAGE_TYPE)