import { useTranslation } from '@commerce/utils/use-translation'
import {EnvelopeIcon,BookOpenIcon,HeartIcon,ArrowPathRoundedSquareIcon,UserIcon, ClipboardDocumentListIcon, BuildingOffice2Icon} from '@heroicons/react/24/outline'
export const useConfig: any = () => {
  const translate = useTranslation()
  return [
    {
      type: 'tab',
      text: translate('label.myAccount.myDetailsHeadingText'),
      mtext: translate('label.myAccount.myDetailsHeadingText'),
      props: 'details',
      head: <UserIcon className="w-7 h-7 text-gray-500" />,
      href: '/my-account',
    },
    {
      type: 'tab',
      text: translate('label.order.myOrdersText'),
      mtext: translate('label.order.myOrdersText'),
      props: 'orders',
      head: <ClipboardDocumentListIcon className="w-7 h-7 text-gray-500" />,
      href: '/my-account/orders',
    },
    {
      type: 'tab',
      text: translate('label.myAccount.myReturnsText'),
      mtext: translate('label.myAccount.myReturnsText'),
      props: 'returns',
      head: <ArrowPathRoundedSquareIcon className="w-7 h-7 text-gray-500" />,
      href: '/my-account/MyReturns',
    },
    {
      type: 'tab',
      text: translate('label.wishlist.wishlistText'),
      mtext: translate('label.wishlist.wishlistText'),
      props: 'wishlist',
      head: <HeartIcon className="w-7 h-7 text-gray-500" />,
      href: '/my-account/wishlist',
    },
    {
      type: 'tab',
      text: translate('label.myAccount.mySavedAddressText'),
      mtext: translate('label.myAccount.mySavedAddressText'),
      props: 'address-book',
      head: <BookOpenIcon className="w-7 h-7 text-gray-500" />,
      href: '/my-account/address-book',
    },
    {
      type: 'tab',
      text: translate('label.contactPreferences.contactPreferencesText'),
      mtext: translate('label.contactPreferences.contactPreferencesText'),
      props: 'contact',
      head: <EnvelopeIcon className="w-7 h-7 text-gray-500" />,
      href: '/my-account/contact',
    },
  ]
}
