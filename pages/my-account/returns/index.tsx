import { useEffect } from 'react'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import withAuth from '@components/utils/withAuth'
import { useRouter } from 'next/router'
import { EVENTS_MAP } from '@components/services/analytics/constants'
import useAnalytics from '@components/services/analytics/useAnalytics'
import { useUI } from '@components/ui/context'
import { useTranslation } from '@commerce/utils/use-translation'
import React from 'react'
import MyReturns from '@components/account/MyReturns'
import LayoutAccount from '@components/Layout/LayoutAccount'
import { IPagePropsProvider } from '@framework/contracts/page-props/IPagePropsProvider'
import { getPagePropType, PagePropType } from '@framework/page-props'
import { AnalyticsEventType } from '@components/services/analytics'

function MyAccount() {
  const router = useRouter()
  const { Customer } = EVENTS_MAP.ENTITY_TYPES
  const { user, isGuestUser, changeMyAccountTab } = useUI()
  const translate = useTranslation()

  useEffect(() => {
    if (isGuestUser) {
      router.push('/')
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  let loggedInEventData: any = { eventType: AnalyticsEventType.CUSTOMER_PROFILE_VIEWED, entityType: Customer, }

  if (user && user.userId) {
    loggedInEventData = { ...loggedInEventData, ...user, }
  }

  useEffect(()=>{
    changeMyAccountTab(translate('label.myAccount.myReturnsText'))
  },[])
  useAnalytics(AnalyticsEventType.CUSTOMER_PROFILE_VIEWED, loggedInEventData)

  return (
    <>
      <h1 className='text-xl font-normal sm:text-2xl dark:text-black'>{translate('label.order.returnHistoryHeadingText')}</h1>
      <div className={'orders bg-white dark:bg-transparent my-2 sm:my-4'}>
        <MyReturns />
      </div>
    </>
  )
}

MyAccount.LayoutAccount = LayoutAccount

export async function getServerSideProps(context: any) {
  const { locale } = context
  const props: IPagePropsProvider = getPagePropType({ type: PagePropType.COMMON })
  const pageProps = await props.getPageProps({ cookies: context?.req?.cookies })

  return {
    props: {
      ...pageProps,
    }, // will be passed to the page component as props
  }
}

export default withDataLayer(withAuth(MyAccount), PAGE_TYPES.OrderReturns, true, LayoutAccount)
