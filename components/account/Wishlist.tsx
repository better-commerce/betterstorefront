import { useEffect, useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import axios from 'axios'
import Button from '@components//ui/Button'
import { NEXT_GET_WISHLIST } from '@components//utils/constants'
import { useUI } from '@components//ui/context'
import { maxBasketItemsCount } from '@framework/utils/app-util'
import { LoadingDots } from '@components//ui'
import { useTranslation } from '@commerce/utils/use-translation'
const ProductCard = dynamic(() => import('@components//ProductCard'))
export default function Wishlist({ deviceInfo }: any) {
  const translate = useTranslation()
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { user, setWishlist } = useUI()

  const fetchItems = async () => {
    !isLoading && setIsLoading(true)
    try {
      const response: any = await axios.post(NEXT_GET_WISHLIST, { id: user.userId, flag: true, })
      setIsLoading(false)
      setData(response.data)
      setWishlist(response.data)
    } catch (error) {
      console.log(error, 'err')
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  return (
    <section aria-labelledby="recent-heading" className="max-w-4xl">
      {!data.length && !isLoading && (
        <div className="flex flex-col w-full py-2 max-acc-container sm:px-0">
          <div className="my-0 font-semibold text-secondary-full-opacity text-m-16 text-24">{translate('label.wishlist.emptyWishlistText')}</div>
          <p className="text-xs sm:text-sm text-primary opacity-60">{translate('label.wishlist.saveItemsText')}.{' '}</p>
          <div className="flex w-full mt-5 sm:flex-col">
            <Link legacyBehavior passHref href="/search" className="w-50 flex items-center justify-center px-4 py-3 -mr-0.5 rounded-sm sm:px-6 btn-primary">
              <Button className="w-52 nc-Button relative h-auto inline-flex items-center justify-center rounded-full transition-colors text-sm sm:text-base font-medium py-3 px-4 sm:py-3.5 sm:px-6  ttnc-ButtonPrimary disabled:bg-opacity-90 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 text-slate-50 dark:text-slate-800 shadow-xl  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-6000 dark:focus:ring-offset-0">{translate('label.orderDetails.startShoppingBtnText')}</Button>
            </Link>
          </div>
        </div>
      )}
      {isLoading && <LoadingDots />}
      <div className="grid grid-cols-1 sm:gap-5 sm:mx-0 md:grid-cols-2 product-listing-main lg:grid-cols-3">
        {data?.map((product: any, wid: number) => (
          <div key={`wishlist-${wid}`}>
            <ProductCard data={product} deviceInfo={deviceInfo} maxBasketItemsCount={maxBasketItemsCount} />
          </div>
        ))}
      </div>
    </section>
  )
}
