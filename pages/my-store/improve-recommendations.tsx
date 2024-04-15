import { BETTERCOMMERCE_DEFAULT_LANGUAGE, SITE_ORIGIN_URL } from "@components/utils/constants";
import withDataLayer, { PAGE_TYPES } from "@components/withDataLayer";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import NextHead from 'next/head'
import { useRouter } from "next/router";
import LayoutAccount from "@components/Layout/LayoutAccount";
import BrowsingHistoryProducts from "@components/Product/RelatedProducts/BrowsingHistory";
import { generateUri } from "@commerce/utils/uri-util";
import { IMG_PLACEHOLDER } from "@components/utils/textVariables";
import Link from "next/link";
import { Switch } from "@headlessui/react";

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

function ImproveRecommendations({ deviceInfo, config }: any) {
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
      <div className="container py-6 mx-auto cart-recently-viewed sm:py-10">
        <div className="flex flex-col justify-start mt-4 sm:mt-6">
          <h1 className="flex items-center text-2xl font-semibold md:text-3xl">Improve Your Recommendation</h1>
          <p>Provide better recommendation by setting up what you want to see.</p>
        </div>
        <div className="flex flex-col mt-4 border w-fill border-slate-200 rounded-2xl sm:mt-8">
          <div className="grid grid-cols-1">
            {recommendations?.map((data: any, dataIdx: number) => (
              <div className="grid items-center grid-cols-12 gap-3 p-2 border-b border-slate-300" key={dataIdx}>
                <div className="col-span-1">
                  <div className="flex-shrink-0">
                    <img width={140} height={60} src={generateUri(data?.image, 'h=200&fm=webp') || IMG_PLACEHOLDER} alt={data?.name || 'cart-item'} className="object-cover object-center w-10 rounded-lg sm:w-16 image" />
                  </div>
                </div>
                <div className="col-span-8">
                  <Link href={data?.link} passHref>
                    <h3 className="font-semibold text-black font-16 hover:text-sky-600">{data?.name}</h3>
                  </Link>
                </div>
                <div className="flex items-center justify-around col-span-3 gap-2">
                  <span className="font-normal font-12 text-slate-600">Use this product for recommendation</span>
                  <Switch checked={data?.isRecommended} className={`${data?.isRecommended ? 'bg-white' : 'bg-gray-300'} relative inline-flex h-[18px] w-[35px] shrink-0 cursor-pointer rounded-full border border-slate-300 transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`} >
                    <span className="sr-only">is Enable</span>
                    <span aria-hidden="true" className={`${data?.isRecommended ? 'translate-x-4' : 'translate-x-0'} pointer-events-none inline-block h-[15px] w-[15px] transform rounded-full bg-black shadow-lg ring-0 transition duration-200 ease-in-out`} />
                  </Switch>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

ImproveRecommendations.LayoutAccount = LayoutAccount
export default withDataLayer(ImproveRecommendations, PAGE_TYPE, true, LayoutAccount)