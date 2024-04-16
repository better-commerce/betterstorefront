import { BETTERCOMMERCE_DEFAULT_LANGUAGE, EngageEventTypes, SITE_ORIGIN_URL } from "@components/utils/constants";
import withDataLayer, { PAGE_TYPES } from "@components/withDataLayer";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import NextHead from 'next/head'
import { useRouter } from "next/router";
import LayoutAccount from "@components/Layout/LayoutAccount";
import { generateUri } from "@commerce/utils/uri-util";
import { IMG_PLACEHOLDER } from "@components/utils/textVariables";
import Link from "next/link";
import { Switch } from "@headlessui/react";
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

const recommendations = [
  { "name": "Pink Ombre Satin Wide Leg Trouser", "image": "https://www.imagedelivery.space/demostore/products/ss220991.jpg?fm=webp&h=400", "isRecommended": true, "link": "/products/multi-blur-print-midi-dress-with-draped-skirt-ss23072" },
  { "name": "Pink Metallic Corset Mini Dress with Ruched Skirt", "image": "https://www.imagedelivery.space/demostore/products/ss22344_pink_2.jpg?fm=webp&h=400", "isRecommended": true, "link": "/products/pink-metallic-corset-mini-dress-with-ruched-skirt-ss22344" },
  { "name": "Black and White Polka Dot Taffeta Mini Dress with Volume Skirt", "image": "https://www.imagedelivery.space/demostore/products/ss23068_1_(2).jpg?fm=webp&h=400", "isRecommended": false, "link": "/products/black-white-polka-dot-taffeta-mini-dress-with-volume-skirt-1-ss23202" },
  { "name": "White Lurex Draped Bodice Mini Dress with Gathered Skirt", "image": "https://www.imagedelivery.space/demostore/products/ss23130-_white1.jpg?fm=webp&h=400", "isRecommended": true, "link": "/products/white-lurex-draped-bodice-mini-dress-with-gathered-skirt-ss23130" },
  { "name": "Liberty Boyfriend Fit Lined Blazer in Teal", "image": "https://www.imagedelivery.space/demostore/products/exsd21253-teal_1.jpg?fm=webp&h=400", "isRecommended": false, "link": "/products/teal-boyfriend-fit-lined-blazer-exsd21253" },
  { "name": "Animal Printed One Shoulder Sequin Dress With Draped Skirt", "image": "https://www.imagedelivery.space/demostore/products/aw22526-animal1.jpg?fm=webp&h=400", "isRecommended": true, "link": "/products/animal-printed-one-shoulder-sequin-dress-with-draped-skirt-aw22526" }
]

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