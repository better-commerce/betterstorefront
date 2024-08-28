import { Guid } from '@commerce/types'
import { useTranslation } from '@commerce/utils/use-translation'
import { useUI } from '@components/ui'
import { useConfig } from '@components/utils/myAccount'
import { BuildingOffice2Icon, EllipsisHorizontalCircleIcon, BuildingStorefrontIcon, ServerIcon } from '@heroicons/react/24/outline'
import { StarIcon } from "@heroicons/react/24/outline";
import { ArrowPathRoundedSquareIcon, BookOpenIcon, ClipboardDocumentListIcon, HeartIcon, UserIcon } from '@heroicons/react/24/solid'
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
    newConfig = [
      {
        type: 'tab',
        text: translate('label.order.myOrdersText'),
        mtext: translate('label.order.myOrdersText'),
        props: 'orders',
        head: <ClipboardDocumentListIcon className="text-gray-500 w-7 h-7" />,
        href: '/my-account/orders',
        displayOrder: 1
      },
      {
        type: 'tab',
        text: translate('label.myAccount.myReturnsText'),
        mtext: translate('label.myAccount.myReturnsText'),
        props: 'returns',
        head: <ArrowPathRoundedSquareIcon className="text-gray-500 w-7 h-7" />,
        href: '/my-account/MyReturns',
        displayOrder: 3
      },
      {
        type: 'tab',
        text: translate('label.wishlist.wishlistText'),
        mtext: translate('label.wishlist.wishlistText'),
        props: 'wishlist',
        head: <HeartIcon className="text-gray-500 w-7 h-7" />,
        href: '/my-account/wishlist',
        displayOrder: 7
      },
      {
        type: 'tab',
        text: translate('label.myAccount.mySavedAddressText'),
        mtext: translate('label.myAccount.mySavedAddressText'),
        props: 'address-book',
        head: <BookOpenIcon className="text-gray-500 w-7 h-7" />,
        href: '/my-account/address-book',
        displayOrder: 8
      },
      {
        type: 'tab',
        text: translate('label.myAccount.myDetailsHeadingText'),
        mtext: translate('label.myAccount.myDetailsHeadingText'),
        props: 'details',
        head: <UserIcon className="text-gray-500 w-7 h-7" />,
        href: '/my-account',
        displayOrder: 9
      }
    ]
    if (isB2B) {
      let i = newConfig.length
      if (referralProgramActive) {
        if (!hasReferral) {
          newConfig.push({
            type: 'tab',
            text: translate('label.myAccount.referAFriendText'),
            mtext: translate('label.myAccount.referAFriendText'),
            props: 'refer-a-friend',
            head: <EllipsisHorizontalCircleIcon className="text-gray-500 w-7 h-7" />,
            href: "/my-account/refer-a-friend",
            displayOrder: 12
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
      newConfig.push({
        type: 'tab',
        text: translate('label.myAccount.dataPackText'),
        mtext: translate('label.myAccount.dataPackText'),
        props: 'data-pack',
        head: <ServerIcon className="text-gray-500 w-7 h-7" />,
        href: "/my-account/data-pack",
        displayOrder: 6
      })
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
            head: <EllipsisHorizontalCircleIcon className="text-gray-500 w-7 h-7" />,
            href: "/my-account/refer-a-friend",
            displayOrder: 11
          })
        }
      } else {
        newConfig = [...config]
      }
    } else if (!hasMyCompany) {
      newConfig.push(
        {
          type: 'tab',
          text: translate('label.myAccount.myCompanyMenus.order'),
          mtext: translate('label.myAccount.myCompanyMenus.order'),
          props: 'orders',
          head: <BuildingOffice2Icon className="text-gray-500 w-7 h-7" />,
          href: '/my-account/my-company/orders',
          displayOrder: 1
        },
        {
          type: 'tab',
          text: translate('label.myAccount.myCompanyMenus.quote'),
          mtext: translate('label.myAccount.myCompanyMenus.quote'),
          props: 'quotes',
          head: <BuildingOffice2Icon className="text-gray-500 w-7 h-7" />,
          href: '/my-account/my-company/quotes',
          displayOrder: 2
        },
        {
          type: 'tab',
          text: translate('label.myAccount.myCompanyMenus.invoice'),
          mtext: translate('label.myAccount.myCompanyMenus.invoice'),
          props: 'invoice',
          head: <BuildingOffice2Icon className="text-gray-500 w-7 h-7" />,
          href: '/my-account/my-company/invoices',
          displayOrder: 4
        },
        {
          type: 'tab',
          text: translate('label.myAccount.myCompanyMenus.shoppingList'),
          mtext: translate('label.myAccount.myCompanyMenus.shoppingList'),
          props: 'shopping-list',
          head: <BuildingOffice2Icon className="text-gray-500 w-7 h-7" />,
          href: '/my-account/my-company/shopping-list',
          displayOrder: 5
        },
        {
          type: 'tab',
          text: translate('label.myAccount.myCompanyMenus.requestQuote'),
          mtext: translate('label.myAccount.myCompanyMenus.requestQuote'),
          props: 'requests-for-quotes',
          head: <BuildingOffice2Icon className="text-gray-500 w-7 h-7" />,
          href: '/my-account/requests-for-quote',
          displayOrder: 5
        },
        {
          type: 'tab',
          text: translate('label.myAccount.myCompanyText'),
          mtext: translate('label.myAccount.myCompanyText'),
          props: 'my-company',
          head: <BuildingOffice2Icon className="text-gray-500 w-7 h-7" />,
          href: '/my-account/my-company',
          displayOrder: 10
        }
      )
    }
    if (featureToggle?.features?.enableMyStoreFeature) {
      newConfig.push({
        type: 'tab',
        text: translate('label.wishlist.myStore'),
        mtext: translate('label.wishlist.myStore'),
        props: 'my-store',
        head: <BuildingStorefrontIcon className="text-gray-500 w-7 h-7" />,
        href: '/my-store/recommendations',
        displayOrder: 14,
        childMenu: [
          {
            type: 'tab',
            text: translate('label.myAccount.recommendedForYouText'),
            mtext: translate('label.myAccount.recommendedForYouText'),
            props: 'myStoreRecommendation',
            head: <StarIcon className="text-gray-500 w-7 h-7 dark:invert" title="Recommended" />,
            href: '/my-store/recommendations',
          },
          {
            type: 'tab',
            text: translate('label.myAccount.browsingHistoryText'),
            mtext: translate('label.myAccount.browsingHistoryText'),
            props: 'myStoreRecommendation',
            head: <StarIcon className="text-gray-500 w-7 h-7 dark:invert" title="Recommended" />,
            href: '/my-store',
          },
          {
            type: 'tab',
            text: translate('label.myAccount.improveRecommendationText'),
            mtext: translate('label.myAccount.improveRecommendationText'),
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
          displayOrder: 13
        })
      }
    }
  }
  return (
    <>
      {isMobile ? (
        <>
          <hr className="mt-6 mb-2 border-slate-200 dark:border-slate-200"></hr>
          <div className="flex w-full gap-0">
            {newConfig.sort((a: any, b: any) => a.displayOrder - b.displayOrder).map((item: any, idx: number) => (
              <>
                {item.text == myAccountActiveTab ? (
                  <>
                    <Link
                      key={`my-acc-${idx}`}
                      shallow={true}
                      href={item.href}
                      passHref
                      className={`block py-2 text-sm sm:text-base w-full menu-top-space flex justify-center ${item.text == myAccountActiveTab
                        ? 'border-t-sky-500 border-t-2 menu-top-padding border-b  border-b-slate-200 pl-2 font-semibold dark:text-black icon-text-black'
                        : 'border-white border-t-2  text-slate-500 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-800'
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
                          className={`block py-1 pl-4 mt-2 text-xs w-full flex justify-center ${itemChild.text == myAccountActiveTab
                            ? 'border-t-sky-500 border-t-2 border-b border-b-slate-200 pl-2 font-semibold dark:text-slate-200 icon-text-black'
                            : 'border-white border-t-2  text-slate-500 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-800'
                            }`}
                        >
                          {isMobile ? itemChild?.head : itemChild?.text}
                        </Link>
                      </>
                    ))}
                  </>
                ) : (
                  <>
                    <Link
                      shallow={true}
                      href={item.href}
                      passHref
                      className="flex justify-center block w-full py-3 text-sm border-b sm:text-base border-slate-200"
                    >
                      <span className="inline-block text-black sm:hidden dark:text-white">
                        {isMobile ? item?.head : item?.mtext}
                      </span>
                      <span
                        className={`hidden sm:inline-block text-black dark:text-black ${item.text == 'My Company' && 'font-display'
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
      ) : (

        ///Desktop view
        <div className="flex flex-col gap-0">
          {newConfig.sort((a: any, b: any) => a.displayOrder - b.displayOrder).map((item: any, idx: number) => (
            <>
              {item.text == myAccountActiveTab ? (
                <>
                  <Link
                    key={`my-acc-${idx}`}
                    shallow={true}
                    href={item.href}
                    passHref
                    className={`block py-2 flex-shrink-0 text-sm sm:text-base ${item.text == myAccountActiveTab
                      ? 'border-l-sky-500 border-l-2 border-b border-b-slate-200 pl-2 font-semibold dark:text-black icon-text-black'
                      : 'border-white border-l-2  text-slate-500 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-800'
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
                          ? 'border-l-sky-500 border-l-2 border-b border-b-slate-200 pl-2 font-semibold dark:text-slate-200 icon-text-black'
                          : 'border-white border-l-2  text-slate-500 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-800'
                          }`}
                      >
                        {isMobile ? itemChild?.head : itemChild?.text}
                      </Link>
                    </>
                  ))}
                </>
              ) : (
                <>
                  <Link
                    shallow={true}
                    href={item.href}
                    passHref
                    className="flex-shrink-0 block py-3 text-sm border-b sm:text-base border-slate-200"
                  >
                    <span className="inline-block text-black sm:hidden dark:text-white">
                      {isMobile ? item?.head : item?.mtext}
                    </span>
                    <span
                      className={`hidden sm:inline-block text-black dark:text-black ${item.text == 'My Company' && 'font-display'
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
      )}
    </>
  )
}

export default SideMenu
