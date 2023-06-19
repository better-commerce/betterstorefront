import Link from 'next/link'
import Image from 'next/image'
import { FC } from 'react'
import { useUI } from '@components/ui/context'
import { useEffect, Fragment, useState } from 'react'
import useCart from '@components/services/cart'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import useWishlist from '@components/services/wishlist'
import {
  WISHLIST_TITLE,
  WISHLIST_SIDEBAR_MESSAGE,
  GENERAL_CATALOG,
  GENERAL_REMOVE,
  GENERAL_ADD_TO_BASKET,
  WISHLIST_SUCCESS_MESSAGE,
  GENERAL_CONTINUE_SHOPPING,
  IMG_PLACEHOLDER,
} from '@components/utils/textVariables'
import { generateUri } from '@commerce/utils/uri-util'
import { recordGA4Event } from '@components/services/analytics/ga4'

const WishlistSidebar: FC<React.PropsWithChildren<unknown>> = () => {
  const {
    displaySidebar,
    closeSidebar,
    setWishlist,
    wishListItems,
    user,
    wishlistItems,
    basketId,
    setCartItems,
    removeFromWishlist,
  } = useUI()
  const { getWishlist, deleteWishlistItem } = useWishlist()
  const [openWishlistSidebar, setOpenWishlistSidebar] = useState(false)

  useEffect(() => {
    setTimeout(() => setOpenWishlistSidebar(displaySidebar), 250)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [isItemInCart, setItemInCart] = useState(false)

  const { addToCart } = useCart()
  const handleWishlistItems = async () => {
    const items = await getWishlist(user.userId, wishlistItems)
    setWishlist(items)
  }
  let objUser: boolean | any = false

  if (typeof window !== 'undefined') {
    objUser = localStorage.getItem('user')
  }

  useEffect(() => {
    if (objUser) handleWishlistItems()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [objUser])

  const handleDeleteWishListItems = async (productId: any) => {
    const idCheck = (itemDetails: any) => {
      return itemDetails.recordId !== productId
    }
    let temptWishList: any = wishListItems.filter(idCheck)
    const items = await getWishlist(user.userId, temptWishList)
    setWishlist(items)
  }

  const deleteItemFromWishlist = (product: any) => {
    let productAvailability = 'Yes'
    if (product?.currentStock > 0) {
      productAvailability = 'Yes'
    } else {
      productAvailability = 'No'
    }

    if (typeof window !== 'undefined') {
      recordGA4Event(window, 'remove_item', {
        product_name: product?.name,
        availability: productAvailability,
        product_id: product?.sku,
      })
    }

    if (objUser) {
      deleteWishlistItem(user?.userId, product?.recordId).then(() =>
        handleDeleteWishListItems(product?.recordId)
      )
    } else removeFromWishlist(product?.recordId)
  }

  const handleAddToCart = (product: any) => {
    addToCart(
      {
        basketId,
        productId: product.recordId,
        qty: 1,
        manualUnitPrice: product.price.raw.withTax,
        stockCode: product.stockCode,
        userId: user.userId,
        isAssociated: user.isAssociated,
      },
      'ADD',
      { product }
    )
      .then((response: any) => {
        setCartItems(response)
        setItemInCart(true)
        deleteItemFromWishlist(product)
        setTimeout(() => {
          setItemInCart(false)
        }, 3000)
      })
      .catch((err: any) => console.log('error', err))
  }

  const handleClose = () => {
    setTimeout(() => closeSidebar(), 500)
    setOpenWishlistSidebar(false)
  }

  const isEmpty: boolean = wishListItems?.length === 0

  const css = { maxWidth: '100%', height: 'auto' }

  return (
    <Transition.Root show={openWishlistSidebar} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 overflow-hidden z-999"
        onClose={handleClose}
      >
        <div className="absolute inset-0 overflow-hidden z-999">
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="w-full h-screen" onClick={handleClose} />
          </Transition.Child>

          <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className="w-screen max-w-md">
                <div className="flex flex-col h-full overflow-y-scroll bg-white shadow-xl">
                  <div className="flex-1 px-4 py-6 overflow-y-auto sm:px-6">
                    <div className="flex items-start justify-between">
                      <Dialog.Title className="text-lg font-medium text-gray-900">
                        {WISHLIST_TITLE}
                      </Dialog.Title>
                      <div className="flex items-center ml-3 h-7">
                        <button
                          type="button"
                          className="p-2 -m-2 text-gray-400 hover:text-gray-500"
                          onClick={handleClose}
                        >
                          <span className="sr-only">Close panel</span>
                          <XMarkIcon className="w-6 h-6" aria-hidden="true" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-8">
                      <div className="flow-root">
                        {isEmpty && (
                          <div className="flex flex-col items-center justify-center w-full h-full text-gray-900">
                            {WISHLIST_SIDEBAR_MESSAGE}
                            <Link href="/search">
                              <button
                                type="button"
                                className="font-medium text-indigo-600 hover:text-indigo-500"
                                onClick={handleClose}
                              >
                                {GENERAL_CATALOG}
                                <span aria-hidden="true"> &rarr;</span>
                              </button>
                            </Link>
                          </div>
                        )}
                        <ul
                          role="list"
                          className="-my-6 divide-y divide-gray-200"
                        >
                          {wishListItems.map((product: any, idx: number) => (
                            <li key={idx} className="flex py-6">
                              <div className="flex-shrink-0 w-24 h-24 overflow-hidden border border-gray-200 rounded-md">
                                <Image
                                  style={css}
                                  width={80}
                                  height={80}
                                  src={
                                    generateUri(
                                      product.image,
                                      'h=200&fm=webp'
                                    ) || IMG_PLACEHOLDER
                                  }
                                  alt={product.name}
                                  className="object-cover object-center w-full h-full"
                                ></Image>
                                {/* <img
                                  src={product.image}
                                  alt={product.name}
                                  className="object-cover object-center w-full h-full"
                                /> */}
                              </div>

                              <div className="flex flex-col flex-1 ml-4">
                                <div>
                                  <div className="flex justify-between font-medium text-gray-900">
                                    <h5 onClick={handleClose}>
                                      <Link href={`/${product.slug}`}>
                                        {product.name}
                                      </Link>
                                    </h5>
                                    <p className="ml-4">
                                      {product.price?.formatted?.withTax}
                                    </p>
                                  </div>
                                  {/* <p className="mt-1 text-sm text-gray-500">{product.color}</p> */}
                                </div>
                                <div className="flex items-end justify-between flex-1 text-sm">
                                  {/* <p className="text-gray-500">Qty {product.quantity}</p> */}

                                  <div className="flex justify-between w-full">
                                    <button
                                      type="button"
                                      className="font-medium text-red-300 hover:text-red-500"
                                      onClick={() =>
                                        deleteItemFromWishlist(product)
                                      }
                                    >
                                      {GENERAL_REMOVE}
                                    </button>
                                  </div>
                                  <div className="flex justify-end w-full">
                                    <button
                                      type="button"
                                      className="font-medium text-black hover:text-indigo-500"
                                      onClick={() => handleAddToCart(product)}
                                    >
                                      {GENERAL_ADD_TO_BASKET}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="px-4 py-6 border-t border-gray-200 sm:px-6">
                    {isItemInCart && (
                      <div className="items-center justify-center w-full h-full py-5 text-xl text-gray-500">
                        <CheckCircleIcon className="flex items-center justify-center w-full h-12 text-center text-indigo-600" />
                        <p className="mt-5 text-center">
                          {WISHLIST_SUCCESS_MESSAGE}
                        </p>
                      </div>
                    )}
                    <div className="flex justify-center mt-6 text-sm text-center text-gray-500">
                      <p>
                        <button
                          type="button"
                          className="flex items-center justify-center px-6 py-3 font-medium uppercase btn-primary"
                          onClick={handleClose}
                        >
                          {GENERAL_CONTINUE_SHOPPING}
                          <span className="ml-2" aria-hidden="true">
                            {' '}
                            &rarr;
                          </span>
                        </button>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default WishlistSidebar
