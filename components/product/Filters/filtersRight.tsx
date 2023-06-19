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
      {products.filters?.map((section: any, sectionId: number) => (
        <>
          <h2
            key={`applied-filter-${sectionId}`}
            className="flex items-center justify-between w-full px-2 py-2 my-1 -mx-2 font-bold text-black uppercase bg-white font-16"
          >
            {section?.name}
          </h2>
          <FilterList
            handleFilters={handleFilters}
            sectionKey={section?.key}
            items={section?.items}
            routerFilters={routerFilters}
          />
        </>
      ))}
    </div>
  )
}
