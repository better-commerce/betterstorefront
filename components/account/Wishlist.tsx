import { useEffect, useState } from 'react'
import axios from 'axios'
import {
  NEXT_GET_WISHLIST,
  NEXT_REMOVE_WISHLIST,
} from '@components/utils/constants'
import { useUI } from '@components/ui/context'
import Link from 'next/link'
import cartHandler from '@components/services/cart'
import { LoadingDots } from '@components/ui'
import { round } from 'lodash'
import { matchStrings, priceFormat } from '@framework/utils/parse-util'
import Image from 'next/legacy/image'
import {
  WISHLIST_TITLE,
  WISHLIST_SUB_TITLE,
  GENERAL_VIEW_PRODUCT,
  GENERAL_ADD_TO_BASKET,
  IMG_PLACEHOLDER,
  GENERAL_REMOVE,
} from '@components/utils/textVariables'
import { isCartAssociated } from '@framework/utils/app-util'

export default function Wishlist() {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { user, basketId, setCartItems, openCart, setWishlist, cartItems } =
    useUI()

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
      

      <main className="lg:px-8">
        <div className="max-w-4xl lg:mx-12">
          <div className="lg:px-0 sm:px-0">
            <h1 className="font-extrabold tracking-tight text-gray-900">
              {/* {WISHLIST_TITLE} */}
            </h1>
          </div>

          <section aria-labelledby="recent-heading" className="mt-1">
            {!data.length && !isLoading && (
              <>
                <div className="flex flex-col w-full py-2 max-acc-container sm:px-0">
                  {/* <Image
                    src="/assets/images/basket-no-item.svg"
                    alt="no basket icon"
                    className="m-92-img"
                  /> */}
                  <div className="my-0 font-semibold text-secondary-full-opacity text-m-16 text-24">
                    {WISHLIST_SUB_TITLE}
                  </div>
                  <p className="text-xs sm:text-sm text-primary opacity-60">
                    Explore more and save items in your wishlist.{' '}
                  </p>
                  <div className="flex w-full mt-5 sm:flex-col">
                    <Link
                      legacyBehavior
                      passHref
                      href="/search"
                      className="w-50 flex items-center justify-center px-4 py-3 -mr-0.5 rounded-sm sm:px-6 btn-primary"
                    >
                      Start Shopping
                    </Link>
                  </div>
                </div>
              </>
            )}
            {isLoading ? <LoadingDots /> : null}
            <div className="space-y-16 sm:space-y-24">
                            <div className="flow-root px-0 mt-2 sm:mt-4 sm:px-0">
                              <div className="grid grid-cols-2 -mx-px sm:gap-y-4 sm:mx-0 md:grid-cols-4 product-listing-main lg:grid-cols-4">
                                {data.map((product: any, wid: number) => {
                                  const saving = product?.listPrice?.raw?.withTax - product?.price?.raw?.withTax;
                                  const discount = round((saving / product?.listPrice?.raw?.withTax) * 100, 0);
                                  return (
                                    <div className="mb-2 origin-center group hover:bg-white" key={wid}>
                                      <div key={product.id} className="relative px-1 pt-0 pb-2 group-hover:pb-0 sm:px-1">
                                        <Link
                                          passHref
                                          href={`/${product.slug}`}
                                        >
                                  
                                            <div className="relative overflow-hidden bg-gray-200 radius-xs aspect-w-1 aspect-h-1">
                                              <div className='imae-container'>
                                                {product.image != null ? (
                                                  <>
                                                    <Image
                                                      src={product.image}
                                                      alt={product.name}
                                                      layout='responsive'
                                                      width={400}
                                                      height={600}
                                                      className='object-cover object-center w-full h-full radius-xs sm:h-full'>
                                                    </Image>
                                                  </>
                                                ) : (
                                                  <>
                                                    <Image
                                                      src={IMG_PLACEHOLDER}
                                                      alt={product.name}
                                                      layout='responsive'
                                                      width={400}
                                                      height={600}
                                                      className='object-cover object-center w-full h-full radius-xs sm:h-full'>
                                                    </Image>
                                                  </>
                                                )
                                                }
                                                {/* <span className='absolute left-0 inline-block px-4 py-1 text-xs text-white uppercase bg-orange bottom-2'>Bestseller</span> */}
                                              </div>
                                              <span className="sr-only">{product.name}</span>
                                            </div>
                                       
                                        </Link>
                                        <div className="pt-0">
                                          <div className='grid grid-cols-12 px-2 mt-2 sm:grid-cols-12 sm:gap-x-2'>
                                            <div className="flex items-center col-span-12 sm:col-span-12">
                                              <h3 className='text-xs truncate max-width-250 text-brown-light text-10'>{product.classification.category}</h3>
                                            </div>
                                          </div>
                                          <h3 className="px-2 py-1 font-medium text-12 text-primary min-h-50 !text-sm">
                                            <Link href={`/${product.slug}`}>
                                             {product.name}
                                            </Link>
                                          </h3>
                                          <p className="px-2 mt-1 mb-2 font-medium text-12 text-primary sm:mt-2 min-h-40 sm:mb-0">
                                            {priceFormat(product?.price?.raw?.withTax)}
                                            {product?.listPrice?.raw?.withTax > product?.price?.raw?.withTax ? (
                                              <>
                                                <span className="px-2 font-normal text-gray-500 line-through text-12">
                                                  {priceFormat(product?.listPrice?.raw?.withTax)}
                                                </span>
                                                <span className='font-normal text-12 text-emerald-500'>{discount}% off</span>
                                              </>
                                            ) : null}
                                          </p>

                                          <div className="w-full px-2 mt-3">
                                            {product?.currentStock > 0 ?
                                              (
                                                <button
                                                  onClick={() => handleAddToCart(product)}
                                                  className="flex items-center justify-center w-full p-3 text-xs font-semibold text-black border uppercase"
                                                >
                                                  <span className='mr-2'><i className="sprite-icon sprite-cart"></i></span> {GENERAL_ADD_TO_BASKET}
                                                </button>
                                              ) :
                                              (
                                                <button
                                                  className="flex items-center justify-center w-full px-3 py-4 text-xs font-semibold text-black bg-gray-200 border"
                                                >
                                                  Out Of Stock
                                                </button>
                                              )
                                            }

                                          </div>
                                          <div className="absolute z-10 inline-block top-3 right-1">
                                            <button
                                              onClick={() =>
                                                handleRemoveFromWishlist(product)
                                              }
                                              className="text-red-600 hover:text-red-500"
                                            >
                                              <span className='mr-2'><i className="sprite-icon sprite-close"></i></span>
                                            </button>
                                          </div>
                                        </div>
                                      </div>
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
