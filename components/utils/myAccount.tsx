import { useTranslation } from '@commerce/utils/use-translation'
import { EnvelopeIcon, BookOpenIcon, HeartIcon, ArrowPathRoundedSquareIcon, UserIcon, ClipboardDocumentListIcon, BuildingOffice2Icon } from '@heroicons/react/24/outline'
export const useConfig: any = () => {
  const translate = useTranslation()
  return [
    {
      type: 'tab',
      text: translate('label.myAccount.myDetailsHeadingText'),
      mtext: translate('label.myAccount.myDetailsHeadingText'),
      props: 'details',
      head: <UserIcon className="text-gray-500 w-7 h-7" />,
      href: '/my-account',
      displayOrder: 2
    },
    {
      type: 'tab',
      text: translate('label.order.myOrdersText'),
      mtext: translate('label.order.myOrdersText'),
      props: 'orders',
      head: <ClipboardDocumentListIcon className="text-gray-500 w-7 h-7" />,
      href: '/my-account/orders',
      displayOrder: 3
    },
    {
      type: 'tab',
      text: translate('label.myAccount.myReturnsText'),
      mtext: translate('label.myAccount.myReturnsText'),
      props: 'returns',
      head: <ArrowPathRoundedSquareIcon className="text-gray-500 w-7 h-7" />,
      href: '/my-account/MyReturns',
      displayOrder: 11
    },
    {
      type: 'tab',
      text: translate('label.wishlist.wishlistText'),
      mtext: translate('label.wishlist.wishlistText'),
      props: 'wishlist',
      head: <HeartIcon className="text-gray-500 w-7 h-7" />,
      href: '/my-account/wishlist',
      displayOrder: 6
    },
    {
      type: 'tab',
      text: translate('label.myAccount.mySavedAddressText'),
      mtext: translate('label.myAccount.mySavedAddressText'),
      props: 'address-book',
      head: <BookOpenIcon className="text-gray-500 w-7 h-7" />,
      href: '/my-account/address-book',
      displayOrder: 7
    }
  ]
}
