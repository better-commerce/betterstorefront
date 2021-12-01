import Link from 'next/link'
import { TrashIcon } from '@heroicons/react/solid'
import { PlusSmIcon, MinusSmIcon } from '@heroicons/react/outline'
import PromotionInput from '@components/cart/PromotionInput'

export default function Summary({ cart, handleItem }: any) {
  return (
    <div className="mt-10 lg:mt-0">
      <h2 className="text-lg font-medium text-gray-900">Order summary</h2>

      <div className="mt-4 bg-white border border-gray-200 rounded-lg shadow-sm">
        <h3 className="sr-only">Items in your cart</h3>
        <ul role="list" className="divide-y divide-gray-200">
          {cart.lineItems?.map((product: any) => (
            <li key={product.id} className="flex py-6 px-4 sm:px-6">
              <div className="flex-shrink-0">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-20 rounded-md"
                />
              </div>

              <div className="ml-6 flex-1 flex flex-col">
                <div className="flex">
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm">
                      <h3 className="py-2 text-md font-bold text-gray-900">
                        {product.brand}
                      </h3>
                      <Link href={`/${product.slug}`}>
                        <a className="font-medium text-gray-700 hover:text-gray-800">
                          {product.name}
                        </a>
                      </Link>
                    </h4>
                  </div>

                  <div className="ml-4 flex-shrink-0 flow-root">
                    <button
                      type="button"
                      onClick={() => handleItem(product, 'delete')}
                      className="-m-2.5 bg-white p-2.5 flex items-center justify-center text-gray-400 hover:text-gray-500"
                    >
                      <span className="sr-only">Remove</span>
                      <TrashIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 pt-2 flex items-end justify-between">
                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {product.price?.formatted?.withTax}
                  </p>

                  <div className="mt-4 sm:mt-0 sm:pr-9">
                    <div className="border px-4 text-gray-900 flex flex-row">
                      <MinusSmIcon
                        onClick={() => handleItem(product, 'decrease')}
                        className="w-4 cursor-pointer"
                      />
                      <span className="text-md px-2 py-2">{product.qty}</span>
                      <PlusSmIcon
                        className="w-4 cursor-pointer"
                        onClick={() => handleItem(product, 'increase')}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <dl className="border-t border-gray-200 py-6 px-4 space-y-6 sm:px-6">
          <div className="flex items-center justify-between">
            <dt className="text-sm text-gray-900">
              {' '}
              Subtotal (taxes included)
            </dt>
            <dd className="text-sm font-medium text-gray-900">
              {cart.subTotal?.formatted?.withTax}
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-sm text-gray-900">Shipping</dt>
            <dd className="text-sm font-medium text-gray-900">
              {cart.shippingCharge?.formatted?.withTax}
            </dd>
          </div>
          <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
            {cart.promotionsApplied?.length > 0 && (
              <>
                <dt className="flex items-center text-sm text-indigo-600">
                  <span>Discount</span>
                </dt>
                <dd className="text-indigo-600 text-sm font-medium">
                  <p>{cart.discount?.formatted?.withTax}</p>
                </dd>
              </>
            )}
          </div>
          <PromotionInput />

          <div className="flex items-center justify-between border-t border-gray-200 pt-6">
            <dt className="font-medium text-gray-900">Total</dt>
            <dd className="font-medium text-gray-900">
              {cart.grandTotal?.formatted?.withTax}
            </dd>
          </div>
        </dl>

        <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
          <button
            type="submit"
            className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
          >
            Confirm order
          </button>
        </div>
      </div>
    </div>
  )
}
