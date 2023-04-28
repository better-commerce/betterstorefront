import cn from 'classnames'
import Link from 'next/link'
import { FC } from 'react'
import { useUI } from '@components/ui/context'
import { useEffect, useState, Fragment } from 'react'
import useCart from '@components/services/cart'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon, PlusSmallIcon, MinusSmallIcon } from '@heroicons/react/24/outline'
import PromotionInput from '../PromotionInput'
import { EVENTS_MAP } from '@components/services/analytics/constants'
import eventDispatcher from '@components/services/analytics/eventDispatcher'
import Image from 'next/image'

import useTranslation, {
  CLOSE_PANEL,
  GENERAL_SHOPPING_CART,
  WISHLIST_SIDEBAR_MESSAGE,
  GENERAL_CATALOG,
  GENERAL_REMOVE,
  GENERAL_DELETE,
  SUBTOTAL_INCLUDING_TAX,
  GENERAL_SHIPPING,
  GENERAL_DISCOUNT,
  GENERAL_TOTAL,
  GENERAL_CHECKOUT,
  GENERAL_CONTINUE_SHOPPING,
  GENERAL_OR_TEXT,
  IMG_PLACEHOLDER,
} from '@components/utils/textVariables'
import { generateUri } from '@commerce/utils/uri-util'
import {
  EmptyGuid,
} from '@components/utils/constants'
import { getCurrentPage } from '@framework/utils/app-util'
import { recordGA4Event } from '@components/services/analytics/ga4'
import { tryParseJson } from '@framework/utils/parse-util'

const CartSidebarView: FC<React.PropsWithChildren<unknown>> = () => {
  const { closeSidebar, setCartItems, cartItems, basketId, user } = useUI()
  const { getCart, addToCart } = useCart()
  const { BasketViewed } = EVENTS_MAP.EVENT_TYPES
  const { Basket } = EVENTS_MAP.ENTITY_TYPES
  let currentPage = getCurrentPage();
  const content = useTranslation()

  useEffect(() => {
    const handleCartitems = async () => {
      const items = await getCart({ basketId })
      setCartItems(items)
    }
    eventDispatcher(BasketViewed, {
      entity: JSON.stringify({
        id: basketId,
        grandTotal: cartItems.grandTotal?.raw.withTax,
        lineItems: cartItems.lineItems,
        promoCode: cartItems.promotionsApplied,
        shipCharge: cartItems.shippingCharge?.raw?.withTax,
        shipTax: cartItems.shippingCharge?.raw?.tax,
        taxPercent: cartItems.taxPercent,
        tax: cartItems.grandTotal?.raw?.tax,
      }),
      entityName: 'Cart',
      entityType: Basket,
      eventType: BasketViewed,
      promoCodes: cartItems.promotionsApplied,
    })
    handleCartitems()
  }, [])

  const handleItem = (product: any, type = 'increase') => {
    const asyncHandleItem = async () => {
      const data: any = {
        basketId,
        productId: product.id,
        stockCode: product.stockCode,
        manualUnitPrice: product.manualUnitPrice,
        displayOrder: product.displayOrderta,
        qty: -1,
      }
      if (type === 'increase') {
        data.qty = 1
        if (currentPage) {
          if (typeof window !== "undefined") {
            recordGA4Event(window, 'select_quantity', {
              category: product?.categoryItems?.length ? product?.categoryItems[0]?.categoryName : "",
              final_quantity: data.qty,
              current_page: currentPage,
              number_of_plus_clicked: 1,
              number_of_minus_clicked: 0,
            });
          }
        }
      }
      if (type === 'delete') {
        data.qty = 0
        if (typeof window !== "undefined") {
          recordGA4Event(window, 'remove_from_cart', {
            ecommerce: {
              items: [
                {
                  item_name: product?.name,
                  price: product?.price?.raw?.withTax,
                  quantity: product?.qty,
                  item_id: product?.sku,
                  item_size: getLineItemSizeWithoutSlug(product),
                  item_brand: product?.brand,
                  item_variant: product?.colorName,
                  item_var_id: product?.stockCode
                }
              ],
              loggedin: (user?.userId && user?.userId !== EmptyGuid),
              current_page: "Cart"
            }
          });
        }
      }
      try {
        const item = await addToCart(data, type, { product })
        setCartItems(item)
      } catch (error) {
        console.log(error)
      }
    }
    asyncHandleItem()
  }

  const getLineItemSizeWithoutSlug = (product: any) => {
    const productData: any = tryParseJson(product?.attributesJson || {})
    return productData?.Size
  }

  const beginCheckout = (cartItems: any) => {
    if (typeof window !== "undefined") {
      recordGA4Event(window, 'begin_checkout', {
        ecommerce: {
          items: [
            cartItems?.lineItems?.map((item: any, itemId: number) => (
              {
                item_name: item?.name,
                price: item?.price?.raw?.withTax,
                quantity: item?.qty,
                item_brand: item?.brand,
                item_id: item?.sku,
                item_size: getLineItemSizeWithoutSlug(item),
                item_variant: item?.colorName,
              }
            ))
          ],
          current_page: "Checkout",
          loggedin_status: (user?.userId && user?.userId !== EmptyGuid),
          paymode: "",
          address: "",
          value: cartItems?.grandTotal?.raw?.withTax,
          item_var_id: cartItems?.lineItems[0]?.stockCode,
        }
      });
    }
  }

  const handleClose = () => closeSidebar()

  const isEmpty: boolean = cartItems?.lineItems?.length === 0

  const css = { maxWidth: '100%', height: 'auto' }
  return (
    <Transition.Root show={true} as={Fragment}>
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
                        {GENERAL_SHOPPING_CART}
                      </Dialog.Title>
                      <div className="flex items-center ml-3 h-7">
                        <button
                          type="button"
                          className="p-2 -m-2 text-gray-400 hover:text-gray-500"
                          onClick={handleClose}
                        >
                          <span className="sr-only">{CLOSE_PANEL}</span>
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
                          {cartItems.lineItems?.map((product: any) => (
                            <li key={product.id} className="">
                              <div className="flex py-6">
                                <div className="flex-shrink-0 w-24 h-24 overflow-hidden border border-gray-200 rounded-md">
                                  <Image
                                    width={100}
                                    height={100}
                                    style={css}
                                    src={
                                      generateUri(product.image, 'h=200&fm=webp') || IMG_PLACEHOLDER
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
                                    <div className="flex justify-between font-semibold text-gray-900 font-sm">
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
                                  <div className="flex items-end justify-between flex-1 text-sm">
                                    {/* <p className="text-gray-500">Qty {product.quantity}</p> */}

                                    <div className="flex justify-between w-full">
                                      <button
                                        type="button"
                                        className="font-medium text-red-300 hover:text-red-500"
                                        onClick={() =>
                                          handleItem(product, 'delete')
                                        }
                                      >
                                        {GENERAL_REMOVE}
                                      </button>
                                      <div className="flex flex-row px-4 text-gray-900 border">
                                        <MinusSmallIcon
                                          onClick={() =>
                                            handleItem(product, 'decrease')
                                          }
                                          className="w-4 cursor-pointer"
                                        />
                                        <span className="px-2 py-2 text-md">
                                          {product.qty}
                                        </span>
                                        <PlusSmallIcon
                                          className="w-4 cursor-pointer"
                                          onClick={() =>
                                            handleItem(product, 'increase')
                                          }
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {product.children?.map(
                                (child: any, idx: number) => {
                                  return (
                                    <div className="flex" key={idx}>
                                      <div className="flex-shrink-0 w-12 h-12 ml-10 overflow-hidden border border-gray-200 rounded-md">
                                        <div className="image-container">
                                          <Image
                                            style={css}
                                            src={
                                              generateUri(child.image, 'h=200&fm=webp') || IMG_PLACEHOLDER
                                            }
                                            alt={child.name}
                                            className="object-cover object-center w-full h-full image"
                                          ></Image>
                                        </div>
                                      </div>
                                      <div className="flex flex-col flex-1 ml-4">
                                        <div>
                                          <div className="flex justify-between font-medium text-gray-900">
                                            <h3 onClick={handleClose}>
                                              <Link href={`/${child.slug}`}>
                                                {child.name}
                                              </Link>
                                            </h3>
                                            <p className="ml-4">
                                              {child.price?.formatted?.withTax}
                                            </p>
                                          </div>
                                          {/* <p className="mt-1 text-sm text-gray-500">{product.color}</p> */}
                                        </div>
                                      </div>
                                      <div className="flex items-end justify-end flex-1 text-sm">
                                        {/* <p className="text-gray-500">Qty {product.quantity}</p> */}

                                        <button
                                          type="button"
                                          className="font-medium text-indigo-600 hover:text-indigo-500"
                                          onClick={() =>
                                            handleItem(child, GENERAL_DELETE)
                                          }
                                        >
                                          {GENERAL_REMOVE}
                                        </button>
                                      </div>
                                    </div>
                                  )
                                }
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {!isEmpty && (
                    <div className="px-4 py-6 border-t border-gray-200 sm:px-6">
                      <PromotionInput />
                      <div className="flex justify-between py-2 text-gray-900 font-small">
                        <p className="text-sm">{SUBTOTAL_INCLUDING_TAX}</p>
                        <p className="font-bold text-black">
                          {cartItems.subTotal?.formatted?.withTax}
                        </p>
                      </div>
                      <div className="flex justify-between py-2 text-black font-small">
                        <p>{GENERAL_SHIPPING}</p>
                        <p className="font-bold text-black">
                          {cartItems.shippingCharge?.formatted?.withTax}
                        </p>
                      </div>

                      {cartItems.promotionsApplied?.length > 0 && (
                        <div className="flex justify-between py-2 text-black font-small">
                          <p className="text-sm">{GENERAL_DISCOUNT}</p>
                          <p className="font-bold text-red-500">
                            {'-'}
                            {cartItems.discount?.formatted?.withTax}
                          </p>
                        </div>
                      )}
                      <div className="flex justify-between font-medium text-black">
                        <p className="text-xl">{GENERAL_TOTAL}</p>
                        <p className="text-xl font-bold text-black">
                          {cartItems.grandTotal?.formatted?.withTax}
                        </p>
                      </div>
                      <div className="mt-6">
                        <Link
                          href="/cart"
                          onClick={() => {
                            handleClose()
                            beginCheckout(cartItems)
                          }}
                          passHref
                          className="flex items-center justify-center px-6 py-3 font-medium text-white uppercase bg-black border border-transparent rounded-sm shadow-sm hover:bg-gray-900"
                        >
                          {content.GENERAL_CHECKOUT}
                        </Link>
                      </div>
                      <div className="flex justify-center mt-6 text-sm text-center text-gray-500">
                        <p>
                          {GENERAL_OR_TEXT}{' '}
                          <button
                            type="button"
                            className="font-medium text-black hover:text-indigo-500"
                            onClick={handleClose}
                          >
                            {GENERAL_CONTINUE_SHOPPING}
                            <span aria-hidden="true"> &rarr;</span>
                          </button>
                        </p>
                      </div>
                    </div>
                  )}
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
