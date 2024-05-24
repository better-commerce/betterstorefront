import { Guid } from '@commerce/types'
import { generateUri } from '@commerce/utils/uri-util'
import { useTranslation } from '@commerce/utils/use-translation'
import Prices from '@components/Prices'
import wishlistHandler from '@components/services/wishlist'
import { useUI } from '@components/ui'
import { NEXT_CREATE_WISHLIST } from '@components/utils/constants'
import { IMG_PLACEHOLDER } from '@components/utils/textVariables'
import { getCartValidateMessages, vatIncluded } from '@framework/utils/app-util'
import { matchStrings, tryParseJson } from '@framework/utils/parse-util'
import { HeartIcon, MinusIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import axios from 'axios'
import Link from 'next/link'
import { useState } from 'react'

const CartItems = ({ userCart, reValidateData, handleItem, openModal, featureToggle, defaultDisplayMembership, }: any) => {
  const translate = useTranslation()
  const isIncludeVAT = vatIncluded()
  const [itemClicked, setItemClicked] = useState<any | Array<any>>()
  const { setCartItems, cartItems, basketId, isGuestUser, user, setIsSplitDelivery, isSplitDelivery, openLoginSideBar, addToWishlist, openWishlist, setSidebarView, closeSidebar } = useUI()
  const [isWishlistClicked, setIsWishlistClicked] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const { isInWishList } = wishlistHandler()
  const getUserId = () => {
    return user?.userId && user?.userId != Guid.empty ? user?.userId : cartItems?.userId
  }
  const enableHtmlScroll = () => {
    const element: any = document.getElementsByTagName('html')[0]
    element.classList.add('overlow-y-auto-p')
  }
  const insertToLocalWishlist = (product: any) => {
    const userId = getUserId()
    if (isGuestUser || (userId && matchStrings(userId, Guid.empty, true))) {
      openLoginSideBar()
      return
    }
    const createWishlist = async () => {
      try {
        await axios.post(NEXT_CREATE_WISHLIST, {
          id: user?.userId,
          productId: (product?.productId).toLowerCase(),
          flag: true,
        })

      } catch (error) {
        console.log(error, 'error')
      }
    }
    createWishlist()
    setIsWishlistClicked(true)
    addToWishlist(product)
    handleItem(product, 'delete')
    openWishlistAfter()
  }
  const openWishlistAfter = () => {
    setTimeout(() => openWishlist(), 1000)
  }

  const handleWishList = async (product: any | Array<any>) => {
    closeModal()
    const objUser = localStorage.getItem('user')
    if (!objUser || isGuestUser) {
      //  setAlert({ type: 'success', msg:" Please Login "})
      openLoginSideBar()
      return
    }
    if (objUser) {
      const createWishlist = async (product: any) => {
        try {
          await axios.post(NEXT_CREATE_WISHLIST, {
            id: getUserId(),
            productId: itemClicked?.length
              ? product?.productId.toLowerCase()
              : itemClicked?.productId.toLowerCase(),
            flag: true,
          })
          insertToLocalWishlist(product)
        } catch (error) {
          console.log(error, 'error')
        }
      }

      if (itemClicked && itemClicked?.length) {
        itemClicked?.forEach((product: any) => {
          createWishlist(product)
        })
      } else if (itemClicked?.productId) {
        createWishlist(product)
      }
    } else {
      closeSidebar()
      setSidebarView('LOGIN_VIEW')
      enableHtmlScroll()
    }

    let productAvailability = 'Yes'
    if (product?.currentStock > 0) {
      productAvailability = 'Yes'
    } else {
      productAvailability = 'No'
    }
  }
  const closeModal = () => {
    setIsOpen(false)
  }
  return (
    <section aria-labelledby="cart-heading" className={`lg:col-span-7 basket-cart-items`}>
      <div className='w-full divide-y divide-slate-200 dark:divide-slate-700'>
        {userCart.lineItems?.map((product: any, productIdx: number) => {
          const soldOutMessage = getCartValidateMessages(reValidateData?.messageCode, product)
          return (
            <>
              <div key={`cart-${productIdx}`} className={`relative flex flex-col last:pb-0 ${product?.price?.raw?.withTax > 0 ? 'py-4 sm:py-6 xl:py-8' : 'bg-green-100 items-center mb-2 py-2 sm:py-2 xl:py-2 px-4'}`} >
                <div className='flex'>
                  <div className={`${product?.price?.raw?.withTax > 0 ? 'w-24 overflow-hidden h-36 sm:w-32' : 'w-16 overflow-hidden h-20 sm:w-16'} relative flex-shrink-0 rounded-xl bg-slate-100`}>
                    <img src={generateUri(product.image, 'h=200&fm=webp') || IMG_PLACEHOLDER} alt={product?.name} className="object-contain object-center w-full h-full p-2" />
                    <Link href={`/${product?.slug}`} className="absolute inset-0"></Link>
                  </div>

                  <div className="flex flex-col flex-1 ml-3 sm:ml-6">
                    <div>
                      <div className="flex justify-between ">
                        <div className="flex-[1.5] ">
                          <h2 className="mb-1 text-sm font-semibold text-gray-500 basket-item-brand"> {product?.brand} </h2>
                          <h3 className="text-base font-semibold">
                            <Link href={`/${product?.slug}`}>{product?.name}</Link>
                          </h3>

                          <div className="mt-1.5 sm:mt-2.5 flex text-sm text-slate-600 dark:text-slate-300">
                            {product?.colorName != "" &&
                              <div className="flex items-center space-x-1.5">
                                <svg className="w-4 h-4 dark:text-slate-600" viewBox="0 0 24 24" fill="none">
                                  <path d="M7.01 18.0001L3 13.9901C1.66 12.6501 1.66 11.32 3 9.98004L9.68 3.30005L17.03 10.6501C17.4 11.0201 17.4 11.6201 17.03 11.9901L11.01 18.0101C9.69 19.3301 8.35 19.3301 7.01 18.0001Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                  <path d="M8.35 1.94995L9.69 3.28992" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                  <path d="M2.07 11.92L17.19 11.26" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                  <path d="M3 22H16" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                  <path d="M18.85 15C18.85 15 17 17.01 17 18.24C17 19.26 17.83 20.09 18.85 20.09C19.87 20.09 20.7 19.26 20.7 18.24C20.7 17.01 18.85 15 18.85 15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span className='dark:text-slate-600'>{product?.colorName}</span>
                              </div>
                            }
                            {product?.size != "" &&
                              <>
                                <span className="mx-4 border-l border-slate-200 dark:border-slate-700 "></span>
                                <div className="flex items-center space-x-1.5">
                                  <svg className="w-4 h-4 dark:text-slate-600" viewBox="0 0 24 24" fill="none">
                                    <path d="M21 9V3H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M3 15V21H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M21 3L13.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M10.5 13.5L3 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                  <span className='uppercase dark:text-slate-600'>{product?.size}</span>
                                </div>
                              </>
                            }
                          </div>
                          <div className="relative flex items-center justify-between w-full mt-3 sm:hidden">
                            {!product?.isMembership && product?.price?.raw?.withTax > 0 ?
                              <div className='relative block text-left'>
                                <div className='inline-block'>
                                  <div className="flex items-center justify-around text-gray-900">
                                    <div className='flex items-center justify-center w-8 h-8 border rounded-full border-slate-400'>
                                      <MinusIcon onClick={() => handleItem(product, 'decrease')} className="w-4 cursor-pointer " />
                                    </div>
                                    <span className="w-10 h-8 px-4 py-2 text-md sm:py-2">
                                      {product.qty}
                                    </span>
                                    <div className='flex items-center justify-center w-8 h-8 border rounded-full border-slate-400'>
                                      <PlusIcon className="w-4 cursor-pointer" onClick={() => handleItem(product, 'increase')} />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              : <div></div>}
                            <Prices contentClass="py-1 px-2 md:py-1.5 md:px-2.5 text-sm font-medium h-full" price={product?.price} listPrice={product?.listPrice} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership} />
                          </div>
                        </div>
                        {!product?.isMembership && product?.price?.raw?.withTax !== 0 &&
                          <div className="relative justify-center hidden text-center sm:flex">
                            <span className='flex items-center justify-center w-8 h-8 border rounded-full border-slate-300'><MinusIcon onClick={() => handleItem(product, 'decrease')} className="w-4 cursor-pointer dark:text-black" /></span>
                            <span className="w-10 h-8 px-4 py-1 text-md sm:py-1 dark:text-black">
                              {product.qty}
                            </span>
                            <span className='flex items-center justify-center w-8 h-8 border rounded-full border-slate-300'><PlusIcon className="w-4 cursor-pointer dark:text-black" onClick={() => handleItem(product, 'increase')} /></span>
                          </div>
                        }
                        <div className="justify-end flex-1 hidden sm:flex basket-item-price">
                          <Prices price={product?.price} listPrice={product?.listPrice} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership} className="mt-0.5" />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 mt-auto text-sm">
                      {product?.price?.raw?.withTax != 0 &&
                        <>
                          <button className="flex items-center gap-1 text-xs font-medium text-left text-gray-700 hover:text-black" onClick={() => { insertToLocalWishlist(product) }} disabled={isInWishList(product?.productId)} >
                            {isInWishList(product?.productId) ? (
                              <><HeartIcon className="w-4 h-4 text-sm text-red-500 hover:text-red-700" />{' '}{translate('label.product.wishlistedText')}</>
                            ) : (
                              <> <HeartIcon className="w-4 h-4 text-sm text-gray-500 dark:text-slate-500" />{' '}{translate('label.wishlist.moveToWishlistText')} </>
                            )
                            }
                          </button>
                          <button type="button" onClick={() => { openModal(); setItemClicked(product); }} className="relative flex items-center text-sm font-medium text-primary-6000 hover:text-primary-500 " >
                            <span>{translate('common.label.removeText')}</span>
                          </button>
                        </>
                      }
                    </div>
                  </div>
                  <div className="flex flex-col pt-3 text-xs font-bold text-gray-700 sm:hidden sm:text-sm">
                    {product?.shippingPlan?.shippingSpeed}
                  </div>
                </div>                
              </div>
            </>
          )
        })}
      </div>
    </section>
  )
}

export default CartItems
