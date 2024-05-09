import { Disclosure } from '@headlessui/react'
import FilterList from './FilterList'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import PriceFilterSlider from '@components/Product/Filters/PriceFilterSlider'
import { CURRENT_THEME } from '@components/utils/constants'

interface Props {
  products: any
  handleFilters: any
  routerFilters: any
}

export default function FiltersRightOpen({ products = { filters: [] }, handleFilters, routerFilters }: Props) {
  return (
    <div key="new" className={`relative flex-col hidden w-full h-full max-w-xs pr-4 ml-auto overflow-y-auto bg-white dark:bg-transparent sm:flex sm:px-0 2xl:px-0 ${CURRENT_THEME == 'green' ? ' sm:col-span-2 filter-panel-3' : ' sm:col-span-3'}`}>
      {products.filters?.map((section: any, sectionIdx: number) => (
        <div key={`applied-filter-right-${sectionIdx}-${section?.key}`} className='border-b border-slate-300'>
          <Disclosure defaultOpen={sectionIdx === 0}>
            {({ open }) => (
              <>
                <Disclosure.Button className={`flex items-center justify-between w-full gap-2 px-0 py-3 text-left text-black bg-white rounded-lg outline-none dark:bg-transparent hover:bg-white dark:hover:bg-transparent active:outline-none hover:outline-none ${CURRENT_THEME == 'green' ? 'text-xl font-medium' : 'uppercase text-sm font-semibold'}`}>
                  <span className='dark:text-white'>{section?.name}</span>
                  <ChevronDownIcon className={`${open ? 'rotate-180 transform' : ''} w-5 h-5 dark:text-white`} />
                </Disclosure.Button>
                <Disclosure.Panel className="px-0 pt-0 pb-2">
                  {section?.key === "price.raw.withTax" ? <PriceFilterSlider handleFilters={handleFilters} sectionKey={section?.key} items={section?.items} routerFilters={routerFilters} /> :
                    <FilterList handleFilters={handleFilters} sectionKey={section?.key} items={section?.items} routerFilters={routerFilters} />}
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </div>
      ))}

    </div>
  )
}
