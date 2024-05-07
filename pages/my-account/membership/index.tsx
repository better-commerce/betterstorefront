import { useState } from 'react'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import withAuth from '@components/utils/withAuth'
import { useRouter } from 'next/router'
import { EVENTS_MAP } from '@components/services/analytics/constants'
import useAnalytics from '@components/services/analytics/useAnalytics'
import { useUI } from '@components/ui/context'
import NextHead from 'next/head'
import React from 'react'
// import MyOrders from '@old-components/account/MyOrders'
import MyMembership from '@components/membership/MyMembership'
import { stringToNumber } from '@framework/utils/parse-util'
import commerce from '@lib/api/commerce'
import { BETTERCOMMERCE_DEFAULT_LANGUAGE, EmptyGuid, SITE_ORIGIN_URL, } from '@components/utils/constants'
import SideMenu from '@components/account/MyAccountMenu'
import { useTranslation } from '@commerce/utils/use-translation'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import LayoutAccount from '@components/Layout/LayoutAccount'
const PAGE_SIZE = 10

function Membership({ deviceInfo, allMembershipPlans, defaultDisplayMembership , featureToggle }: any) {
  const { user } = useUI()
  const router = useRouter()
  const [isShow, setShow] = useState(true)
  const { CustomerProfileViewed } = EVENTS_MAP.EVENT_TYPES
  const { Customer } = EVENTS_MAP.ENTITY_TYPES
  const translate = useTranslation()
  const [active, setActive] = useState(false)
  const currentOption = translate('label.membership.membershipText')

  let loggedInEventData: any = {
    eventType: CustomerProfileViewed,
  }

  if (user && user.userId) {
    loggedInEventData = {
      ...loggedInEventData,
      entity: JSON.stringify({
        email: user.email,
        dateOfBirth: user.yearOfBirth,
        gender: user.gender,
        id: user.userId,
        name: user.firstName + user.lastName,
        postCode: user.postCode,
      }),
      entityId: user.userId,
      entityName: user.firstName + user.lastName,
      entityType: Customer,
    }
  }

  const handleClick = () => {
    setActive(!active)
  }
  useAnalytics(CustomerProfileViewed, loggedInEventData)


  return (
    <>
      <NextHead>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <link rel="canonical" id="canonical" href={SITE_ORIGIN_URL + router.asPath} />
        <title>{currentOption}</title>
        <meta name="title" content={currentOption} />
        <meta name="description" content={currentOption} />
        <meta name="keywords" content={currentOption} />
        <meta property="og:image" content="" />
        <meta property="og:title" content={currentOption} key="ogtitle" />
        <meta property="og:description" content={currentOption} key="ogdesc" />
      </NextHead>
      <section className="container w-full bar header-space">
        <div className="mt-14 sm:mt-20">
          <div className='max-w-4xl mx-auto'>
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
            <SideMenu
              handleClick={handleClick}
              setShow={setShow}
              currentOption={currentOption}
              deviceInfo={deviceInfo}
              featureToggle={featureToggle}
            />
            <hr className="border-slate-200 dark:border-slate-700"></hr>
          </div>
          <div className="max-w-4xl pb-24 mx-auto pt-14 sm:pt-26 lg:pb-32">
            <h2 className='text-2xl font-semibold sm:text-3xl'>{translate('label.membership.myMembershipText')}</h2>
            <div className={'orders bg-white dark:bg-transparent my-2 sm:my-6'}>
                <MyMembership defaultDisplayMembership={defaultDisplayMembership} allMembershipPlans={allMembershipPlans}/>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

Membership.LayoutAccount = LayoutAccount

const PAGE_TYPE = PAGE_TYPES.Page

export async function getServerSideProps(context: any) {
  const { locale } = context
  const data = {
    "SearchText": null,
    "PricingType": 0,
    "Name": null,
    "TermType": 0,
    "IsActive": 1,
    "ProductId": EmptyGuid,
    "CategoryId": EmptyGuid,
    "ManufacturerId": EmptyGuid,
    "SubManufacturerId": EmptyGuid,
    "PlanType": 0,
    "CurrentPage": 0,
    "PageSize": 0
  }
  let defaultDisplayMembership = {}
  const { result: allMembershipPlans } = await commerce.getMembershipPlans({data, cookies: context?.req?.cookies})
  if (allMembershipPlans?.length) {
   const MembershipPlans = allMembershipPlans?.sort((a: any, b: any) => a?.price?.raw?.withTax - b?.price?.raw?.withTax)[0]
    if (MembershipPlans) {
      const promoCode = MembershipPlans?.membershipBenefits?.[0]?.code
      if (promoCode) {
        const promotion= await commerce.getPromotion(promoCode)
        defaultDisplayMembership ={ membershipPromoDiscountPerc: stringToNumber(promotion?.result?.additionalInfo1) , membershipPrice : MembershipPlans?.price?.raw?.withTax}
      }
    }
  }
  return {
    props: {
      ...(await serverSideTranslations(locale ?? BETTERCOMMERCE_DEFAULT_LANGUAGE!)),
      defaultDisplayMembership,
      allMembershipPlans
    }, // will be passed to the page component as props
  }
}

export default withDataLayer(withAuth(Membership), PAGE_TYPE, true, LayoutAccount)
