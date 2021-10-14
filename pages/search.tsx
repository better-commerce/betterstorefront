import { Layout } from '@components/common'
import Link from 'next/link'
import { useReducer } from 'react'
import { useRouter } from 'next/router'
import classNames from '@components/utils/classNames'
import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon, FilterIcon, StarIcon } from '@heroicons/react/solid'
import useSwr from 'swr'
import { getData } from '@components/utils/clientFetcher'
import Skeleton from '@components/ui/Skeleton'
import Pagination from '@components/product/Pagination'
import { GetServerSideProps } from 'next'

const filters = {
  price: [
    { value: '0', label: '$0 - $25', checked: false },
    { value: '25', label: '$25 - $50', checked: false },
    { value: '50', label: '$50 - $75', checked: false },
    { value: '75', label: '$75+', checked: false },
  ],
  color: [
    { value: 'white', label: 'White', checked: false },
    { value: 'beige', label: 'Beige', checked: false },
    { value: 'blue', label: 'Blue', checked: true },
    { value: 'brown', label: 'Brown', checked: false },
    { value: 'green', label: 'Green', checked: false },
    { value: 'purple', label: 'Purple', checked: false },
  ],
  size: [
    { value: 'xs', label: 'XS', checked: false },
    { value: 's', label: 'S', checked: true },
    { value: 'm', label: 'M', checked: false },
    { value: 'l', label: 'L', checked: false },
    { value: 'xl', label: 'XL', checked: false },
    { value: '2xl', label: '2XL', checked: false },
  ],
  category: [
    { value: 'all-new-arrivals', label: 'All New Arrivals', checked: false },
    { value: 'tees', label: 'Tees', checked: false },
    { value: 'objects', label: 'Objects', checked: false },
    { value: 'sweatshirts', label: 'Sweatshirts', checked: false },
    { value: 'pants-and-shorts', label: 'Pants & Shorts', checked: false },
  ],
}
const sortOptions = [
  { name: 'Most Popular', href: '?sortOrder=desc', current: true },
  { name: 'Best Rating', href: '#', current: false },
  { name: 'Newest', href: '#', current: false },
  { name: 'Price: Low to High', href: '#', current: false },
  { name: 'Price: High to Low', href: '#', current: false },
]
const products = [
  {
    id: 1,
    name: 'Organize Basic Set (Walnut)',
    price: '$149',
    rating: 5,
    reviewCount: 38,
    imageSrc:
      'https://tailwindui.com/img/ecommerce-images/category-page-05-image-card-01.jpg',
    imageAlt: 'TODO',
    href: '#',
  },
  {
    id: 2,
    name: 'Organize Pen Holder',
    price: '$15',
    rating: 5,
    reviewCount: 18,
    imageSrc:
      'https://tailwindui.com/img/ecommerce-images/category-page-05-image-card-02.jpg',
    imageAlt: 'TODO',
    href: '#',
  },
  {
    id: 3,
    name: 'Organize Sticky Note Holder',
    price: '$15',
    rating: 5,
    reviewCount: 14,
    imageSrc:
      'https://tailwindui.com/img/ecommerce-images/category-page-05-image-card-03.jpg',
    imageAlt: 'TODO',
    href: '#',
  },
  {
    id: 4,
    name: 'Organize Phone Holder',
    price: '$15',
    rating: 4,
    reviewCount: 21,
    imageSrc:
      'https://tailwindui.com/img/ecommerce-images/category-page-05-image-card-04.jpg',
    imageAlt: 'TODO',
    href: '#',
  },
  // More products...
]

const ACTION_TYPES = {
  SORT_BY: 'SORT_BY',
  PAGE: 'PAGE',
  SORT_ORDER: 'SORT_ORDER',
  CLEAR: 'CLEAR',
}

interface actionInterface {
  type?: string
  payload?: object | any
}

interface stateInterface {
  sortBy?: string
  page?: string
  sortOrder?: string
}

const { SORT_BY, PAGE, SORT_ORDER, CLEAR } = ACTION_TYPES

const DEFAULT_STATE = {
  sortBy: '',
  sortOrder: '',
  page: 1,
}

function reducer(state: stateInterface, { type, payload }: actionInterface) {
  switch (type) {
    case SORT_BY:
      return { ...state, sortBy: payload }
    case PAGE:
      return { ...state, page: payload }
    case SORT_ORDER:
      return { ...state, sortOrder: payload }
    case CLEAR:
      return { ...state, ...DEFAULT_STATE }
    default:
      return state
  }
}

function Search({ query }: any) {
  const adaptedQuery = { ...query }
  adaptedQuery.page ? (adaptedQuery.page = Number(adaptedQuery.page)) : false
  const initialState = {
    ...DEFAULT_STATE,
    ...adaptedQuery,
  }

  const router = useRouter()
  const [state, dispatch] = useReducer(reducer, initialState)
  const computedUrl = `/api/catalog/products/?page=${state.page}&sortBy=${state.sortBy}&sortOrder=${state.sortOrder}`
  const { data, error } = useSwr(computedUrl, getData)
  const handlePageChange = (page: any) => {
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, page: page.selected + 1 },
      },
      undefined,
      { shallow: true }
    )
    dispatch({ type: PAGE, payload: page.selected + 1 })
  }

  return (
    <div className="bg-white">
      {/* Mobile menu */}
      <main className="pb-24">
        <div className="text-center py-16 px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
            Catalog
          </h1>
        </div>

        {/* Filters */}
        <Disclosure
          as="section"
          aria-labelledby="filter-heading"
          className="relative z-10 border-t border-b border-gray-200 grid items-center"
        >
          <h2 id="filter-heading" className="sr-only">
            Filters
          </h2>
          <div className="relative col-start-1 row-start-1 py-4">
            <div className="max-w-7xl mx-auto flex space-x-6 divide-x divide-gray-200 text-sm px-4 sm:px-6 lg:px-8">
              <div>
                <Disclosure.Button className="group text-gray-700 font-medium flex items-center">
                  <FilterIcon
                    className="flex-none w-5 h-5 mr-2 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                  2 Filters
                </Disclosure.Button>
              </div>
              <div className="pl-6">
                <Link href="/search">
                  <button
                    type="button"
                    onClick={() => {
                      dispatch({ type: CLEAR })
                    }}
                    className="text-gray-500"
                  >
                    Clear all
                  </button>
                </Link>
              </div>
            </div>
          </div>
          <Disclosure.Panel className="border-t border-gray-200 py-10">
            <div className="max-w-7xl mx-auto grid grid-cols-2 gap-x-4 px-4 text-sm sm:px-6 md:gap-x-6 lg:px-8">
              <div className="grid grid-cols-1 gap-y-10 auto-rows-min md:grid-cols-2 md:gap-x-6">
                <fieldset>
                  <legend className="block font-medium">Price</legend>
                  <div className="pt-6 space-y-6 sm:pt-4 sm:space-y-4">
                    {filters.price.map((option, optionIdx) => (
                      <div
                        key={option.value}
                        className="flex items-center text-base sm:text-sm"
                      >
                        <input
                          id={`price-${optionIdx}`}
                          name="price[]"
                          defaultValue={option.value}
                          type="checkbox"
                          className="flex-shrink-0 h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                          defaultChecked={option.checked}
                        />
                        <label
                          htmlFor={`price-${optionIdx}`}
                          className="ml-3 min-w-0 flex-1 text-gray-600"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </fieldset>
                <fieldset>
                  <legend className="block font-medium">Color</legend>
                  <div className="pt-6 space-y-6 sm:pt-4 sm:space-y-4">
                    {filters.color.map((option, optionIdx) => (
                      <div
                        key={option.value}
                        className="flex items-center text-base sm:text-sm"
                      >
                        <input
                          id={`color-${optionIdx}`}
                          name="color[]"
                          defaultValue={option.value}
                          type="checkbox"
                          className="flex-shrink-0 h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                          defaultChecked={option.checked}
                        />
                        <label
                          htmlFor={`color-${optionIdx}`}
                          className="ml-3 min-w-0 flex-1 text-gray-600"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </fieldset>
              </div>
              <div className="grid grid-cols-1 gap-y-10 auto-rows-min md:grid-cols-2 md:gap-x-6">
                <fieldset>
                  <legend className="block font-medium">Size</legend>
                  <div className="pt-6 space-y-6 sm:pt-4 sm:space-y-4">
                    {filters.size.map((option, optionIdx) => (
                      <div
                        key={option.value}
                        className="flex items-center text-base sm:text-sm"
                      >
                        <input
                          id={`size-${optionIdx}`}
                          name="size[]"
                          defaultValue={option.value}
                          type="checkbox"
                          className="flex-shrink-0 h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                          defaultChecked={option.checked}
                        />
                        <label
                          htmlFor={`size-${optionIdx}`}
                          className="ml-3 min-w-0 flex-1 text-gray-600"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </fieldset>
                <fieldset>
                  <legend className="block font-medium">Category</legend>
                  <div className="pt-6 space-y-6 sm:pt-4 sm:space-y-4">
                    {filters.category.map((option, optionIdx) => (
                      <div
                        key={option.value}
                        className="flex items-center text-base sm:text-sm"
                      >
                        <input
                          id={`category-${optionIdx}`}
                          name="category[]"
                          defaultValue={option.value}
                          type="checkbox"
                          className="flex-shrink-0 h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                          defaultChecked={option.checked}
                        />
                        <label
                          htmlFor={`category-${optionIdx}`}
                          className="ml-3 min-w-0 flex-1 text-gray-600"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </fieldset>
              </div>
            </div>
          </Disclosure.Panel>
          <div className="col-start-1 row-start-1 py-4">
            <div className="flex justify-end max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Menu as="div" className="relative inline-block">
                <div className="flex">
                  <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                    Sort
                    <ChevronDownIcon
                      className="flex-shrink-0 -mr-1 ml-1 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                      aria-hidden="true"
                    />
                  </Menu.Button>
                </div>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-2xl bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      {sortOptions.map((option) => (
                        <Menu.Item key={option.name}>
                          {({ active }) => (
                            <Link href={option.href} passHref>
                              <a
                                href={option.href}
                                className={classNames(
                                  option.current
                                    ? 'font-medium text-gray-900'
                                    : 'text-gray-500',
                                  active ? 'bg-gray-100' : '',
                                  'block px-4 py-2 text-sm'
                                )}
                              >
                                {option.name}
                              </a>
                            </Link>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </Disclosure>

        {/* Product grid */}
        <section
          aria-labelledby="products-heading"
          className="max-w-7xl mx-auto overflow-hidden sm:px-6 lg:px-8"
        >
          <h2 id="products-heading" className="sr-only">
            Products
          </h2>

          <div className="-mx-px border-l border-gray-200 grid grid-cols-2 sm:mx-0 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="group relative p-4 border-r border-b border-gray-200 sm:p-6"
              >
                <div className="rounded-lg overflow-hidden bg-gray-200 aspect-w-1 aspect-h-1 group-hover:opacity-75">
                  <img
                    src={product.imageSrc}
                    alt={product.imageAlt}
                    className="w-full h-full object-center object-cover"
                  />
                </div>
                <div className="pt-10 pb-4 text-center">
                  <h3 className="text-sm font-medium text-gray-900">
                    <a href={product.href}>
                      <span aria-hidden="true" className="absolute inset-0" />
                      {product.name}
                    </a>
                  </h3>
                  <div className="mt-3 flex flex-col items-center">
                    <p className="sr-only">{product.rating} out of 5 stars</p>
                    <div className="flex items-center">
                      {[0, 1, 2, 3, 4].map((rating) => (
                        <StarIcon
                          key={rating}
                          className={classNames(
                            product.rating > rating
                              ? 'text-yellow-400'
                              : 'text-gray-200',
                            'flex-shrink-0 h-5 w-5'
                          )}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {product.reviewCount} reviews
                    </p>
                  </div>
                  <p className="mt-4 text-base font-medium text-gray-900">
                    {product.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pagination */}
        <Pagination currentPage={state.page} onPageChange={handlePageChange} />
      </main>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: { query: context.query }, // will be passed to the page component as props
  }
}

export default Search

Search.Layout = Layout
