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
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { BETTERCOMMERCE_DEFAULT_LANGUAGE } from '@components/utils/constants'
import LayoutAccount from '@components/Layout/LayoutAccount'
import { IPagePropsProvider } from '@framework/contracts/page-props/IPagePropsProvider'
import { getPagePropType, PagePropType } from '@framework/page-props'
function MyAccount() {
  const router = useRouter()
  const { CustomerProfileViewed } = EVENTS_MAP.EVENT_TYPES
  const { Customer } = EVENTS_MAP.ENTITY_TYPES
  const { user, isGuestUser, changeMyAccountTab } = useUI()
  const translate = useTranslation()

  useEffect(() => {
    if (isGuestUser) {
      router.push('/')
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
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

useEffect(()=>{
  changeMyAccountTab(translate('label.myAccount.myReturnsText'))
},[])
  useAnalytics(CustomerProfileViewed, loggedInEventData)

  return (
    <>
      <h2 className='text-2xl font-semibold sm:text-3xl'>{translate('label.order.returnHistoryHeadingText')}</h2>
      <div className={'orders bg-white dark:bg-transparent my-2 sm:my-6'}>
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
      ...(await serverSideTranslations(locale ?? BETTERCOMMERCE_DEFAULT_LANGUAGE!)),
    }, // will be passed to the page component as props
  }
}

export default withDataLayer(withAuth(MyAccount), PAGE_TYPES.OrderReturns, true, LayoutAccount)
