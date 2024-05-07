import { Guid } from '@commerce/types'
import { useTranslation } from '@commerce/utils/use-translation'
import { useUI } from '@components/ui'
import { useConfig } from '@components/utils/myAccount'
import { BuildingOffice2Icon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import React from 'react'

function SideMenu({ handleClick, setShow, currentOption, deviceInfo, featureToggle}: any) {
  const config = useConfig();
  const translate = useTranslation()
  const { isMobile, isIPadorTablet } = deviceInfo
  const { user, referralProgramActive } = useUI()
  let isB2B = user?.companyId !== Guid.empty
  let newConfig: any = []
  if (config && typeof window !== 'undefined') {
    const hasMyCompany = config.some(
      (item: any) => item?.props === 'my-company'
    )
    const hasReferral = config.some(
      (item: any) => item?.props === 'refer-a-friend'
    )
    newConfig = [...config]
    if (isB2B) {
      let i = newConfig.length
      if (referralProgramActive) {
        if (!hasReferral) {
          newConfig.push({
            type: 'tab',
            text: translate('label.myAccount.referAFriendText'),
            mtext: translate('label.myAccount.referAFriendText'),
            props: 'refer-a-friend',
            href: "/my-account/refer-a-friend"
          })
        }
      }
      while (i--) {
        if (
          newConfig[i]?.props === 'address-book' ||
          newConfig[i]?.props === 'orders'
        ) {
          newConfig.splice(i, 1)
        }
      }
    }
    if (!isB2B) {
      if (referralProgramActive) {
        if (!hasReferral) {
          newConfig = [...config]
          newConfig.push({
            type: 'tab',
            text: translate('label.myAccount.referAFriendText'),
            mtext: translate('label.myAccount.referAFriendText'),
            props: 'refer-a-friend',
            href: "/my-account/refer-a-friend"
          })
        }
      } else {
        newConfig = [...config]
      }
    } else if (!hasMyCompany) {
      newConfig.push({
        type: 'tab',
        text: translate('label.myAccount.myCompanyText'),
        mtext: translate('label.myAccount.myCompanyText'),
        props: 'my-company',
        head: <BuildingOffice2Icon className="w-7 h-7 text-gray-500" />,
        href: '/my-account/my-company',
      })
    }
    if (featureToggle?.features?.enableMembership) {
      if (user?.hasMembership) {
        newConfig.push({
            type: 'tab',
            text: translate('label.membership.membershipText'),
            mtext: translate('label.membership.membershipText'),
            props: 'membership',
            href: '/my-account/membership',
        })
      }
    }
  }
  return (
    <>
    <div className='flex space-x-4 md:space-x-6 tabScroll'>
    {newConfig.map((item: any, idx: number) => (
        <>
           {item.text == currentOption ? (
              <>
                <Link
                 key={`my-acc-${idx}`}
                    shallow={true}
                    href={item.href}
                    passHref
                    onClick={() => {
                      handleClick
                      setShow(false)
                    }}
                    className={`block py-3 md:py-8 border-b-2 flex-shrink-0 text-sm sm:text-base ${item.text == currentOption
                    ? "border-primary-500 font-medium dark:text-slate-200 icon-text-black"
                    : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                    }`}
                  >
                    {isMobile ? item?.head : item?.text}
                  </Link>
              </>
            ) : (
              <>
                <Link
                  shallow={true}
                  href={item.href}
                  passHref
                  onClick={() => {
                    handleClick
                  }}
                  className="block py-3 md:py-8  flex-shrink-0 text-sm sm:text-base"
                >
                  <span className="inline-block text-black sm:hidden dark:text-white">
                    {isMobile ? item?.head : item?.mtext}
                  </span>
                  <span
                    className={`hidden sm:inline-block text-black dark:text-white ${item.text == 'My Company' && 'font-display'
                      }`}
                  >
                    {isMobile ? item?.head : item?.text}
                  </span>
                </Link>
              </>
            )}
        </>
      ))}
    </div>
    </>
  )
}

export default SideMenu
