import { useEffect } from 'react'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import withAuth from '@components/utils/withAuth'
import { useRouter } from 'next/router'
import { EVENTS_MAP } from '@components/services/analytics/constants'
import useAnalytics from '@components/services/analytics/useAnalytics'
import { useUI } from '@components/ui/context'
import React from 'react'
import Wishlist from '@components/account/Wishlist'
import { useTranslation } from '@commerce/utils/use-translation'
import LayoutAccount from '@components/Layout/LayoutAccount'
import { IPagePropsProvider } from '@framework/contracts/page-props/IPagePropsProvider'
import { getPagePropType, PagePropType } from '@framework/page-props'

function MyAccount({ deviceInfo, featureToggle, defaultDisplayMembership, }: any) {
  const router = useRouter()
  const { CustomerProfileViewed } = EVENTS_MAP.EVENT_TYPES
  const { Customer } = EVENTS_MAP.ENTITY_TYPES
  const translate = useTranslation()
  const { user, isGuestUser, changeMyAccountTab } = useUI()

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
    changeMyAccountTab(translate('label.wishlist.wishlistText'))
  },[])

  useAnalytics(CustomerProfileViewed, loggedInEventData)

  return (
    <>
      <h1 className='text-2xl font-semibold sm:text-3xl dark:text-black'>{translate('label.wishlist.wishlistText')}</h1>
      <div className={'orders bg-white dark:bg-transparent my-2 sm:my-6'}>
        <Wishlist deviceInfo={deviceInfo} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership} />
      </div>
    </>
  )
}

MyAccount.LayoutAccount = LayoutAccount

export async function getServerSideProps(context: any) {
  const { locale } = context
  const props: IPagePropsProvider = getPagePropType({ type: PagePropType.WISHLIST })
  const pageProps = await props.getPageProps({ cookies: context?.req?.cookies })

  return {
    props: {
      ...pageProps,
    }, // will be passed to the page component as props
  }
}

export default withDataLayer(withAuth(MyAccount), PAGE_TYPES.Wishlist, true, LayoutAccount)