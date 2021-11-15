import { useEffect, useState } from 'react'
import { CheckIcon } from '@heroicons/react/outline'
import axios from 'axios'
import { NEXT_GET_WISHLIST } from '@components/utils/constants'
import { useUI } from '@components/ui/context'
import Link from 'next/link'

export default function Wishlist() {
  const [data, setData] = useState([])

  const { user } = useUI()
  useEffect(() => {
    const fetchOrders = async () => {
      const response: any = await axios.post(NEXT_GET_WISHLIST, {
        id: user.userId,
        flag: true,
      })
      setData(response.data)
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
              Wishlist
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Check the status of recent orders, manage returns, and download
              invoices.
            </p>
          </div>

          <section aria-labelledby="recent-heading" className="mt-16">
            {!data.length && <div>Oh-no! Your wishlist is empty.</div>}
            <div className="space-y-16 sm:space-y-24">
              <div className="mt-6 flow-root px-4 sm:mt-10 sm:px-0">
                <div className="-my-6 divide-y divide-gray-200 sm:-my-10">
                  {data.map((product: any) => (
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
          </section>
        </div>
      </main>
    </div>
  )
}
