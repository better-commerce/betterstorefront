import { useState, useEffect, useMemo } from 'react'
import Layout from '@components/Layout/Layout'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import { useConfig } from '@components/utils/myAccount'
import withAuth from '@components/utils/withAuth'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { EVENTS_MAP } from '@components/services/analytics/constants'
import useAnalytics from '@components/services/analytics/useAnalytics'
import { useUI } from '@components/ui/context'
import React from 'react'
import MyDetails from '@components/account/MyDetails'
import { StarIcon } from "@heroicons/react/24/outline";
import { Guid } from '@commerce/types'
import NextHead from 'next/head'
import { BETTERCOMMERCE_DEFAULT_LANGUAGE, SITE_ORIGIN_URL } from '@components/utils/constants'
import { useTranslation } from '@commerce/utils/use-translation'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import LayoutAccount from '@components/Layout/LayoutAccount'
import { BuildingOffice2Icon } from '@heroicons/react/24/outline'
function MyAccount() {
  const [isShow, setShow] = useState(true)
  const config = useConfig();
  const { user, isGuestUser, changeMyAccountTab } = useUI()
  const router = useRouter()
  const translate = useTranslation()
  const { CustomerProfileViewed } = EVENTS_MAP.EVENT_TYPES
  const { Customer } = EVENTS_MAP.ENTITY_TYPES
  // const newConfig: any = useMemo(() => {
  //   let output: any = []
  //   let isB2B = user?.companyId !== Guid.empty
  //   const hasMyCompany = config?.some((item: any) => item?.props === 'my-company')
  //   const hasReferral = config?.some((item: any) => item?.props === 'refer-a-friend')
  //   output = [...config]
  //   if (isB2B) {
  //     let i = output.length
  //     if (referralProgramActive) {
  //       if (!hasReferral) {
  //         output.push({
  //           type: 'tab',
  //           text: 'Refer a Friend',
  //           mtext: 'Refer a Friend',
  //           props: 'refer-a-friend',
  //           href: "/my-account/refer-a-friend"
  //         })
  //       }
  //     }
  //     while (i--) {
  //       if (output[i]?.props === 'address-book' || output[i]?.props === 'orders') {
  //         output.splice(i, 1)
  //       }
  //     }
  //   }
  //   if (!isB2B) {
  //     if (referralProgramActive) {
  //       if (!hasReferral) {
  //         output = [...config]
  //         output.push({
  //           type: 'tab',
  //           text: 'Refer a Friend',
  //           mtext: 'Refer a Friend',
  //           props: 'refer-a-friend',
  //           href: "/my-account/refer-a-friend"
  //         })
  //       }
  //     } else {
  //       output = [...config]
  //     }
  //   } else if (!hasMyCompany) {
  //     output.push({
  //       type: 'tab',
  //       text: 'My Company',
  //       mtext: 'My Company',
  //       props: 'my-company',
  //       head: <BuildingOffice2Icon className="text-gray-500 w-7 h-7" />,
  //       href: '/my-account/my-company',
  //     })
  //   }
    
  //   if (featureToggle?.features?.enableMembership) {
  //     if (user?.hasMembership) {
  //       output.push({
  //           type: 'tab',
  //           text: translate('label.membership.membershipText'),
  //           mtext: translate('label.membership.membershipText'),
  //           props: 'membership',
  //           head: <StarIcon className="w-7 h-7 text-gray-500 dark:invert" title="Membership" />,
  //           href: '/my-account/membership',
  //       })
  //     }
  //   }
    
  //   return output
  // }, [config])

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
    changeMyAccountTab(translate('label.myAccount.myDetailsHeadingText'))
  },[])
  
  useAnalytics(CustomerProfileViewed, loggedInEventData)

  const handleToggleShowState = () => {
    setShow(!isShow)
  }


  return ( 
    <div className={'orders bg-white dark:bg-transparent'}>
      <MyDetails/>
    </div> )
  }

MyAccount.LayoutAccount = LayoutAccount

const PAGE_TYPE = PAGE_TYPES.Page

export async function getServerSideProps(context: any) {
  const { locale } = context
  return {
    props: {
      ...(await serverSideTranslations(locale ?? BETTERCOMMERCE_DEFAULT_LANGUAGE!)),
    }, // will be passed to the page component as props
  }
}

export default withDataLayer(withAuth(MyAccount), PAGE_TYPE, true, LayoutAccount)