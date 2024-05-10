import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import withAuth from '@components/utils/withAuth'
import { EVENTS_MAP } from '@components/services/analytics/constants'
import useAnalytics from '@components/services/analytics/useAnalytics'
import { useUI } from '@components/ui/context'
import MyMembership from '@components/membership/MyMembership'
import { stringToNumber } from '@framework/utils/parse-util'
import commerce from '@lib/api/commerce'
import { useTranslation } from '@commerce/utils/use-translation'
import { BETTERCOMMERCE_DEFAULT_LANGUAGE, EmptyGuid } from '@components/utils/constants'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import LayoutAccount from '@components/Layout/LayoutAccount'
import { useEffect } from 'react'

function Membership({ allMembershipPlans, defaultDisplayMembership  }: any) {
  const { user , changeMyAccountTab } = useUI()
  const { CustomerProfileViewed } = EVENTS_MAP.EVENT_TYPES
  const { Customer } = EVENTS_MAP.ENTITY_TYPES
  const translate = useTranslation()
  let loggedInEventData: any = {
    eventType: CustomerProfileViewed,
  }

  useEffect(()=>{
    changeMyAccountTab(translate('label.membership.myMembershipText'))
  },[])
  
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
  useAnalytics(CustomerProfileViewed, loggedInEventData)
  return ( 
  <>
    <h2 className='text-2xl font-semibold sm:text-3xl'>{translate('label.membership.myMembershipText')}</h2>
    <MyMembership defaultDisplayMembership={defaultDisplayMembership} allMembershipPlans={allMembershipPlans}/>
  </> )
}

Membership.LayoutAccount = LayoutAccount

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

export default withDataLayer(withAuth(Membership), PAGE_TYPES.Membership, true, LayoutAccount)
