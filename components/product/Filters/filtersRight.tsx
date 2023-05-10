import FilterList from './FilterList'
import { GENERAL_FILTER_TITLE } from '@components/utils/textVariables'

interface Props {
  products: any
  handleFilters: any
  routerFilters: any
}

export default function FiltersRightOpen({
  products = { filters: [] },
  handleFilters,
  routerFilters,
}: Props) {
  return (
    <div className="bg-transparent">
      {/* Mobile filter dialog */}
      <div className="relative flex flex-col w-full h-full max-w-xs ml-auto overflow-y-auto bg-white border-r">
        <div className="flex items-center justify-between px-0 pt-2">
          <h2 className="text-lg font-medium text-gray-900">
            {GENERAL_FILTER_TITLE}
          </h2>
        </div>

        {/* Filters */}
        <form className="mt-2">
          {products.filters?.map((section: any) => (
            <div
              key={section.name}
              className="px-4 py-6 border-t border-gray-200 sm:pr-4 sm:px-0"
            >
              <>
                <h3 className="-mx-2 -my-3">
                  <div className="flex items-center justify-between w-full px-2 py-1 font-medium text-gray-900 bg-white text-md">
                    {section.name}
                  </div>
                </h3>
                <div className="pt-3 space-y-3">
                  <FilterList
                    handleFilters={handleFilters}
                    sectionKey={section.key}
                    items={section.items}
                    routerFilters={routerFilters}
                  />
                </div>
              </>
            </div>
          ))}
        </form>
      </div>
    </div>
  )
}
