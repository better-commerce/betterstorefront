import { Fragment, useState } from 'react'
import { Dialog, Disclosure, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/solid'
import classNames from '@components/utils/classNames'
import ProductSort from '@components/product/ProductSort'
import FilterList from './FilterList'
import { BTN_CLEAR_ALL, GENERAL_CLOSE, GENERAL_FILTER_TITLE } from '@components/utils/textVariables'

interface Props {
  products: any
  handleSortBy: any
  handleFilters: any
  routerFilters: any
  clearAll: any
  routerSortOption: any
  removeFilter: any
}

export default function Filters({
  products = { filters: [] },
  handleFilters,
  handleSortBy,
  routerFilters,
  clearAll,
  routerSortOption,
  removeFilter,
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
    <>
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
              <div className="flex items-center justify-between px-4 py-4">
                <h2 className="text-lg font-medium text-gray-900">
                  {GENERAL_FILTER_TITLE}
                </h2>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center w-10 h-6 p-2 -mr-2 text-gray-400 bg-white rounded-md sm:h-10 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <span className="sr-only">{GENERAL_CLOSE}</span>
                  <XMarkIcon className="w-6 h-6" aria-hidden="true" />
                </button>
              </div>

              {products.filters?.map((section: any) => (
                <Disclosure
                  as="div"
                  key={section.name}
                  className="p-0 border-t border-white border-y-2 bg-gray-100"
                >
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="flex items-center justify-between w-full px-4 py-3">
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
                      <Disclosure.Panel className="pt-4 space-y-3 px-4 bg-white">
                        <FilterList
                          handleFilters={handleFilters}
                          sectionKey={section.key}
                          items={section.items}
                          routerFilters={routerFilters}
                          closeSidebar={() => setOpen(false)}
                        />
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              ))}
            </div>
          </Transition.Child>
        </Dialog>
      </Transition.Root>

      <section
        aria-labelledby="filter-heading-filter"
        className="flex items-center justify-between px-0 py-0 text-center w-screen mob-w-screen border-t border-gray-200 sm:px-4 lg:max-w-7xl lg:px-8"
      >
        <h2 id="filter-heading-filter" className="sr-only">
          {GENERAL_FILTER_TITLE}
        </h2>
        <div className="relative col-start-1 row-start-1 py-3">
          <div className="flex px-2 pr-2 mx-auto space-x-6 text-sm divide-x divide-gray-200 max-w-7xl sm:px-6 lg:px-8">
            <button
              onClick={() => setOpen(true)}
              title="Product Filter"
              className="flex items-center font-medium text-gray-700 group px-4 py-2 bg-gray-200"
            >
              <AdjustmentsHorizontalIcon className='w-5 h-5 text-black' />
              {/* {appliedFilters?.length > 0 && routerFilters.length} */}
            </button>
          </div>
        </div>
        <ProductSort
          routerSortOption={routerSortOption}
          products={products}
          action={handleSortBy}
        />
      </section>
      {appliedFilters?.length > 0 && (
        <>
          <div className='flex justify-between px-4 items-center'>
            <h4 className="flex mb-2 text-sm font-bold">
              Applied Filters
            </h4>
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
          <div className="flex flex-wrap px-4 py-2 border-t border-gray-100 my-2">
            <div className="flex flex-wrap">
              {appliedFilters?.map((appliedFilter: any, idx: number) => (
                <div
                  key={`applied-filter-${idx}`}
                  className="flex py-1 px-2 m-1 w-auto text-sm font-medium text-gray-600 border border-gray-400 bg-gray-50 rounded-2xl"
                >
                  {appliedFilter?.name && (
                    <div className="flex">
                      <span className="font-medium">
                        {appliedFilter?.name}:{' '}
                      </span>
                      <span>{appliedFilter?.Value}</span>
                      <XMarkIcon onClick={ () => removeFilter(appliedFilter)} className='flex w-4 h-4 my-auto ml-1 cursor-pointer md:h-3 md:w-3 2xl:h-4 2xl:w-4'/>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  )
}
