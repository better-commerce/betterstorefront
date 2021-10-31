import cn from 'classnames'
import Link from 'next/link'
import { FC } from 'react'
import { useUI } from '@components/ui/context'
import { useEffect, useState, Fragment } from 'react'
import useCart from '@components/services/cart'
import { Dialog, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'

const CartSidebarView: FC = () => {
  const { closeSidebar, setCartItems, cartItems, basketId, removeFromCart } =
    useUI()
  const [isLoading, setIsLoading] = useState(true)
  const { getCart, removeItemFromCart } = useCart()

  useEffect(() => {
    const handleCartitems = async () => {
      const items = await getCart({ basketId })
      setCartItems(items)
      setIsLoading(false)
    }
    handleCartitems()
  }, [])

  const removeItem = (productId: string) => {
    const asyncRemoveItem = async () => {
      try {
        await removeItemFromCart({ basketId, productId })
        removeFromCart(productId)
      } catch (error) {
        console.log(error)
      }
    }
    asyncRemoveItem()
  }

  const handleClose = () => closeSidebar()

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
                        Shopping cart
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
                        <ul
                          role="list"
                          className="-my-6 divide-y divide-gray-200"
                        >
                          {cartItems.lineItems.map((product: any) => (
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
                                      <Link href={product.slug}>
                                        {product.name}
                                      </Link>
                                    </h3>
                                    <p className="ml-4">
                                      {product.listPrice?.formatted?.withTax}
                                    </p>
                                  </div>
                                  {/* <p className="mt-1 text-sm text-gray-500">{product.color}</p> */}
                                </div>
                                <div className="flex-1 flex items-end justify-between text-sm">
                                  {/* <p className="text-gray-500">Qty {product.quantity}</p> */}

                                  <div className="flex">
                                    <button
                                      type="button"
                                      className="font-medium text-indigo-600 hover:text-indigo-500"
                                      onClick={() => removeItem(product.id)}
                                    >
                                      Remove
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
                    <div className="flex py-2 justify-between font-small text-gray-900">
                      <p>Total</p>
                      <p>{cartItems.grandTotal?.formatted?.withoutTax}</p>
                    </div>
                    <div className="flex py-2 justify-between font-small text-gray-900">
                      <p>Tax</p>
                      <p>{cartItems.grandTotal?.formatted?.tax}</p>
                    </div>
                    <div className="flex justify-between font-medium text-gray-900">
                      <p>Subtotal</p>
                      <p>{cartItems.grandTotal?.formatted?.withTax}</p>
                    </div>
                    {console.log(cartItems.grandTotal)}
                    <p className="mt-0.5 text-sm text-gray-500">
                      Shipping is calculated at checkout.
                    </p>
                    <div className="mt-6">
                      <Link href="/checkout" passHref>
                        <a
                          onClick={handleClose}
                          className="flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                          href="/checkout"
                        >
                          Checkout
                        </a>
                      </Link>
                    </div>
                    <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
                      <p>
                        or{' '}
                        <button
                          type="button"
                          className="text-indigo-600 font-medium hover:text-indigo-500"
                          onClick={handleClose}
                        >
                          Continue Shopping
                          <span aria-hidden="true"> &rarr;</span>
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

export default CartSidebarView
