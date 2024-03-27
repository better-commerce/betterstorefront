import { useTranslation } from '@commerce/utils/use-translation'
import ProductSort from '@components/product/ProductSort'
import { XMarkIcon } from '@heroicons/react/24/outline'
interface Props {
  products: any
  handleSortBy: any
  routerFilters: any
  clearAll: any
  routerSortOption: any
  removeFilter: any
}

export default function FiltersRightOpen({ products = { filters: [] }, handleSortBy, routerFilters, clearAll, routerSortOption, removeFilter }: Props) {
  const translate =  useTranslation()
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
              {appliedFilters?.map((appliedFilter: any, idx: number) => (
                <div key={`applied-filter-top-bar-${idx}`} className="flex justify-center m-1 text-gray-600" >
                  {appliedFilter?.name && (
                    <span className="flex px-3 text-sm font-medium text-gray-600 border border-gray-200 bg-gray-50 rounded-2xl">
                      {appliedFilter?.Value}
                      <XMarkIcon onClick={ () => removeFilter(appliedFilter)} className='flex w-4 h-4 my-auto ml-1 cursor-pointer md:h-3 md:w-3 2xl:h-4 2xl:w-4'/>
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
      <ProductSort routerSortOption={routerSortOption} products={products} action={handleSortBy} />
    </section>
  )
}
