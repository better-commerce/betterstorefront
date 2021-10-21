import { useState } from 'react'
import { RadioGroup, Tab } from '@headlessui/react'
import { HeartIcon } from '@heroicons/react/outline'
import { StarIcon, PlayIcon } from '@heroicons/react/solid'
import { NextSeo } from 'next-seo'
import classNames from '@components/utils/classNames'
import AttributesHandler from './AttributesHandler'
import Link from 'next/link'
import { useUI } from '@components/ui/context'
import BreadCrumbs from '@components/ui/BreadCrumbs'

export default function ProductView({ product = { images: [] } }: any) {
  const { openNotifyUser } = useUI()

  console.log(product)

  if (!product) {
    return null
  }

  const handleNotification = () => {
    openNotifyUser(product.id)
  }

  const content = [...product.images, ...product.videos]

  return (
    <div className="bg-white">
      {/* Mobile menu */}
      <div className="max-w-7xl mx-auto sm:pt-6 sm:px-6 lg:px-8">
        <BreadCrumbs items={product.breadCrumbs} currentProduct={product} />
      </div>
      <main className="max-w-7xl mx-auto sm:pt-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto lg:max-w-none">
          {/* Product */}
          <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
            {/* Image gallery */}
            <Tab.Group as="div" className="flex flex-col-reverse">
              {/* Image selector */}
              <div className="hidden mt-6 w-full max-w-2xl mx-auto sm:block lg:max-w-none">
                <Tab.List className="grid grid-cols-4 gap-6">
                  {content?.map((image: any) => (
                    <Tab
                      key={image.name}
                      className="relative h-24 bg-white rounded-md flex items-center justify-center text-sm font-medium uppercase text-gray-900 cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring focus:ring-offset-4 focus:ring-opacity-50"
                    >
                      {() => (
                        <>
                          <span className="sr-only">{image.name}</span>
                          <span className="absolute inset-0 rounded-md overflow-hidden">
                            {image.image ? (
                              <img
                                src={image.image}
                                alt=""
                                className="w-full h-full object-center object-cover"
                              />
                            ) : (
                              <PlayIcon className="h-full w-full object-center object-cover" />
                            )}
                          </span>
                        </>
                      )}
                    </Tab>
                  ))}
                </Tab.List>
              </div>

              <Tab.Panels className="w-full aspect-w-1 aspect-h-1">
                {content?.map((image: any) => (
                  <Tab.Panel key={image.name + 'tab-panel'}>
                    {image.image ? (
                      <img
                        src={image.image}
                        alt={image.name}
                        className="w-full h-full object-center object-cover sm:rounded-lg"
                      />
                    ) : (
                      <iframe
                        width="560"
                        height="315"
                        src={image.url}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    )}
                  </Tab.Panel>
                ))}
              </Tab.Panels>
            </Tab.Group>

            {/* Product info */}
            <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                {product.name}
              </h1>

              <div className="mt-3">
                <h2 className="sr-only">Product information</h2>
                <p className="text-3xl text-gray-900">
                  {product.price.formatted.withTax}
                  {product.listPrice.raw.tax > 0 ? (
                    <span className="px-5 text-sm line-through text-gray-500">
                      RRP {product.listPrice.formatted.withTax}
                    </span>
                  ) : null}
                </p>
              </div>

              {/* Reviews */}
              <div className="mt-3">
                <h3 className="sr-only">Reviews</h3>
                <div className="flex items-center">
                  <div className="flex items-center">
                    {[0, 1, 2, 3, 4].map((rating) => (
                      <StarIcon
                        key={rating}
                        className={classNames(
                          product.rating > rating
                            ? 'text-indigo-500'
                            : 'text-gray-300',
                          'h-5 w-5 flex-shrink-0'
                        )}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <p className="sr-only">{product.rating} out of 5 stars</p>
                </div>
              </div>
              <div className="w-full sm:w-6/12">
                <AttributesHandler product={product} />
              </div>
              <div className="mt-6">
                <h3 className="sr-only">Description</h3>

                <div
                  className="text-gray-700 space-y-6"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>

              <section aria-labelledby="details-heading" className="mt-12">
                <h2 id="details-heading" className="sr-only">
                  Additional details
                </h2>

                <div className="mt-10 flex sm:flex-col1">
                  <button
                    type="submit"
                    onClick={() => {
                      product.currentStock ? () => {} : handleNotification()
                    }}
                    className="max-w-xs flex-1 bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500 sm:w-full"
                  >
                    {product.currentStock ? 'Add to bag' : 'Notify me'}
                  </button>

                  <button
                    type="button"
                    className="ml-4 py-3 px-3 rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                  >
                    <HeartIcon
                      className="h-6 w-6 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <span className="sr-only">Add to favorites</span>
                  </button>
                </div>

                <div className="border-t divide-y divide-gray-200">
                  {/* {product.details.map((detail:any) => (
                    <Disclosure as="div" key={detail.name}>
                      {({ open }) => (
                        <>
                          <h3>
                            <Disclosure.Button className="group relative w-full py-6 flex justify-between items-center text-left">
                              <span
                                className={classNames(
                                  open ? 'text-indigo-600' : 'text-gray-900',
                                  'text-sm font-medium'
                                )}
                              >
                                {detail.name}
                              </span>
                              <span className="ml-6 flex items-center">
                                {open ? (
                                  <MinusSmIcon
                                    className="block h-6 w-6 text-indigo-400 group-hover:text-indigo-500"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <PlusSmIcon
                                    className="block h-6 w-6 text-gray-400 group-hover:text-gray-500"
                                    aria-hidden="true"
                                  />
                                )}
                              </span>
                            </Disclosure.Button>
                          </h3>
                          <Disclosure.Panel
                            as="div"
                            className="pb-6 prose prose-sm"
                          >
                            <ul role="list">
                              {detail.items.map((item) => (
                                <li key={item}>{item}</li>
                              ))}
                            </ul>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  ))} */}
                </div>
              </section>
            </div>
          </div>

          <section
            aria-labelledby="related-heading"
            className="mt-10 border-t border-gray-200 py-16 px-4 sm:px-0"
          >
            <h2
              id="related-heading"
              className="text-xl font-bold text-gray-900"
            >
              Customers also bought
            </h2>

            <div className="mt-8 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
              {product?.relatedProductList?.map((product: any) => (
                <div key={product.id}>
                  <div className="relative">
                    <div className="relative w-full h-72 rounded-lg overflow-hidden">
                      <Link href={`/${product.slug}`} passHref>
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-center object-cover"
                        />
                      </Link>
                    </div>
                    <div className="relative mt-4">
                      <h3 className="text-sm font-medium text-gray-900">
                        <Link href={`/${product.slug}`} passHref>
                          <a href={`/${product.slug}`}>{product.name}</a>
                        </Link>
                      </h3>
                      {/* <p className="mt-1 text-sm text-gray-500">
                        {product.color}
                      </p> */}
                    </div>
                    <div className="absolute top-0 inset-x-0 h-72 rounded-lg p-4 flex items-end justify-end overflow-hidden">
                      <div
                        aria-hidden="true"
                        className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black opacity-50"
                      />
                      <p className="relative text-lg font-semibold text-white">
                        {product.price.formatted.withTax}
                      </p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Link href={`/${product.slug}`} passHref>
                      <a
                        href={product.slug}
                        className="relative flex bg-gray-100 border border-transparent rounded-md py-2 px-8 items-center justify-center text-sm font-medium text-gray-900 hover:bg-gray-200"
                      >
                        Add to bag
                        <span className="sr-only">, {product.name}</span>
                      </a>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
        <NextSeo
          title={product.name}
          description={product.metaDescription}
          additionalMetaTags={[
            {
              name: 'keywords',
              content: product.metaKeywords,
            },
          ]}
          openGraph={{
            type: 'website',
            title: product.metaTitle,
            description: product.metaDescription,
            images: [
              {
                url: product.image,
                width: 800,
                height: 600,
                alt: product.name,
              },
            ],
          }}
        />
      </main>
    </div>
  )
}
