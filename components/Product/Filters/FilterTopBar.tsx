import { useTranslation } from '@commerce/utils/use-translation'
import { XMarkIcon } from '@heroicons/react/24/outline'
import ProductSort from '../ProductSort'
interface Props {
  products: any
  handleSortBy: any
  routerFilters: any
  clearAll: any
  routerSortOption: any
  removeFilter: any
  featureToggle?: any
}

export default function FiltersRightOpen({ products = { filters: [] }, handleSortBy, routerFilters, clearAll, routerSortOption, removeFilter, featureToggle }: Props) {
  const translate = useTranslation()
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
    <section aria-labelledby="filter-heading" className="items-center justify-between flex-1 hidden w-full py-4 text-center sm:mb-0 sm:flex sm:pr-2 lg:pr-6 flex-end mob-filter" >
      {appliedFilters?.length > 0 ? (
        <div className="relative col-start-1 row-start-1 py-2 pl-4">
          <div className="flex px-0 mx-auto space-x-6 text-sm divide-x divide-gray-200 max-w-7xl sm:px-0 lg:px-0">
            <button onClick={clearAll} type="button" className="text-gray-500"> {translate('label.filters.clearAllText')} </button>
            <div className="flex flex-wrap">
              {appliedFilters?.map((appliedFilter: any, idx: number) => {
                let secondValue = appliedFilter?.Value;
                if (appliedFilter?.Value) {
                  const parts = appliedFilter.Value.split('|');
                  if (parts.length > 1) {
                    secondValue = parts[1];
                  }
                }
                return (
                  <div key={`applied-filter-top-bar-${idx}`} className="flex justify-center m-1 text-gray-600" >
                    {appliedFilter?.name && (
                      <span className="flex px-2 py-1 font-medium text-gray-600 border font-14 border-slate-300 bg-slate-50 rounded-2xl">
                        {secondValue}
                        <span onClick={() => removeFilter(appliedFilter)} className="relative flex items-center justify-center flex-shrink-0 w-4 h-4 ml-3 text-slate-700 bg-slate-300 rounded-full cursor-pointer top-0.5">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor" >
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </span>
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
      <ProductSort routerSortOption={routerSortOption} products={products} action={handleSortBy} featureToggle={featureToggle} />
    </section>
  )
}
