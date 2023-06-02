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
    <div className="relative flex-col hidden w-full h-full max-w-xs pr-4 ml-auto overflow-y-auto bg-white sm:col-span-2 sm:flex">
      {products.filters?.map((section: any, sectionId:number) => (
        <>
          <div key={`applied-filter-${sectionId}`} className="flex items-center justify-between w-full px-2 py-2 my-1 -mx-2 font-bold text-black uppercase bg-white text-md">{section?.name}</div>
          <FilterList handleFilters={handleFilters} sectionKey={section?.key} items={section?.items} routerFilters={routerFilters} />
        </>
      ))}
    </div>
  )
}
