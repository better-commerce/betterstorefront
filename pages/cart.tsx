import dynamic from 'next/dynamic'
import NextHead from 'next/head'
import { XMarkIcon as XMarkIconSolid } from '@heroicons/react/24/solid'
import { Layout } from '@components/common'
import { GetServerSideProps } from 'next'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import { useCart as getCart } from '@framework/cart'
import cookie from 'cookie'
import { basketId as basketIdGenerator } from '@components/ui/context'
import Link from 'next/link'
import { useUI } from '@components/ui/context'
import cartHandler from '@components/services/cart'
import { PlusSmallIcon, MinusSmallIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
const PromotionInput = dynamic(() => import('../components/cart/PromotionInput'));
import { useEffect, useState } from 'react'
import Image from 'next/image'
import axios from 'axios'
import { Disclosure, Transition } from '@headlessui/react'
import { getShippingPlans } from '@framework/shipping'
import {
  BTN_CHECKOUT_NOW,
  BTN_PLACE_ORDER,
  GENERAL_CATALOG,
  GENERAL_DISCOUNT,
  GENERAL_ORDER_SUMMARY,
  GENERAL_PRICE_LABEL_RRP,
  GENERAL_REMOVE,
  GENERAL_SHIPPING,
  GENERAL_SHOPPING_CART,
  GENERAL_TOTAL,
  IMG_PLACEHOLDER,
  ITEMS_IN_YOUR_CART,
  SUBTOTAL_INCLUDING_TAX,
} from '@components/utils/textVariables'
import { generateUri } from '@commerce/utils/uri-util'
import { tryParseJson } from '@framework/utils/parse-util'
import SizeChangeModal from '@components/cart/SizeChange'

function Cart({ cart }: any) {
  const { setCartItems, cartItems, basketId } = useUI()
  const { addToCart } = cartHandler()
  const [openSizeChangeModal, setOpenSizeChangeModal] = useState(false)
  const [selectedProductOnSizeChange, setSelectedProductOnSizeChange] = useState(null)

  const handleToggleOpenSizeChangeModal = async (product?: any) => {
    // toggle open/close modal
    setOpenSizeChangeModal(!openSizeChangeModal)

    if (product) {
      // on open modal
      setSelectedProductOnSizeChange(product)
    } else {
      // on close modal
      setSelectedProductOnSizeChange(null)
    }
  }
  const mapShippingPlansToItems = (plans?: any, items?: any) => {
    const itemsClone = [...items]
    return plans?.reduce((acc: any, obj: any) => {
      acc?.forEach((cartItem?: any) => {
        const foundShippingPlan = obj.Items.find((item: any) => {
          return (
            item.ProductId.toLowerCase() === cartItem.productId.toLowerCase()
          )
        })
        if (foundShippingPlan) {
          cartItem.shippingPlan = obj
        }
      })
      return acc
    }, itemsClone)
  }

  const fetchShippingPlans = async () => {
    const shippingMethodItem: any = cart.shippingMethods.find(
      (method: any) => method.id === cart.shippingMethodId
    )

    const model = {
      BasketId: basketId,
      OrderId: '00000000-0000-0000-0000-000000000000',
      PostCode: '',
      ShippingMethodType: shippingMethodItem.type,
      ShippingMethodId: cart?.shippingMethodId,
      ShippingMethodName: shippingMethodItem.displayName,
      ShippingMethodCode: shippingMethodItem.shippingCode,
      DeliveryItems: cart?.lineItems?.map((item: any) => {
        return {
          BasketLineId: Number(item.id),
          OrderLineRecordId: '00000000-0000-0000-0000-000000000000',
          ProductId: item.productId,
          ParentProductId: item.parentProductId,
          StockCode: item.stockCode,
          Qty: item.qty,
          PoolCode: item.poolCode || null,
        }
      }),
      AllowPartialOrderDelivery: true,
      AllowPartialLineDelivery: true,
      PickupStoreId: '00000000-0000-0000-0000-000000000000',
      RefStoreId: null,
      PrimaryInventoryPool: 'PrimaryInvPool',
      SecondaryInventoryPool: 'PrimaryInvPool',
      IsEditOrder: false,
      OrderNo: null,
      DeliveryCenter: null,
    }
    //const response = await axios.post(NEXT_SHIPPING_PLANS, { model })
    const shippingPlans = await getShippingPlans()({ model: model });
    //console.log(JSON.stringify(shippingPlans));

    setCartItems({
      ...cart,
      lineItems: mapShippingPlansToItems(shippingPlans || [], cart.lineItems),
    })
  }

  useEffect(() => {
    async function loadShippingPlans() {
      await fetchShippingPlans();
    }
    
    if (cart?.shippingMethods.length > 0) {
      loadShippingPlans()
    }
    else {
      setCartItems(cart)
    }
  }, [])

  const handleItem = (product: any, type = 'increase') => {
    const asyncHandleItem = async () => {
      let data: any = {
        basketId,
        productId: product.id,
        stockCode: product.stockCode,
        manualUnitPrice: product.manualUnitPrice,
        displayOrder: product.displayOrderta,
        qty: -1,
      }
      if (type === 'increase') {
        data.qty = 1
      }
      if (type === 'delete') {
        data.qty = 0
        userCart.lineItems = userCart.lineItems.filter(
          (item: { id: any }) => item.id !== product.id
        )
      }
      try {
        const item = await addToCart(data)
        setCartItems(item)
      } catch (error) {
        console.log(error)
      }
    }
    asyncHandleItem()
  }

  const userCart = cartItems
  const isEmpty: boolean = userCart?.lineItems?.length === 0
  const css = { maxWidth: '100%', height: 'auto' }
  const getLineItemSizeWithoutSlug = (product: any) => {
    const productData: any = tryParseJson(product?.attributesJson || {})
    return productData?.Size
  }
  return (
    <>
      <NextHead>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="canonical" id="canonical" href="https://demostore.bettercommerce.io/cart" />
        <title>Basket</title>
        <meta name="title" content="Basket" />
        <meta name="description" content="Basket" />
        <meta name="keywords" content="Basket" />
        <meta property="og:image" content="" />
        <meta property="og:title" content="Basket" key="ogtitle" />
        <meta property="og:description" content="Basket" key="ogdesc" />
      </NextHead>
      <div className="container w-full px-4 mx-auto mt-6 bg-white sm:px-6 sm:mt-10">
        <h1 className="relative text-2xl font-semibold tracking-tight text-black uppercase sm:text-2xl">
          {GENERAL_SHOPPING_CART} <span className='absolute pl-2 text-sm font-normal text-gray-400 top-2'>{userCart?.lineItems?.length} Items added</span>
        </h1>
        {!isEmpty && (
          <div className="relative mt-4 sm:mt-6 lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start xl:gap-x-16">
            <section aria-labelledby="cart-heading" className="lg:col-span-7">
              {userCart.lineItems?.map((product: any, productIdx: number) => (
                <div key={productIdx} className="flex p-2 mb-2 border border-gray-200 rounded-md sm:p-3">
                  <div className="flex-shrink-0">
                    <Image style={css} width={140} height={180} src={generateUri(product.image, "h=200&fm=webp") || IMG_PLACEHOLDER} alt={product.name} className="object-cover object-center w-16 rounded-lg sm:w-28 image" />
                  </div>
                  <div className="relative flex flex-col flex-1 w-full gap-0 ml-4 sm:ml-6">
                    <h3 className="py-0 text-sm font-semibold text-black sm:py-0 sm:text-sm">{product.brand}</h3>
                    <h3 className="my-2 text-sm sm:text-sm sm:my-1">
                      <Link href={`/${product.slug}`}>
                        <span className="font-normal text-gray-700 hover:text-gray-800">{product.name}</span>
                      </Link>
                    </h3>
                    <div className="mt-0 font-bold text-black text-md sm:font-medium">
                      {product.price?.formatted?.withTax}
                      {product.listPrice?.raw.withTax > 0 && product.listPrice?.raw.withTax != product.price?.raw?.withTax ? (
                        <span className="px-2 text-sm text-red-400 line-through">{GENERAL_PRICE_LABEL_RRP}{' '}{product.listPrice.formatted.withTax}</span>
                      ) : null}
                    </div>
                    <div className="flex justify-between pl-0 pr-0 mt-2 sm:mt-2 sm:pr-0">
                      {product?.variantProducts?.length > 0 ? (
                        <div></div>
                      ) : (
                        <div role="button" onClick={handleToggleOpenSizeChangeModal.bind(null, product)}>
                          <div className="border w-[fit-content] flex items-center mt-3 py-2 px-2">
                            <div className="mr-1 text-sm text-gray-700">Size: <span className='font-semibold text-black'>{getLineItemSizeWithoutSlug(product)}</span></div>
                            <ChevronDownIcon className="w-4 h-4 text-black" />
                          </div>
                        </div>
                      )}
                      <div className="flex items-center justify-around px-2 text-gray-900 border sm:px-4">
                        <MinusSmallIcon onClick={() => handleItem(product, 'decrease')} className="w-4 cursor-pointer" />
                        <span className="px-4 py-1 text-md sm:py-1">{product.qty}</span>
                        <PlusSmallIcon className="w-4 cursor-pointer" onClick={() => handleItem(product, 'increase')} />
                      </div>
                    </div>

                    {product.children?.map((child: any, idx: number) => (
                      <div className="flex mt-10" key={'child' + idx}>
                        <div className="flex-shrink-0 w-12 h-12 overflow-hidden border border-gray-200 rounded-md">
                          <img src={child.image} alt={child.name} className="object-cover object-center w-full h-full" />
                        </div>
                        <div className="flex justify-between ml-5 font-medium text-gray-900">
                          <Link href={`/${child.slug}`}>{child.name}</Link>
                          <p className="ml-4">{child.price?.formatted?.withTax > 0 ? child.price?.formatted?.withTax : ""}</p>
                        </div>
                        {!child.parentProductId ? (
                          <div className="flex items-center justify-end flex-1 text-sm">
                            <button type="button" onClick={() => handleItem(child, 'delete')} className="inline-flex p-2 -m-2 text-gray-400 hover:text-gray-500">
                              <span className="sr-only">{GENERAL_REMOVE}</span>
                              <XMarkIconSolid className="w-5 h-5" aria-hidden="true" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-row px-2 pl-2 pr-0 text-gray-900 border sm:px-4 text-md sm:py-2 sm:pr-9">{child.qty}</div>
                        )}
                      </div>
                    )
                    )}
                    <div className="absolute top-0 right-0">
                      <button type="button" onClick={() => handleItem(product, 'delete')} className="inline-flex p-2 -m-2 text-gray-400 hover:text-gray-500">
                        <span className="sr-only">{GENERAL_REMOVE}</span>
                        <XMarkIconSolid className="w-4 h-4 mt-2 text-black sm:h-5 sm:w-5" aria-hidden="true" />
                      </button>
                    </div>
                    <div className="flex flex-col pt-3 text-xs font-bold text-gray-700 sm:hidden sm:text-sm">{product.shippingPlan?.shippingSpeed}</div>
                  </div>
                </div>
              ))}
            </section>
            <section aria-labelledby="summary-heading" className="px-4 py-0 mt-4 bg-white rounded-sm md:sticky top-20 sm:mt-0 sm:px-6 lg:px-6 lg:mt-0 lg:col-span-5">
              <h2 id="summary-heading" className="mb-1 text-xl font-semibold text-black uppercase">{GENERAL_ORDER_SUMMARY}</h2>
              <div className="mt-4 lg:-mb-3">
                <Disclosure defaultOpen={true}>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="flex justify-between py-2 text-sm font-medium text-left underline rounded-lg text-green focus-visible:ring-opacity-75 link-button">
                        Apply Promo
                      </Disclosure.Button>
                      <Transition
                        enter="transition duration-100 ease-out"
                        enterFrom="transform scale-95 opacity-0"
                        enterTo="transform scale-100 opacity-100"
                        leave="transition duration-75 ease-out"
                        leaveFrom="transform scale-100 opacity-100"
                        leaveTo="transform scale-95 opacity-0">
                        <Disclosure.Panel className="px-0 pt-4 pb-2 text-sm text-gray-500">
                          <PromotionInput />
                        </Disclosure.Panel>
                      </Transition>
                    </>
                  )}
                </Disclosure>
              </div>
              <dl className="mt-6 space-y-2 sm:space-y-2">
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-600">
                    {SUBTOTAL_INCLUDING_TAX}
                  </dt>
                  <dd className="font-semibold text-black text-md">
                    {cartItems.subTotal?.formatted?.withTax}
                  </dd>
                </div>
                <div className="flex items-center justify-between pt-2 sm:pt-1">
                  <dt className="flex items-center text-sm text-gray-600">
                    <span>{GENERAL_SHIPPING}</span>
                  </dt>
                  <dd className="font-semibold text-black text-md">
                    {cartItems.shippingCharge?.formatted?.withTax}
                  </dd>
                </div>
                <div className="flex items-center justify-between pt-2 sm:pt-2">
                  {userCart.promotionsApplied?.length > 0 && (
                    <>
                      <dt className="flex items-center text-sm text-gray-600">
                        <span>{GENERAL_DISCOUNT}</span>
                      </dt>
                      <dd className="font-semibold text-red-500 text-md">
                        <p>{'-'}{cartItems.discount?.formatted?.withTax}</p>
                      </dd>
                    </>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 text-gray-900 border-t">
                  <dt className="text-lg font-bold text-black">{GENERAL_TOTAL}</dt>
                  <dd className="text-xl font-bold text-black">
                    {cartItems.grandTotal?.formatted?.withTax}
                  </dd>
                </div>
              </dl>

              <div className="mt-6">
                <Link href="/checkout">
                  <button
                    type="submit"
                    className="w-full px-4 py-3 font-medium text-center text-white uppercase bg-black border border-transparent rounded-sm shadow-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-black"
                  >
                    {BTN_PLACE_ORDER}
                  </button>
                </Link>
              </div>
            </section>
          </div>
        )}
        {isEmpty && (
          <div className="flex flex-col items-center justify-center w-full h-full py-10 text-gray-900">
            Uh-oh, you don't have any items in here
            <Link href="/search">
              <button
                type="button"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                {GENERAL_CATALOG}
                <span aria-hidden="true"> &rarr;</span>
              </button>
            </Link>
          </div>
        )}
        <SizeChangeModal
          open={openSizeChangeModal}
          handleToggleOpen={handleToggleOpenSizeChangeModal}
          product={selectedProductOnSizeChange}
        />
      </div>
    </>
  )
}
Cart.Layout = Layout

const PAGE_TYPE = PAGE_TYPES['Checkout']

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = cookie.parse(context.req.headers.cookie || '')
  let basketRef: any = cookies.basketId
  if (!basketRef) {
    basketRef = basketIdGenerator()
    context.res.setHeader('set-cookie', `basketId=${basketRef}`)
  }

  const response = await getCart()({
    basketId: basketRef,
    cookies: context.req.cookies,
  })

  return {
    props: { cart: response }, // will be passed to the page component as props
  }
}

export default withDataLayer(Cart, PAGE_TYPE)
