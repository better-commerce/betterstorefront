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
    <section aria-labelledby="recent-heading" className="w-full">
      {!wishListItems?.length && (
        <div className="flex flex-col items-center justify-center w-full py-2 mx-auto sm:px-0">
          <div className="my-0 font-semibold text-secondary-full-opacity text-m-16 text-24 dark:text-black">{translate('label.wishlist.emptyWishlistText')}</div>
          <p className="mt-3 text-xs sm:text-sm text-primary opacity-60 dark:text-black">{translate('label.wishlist.saveItemsText')}.{' '}</p>
          <div className="flex items-center justify-center w-full mt-5 sm:flex-col">
            <Link legacyBehavior passHref href={sanitizeRelativeUrl(`/search`)} className="w-50 flex items-center justify-center px-4 py-3 -mr-0.5 rounded-sm sm:px-6 btn-primary !text-sky-500 underline">
              <span className='px-6 py-2 font-semibold bg-white border rounded-full cursor-pointer hover:bg-sky-100 border-sky-500 text-sky-500'>{translate('label.orderDetails.startShoppingBtnText')}</span>
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
