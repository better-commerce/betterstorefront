import { Fragment, useState } from 'react'
import { Dialog, Disclosure, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon, FunnelIcon } from '@heroicons/react/24/solid'
import classNames from '@components/utils/classNames'
import ProductSort from '@components/product/ProductSort'
import FilterList from './FilterList'
import { data } from 'autoprefixer'
import { BTN_CLEAR_ALL, GENERAL_CLOSE, GENERAL_FILTER_TITLE, PRODUCT_FILTER } from '@components/utils/textVariables'

/**
 *
 * {
 *  key: "brandNoAnlz",
 *  value: "Accessorize"
 *  "isSelected": true
 * }
 * */
interface Props {
  products: any
  handleSortBy: any
  handleFilters: any
  routerFilters: any
  clearAll: any
  routerSortOption: any
}

export default function Filters({
  products = { filters: [] },
  handleFilters,
  handleSortBy,
  routerFilters,
  clearAll,
  routerSortOption,
}: Props) {
  const [open, setOpen] = useState(false)

  const generateFiltersTitle = (filtersLength: number) => {
    if (filtersLength === 0) return null
    if (filtersLength === 1) return `${filtersLength} Filter`
    return `${filtersLength} Filters`
  }

  const appliedFilters = products?.filters?.reduce(
    (acc: any, obj: any) => {
      acc.forEach((item: any) => {
        if (item.Key === obj.key) {
          item['name'] = obj.name
          return item
        }
        return acc
      })
      return acc
    },
    [...routerFilters]
  )

  return (
    <div className="bg-transparent">
      {/* Mobile filter dialog */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 flex z-999" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <div className="relative flex flex-col w-full h-full max-w-xs py-2 pb-2 ml-auto overflow-y-auto bg-white shadow-xl sm:py-4 sm:pb-6 z-9999">
              <div className="flex items-center justify-between px-4">
                <h2 className="text-lg font-medium text-gray-900">{GENERAL_FILTER_TITLE}</h2>
                <button
                  type="button"
                  className="flex items-center justify-center w-10 h-6 p-2 -mr-2 text-gray-400 bg-white rounded-md sm:h-10 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  onClick={() => setOpen(false)}
                >
                  <span className="sr-only">{GENERAL_CLOSE}</span>
                  <XMarkIcon className="w-6 h-6" aria-hidden="true" />
                </button>
              </div>

              {/* Filters */}
              <form className="mt-2 sm:mt-4">
                {products.filters?.map((section: any) => (
                  <Disclosure
                    as="div"
                    key={section.name}
                    className="px-4 py-3 border-t border-gray-200"
                  >
                    {({ open }) => (
                      <>
                        <h3 className="flow-root -mx-2 -my-3">
                          <Disclosure.Button className="flex items-center justify-between w-full px-2 py-3 text-sm text-gray-400 bg-white">
                            <span className="font-medium text-gray-900">
                              {section.name}
                            </span>
                            <span className="flex items-center ml-6">
                              <ChevronDownIcon
                                className={classNames(
                                  open ? '-rotate-180' : 'rotate-0',
                                  'h-5 w-5 transform'
                                )}
                                aria-hidden="true"
                              />
                            </span>
                          </Disclosure.Button>
                        </h3>
                        <Disclosure.Panel className="pt-6">
                          <div className="space-y-6">
                            <FilterList
                              handleFilters={handleFilters}
                              sectionKey={section.key}
                              items={section.items}
                              routerFilters={routerFilters}
                              closeSidebar={() => setOpen(false)}
                            />
                          </div>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                ))}
              </form>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition.Root>

      <div className="px-0 text-center sm:px-6 lg:max-w-7xl lg:px-8">
        <section
          aria-labelledby="filter-heading-filter"
          className="py-0 border-t border-gray-200"
        >
          <h2 className="sr-only">
            {PRODUCT_FILTER}
          </h2>

          <div className="flex items-center justify-between pr-4">
            <h2 id="filter-heading-filter" className="sr-only">
              {GENERAL_FILTER_TITLE}
            </h2>
            <div className="relative col-start-1 row-start-1 py-3">
              <div className="flex px-4 mx-auto space-x-6 text-sm divide-x divide-gray-200 max-w-7xl sm:px-6 lg:px-8">
                <div>
                  <button
                    onClick={() => setOpen(true)}
                    className="flex items-center font-medium text-gray-700 group"
                  >
                    <FunnelIcon
                      className="flex-none w-5 h-5 mr-2 text-gray-900 group-hover:text-gray-500"
                      aria-hidden="true"
                    />
                    {appliedFilters?.length >0 && (
                      routerFilters.length
                    )}
                    
                  </button>
                </div>
                <div className="pl-6">
                  <button
                    onClick={clearAll}
                    type="button"
                    className="text-gray-500"
                  >
                    {BTN_CLEAR_ALL}
                  </button>
                </div>
              </div>
            </div>
            <ProductSort              
              routerSortOption={routerSortOption}
              products={products}
              action={handleSortBy}
            />
          </div>
           {appliedFilters?.length >0 && (
              <div className='grid flex-col grid-cols-1 px-4 py-2 border-t border-gray-100'>
                  <h4 className='flex w-full mb-2 text-sm font-bold'>Applied Filters</h4>
                  <div className='grid grid-cols-2'>
                    {appliedFilters.map((appliedFilter: any, idx: number) => {
                        return (
                            <div
                              key={`applied-filter-${idx}`}
                              className="flex-1 text-xs text-left text-gray-600 justify-left items-left"
                            >
                                {appliedFilter.name ? (
                                  <>
                                    <span className='font-medium'>{appliedFilter.name}: </span>
                                    <span className="ml-1">{appliedFilter.Value}</span>
                                  </>
                                ) : null}
                            </div>
                        )
                    })}
                  </div>
              </div>
            )}
          
        </section>
      </div>
    </div>
  )
}
