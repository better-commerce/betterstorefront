import { useEffect, useState } from 'react'
import { CheckIcon } from '@heroicons/react/outline'
import axios from 'axios'
import { NEXT_GET_ORDERS } from '@components/utils/constants'
import { useUI } from '@components/ui/context'
import Link from 'next/link'

export default function MyOrders() {
  const [data, setData] = useState([])

  const { user } = useUI()
  useEffect(() => {
    const fetchOrders = async () => {
      const response: any = await axios.post(NEXT_GET_ORDERS, {
        email: user.email,
      })
      let tempArr: any = []
      tempArr.push(response.data)
      setData(tempArr)
    }
    fetchOrders()
  }, [])
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

                  <div className="bg-gray-50 px-4 py-6 sm:rounded-lg sm:p-6 md:flex md:items-center md:justify-between md:space-x-6 lg:space-x-8">
                    <dl className="divide-y divide-gray-200 space-y-4 text-sm text-gray-600 flex-auto md:divide-y-0 md:space-y-0 md:grid md:grid-cols-4 md:gap-x-8 lg:w-1/2 lg:flex-none lg:gap-x-8">
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
                          {order.subTotal.formatted.withTax}
                        </dd>
                      </div>
                      <div className="flex justify-between md:block">
                        <dt className="font-medium text-gray-900">Status</dt>
                        <dd className="md:mt-1">{order.orderStatus}</dd>
                      </div>
                    </dl>
                    {/* <div className="space-y-4 mt-6 sm:flex sm:space-x-4 sm:space-y-0 md:mt-0">
                      <a
                        href={order.href}
                        className="w-full flex items-center justify-center bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 md:w-auto"
                      >
                        View Order
                        <span className="sr-only">{order.number}</span>
                      </a>
                      <a
                        href={order.invoiceHref}
                        className="w-full flex items-center justify-center bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 md:w-auto"
                      >
                        View Invoice
                        <span className="sr-only">
                          for order {order.number}
                        </span>
                      </a>
                    </div> */}
                  </div>

                  <div className="mt-6 flow-root px-4 sm:mt-10 sm:px-0">
                    <div className="-my-6 divide-y divide-gray-200 sm:-my-10">
                      {order.items.map((product: any) => (
                        <div key={product.id} className="flex py-6 sm:py-10">
                          <div className="min-w-0 flex-1 lg:flex lg:flex-col">
                            <div className="lg:flex-1">
                              <div className="sm:flex">
                                <div>
                                  <h4 className="font-medium text-gray-900">
                                    {product.name}
                                  </h4>
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html: product.shortDescription,
                                    }}
                                    className="hidden mt-2 text-sm text-gray-500 sm:block"
                                  />
                                </div>
                                <p className="mt-1 font-medium text-gray-900 sm:mt-0 sm:ml-6">
                                  {product.price.formatted.withTax}
                                </p>
                              </div>
                              <div className="mt-2 flex text-sm font-medium sm:mt-4">
                                <Link href={`/${product.slug}`}>
                                  <a
                                    href={product.slug}
                                    className="text-indigo-600 hover:text-indigo-500"
                                  >
                                    View Product
                                  </a>
                                </Link>
                                <div className="border-l border-gray-200 ml-4 pl-4 sm:ml-6 sm:pl-6">
                                  <a
                                    href="#"
                                    className="text-indigo-600 hover:text-indigo-500"
                                  >
                                    Buy Again
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div className="mt-6 font-medium">
                              {product.status === 'delivered' ? (
                                <div className="flex space-x-2">
                                  <CheckIcon
                                    className="flex-none w-6 h-6 text-green-500"
                                    aria-hidden="true"
                                  />
                                  <p>
                                    Delivered
                                    <span className="hidden sm:inline">
                                      {' '}
                                      on{' '}
                                      <time dateTime={product.datetime}>
                                        {product.date}
                                      </time>
                                    </span>
                                  </p>
                                </div>
                              ) : product.status === 'out-for-delivery' ? (
                                <p>Out for delivery</p>
                              ) : product.status === 'cancelled' ? (
                                <p className="text-gray-500">Cancelled</p>
                              ) : null}
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
