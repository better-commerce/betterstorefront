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
      <div className="ml-auto relative max-w-xs w-full h-full bg-white shadow-xl py-4 pb-6 flex flex-col overflow-y-auto">
              <div className="px-4 flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">{GENERAL_FILTER_TITLE}</h2>               
              </div>

              {/* Filters */}
              <form className="mt-4">
                {products.filters?.map((section: any) => (
                  <div
                    key={section.name}
                    className="border-t border-gray-200 px-4 py-6"
                  >
                   
                      <>
                        <h3 className="-mx-2 -my-3">
                          <div className="px-2 py-3 bg-white w-full flex items-center justify-between text-sm text-gray-400">
                            <span className="font-medium text-gray-900">
                              {section.name}
                            </span>
                           
                          </div>
                        </h3>
                        <div className="pt-3">
                          <div className="space-y-3">
                            <FilterList
                              handleFilters={handleFilters}
                              sectionKey={section.key}
                              items={section.items}
                              routerFilters={routerFilters}                              
                            />
                          </div>
                        </div>
                      </>
                   
                  </div>
                ))}
              </form>
            </div>

      
    </div>
  )
}
