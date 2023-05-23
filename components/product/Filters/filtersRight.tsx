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
    <div className="relative flex-col hidden w-full h-full max-w-xs pr-4 ml-auto overflow-y-auto bg-white border-r sm:col-span-2 sm:flex">
      <h2 className="text-lg font-medium text-gray-900">{GENERAL_FILTER_TITLE}</h2>
      {products.filters?.map((section: any) => (
        <>
          <h3 key={section?.name} className="flex items-center justify-between w-full px-2 py-3 my-1 -mx-2 font-semibold text-gray-900 bg-white border-t border-gray-200 text-md">{section?.name}</h3>
          <FilterList handleFilters={handleFilters} sectionKey={section?.key} items={section?.items} routerFilters={routerFilters} />
        </>
      ))}
    </div>
  )
}
