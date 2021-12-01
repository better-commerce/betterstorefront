import {
  QuestionMarkCircleIcon,
  XIcon as XIconSolid,
} from '@heroicons/react/solid'
import { Layout } from '@components/common'
import { GetServerSideProps } from 'next'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import { useCart as getCart } from '@framework/cart'
import cookie from 'cookie'
import { basketId as basketIdGenerator } from '@components/ui/context'
import Link from 'next/link'
import { useUI } from '@components/ui/context'
import cartHandler from '@components/services/cart'
import { PlusSmIcon, MinusSmIcon } from '@heroicons/react/outline'
import PromotionInput from '../components/cart/PromotionInput'

function Cart({ cart }: any) {
  const { setCartItems, cartItems, basketId } = useUI()
  const { getCart, addToCart } = cartHandler()

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
      }
      if (type === 'delete') {
        data.qty = 0
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

  const userCart = cartItems?.lineItems?.length ? cartItems : cart
  return (
    <div className="bg-white">
      <main className="max-w-2xl mx-auto pt-16 pb-24 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Shopping Cart
        </h1>

        <form className="mt-12 lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start xl:gap-x-16">
          <section aria-labelledby="cart-heading" className="lg:col-span-7">
            <h2 id="cart-heading" className="sr-only">
              Items in your shopping cart
            </h2>

            <ul
              role="list"
              className="border-t border-b border-gray-200 divide-y divide-gray-200"
            >
              {userCart.lineItems?.map((product: any, productIdx: number) => (
                <li key={product.id} className="flex py-6 sm:py-10">
                  <div className="flex-shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-24 h-24 rounded-md object-center object-cover sm:w-48 sm:h-48"
                    />
                  </div>

                  <div className="ml-4 flex-1 flex flex-col justify-between sm:ml-6">
                    <div className="relative pr-9 flex justify-between sm:pr-0">
                      <div>
                        <div className="flex justify-between flex-col">
                          <h3 className="py-2 text-md font-bold text-gray-900">
                            {product.brand}
                          </h3>
                          <h3 className="text-sm">
                            <Link href={`/${product.slug}`}>
                              <a
                                href={product.slug}
                                className="font-medium text-gray-700 hover:text-gray-800"
                              >
                                {product.name}
                              </a>
                            </Link>
                          </h3>
                        </div>
                        {/* <div className="mt-1 flex text-sm">
                          <p className="text-gray-500">{product.color}</p>
                          {product.size ? (
                            <p className="ml-4 pl-4 border-l border-gray-200 text-gray-500">
                              {product.size}
                            </p>
                          ) : null}
                        </div> */}
                        <p className="mt-1 text-sm font-medium text-gray-900">
                          {product.price?.formatted?.withTax}
                        </p>
                        {product.children?.map((child: any, idx: number) => {
                          return (
                            <div className="flex mt-10" key={idx}>
                              <div className="flex-shrink-0 w-12 h-12 border border-gray-200 rounded-md overflow-hidden">
                                <img
                                  src={child.image}
                                  alt={child.name}
                                  className="w-full h-full object-center object-cover"
                                />
                              </div>
                              <div className="flex ml-5 justify-between font-medium text-gray-900">
                                <Link href={`/${child.slug}`}>
                                  {child.name}
                                </Link>
                                <p className="ml-4">
                                  {child.price?.formatted?.withTax}
                                </p>
                                {/* <p className="mt-1 text-sm text-gray-500">{product.color}</p> */}
                              </div>
                              <div className="flex-1 flex items-center justify-end text-sm">
                                {/* <p className="text-gray-500">Qty {product.quantity}</p> */}

                                <button
                                  type="button"
                                  onClick={() => handleItem(child, 'delete')}
                                  className="-m-2 p-2 inline-flex text-gray-400 hover:text-gray-500"
                                >
                                  <span className="sr-only">Remove</span>
                                  <XIconSolid
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                </button>
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      <div className="mt-4 sm:mt-0 sm:pr-9">
                        <div className="border px-4 text-gray-900 flex flex-row">
                          <MinusSmIcon
                            onClick={() => handleItem(product, 'decrease')}
                            className="w-4 cursor-pointer"
                          />
                          <span className="text-md px-2 py-2">
                            {product.qty}
                          </span>
                          <PlusSmIcon
                            className="w-4 cursor-pointer"
                            onClick={() => handleItem(product, 'increase')}
                          />
                        </div>
                      </div>
                      <div className="absolute top-0 right-0">
                        <button
                          type="button"
                          onClick={() => handleItem(product, 'delete')}
                          className="-m-2 p-2 inline-flex text-gray-400 hover:text-gray-500"
                        >
                          <span className="sr-only">Remove</span>
                          <XIconSolid className="h-5 w-5" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Order summary */}
          <section
            aria-labelledby="summary-heading"
            className="mt-16 bg-gray-50 rounded-lg px-4 py-6 sm:p-6 lg:p-8 lg:mt-0 lg:col-span-5"
          >
            <h2
              id="summary-heading"
              className="text-lg font-medium text-gray-900"
            >
              Order summary
            </h2>

            <dl className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-600">
                  Subtotal (taxes included)
                </dt>
                <dd className="text-sm font-medium text-gray-900">
                  {cartItems.subTotal?.formatted?.withTax}
                </dd>
              </div>
              <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                <dt className="flex items-center text-sm text-gray-600">
                  <span>Shipping</span>
                </dt>
                <dd className="text-sm font-medium text-gray-900">
                  {cartItems.shippingCharge?.formatted?.withTax}
                </dd>
              </div>
              <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                {userCart.promotionsApplied?.length > 0 && (
                  <>
                    <dt className="flex items-center text-sm text-indigo-600">
                      <span>Discount</span>
                    </dt>
                    <dd className="text-indigo-600 text-sm font-medium">
                      <p>{cartItems.discount?.formatted?.withTax}</p>
                    </dd>
                  </>
                )}
              </div>
              <PromotionInput />

              <div className="text-gray-900 border-t border-gray-200 pt-4 flex items-center justify-between">
                <dt className="font-medium text-gray-900">Order total</dt>
                <dd className="font-medium text-gray-900">
                  {cartItems.grandTotal?.formatted?.withTax}
                </dd>
              </div>
            </dl>

            <div className="mt-6">
              <Link href="/checkout">
                <a
                  type="submit"
                  className="text-center w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
                >
                  Checkout now
                </a>
              </Link>
            </div>
          </section>
        </form>
      </main>
    </div>
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
  })

  return {
    props: { cart: response }, // will be passed to the page component as props
  }
}

export default withDataLayer(Cart, PAGE_TYPE)
