import { useEffect, useState } from 'react'
import { CheckIcon } from '@heroicons/react/outline'
import axios from 'axios'
import { NEXT_GET_ORDERS } from '@components/utils/constants'
import { useUI } from '@components/ui/context'
import Link from 'next/link'
import cartHandler from '@components/services/cart'

export default function MyOrders() {
  const [data, setData] = useState([])

  const { user, basketId, setCartItems, openCart } = useUI()

  useEffect(() => {
    const fetchOrders = async () => {
      const response: any = await axios.post(NEXT_GET_ORDERS, {
        id: user.userId,
        hasMembership: user.hasMembership,
      })

      setData(response.data)
    }
    fetchOrders()
  }, [])

  const handleAddToCart = (product: any) => {
    cartHandler()
      .addToCart({
        basketId,
        productId: product.recordId,
        qty: product.qty,
        manualUnitPrice: product.price,
        stockCode: product.stockCode,
        userId: user.userId,
        isAssociated: user.isAssociated,
      })
      .then((response: any) => {
        setCartItems(response)
        openCart()
      })
      .catch((err: any) => console.log('error', err))
  }

  return (
    <div className="bg-white">
      {/* Mobile menu */}

      <main className="sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="px-4 sm:px-0">
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
              Order history
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Check the status of recent orders, manage returns, and download
              invoices.
            </p>
          </div>

          <section aria-labelledby="recent-heading" className="mt-16">
            <h2 id="recent-heading" className="sr-only">
              Recent orders
            </h2>

            <div className="space-y-16 sm:space-y-24">
              {data.map((order: any) => (
                <div key={order.orderNo}>
                  <h3 className="sr-only">
                    Order placed on{' '}
                    <time dateTime={order.orderDate}>
                      {new Date(order.orderDate).toLocaleDateString()}
                    </time>
                  </h3>

                  <div className="bg-gray-50 px-4 py-8 sm:rounded-lg sm:p-8 md:flex md:items-center md:justify-between md:space-x-6 lg:space-x-10">
                    <dl className="divide-y divide-gray-200 space-y-6 text-sm text-gray-600 flex-auto md:divide-y-0 md:space-y-0 md:grid md:grid-cols-5 md:gap-x-10 w-full lg:flex-none lg:gap-x-10">
                      <div className="flex justify-between md:block">
                        <dt className="font-medium text-gray-900">
                          Order number
                        </dt>
                        <dd className="md:mt-1">{order.orderNo}</dd>
                      </div>
                      <div className="flex justify-between pt-4 md:block md:pt-0">
                        <dt className="font-medium text-gray-900">
                          Date placed
                        </dt>
                        <dd className="md:mt-1">
                          <time dateTime={order.orderDate}>
                            {new Date(order.orderDate).toLocaleDateString()}
                          </time>
                        </dd>
                      </div>
                      <div className="flex justify-between pt-4 font-medium text-gray-900 md:block md:pt-0">
                        <dt>Total</dt>
                        <dd className="md:mt-1">
                          {order?.subTotal?.formatted?.withTax}
                        </dd>
                      </div>
                      <div className="flex justify-between md:block">
                        <dt className="font-medium text-gray-900">Status</dt>
                        <dd className="md:mt-1">{order.orderStatus}</dd>
                      </div>
                      <div className="flex justify-between md:block">
                        <dt className="font-medium text-gray-900">Tracking</dt>
                        {/* <dd className="md:mt-1">{order.orderStatus}</dd> */}
                        <a
                          href={order.trackingLink}
                          className="md:mt-1 text-indigo-600 hover:indigo-500"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Tracking link
                        </a>
                      </div>
                    </dl>
                  </div>
                  <div className="mt-6 flow-root px-4 sm:mt-10 sm:px-0">
                    <div className="-my-6 divide-y divide-gray-200 sm:-my-10">
                      {order.itemsBasic.map((product: any) => (
                        <div key={product.id} className="flex py-6 sm:py-10">
                          <div className="min-w-0 flex-1 lg:flex lg:flex-col">
                            <div className="lg:flex-1">
                              <div className="sm:flex">
                                <div>
                                  <h4 className="font-medium text-gray-900">
                                    {product?.name}
                                  </h4>
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html: product.shortDescription,
                                    }}
                                    className="hidden mt-2 text-sm text-gray-500 sm:block"
                                  />
                                </div>
                                <p className="mt-1 font-medium text-gray-900 sm:mt-0 sm:ml-6">
                                  {product.price?.formatted?.withTax}
                                </p>
                              </div>
                              <div className="mt-2 flex text-sm font-medium sm:mt-4">
                                <Link href={`/${product.slug || '#'}`}>
                                  <a
                                    href={product.slug || '#'}
                                    className="text-indigo-600 hover:text-indigo-500"
                                  >
                                    View Product
                                  </a>
                                </Link>
                                <div className="border-l border-gray-200 ml-4 pl-4 sm:ml-6 sm:pl-6">
                                  <button
                                    onClick={() => handleAddToCart(product)}
                                    className="text-indigo-600 hover:text-indigo-500"
                                  >
                                    Add to basket
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="ml-4 flex-shrink-0 sm:m-0 sm:mr-6 sm:order-first">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="col-start-2 col-end-3 sm:col-start-1 sm:row-start-1 sm:row-span-2 w-20 h-20 rounded-lg object-center object-cover sm:w-40 sm:h-40 lg:w-52 lg:h-52"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
