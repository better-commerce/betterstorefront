import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import withAuth from '@components/utils/withAuth'
import { EVENTS_MAP } from '@components/services/analytics/constants'
import useAnalytics from '@components/services/analytics/useAnalytics'
import { useUI } from '@components/ui/context'
import MyMembership from '@components/membership/MyMembership'
import { useTranslation } from '@commerce/utils/use-translation'
import LayoutAccount from '@components/Layout/LayoutAccount'
import { useEffect } from 'react'
import { IPagePropsProvider } from '@framework/contracts/page-props/IPagePropsProvider'
import { getPagePropType, PagePropType } from '@framework/page-props'
import { AnalyticsEventType } from '@components/services/analytics'

function Membership({ allMembershipPlans, defaultDisplayMembership  }: any) {
  const { recordAnalytics } = useAnalytics()
  const { user , changeMyAccountTab } = useUI()
  const { Customer } = EVENTS_MAP.ENTITY_TYPES
  const translate = useTranslation()
  let loggedInEventData: any = {
    eventType: AnalyticsEventType.CUSTOMER_PROFILE_VIEWED,
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
  recordAnalytics(AnalyticsEventType.CUSTOMER_PROFILE_VIEWED, loggedInEventData)
  return ( 
  <>
    <h2 className='text-2xl font-semibold sm:text-3xl'>{translate('label.membership.myMembershipText')}</h2>
    <MyMembership defaultDisplayMembership={defaultDisplayMembership} allMembershipPlans={allMembershipPlans}/>
  </> )
}

Membership.LayoutAccount = LayoutAccount

export async function getServerSideProps(context: any) {
  const { locale } = context
  const props: IPagePropsProvider = getPagePropType({ type: PagePropType.ACCOUNT_MEMBERSHIP })
  const pageProps = await props.getPageProps({ cookies: context?.req?.cookies })

  return {
    props: {
      ...pageProps,
    }, // will be passed to the page component as props
  }
}

export default withDataLayer(withAuth(Membership), PAGE_TYPES.Membership, true, LayoutAccount)
