import { BETTERCOMMERCE_DEFAULT_LANGUAGE, EngageEventTypes, SITE_ORIGIN_URL } from "@components/utils/constants";
import withDataLayer, { PAGE_TYPES } from "@components/withDataLayer";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import NextHead from 'next/head'
import { useRouter } from "next/router";
import LayoutAccount from "@components/Layout/LayoutAccount";
import EngageProductCard from "@components/SectionEngagePanels/ProductCard";
import { useConfig } from "@components/utils/myAccount";
import { useEffect, useMemo, useState } from "react";
import { useUI } from "@components/ui";
import { Guid } from "@commerce/types";
import { BuildingOffice2Icon } from "@heroicons/react/24/outline";
import { useTranslation } from "@commerce/utils/use-translation";
import Link from "next/link";
import { isMobile } from "react-device-detect";
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

function ImproveRecommendations({ deviceInfo, campaignData, featureToggle }: any) {
  const router = useRouter()
  const config = useConfig();
  const translate = useTranslation()
  const { user, deleteUser, isGuestUser, referralProgramActive } = useUI()
  const [active, setActive] = useState(false)
  const [isShow, setShow] = useState(true)
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
  const handleClick = () => {
    setActive(!active)
  }
  const handleToggleShowState = () => {
    setShow(!isShow)
  }
  useEffect(() => {
    const { pathname } = router;
    const title = getPageTitle(pathname);
    setNextPageTitle(title);
  }, [router]);
  const newConfig: any = useMemo(() => {
    let output: any = []
    let isB2B = user?.companyId !== Guid.empty
    const hasMyCompany = config?.some((item: any) => item?.props === 'my-company')
    const hasReferral = config?.some((item: any) => item?.props === 'refer-a-friend')
    output = [...config]
    if (isB2B) {
      let i = output.length
      if (referralProgramActive) {
        if (!hasReferral) {
          output.push({
            type: 'tab',
            text: 'Refer a Friend',
            mtext: 'Refer a Friend',
            props: 'refer-a-friend',
            href: "/my-account/refer-a-friend"
          })
        }
      }
      while (i--) {
        if (output[i]?.props === 'address-book' || output[i]?.props === 'orders') {
          output.splice(i, 1)
        }
      }
    }
    if (!isB2B) {
      if (referralProgramActive) {
        if (!hasReferral) {
          output = [...config]
          output.push({
            type: 'tab',
            text: 'Refer a Friend',
            mtext: 'Refer a Friend',
            props: 'refer-a-friend',
            href: "/my-account/refer-a-friend"
          })
        }
      } else {
        output = [...config]
      }
    } else if (!hasMyCompany) {
      output.push({
        type: 'tab',
        text: 'My Company',
        mtext: 'My Company',
        props: 'my-company',
        head: <BuildingOffice2Icon className="text-gray-500 w-7 h-7" />,
        href: '/my-account/my-company',
      })
    }

    if (featureToggle?.features?.enableMembership) {
      if (user?.hasMembership) {
        output.push({
          type: 'tab',
          text: translate('label.membership.membershipText'),
          mtext: translate('label.membership.membershipText'),
          props: 'membership',
          href: '/my-account/membership',
        })
      }
    }

    return output
  }, [config])
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
      <div className="container py-6 mx-auto mt-10 cart-recently-viewed sm:py-2 sm:mt-10 mob-padding-0">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold xl:text-4xl dark:text-white">{translate('common.label.accountText')}</h2>
          <span className="block mt-4 text-base text-neutral-500 dark:text-neutral-400 sm:text-lg">
            <span className="font-semibold text-slate-900 dark:text-slate-200">
              {user?.firstName},
            </span>{" "}
            {user.email}
          </span>
        </div>
        <hr className="mt-10 border-slate-200 dark:border-slate-700"></hr>
        <div className="flex space-x-8 overflow-x-auto md:space-x-13 hiddenScrollbar">
          {newConfig?.map((item: any, idx: number) => (item?.text == 'My Store' ? (
            <Link key={`my-acc-${idx}`} shallow={true} href={item?.href} passHref onClick={() => { handleClick(); handleToggleShowState(); }} className={`block py-3 md:py-8 border-b-2 flex-shrink-0 text-sm sm:text-base ${item?.text == 'My Store' ? "border-primary-500 font-medium icon-text-black dark:text-slate-200" : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"}`} >
              {isMobile ? item?.head : item?.text}
            </Link>
          ) : (
            <Link key={`my-acc-${idx}`} shallow={true} href={item?.href} passHref onClick={() => { handleClick() }} className="flex-shrink-0 block py-3 text-sm md:py-8 sm:text-base" >
              <span className="inline-block text-black sm:hidden dark:text-white"> {isMobile ? item?.head : item?.mtext} </span>
              <span className="hidden text-black sm:inline-block dark:text-white"> {isMobile ? item?.head : item?.text} </span>
            </Link>
          )
          ))}
        </div>
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
          <EngageRecommendationCard productLimit={15} type={EngageEventTypes.PURCHASE_HISTORY} campaignData={campaignData} title="Improve Your Recommendation" isSlider={false} productPerRow={5} forceDisplay={true} />
        </div>
      </div>
    </>
  )
}

ImproveRecommendations.LayoutAccount = LayoutAccount
export default withDataLayer(ImproveRecommendations, PAGE_TYPE, true, LayoutAccount)