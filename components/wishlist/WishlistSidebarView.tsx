import Link from 'next/link'
import { FC } from 'react'
import { useUI } from '@components/ui/context'
import { useEffect, Fragment, useState } from 'react'
import useCart from '@components/services/cart'
import { Dialog, Transition } from '@headlessui/react'
import { XIcon, CheckCircleIcon } from '@heroicons/react/outline'
import useWishlist from '@components/services/wishlist'
const WishlistSidebar: FC = () => {
  const {
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

  const [isItemInCart, setItemInCart] = useState(false)

  const { addToCart } = useCart()
  const handleWishlistItems = async () => {
    const items = await getWishlist(user.userId, wishlistItems)
    setWishlist(items)
  }
  let accessToken: boolean | any = false

  if (typeof window !== 'undefined') {
    accessToken = localStorage.getItem('user')
  }

  useEffect(() => {
    if (accessToken) handleWishlistItems()
  }, [])

  const deleteItemFromWishlist = (productId: string) => {
    if (accessToken) {
      deleteWishlistItem(user.userId, productId).then(() =>
        handleWishlistItems()
      )
    } else removeFromWishlist(productId)
  }

  const handleAddToCart = (product: any) => {
    addToCart({
      basketId,
      productId: product.recordId,
      qty: 1,
      manualUnitPrice: product.price.raw.withTax,
      stockCode: product.stockCode,
    })
      .then((response: any) => {
        setCartItems(response)
        setItemInCart(true)
        setTimeout(() => {
          setItemInCart(false)
        }, 3000)
      })
      .catch((err: any) => console.log('error', err))
  }

  const handleClose = () => closeSidebar()

  const isEmpty: boolean = wishListItems?.length === 0

  return (
    <Transition.Root show={true} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 overflow-hidden z-50"
        onClose={handleClose}
      >
        <div className="absolute inset-0 overflow-hidden">
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="" />
          </Transition.Child>

          <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
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
                <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                  <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                    <div className="flex items-start justify-between">
                      <Dialog.Title className="text-lg font-medium text-gray-900">
                        Wishlist
                      </Dialog.Title>
                      <div className="ml-3 h-7 flex items-center">
                        <button
                          type="button"
                          className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                          onClick={handleClose}
                        >
                          <span className="sr-only">Close panel</span>
                          <XIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-8">
                      <div className="flow-root">
                        {isEmpty && (
                          <div className="text-gray-900 h-full w-full flex flex-col justify-center items-center">
                            Uh-oh, you don't have any items in here
                            <Link href="/search">
                              <button
                                type="button"
                                className="text-indigo-600 font-medium hover:text-indigo-500"
                                onClick={handleClose}
                              >
                                Catalog
                                <span aria-hidden="true"> &rarr;</span>
                              </button>
                            </Link>
                          </div>
                        )}
                        <ul
                          role="list"
                          className="-my-6 divide-y divide-gray-200"
                        >
                          {wishListItems.map((product: any) => (
                            <li key={product.id} className="py-6 flex">
                              <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-full h-full object-center object-cover"
                                />
                              </div>

                              <div className="ml-4 flex-1 flex flex-col">
                                <div>
                                  <div className="flex justify-between font-medium text-gray-900">
                                    <h3 onClick={handleClose}>
                                      <Link href={`/${product.slug}`}>
                                        {product.name}
                                      </Link>
                                    </h3>
                                    <p className="ml-4">
                                      {product.price?.formatted?.withTax}
                                    </p>
                                  </div>
                                  {/* <p className="mt-1 text-sm text-gray-500">{product.color}</p> */}
                                </div>
                                <div className="flex-1 flex items-end justify-between text-sm">
                                  {/* <p className="text-gray-500">Qty {product.quantity}</p> */}

                                  <div className="flex justify-between w-full">
                                    <button
                                      type="button"
                                      className="font-medium text-indigo-600 hover:text-indigo-500"
                                      onClick={() =>
                                        deleteItemFromWishlist(product.recordId)
                                      }
                                    >
                                      Remove
                                    </button>
                                  </div>
                                  <div className="flex justify-between w-full">
                                    <button
                                      type="button"
                                      className="font-medium text-indigo-600 hover:text-indigo-500"
                                      onClick={() => handleAddToCart(product)}
                                    >
                                      Add to cart
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

                  <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                    {isItemInCart && (
                      <div className="text-gray-500 py-5 text-xl w-full justify-center items-center h-full">
                        <CheckCircleIcon className="h-12 text-center flex justify-center w-full items-center text-indigo-600" />
                        <p className="mt-5 text-center">
                          Item was added in the cart
                        </p>
                      </div>
                    )}
                    <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
                      <p>
                        <button
                          type="button"
                          className="flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                          onClick={handleClose}
                        >
                          Continue Shopping
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