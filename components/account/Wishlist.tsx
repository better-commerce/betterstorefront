import { useEffect, useState } from 'react'
import Button from '@components/ui/Button'
import axios from 'axios'
import {
  NEXT_GET_WISHLIST,
  NEXT_REMOVE_WISHLIST,
} from '@components/utils/constants'
import { useUI } from '@components/ui/context'
import { maxBasketItemsCount } from '@framework/utils/app-util'
import Link from 'next/link'
import cartHandler from '@components/services/cart'
import { LoadingDots } from '@components/ui'
import { round } from 'lodash'
import { matchStrings, priceFormat } from '@framework/utils/parse-util'
import Image from 'next/legacy/image'
import {
  IMG_PLACEHOLDER,
} from '@components/utils/textVariables'
import dynamic from 'next/dynamic'
import { isCartAssociated, vatIncluded } from '@framework/utils/app-util'
import { generateUri } from '@commerce/utils/uri-util'
import { useTranslation } from '@commerce/utils/use-translation'
const ProductCard = dynamic(() => import('@new-components/ProductCard'))
export default function Wishlist({ deviceInfo }: any) {
  const translate = useTranslation()
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { user, basketId, setCartItems, openCart, setWishlist, cartItems } =
    useUI()

  const isIncludeVAT = vatIncluded()
  const fetchItems = async () => {
    !isLoading && setIsLoading(true)
    try {
      const response: any = await axios.post(NEXT_GET_WISHLIST, {
        id: user.userId,
        flag: true,
      })
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleAddToCart = (product: any) => {
    cartHandler()
      .addToCart(
        {
          basketId,
          productId: product.recordId,
          qty: 1,
          manualUnitPrice: product.price.raw.withTax,
          stockCode: product.stockCode,
          userId: user.userId,
          isAssociated: isCartAssociated(cartItems),
        },
        'ADD',
        { product }
      )
      .then((response: any) => {
        setCartItems(response)
        handleRemoveFromWishlist(product)
        openCart()
      })
      .catch((err: any) => console.log('error', err))
  }

  const handleRemoveFromWishlist = (product: any) => {
    const handleAsync = async () => {
      try {
        await axios.post(NEXT_REMOVE_WISHLIST, {
          id: user.userId,
          productId: product.recordId,
          flag: true,
        })
        fetchItems()
      } catch (error) {
        console.log(error, 'err')
      }
    }
    handleAsync()
  }

  return (
    <div className="bg-white">
      {/* Mobile menu */}
      <main className="">
        <div className="max-w-4xl">
          <div className="">
          </div>
          <section aria-labelledby="recent-heading" className="mt-1">
            {!data.length && !isLoading && (
              <div className="flex flex-col w-full py-2 max-acc-container sm:px-0">
                <div className="my-0 font-semibold text-secondary-full-opacity text-m-16 text-24">
                  {translate('label.wishlist.emptyWishlistText')}
                </div>
                <p className="text-xs sm:text-sm text-primary opacity-60">
                  {translate('label.wishlist.saveItemsText')}.{' '}
                </p>
                <div className="flex w-full mt-5 sm:flex-col">
                  <Link
                    legacyBehavior
                    passHref
                    href="/search"
                    className="w-50 flex items-center justify-center px-4 py-3 -mr-0.5 rounded-sm sm:px-6 btn-primary"
                  >
                    <Button className="w-52 nc-Button relative h-auto inline-flex items-center justify-center rounded-full transition-colors text-sm sm:text-base font-medium py-3 px-4 sm:py-3.5 sm:px-6  ttnc-ButtonPrimary disabled:bg-opacity-90 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 text-slate-50 dark:text-slate-800 shadow-xl  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-6000 dark:focus:ring-offset-0">{translate('label.orderDetails.startShoppingBtnText')}</Button>
                  </Link>
                </div>
              </div>
            )}
            {isLoading && <LoadingDots />}
            <div className="space-y-16 sm:space-y-24">
              <div className="flow-root px-0 mt-2 sm:mt-4 sm:px-0">
                <div className="grid grid-cols-1 sm:gap-5 sm:mx-0 md:grid-cols-2 product-listing-main lg:grid-cols-3">
                  {data.map((product: any, wid: number) => {
                    return (
                      <div key={`wishlist-${wid}`}>
                        <ProductCard data={product} deviceInfo={deviceInfo} maxBasketItemsCount={maxBasketItemsCount} />
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
