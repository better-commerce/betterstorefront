import Link from 'next/link'
import dynamic from 'next/dynamic'
import Button from '@components/ui/Button'
import { useUI } from '@components/ui/context'
import { maxBasketItemsCount, sanitizeRelativeUrl } from '@framework/utils/app-util'
import { useTranslation } from '@commerce/utils/use-translation'
const ProductCard = dynamic(() => import('@components/ProductCard'))
export default function Wishlist({ deviceInfo, featureToggle, defaultDisplayMembership, }: any) {
  const translate = useTranslation()
  const { wishListItems } = useUI()


  return (
    <section aria-labelledby="recent-heading" className="max-w-4xl">
      {!wishListItems?.length && (
        <div className="flex flex-col w-full py-2 max-acc-container sm:px-0">
          <div className="my-0 font-semibold text-secondary-full-opacity text-m-16 text-24 dark:text-black">{translate('label.wishlist.emptyWishlistText')}</div>
          <p className="mt-3 text-xs sm:text-sm text-primary opacity-60 dark:text-black">{translate('label.wishlist.saveItemsText')}.{' '}</p>
          <div className="flex w-full mt-5 sm:flex-col">
            <Link legacyBehavior passHref href={sanitizeRelativeUrl(`/search`)} className="w-50 flex items-center justify-center px-4 py-3 -mr-0.5 rounded-sm sm:px-6 btn-primary">
              <Button className="w-52 nc-Button relative h-auto inline-flex items-center justify-center rounded-full transition-colors text-sm sm:text-base font-medium py-3 px-4 sm:py-3.5 sm:px-6  ttnc-ButtonPrimary disabled:bg-opacity-90 bg-slate-900 dark:!bg-slate-900 hover:bg-slate-800 text-slate-50 dark:!text-slate-50 shadow-xl  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-6000 dark:focus:ring-offset-0">{translate('label.orderDetails.startShoppingBtnText')}</Button>
            </Link>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 sm:gap-5 sm:mx-0 md:grid-cols-2 product-listing-main lg:grid-cols-3">
        {wishListItems?.map((product: any, wid: number) => (
          <div key={`wishlist-${wid}`}>
            <ProductCard data={product} deviceInfo={deviceInfo} maxBasketItemsCount={maxBasketItemsCount} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership} />
          </div>
        ))}
      </div>
    </section>
  )
}
