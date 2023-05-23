import ProductSort from '@components/product/ProductSort'
import { BTN_CLEAR_ALL, GENERAL_FILTER_TITLE, PRODUCT_FILTER } from '@components/utils/textVariables'

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
  routerFilters: any
  clearAll: any
  routerSortOption: any
}

export default function FiltersRightOpen({
  products = { filters: [] },
  handleSortBy,
  routerFilters,
  clearAll,
  routerSortOption,
}: Props) {
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
    <section aria-labelledby="filter-heading" className="flex-1 hidden max-w-3xl py-1 text-center border-b border-gray-200 sm:block sm:pl-2 lg:max-w-7xl lg:pl-4">
      <div className="flex items-center justify-between">
        <span id="filter-heading-product" className="sr-only">{GENERAL_FILTER_TITLE}</span>
        <div className="relative col-start-1 row-start-1 py-2">
          <div className="flex px-0 mx-auto space-x-6 text-sm divide-x divide-gray-200 max-w-7xl sm:px-0 lg:px-0">
            <div className="pl-0">
              <button onClick={clearAll} type="button" className="text-gray-500">{BTN_CLEAR_ALL}</button>
            </div>
            <div className="grid grid-cols-5 pl-2">
              {appliedFilters?.map((appliedFilter: any, idx: number) => (
                <div key={`applied-filter-${idx}`} className="flex justify-center text-gray-600">
                  {appliedFilter.name ? (
                    <span className="px-3 text-sm font-medium text-gray-600 border border-gray-200 bg-gray-50 rounded-2xl">{appliedFilter.Value}</span>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
        <ProductSort routerSortOption={routerSortOption} products={products} action={handleSortBy} />
      </div>
    </section>
  )
}
