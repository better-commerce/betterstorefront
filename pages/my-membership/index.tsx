import withDataLayer, { PAGE_TYPES } from "@components/withDataLayer";
import NextHead from 'next/head'
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Layout from '@components/Layout/Layout'
import { MembershipType, SITE_ORIGIN_URL } from "@components/utils/constants";
import React, { useMemo } from "react";
import { removeQueryString } from "@commerce/utils/uri-util";
import { RocketLaunchIcon, TagIcon } from "@heroicons/react/24/outline";
import { GetServerSideProps, } from "next";
import cartHandler from "@components/services/cart";
import { useUI } from "@components/ui";
const Button = dynamic(() => import('@components/ui/IndigoButton'))
import Loader from "@components/Loader";
import { useTranslation } from "@commerce/utils/use-translation";
import MemberBenefits from "@components/membership/MemberBenefits";
import { IPagePropsProvider } from "@framework/contracts/page-props/IPagePropsProvider";
import { getPagePropType, PagePropType } from "@framework/page-props";

const PAGE_TYPE = PAGE_TYPES.MyMembership

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const { locale, req } = context
  const props: IPagePropsProvider = getPagePropType({ type: PagePropType.MEMBERSHIP })
  const pageProps = await props.getPageProps({ cookies: context?.req?.cookies })
  
  return {
    props: {
      ...pageProps,
      
    },
  }
}

const MyMembershipPage = ({ allPlans }: any) => {
  const router = useRouter()
  const { user, basketId, setCartItems } = useUI();
  const translate = useTranslation();

  const buttonTitle = () => {
    let buttonConfig: any = {
      title: translate('label.basket.addToBagText'),
      action: async ( plan:any ) => {
        const item = await cartHandler()?.addToCart(
          {
            basketId,
            productId: plan?.recordId,
            qty: 1,
            manualUnitPrice: plan?.price?.raw?.withoutTax,
            stockCode: plan?.stockCode,
            userId: user?.userId,
            isAssociated: user?.isAssociated,
            isMembership: true,
          },
          'ADD',
          { plan }
        )
        setCartItems(item)
      },
    }
    return buttonConfig
  }
  const buttonConfig = buttonTitle();

  const gradientName = useMemo(() => {
    return (plan:any) => {
      if (plan === MembershipType.SILVER) {
        return 'gradient-silver text-black';
      } else if (plan === MembershipType.GOLD) {
        return 'gradient-golden text-white';
      } else if (plan === MembershipType.PLATINUM) {
        return 'gradient-platinum text-white';
      }
      return 'bg-black';
    };
  }, [allPlans]);
  
  const cleanPath = removeQueryString(router.asPath)
  return (
    <>
      <NextHead>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="canonical" id="canonical" href={SITE_ORIGIN_URL + cleanPath} />
        <title>{translate('label.membership.myMembershipText')}</title>
        <meta name="title" content="My Membership" />
        <meta name="description" content="My Membership" />
        <meta name="keywords" content="My Membership" />
        <meta property="og:image" content="My Membership" />
        <meta property="og:title" content="My Membership" key="ogtitle" />
        <meta property="og:description" content="My Membership" key="ogdesc" />
      </NextHead>
      <div className="py-6 sm:py-16 bg-gradient-to-t from-purple-100 to-white">
        <div className="container flex flex-col justify-center py-6 mx-auto text-center sm:py-10">
          <h3 className="mx-auto my-1 text-5xl font-semibold text-black leading-extra-loose sm:max-w-xl">GET 20% OFF + {translate('label.product.freeDeliveryText')}</h3>
          <p className="dark:text-black">{translate('label.membership.membershipDescText')}</p>
        </div>
      </div>
      <div className="pb-10 sm:pb-24 bg-gradient-to-b from-purple-100 to-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {(allPlans?.length >= 0) ? allPlans?.sort((plan1: any, plan2: any) => plan1?.displayOrder - plan2.displayOrder)?.map((plan: any, planIdx: number) => (
              <div className="flex flex-col w-full bg-transparent border-2 border-black rounded-2xl" key={`plan-${planIdx}`}>
                <div className={`items-center justify-center py-4 text-center ${gradientName(plan?.name)} rounded-t-xl`}>
                  <h2 className={`text-lg font-medium ${gradientName(plan?.name)}`}>{plan?.name}</h2>
                </div>
                <div className="bg-gradient-to-t from-purple-100 to-white rounded-b-xl">
                  <div className="flex flex-col gap-4 p-6">
                    {plan?.membershipBenefits?.map((benefits: any, bIdx: number) => (
                      <>
                        <div className="flex items-center gap-4 justify-normal">
                          <TagIcon className="w-6 h-6 p-1 text-white bg-black rounded-full" />
                          <span className="font-medium text-black text-md">{benefits?.noOfVoucher} x 20% {translate('label.membership.discountsAnytimeText')}</span>
                        </div>
                        <div className="flex items-center gap-4 justify-normal">
                          <RocketLaunchIcon className="w-6 h-6 p-1 text-white bg-black rounded-full" />
                          <span className="font-medium text-black text-md">{translate('label.membership.unlimitedDeliveryText')}</span>
                        </div>
                      </>
                    ))}

                  </div>
                  <div className="flex items-center justify-center gap-1 pt-6 mt-6 border-t border-purple-100">
                    <h3 className="text-xl font-semibold text-slate-900">{plan?.price?.formatted?.withTax}</h3>
                    <span className="text-xs font-normal text-slate-500">{translate('label.membership.perYearText')}</span>
                  </div>
                  <div className="flex items-center justify-center mt-2">
                    <h4 className="text-sm font-normal text-black">{translate('label.membership.billedAnnuallyText')}</h4>
                  </div>
                  <div className="flex items-center justify-center px-6 pt-3 pb-6 mt-6">
                    <Button className={'w-full py-3 text-sm text-white !bg-black rounded-full hover:!bg-gray-900'} title={buttonConfig.title} action={() => buttonConfig.action(plan)} buttonType={buttonConfig.type || 'cart'} />
                  </div>
                </div>
              </div>
            )) : <Loader />}
          </div>
        </div>
      </div>
      <div className="container mx-auto">
        <div className="flex flex-col justify-center pb-6 mx-auto text-center sm:max-w-4xl sm:pb-10">
          <h3 className="my-1 mb-6 text-3xl font-medium text-slate-800">{translate('label.membership.alreadyMemberText')}</h3>
          <p className="my-2 text-sm font-normal text-slate-700">{translate('label.membership.upgradeMembershipText')}</p>
          <p className="my-1 text-sm font-normal text-slate-700">{translate('label.membership.upgradeAnyTimeText')}</p>
        </div>
        <div className="flex flex-col justify-center py-6 text-center border-t border-slate-200 sm:py-10">
          <h3 className="my-1 text-3xl font-medium text-slate-800">{translate('label.membership.membershipBenefitsText')}</h3>
          <div className="grid grid-cols-1 gap-10 mt-8 sm:grid-cols-4">
            <MemberBenefits />
          </div>
        </div>
      </div>
    </>
  )
}

MyMembershipPage.LayoutAccount = Layout
export default withDataLayer(MyMembershipPage, PAGE_TYPE, true, Layout)