import {
  CheckIcon,
  ClockIcon,
  QuestionMarkCircleIcon,
  XIcon as XIconSolid,
} from '@heroicons/react/solid'
import { Layout } from '@components/common'

const products = [
  {
    id: 1,
    name: 'Basic Tee',
    href: '#',
    price: '$32.00',
    color: 'Sienna',
    inStock: true,
    size: 'Large',
    imageSrc:
      'https://tailwindui.com/img/ecommerce-images/shopping-cart-page-01-product-01.jpg',
    imageAlt: "Front of men's Basic Tee in sienna.",
  },
  {
    id: 2,
    name: 'Basic Tee',
    href: '#',
    price: '$32.00',
    color: 'Black',
    inStock: false,
    leadTime: '3–4 weeks',
    size: 'Large',
    imageSrc:
      'https://tailwindui.com/img/ecommerce-images/shopping-cart-page-01-product-02.jpg',
    imageAlt: "Front of men's Basic Tee in black.",
  },
  {
    id: 3,
    name: 'Nomad Tumbler',
    href: '#',
    price: '$35.00',
    color: 'White',
    inStock: true,
    imageSrc:
      'https://tailwindui.com/img/ecommerce-images/shopping-cart-page-01-product-03.jpg',
    imageAlt: 'Insulated bottle with white base and black snap lid.',
  },
]
const relatedProducts = [
  {
    id: 1,
    name: 'Billfold Wallet',
    href: '#',
    imageSrc:
      'https://tailwindui.com/img/ecommerce-images/shopping-cart-page-01-related-product-01.jpg',
    imageAlt: 'Front of Billfold Wallet in natural leather.',
    price: '$118',
    color: 'Natural',
  },
  // More products...
]

function Cart() {
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
              {products.map((product, productIdx) => (
                <li key={product.id} className="flex py-6 sm:py-10">
                  <div className="flex-shrink-0">
                    <img
                      src={product.imageSrc}
                      alt={product.imageAlt}
                      className="w-24 h-24 rounded-md object-center object-cover sm:w-48 sm:h-48"
                    />
                  </div>

                  <div className="ml-4 flex-1 flex flex-col justify-between sm:ml-6">
                    <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                      <div>
                        <div className="flex justify-between">
                          <h3 className="text-sm">
                            <a
                              href={product.href}
                              className="font-medium text-gray-700 hover:text-gray-800"
                            >
                              {product.name}
                            </a>
                          </h3>
                        </div>
                        <div className="mt-1 flex text-sm">
                          <p className="text-gray-500">{product.color}</p>
                          {product.size ? (
                            <p className="ml-4 pl-4 border-l border-gray-200 text-gray-500">
                              {product.size}
                            </p>
                          ) : null}
                        </div>
                        <p className="mt-1 text-sm font-medium text-gray-900">
                          {product.price}
                        </p>
                      </div>

                      <div className="mt-4 sm:mt-0 sm:pr-9">
                        <label
                          htmlFor={`quantity-${productIdx}`}
                          className="sr-only"
                        >
                          Quantity, {product.name}
                        </label>
                        <select
                          id={`quantity-${productIdx}`}
                          name={`quantity-${productIdx}`}
                          className="max-w-full rounded-md border border-gray-300 py-1.5 text-base leading-5 font-medium text-gray-700 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                          <option value={1}>1</option>
                          <option value={2}>2</option>
                          <option value={3}>3</option>
                          <option value={4}>4</option>
                          <option value={5}>5</option>
                          <option value={6}>6</option>
                          <option value={7}>7</option>
                          <option value={8}>8</option>
                        </select>

                        <div className="absolute top-0 right-0">
                          <button
                            type="button"
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
                    </div>

                    <p className="mt-4 flex text-sm text-gray-700 space-x-2">
                      {product.inStock ? (
                        <CheckIcon
                          className="flex-shrink-0 h-5 w-5 text-green-500"
                          aria-hidden="true"
                        />
                      ) : (
                        <ClockIcon
                          className="flex-shrink-0 h-5 w-5 text-gray-300"
                          aria-hidden="true"
                        />
                      )}

                      <span>
                        {product.inStock
                          ? 'In stock'
                          : `Ships in ${product.leadTime}`}
                      </span>
                    </p>
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
                <dt className="text-sm text-gray-600">Subtotal</dt>
                <dd className="text-sm font-medium text-gray-900">$99.00</dd>
              </div>
              <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                <dt className="flex items-center text-sm text-gray-600">
                  <span>Shipping estimate</span>
                  <a
                    href="#"
                    className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">
                      Learn more about how shipping is calculated
                    </span>
                    <QuestionMarkCircleIcon
                      className="h-5 w-5"
                      aria-hidden="true"
                    />
                  </a>
                </dt>
                <dd className="text-sm font-medium text-gray-900">$5.00</dd>
              </div>
              <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                <dt className="flex text-sm text-gray-600">
                  <span>Tax estimate</span>
                  <a
                    href="#"
                    className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">
                      Learn more about how tax is calculated
                    </span>
                    <QuestionMarkCircleIcon
                      className="h-5 w-5"
                      aria-hidden="true"
                    />
                  </a>
                </dt>
                <dd className="text-sm font-medium text-gray-900">$8.32</dd>
              </div>
              <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                <dt className="text-base font-medium text-gray-900">
                  Order total
                </dt>
                <dd className="text-base font-medium text-gray-900">$112.32</dd>
              </div>
            </dl>

            <div className="mt-6">
              <button
                type="submit"
                className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
              >
                Checkout
              </button>
            </div>
          </section>
        </form>

        {/* Related products */}
        <section aria-labelledby="related-heading" className="mt-24">
          <h2
            id="related-heading"
            className="text-lg font-medium text-gray-900"
          >
            You may also like&hellip;
          </h2>

          <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {relatedProducts.map((relatedProduct) => (
              <div key={relatedProduct.id} className="group relative">
                <div className="w-full min-h-80 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none">
                  <img
                    src={relatedProduct.imageSrc}
                    alt={relatedProduct.imageAlt}
                    className="w-full h-full object-center object-cover lg:w-full lg:h-full"
                  />
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-gray-700">
                      <a href={relatedProduct.href}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {relatedProduct.name}
                      </a>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {relatedProduct.color}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {relatedProduct.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
Cart.Layout = Layout

export default Cart
// import type { GetStaticPropsContext } from 'next'
// import commerce from '@lib/api/commerce'
// import { Layout } from '@components/common'
// import { Button, Text } from '@components/ui'
// import { Bag, Cross, Check, MapPin, CreditCard } from '@components/icons'
// import { CartItem } from '@components/cart'
// import useCart from '@components/services/cart'
// import { useUI } from '@components/ui/context'
// import { useEffect } from 'react'

// export async function getStaticProps({
//   preview,
//   locale,
//   locales,
// }: GetStaticPropsContext) {
//   const config = { locale, locales }
//   const pagesPromise = commerce.getAllPages({ config, preview })
//   const siteInfoPromise = commerce.getSiteInfo({ config, preview })
//   const { pages } = await pagesPromise
//   const { categories } = await siteInfoPromise
//   return {
//     props: { pages, categories },
//   }
// }

// export default function Cart() {
//   const error = null
//   const success = null
//   const { getCart } = useCart()
//   const { basketId } = useUI()

//   const data: any = []

//   const isLoading = false

//   const isEmpty = false

//   useEffect(() => {
//     getCart(basketId)
//   }, [])
//   return (
//     <div className="grid lg:grid-cols-12 w-full max-w-7xl mx-auto">
//       <div className="lg:col-span-8">
//         {isLoading || isEmpty ? (
//           <div className="flex-1 px-12 py-24 flex flex-col justify-center items-center ">
//             <span className="border border-dashed border-secondary flex items-center justify-center w-16 h-16 bg-primary p-12 rounded-lg text-primary">
//               <Bag className="absolute" />
//             </span>
//             <h2 className="pt-6 text-2xl font-bold tracking-wide text-center">
//               Your cart is empty
//             </h2>
//             <p className="text-accent-6 px-10 text-center pt-2">
//               Biscuit oat cake wafer icing ice cream tiramisu pudding cupcake.
//             </p>
//           </div>
//         ) : error ? (
//           <div className="flex-1 px-4 flex flex-col justify-center items-center">
//             <span className="border border-white rounded-full flex items-center justify-center w-16 h-16">
//               <Cross width={24} height={24} />
//             </span>
//             <h2 className="pt-6 text-xl font-light text-center">
//               We couldn’t process the purchase. Please check your card
//               information and try again.
//             </h2>
//           </div>
//         ) : success ? (
//           <div className="flex-1 px-4 flex flex-col justify-center items-center">
//             <span className="border border-white rounded-full flex items-center justify-center w-16 h-16">
//               <Check />
//             </span>
//             <h2 className="pt-6 text-xl font-light text-center">
//               Thank you for your order.
//             </h2>
//           </div>
//         ) : (
//           <div className="px-4 sm:px-6 flex-1">
//             <Text variant="pageHeading">My Cart</Text>
//             <Text variant="sectionHeading">Review your Order</Text>
//             <ul className="py-6 space-y-6 sm:py-0 sm:space-y-0 sm:divide-y sm:divide-accent-2 border-b border-accent-2">
//               {data.map((item: any) => (
//                 <CartItem
//                   key={item.id}
//                   item={item}
//                   currencyCode={data?.currency.code!}
//                 />
//               ))}
//             </ul>
//             <div className="my-6">
//               <Text>
//                 Before you leave, take a look at these items. We picked them
//                 just for you
//               </Text>
//               <div className="flex py-6 space-x-6">
//                 {[1, 2, 3, 4, 5, 6].map((x) => (
//                   <div
//                     key={x}
//                     className="border border-accent-3 w-full h-24 bg-accent-2 bg-opacity-50 transform cursor-pointer hover:scale-110 duration-75"
//                   />
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//       <div className="lg:col-span-4">
//         <div className="flex-shrink-0 px-4 py-24 sm:px-6">
//           {process.env.COMMERCE_CUSTOMCHECKOUT_ENABLED && (
//             <>
//               {/* Shipping Address */}
//               {/* Only available with customCheckout set to true - Meaning that the provider does offer checkout functionality. */}
//               <div className="rounded-md border border-accent-2 px-6 py-6 mb-4 text-center flex items-center justify-center cursor-pointer hover:border-accent-4">
//                 <div className="mr-5">
//                   <MapPin />
//                 </div>
//                 <div className="text-sm text-center font-medium">
//                   <span className="uppercase">+ Add Shipping Address</span>
//                   {/* <span>
//                     1046 Kearny Street.<br/>
//                     San Franssisco, California
//                   </span> */}
//                 </div>
//               </div>
//               {/* Payment Method */}
//               {/* Only available with customCheckout set to true - Meaning that the provider does offer checkout functionality. */}
//               <div className="rounded-md border border-accent-2 px-6 py-6 mb-4 text-center flex items-center justify-center cursor-pointer hover:border-accent-4">
//                 <div className="mr-5">
//                   <CreditCard />
//                 </div>
//                 <div className="text-sm text-center font-medium">
//                   <span className="uppercase">+ Add Payment Method</span>
//                   {/* <span>VISA #### #### #### 2345</span> */}
//                 </div>
//               </div>
//             </>
//           )}
//           <div className="border-t border-accent-2">
//             <ul className="py-3">
//               <li className="flex justify-between py-1">
//                 <span>Subtotal</span>
//               </li>
//               <li className="flex justify-between py-1">
//                 <span>Taxes</span>
//                 <span>Calculated at checkout</span>
//               </li>
//               <li className="flex justify-between py-1">
//                 <span>Estimated Shipping</span>
//                 <span className="font-bold tracking-wide">FREE</span>
//               </li>
//             </ul>
//             <div className="flex justify-between border-t border-accent-2 py-3 font-bold mb-10">
//               <span>Total</span>
//             </div>
//           </div>
//           <div className="flex flex-row justify-end">
//             <div className="w-full lg:w-72">
//               {isEmpty ? (
//                 <Button href="/" Component="a" width="100%">
//                   Continue Shopping
//                 </Button>
//               ) : (
//                 <Button href="/checkout" Component="a" width="100%">
//                   Proceed to Checkout
//                 </Button>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// Cart.Layout = Layout
