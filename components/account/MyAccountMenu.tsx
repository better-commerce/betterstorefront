import { Guid } from '@commerce/types'
import { useTranslation } from '@commerce/utils/use-translation'
import { useUI } from '@components/ui'
import { useConfig } from '@components/utils/myAccount'
import { BuildingOffice2Icon, EnvelopeIcon } from '@heroicons/react/24/outline'
import { StarIcon } from "@heroicons/react/24/outline";
import Link from 'next/link'

function SideMenu({ deviceInfo, featureToggle }: any) {
  const config = useConfig();
  const translate = useTranslation()
  const { isMobile, isIPadorTablet } = deviceInfo
  const { user, referralProgramActive, myAccountActiveTab } = useUI()
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
        head: <BuildingOffice2Icon className="text-gray-500 w-7 h-7" />,
        href: '/my-account/my-company',
      })
    }
    if (featureToggle?.features?.enableMyStoreFeature) {
      newConfig.push({
        type: 'tab',
        text: translate('label.wishlist.myStore'),
        mtext: translate('label.wishlist.myStore'),
        props: 'my-store',
        head: <EnvelopeIcon className="text-gray-500 w-7 h-7" />,
        href: '/my-store/recommendations',
        childMenu: [
          {
            type: 'tab',
            text: "Recommended For You",
            mtext: "Recommended For You",
            props: 'myStoreRecommendation',
            head: <StarIcon className="text-gray-500 w-7 h-7 dark:invert" title="Recommended" />,
            href: '/my-store/recommendations',
          },
          {
            type: 'tab',
            text: "Browsing History",
            mtext: "Browsing History",
            props: 'myStoreRecommendation',
            head: <StarIcon className="text-gray-500 w-7 h-7 dark:invert" title="Recommended" />,
            href: '/my-store',
          },
          {
            type: 'tab',
            text: "Improve Your Recommendation",
            mtext: "Improve Your Recommendation",
            props: 'myStoreRecommendation',
            head: <StarIcon className="text-gray-500 w-7 h-7 dark:invert" title="Recommended" />,
            href: '/my-store/improve-recommendations',
          }
        ]
      })
    }
    if (featureToggle?.features?.enableMembership) {
      if (user?.hasMembership) {
        newConfig.push({
          type: 'tab',
          text: translate('label.membership.myMembershipText'),
          mtext: translate('label.membership.myMembershipText'),
          props: 'myStore',
          head: <StarIcon className="text-gray-500 w-7 h-7 dark:invert" title="Membership" />,
          href: '/my-account/membership',
        })
      }
    }
  }
  return (
    <>
      <div className='flex flex-col gap-0'>
        {newConfig.map((item: any, idx: number) => (
          <>
            {item.text == myAccountActiveTab ? (
              <>
                <Link
                  key={`my-acc-${idx}`}
                  shallow={true}
                  href={item.href}
                  passHref
                  className={`block py-2 flex-shrink-0 text-sm sm:text-base ${item.text == myAccountActiveTab
                    ? "border-l-sky-500 border-l-2 border-b border-b-slate-200 pl-2 font-semibold dark:text-slate-200 icon-text-black"
                    : "border-white border-l-2  text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                    }`}
                >
                  {isMobile ? item?.head : item?.text}
                </Link>
                {item?.childMenu?.map((itemChild: any, iDx: number) => (
                  <>
                    <Link
                      key={`my-acc-${iDx}`}
                      shallow={true}
                      href={itemChild?.href}
                      passHref
                      className={`block py-1 pl-4 mt-2 flex-shrink-0 text-xs ${itemChild.text == myAccountActiveTab
                        ? "border-l-sky-500 border-l-2 border-b border-b-slate-200 pl-2 font-semibold dark:text-slate-200 icon-text-black"
                        : "border-white border-l-2  text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                        }`}
                    >
                      {isMobile ? itemChild?.head : itemChild?.text}
                    </Link>
                  </>
                ))}
              </>
            ) : (
              <>
                <Link shallow={true} href={item.href} passHref className="flex-shrink-0 block py-3 text-sm border-b sm:text-base border-slate-200" >
                  <span className="inline-block text-black sm:hidden dark:text-white">
                    {isMobile ? item?.head : item?.mtext}
                  </span>
                  <span className={`hidden sm:inline-block text-black dark:text-white ${item.text == 'My Company' && 'font-display'}`} >
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
