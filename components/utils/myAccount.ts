import { useTranslation } from "@commerce/utils/use-translation"

export const useConfig: any = () => {
  const translate = useTranslation()
  return [
    {
      type: 'tab',
      text: translate('label.order.myOrdersText'),
      mtext: translate('label.order.myOrdersText'),
      props: 'orders',
      href:"/my-account/orders"
    },
    {
      type: 'tab',
      text: translate('common.label.myReturnsText'),
      mtext: translate('common.label.myReturnsText'),
      props: 'returns',
     href:"/my-account/MyReturns"
    },
    {
      type: 'tab',
      text: translate('label.wishlist.wishlistText'),
      mtext: translate('label.wishlist.wishlistText'),
      props: 'wishlist',
      href:"/my-account/wishlist"
    },
    {
      type: 'tab',
      text: translate('label.myAccount.myDetailsHeadingText'),
      mtext: translate('label.myAccount.myDetailsHeadingText'),
      props: 'details',
      href:"/my-account"
    },
    {
      type: 'tab',
      text: translate('label.myAccount.mySavedAddressText'),
      mtext: translate('label.myAccount.mySavedAddressText'),
      props: 'address-book',
      href:"/my-account/address-book"
    },
  
    {
      type: 'tab',
      text: translate('common.label.contactPrefText'),
      mtext: translate('common.label.contactPrefText'),
      props: 'contact',
     href:"/my-account/contact"
    },
   
  ]
}

