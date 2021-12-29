/* This example requires Tailwind CSS v2.0+ */
import { useEffect, useState } from 'react'
import { useUI } from '@components/ui/context'
import Link from 'next/link'
import axios from 'axios'
import { NEXT_GET_ORDER_DETAILS } from '@components/utils/constants'
const defaultModel: any = {}
import { LoadingDots } from '@components/ui'

export default function OrderConfirmation() {
  const [order, setOrderData] = useState(defaultModel)
  const [isLoading, setIsLoading] = useState(true)
  const { setOrderId, orderId } = useUI()

  useEffect(() => {
    const fetchOrder = async () => {
      const { data }: any = await axios.post(NEXT_GET_ORDER_DETAILS, {
        id: orderId,
      })
      setOrderData(data.order)
      setIsLoading(false)
    }
    if (orderId) fetchOrder()
    if (!orderId) setIsLoading(false)
    return function cleanup() {
      setOrderId('')
    }
  }, [])

  if (isLoading) {
    return (
      <main className="bg-white px-4 pt-16 pb-24 sm:px-6 sm:pt-24 lg:px-8 lg:py-32">
        <h1 className="text-5xl text-center w-full font-extrabold uppercase tracking-light text-gray-600">
          Loading your order
        </h1>
        <div className="mt-10 flex justify-center items-center text-gray-900 w-full">
          <LoadingDots />
        </div>
      </main>
    )
  }
  return (
    <main className="bg-white px-4 pt-16 pb-24 sm:px-6 sm:pt-24 lg:px-8 lg:py-32">
      <div className="max-w-3xl mx-auto">
        <div className="max-w-xl">
          <h1 className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
            {order.orderNo ? 'Thank you!' : null}
          </h1>
          <p className="mt-2 text-4xl text-black font-extrabold tracking-tight sm:text-5xl">
            {order.orderNo ? " It's on the way!" : 'Woops! No order provided'}
          </p>
          {order.orderNo ? (
            <p className="mt-2 text-black text-gray-500">
              Your order {order.orderNo} will be with you soon.
            </p>
          ) : null}
        </div>

        {order.orderNo ? (
          <section
            aria-labelledby="order-heading"
            className="mt-10 border-t border-gray-200"
          >
            <h2 id="order-heading" className="sr-only">
              Your order
            </h2>

            <h3 className="sr-only">Items</h3>
            {order.items.map((product: any) => (
              <div
                key={product.id}
                className="py-10 border-b border-gray-200 flex space-x-6"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="flex-none w-20 h-20 object-center object-cover bg-gray-100 rounded-lg sm:w-40 sm:h-40"
                />
                <div className="flex-auto flex flex-col">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      <Link href={`/${product.slug}`}>
                        <a>{product.name}</a>
                      </Link>
                    </h4>

                    <div
                      dangerouslySetInnerHTML={{
                        __html: product.shortDescription,
                      }}
                      className="mt-2 text-sm text-gray-500"
                    />
                  </div>
                  <div className="mt-6 flex-1 flex items-end">
                    <dl className="flex text-sm divide-x divide-gray-200 space-x-4 sm:space-x-6">
                      <div className="flex">
                        <dt className="font-medium text-gray-900">Quantity</dt>
                        <dd className="ml-2 text-gray-700">{product.qty}</dd>
                      </div>
                      <div className="pl-4 flex sm:pl-6">
                        <dt className="font-medium text-gray-900">Price</dt>
                        <dd className="ml-2 text-gray-700">
                          {product.price.formatted.withTax}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            ))}

            <div className="sm:ml-40 sm:pl-6">
              <h3 className="sr-only">Your information</h3>

              <h4 className="sr-only">Addresses</h4>
              <dl className="grid grid-cols-2 gap-x-6 text-sm py-10">
                <div>
                  <dt className="font-medium text-gray-900">
                    Shipping address
                  </dt>
                  <dd className="mt-2 text-gray-700">
                    <address className="not-italic">
                      <span className="block">{`${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`}</span>
                      <span className="block">{`${order.shippingAddress.phoneNo}`}</span>
                      <span className="block">{`${order.shippingAddress.address1}`}</span>
                      <span className="block">{`${order.shippingAddress.address2}`}</span>
                      <span className="block">{`${order.shippingAddress.city} ${order.shippingAddress.countryCode} ${order.shippingAddress.postCode}`}</span>
                    </address>
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-900">Billing address</dt>
                  <dd className="mt-2 text-gray-700">
                    <address className="not-italic">
                      <span className="block">{`${order.billingAddress.firstName} ${order.billingAddress.lastName}`}</span>
                      <span className="block">{`${order.shippingAddress.phoneNo}`}</span>
                      <span className="block">{`${order.billingAddress.address1}`}</span>
                      <span className="block">{`${order.billingAddress.address2}`}</span>
                      <span className="block">{`${order.billingAddress.city} ${order.billingAddress.countryCode} ${order.billingAddress.postCode}`}</span>
                    </address>
                  </dd>
                </div>
              </dl>

              <h4 className="sr-only">Payment</h4>
              <dl className="grid grid-cols-2 gap-x-6 border-t border-gray-200 text-sm py-10">
                {order.payments && (
                  <div>
                    <dt className="font-medium text-gray-900">
                      Payment method
                    </dt>
                    <dd className="mt-2 text-gray-700">
                      <p>{order.payments[0]?.paymentMethod}</p>
                      <p>{order.payments[0]?.paymentGateway}</p>
                      <p>{order.payments[0]?.cardNo}</p>
                    </dd>
                  </div>
                )}
                <div>
                  <dt className="font-medium text-gray-900">Shipping method</dt>
                  <dd className="mt-2 text-gray-700">
                    <p>{order.shipping.displayName}</p>
                    <p>
                      Delivered by:{' '}
                      {new Date(
                        order.shipping.expectedDeliveryDate
                      ).toLocaleDateString()}
                    </p>
                  </dd>
                </div>
              </dl>

              <h3 className="sr-only">Summary</h3>

              <dl className="space-y-6 border-t border-gray-200 text-sm pt-10">
                <div className="flex justify-between">
                  <dt className="font-medium text-gray-900">Subtotal</dt>
                  <dd className="text-gray-700">
                    {order.subTotal?.formatted?.withTax}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium text-gray-900">Shipping</dt>
                  <dd className="text-gray-700">
                    {order.shipping.price.formatted.withTax}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium text-gray-900">Total</dt>
                  <dd className="text-gray-900">
                    {order.subTotal?.formatted?.withTax}
                  </dd>
                </div>
              </dl>
            </div>
          </section>
        ) : null}
      </div>
    </main>
  )
}
