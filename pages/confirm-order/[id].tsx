/* This example requires Tailwind CSS v2.0+ */
import { GetServerSideProps } from 'next'
import { getOrderDetails } from '@framework/checkout'
import Link from 'next/link'
import { GENERAL_ADDRESS, GENERAL_BILLING_ADDRESS, GENERAL_DELIVERED_BY, GENERAL_ITEMS, GENERAL_ON_THE_WAY, GENERAL_ORDER_WILL_BE_WITH_YOU_SOON, GENERAL_PAYMENT, GENERAL_PAYMENT_METHOD, GENERAL_PRICE, GENERAL_QUANTITY, GENERAL_SHIPPING, GENERAL_SHIPPING_ADDRESS, GENERAL_SHIPPING_METHOD, GENERAL_SUBTOTAL, GENERAL_SUMMARY, GENERAL_THANK_YOU, GENERAL_TOTAL, GENERAL_YOUR_ORDER, YOUR_INFORMATION } from '@components/utils/textVariables'

export default function OrderConfirmation({ order }: any) {
  return (
    <main className="bg-white px-4 pt-16 pb-24 sm:px-6 sm:pt-24 lg:px-8 lg:py-32">
      <div className="max-w-3xl mx-auto">
        <div className="max-w-xl">
          <h1 className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
            {GENERAL_THANK_YOU}
          </h1>
          <p className="mt-2 text-4xl text-black font-extrabold tracking-tight sm:text-5xl">
            {GENERAL_ON_THE_WAY}
          </p>
          <p className="mt-2 text-black text-gray-500">
           {GENERAL_YOUR_ORDER} {order.orderNo} {GENERAL_ORDER_WILL_BE_WITH_YOU_SOON}
          </p>
        </div>

        <section
          aria-labelledby="order-heading"
          className="mt-10 border-t border-gray-200"
        >
          <h2 id="order-heading" className="sr-only">
            {GENERAL_YOUR_ORDER}
          </h2>

          <h3 className="sr-only">{GENERAL_ITEMS}</h3>
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
                      <dt className="font-medium text-gray-900">{GENERAL_QUANTITY}</dt>
                      <dd className="ml-2 text-gray-700">{product.qty}</dd>
                    </div>
                    <div className="pl-4 flex sm:pl-6">
                      <dt className="font-medium text-gray-900">{GENERAL_PRICE}</dt>
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
            <h3 className="sr-only">{YOUR_INFORMATION}</h3>

            <h4 className="sr-only">{GENERAL_ADDRESS}</h4>
            <dl className="grid grid-cols-2 gap-x-6 text-sm py-10">
              <div>
                <dt className="font-medium text-gray-900">{GENERAL_SHIPPING_ADDRESS}</dt>
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
                <dt className="font-medium text-gray-900">{GENERAL_BILLING_ADDRESS}</dt>
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

            <h4 className="sr-only">{GENERAL_PAYMENT}</h4>
            <dl className="grid grid-cols-2 gap-x-6 border-t border-gray-200 text-sm py-10">
              {order.payments && (
                <div>
                  <dt className="font-medium text-gray-900">{GENERAL_PAYMENT_METHOD}</dt>
                  <dd className="mt-2 text-gray-700">
                    <p>{order.paymentsorder.payments[0]?.paymentMethod}</p>
                    <p>{order.payments[0]?.paymentGateway}</p>
                    <p>{order.payments[0]?.cardNo}</p>
                  </dd>
                </div>
              )}
              <div>
                <dt className="font-medium text-gray-900">{GENERAL_SHIPPING_METHOD}</dt>
                <dd className="mt-2 text-gray-700">
                  <p>{order.shipping.displayName}</p>
                  <p>
                    {GENERAL_DELIVERED_BY}:{' '}
                    {new Date(
                      order.shipping.expectedDeliveryDate
                    ).toLocaleDateString()}
                  </p>
                </dd>
              </div>
            </dl>

            <h3 className="sr-only">{GENERAL_SUMMARY}</h3>

            <dl className="space-y-6 border-t border-gray-200 text-sm pt-10">
              <div className="flex justify-between">
                <dt className="font-medium text-gray-900">{GENERAL_SUBTOTAL}</dt>
                <dd className="text-gray-700">
                  {order.subTotal?.formatted?.withTax}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium text-gray-900">{GENERAL_SHIPPING}</dt>
                <dd className="text-gray-700">
                  {order.shipping.price.formatted.withTax}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium text-gray-900">{GENERAL_TOTAL}</dt>
                <dd className="text-gray-900">
                  {order.subTotal?.formatted?.withTax}
                </dd>
              </div>
            </dl>
          </div>
        </section>
      </div>
    </main>
  )
}

export const getServerSideProps: GetServerSideProps = async ({
  params,
}: any) => {
  const response: any = await getOrderDetails()(params?.id)

  return {
    props: { order: response.result }, // will be passed to the page component as props
  }
}
