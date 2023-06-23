import classNames from '@components/utils/classNames'
import { useRouter } from 'next/router'
import Link from 'next/link'

const MAX_CHARS = 19

export default function PLPSort({
  sortList,
  action,
  routerSortOption,
  closeSidebar,
  hasFiltersLoaded,
}: any) {
  const router = useRouter()

  const currentOption = sortList?.filter(
    (item: any) => item.key === routerSortOption
  )[0]

  return (
    <>
      <div className="pb-3">
        <h6 className="font-medium">Sort By</h6>
      </div>
      <div className="flex flex-wrap w-full">
        {!!sortList?.length
          ? sortList.map((option: any) => {
              option.value = option.value.replace(':', '')
              option.trimmedValue =
                option.value?.length > MAX_CHARS
                  ? option.value.substring(0, MAX_CHARS) + '...'
                  : option.value
              if (currentOption?.key === option.key) {
                return (
                  <div
                    key={option.value}
                    className="flex items-center justify-center text-xs lg:text-sm md:text-sm mt-[1px] ml-[1px] outline outline-1 hover:z-10 hover:outline-gray-900 text-gray-900 capitalize text-center px-2 py-4 h-full w-full flex-[1_0_calc(50%-1px)] truncate outline-gray-900 z-10 cursor-default"
                    title={option.value}
                  >
                    {option.trimmedValue}
                  </div>
                )
              }
              return (
                // <Link
                //   key={option.value}
                //   href={{
                //     pathname: router.pathname,
                //     query: { ...router.query, sortBy: option.key },
                //   }}
                //   passHref
                //   onClick={() => {
                //     if (!hasFiltersLoaded) return
                //     if (action) action(option.key)
                //     closeSidebar()
                //   }}
                //   className={classNames(
                //     'flex items-center justify-center text-xs lg:text-sm md:text-sm mt-[1px] ml-[1px] outline outline-1 hover:z-10 hover:outline-gray-900 text-gray-900 capitalize text-center px-2 py-4 h-full w-full flex-[0_0_calc(50%-1px)] truncate outline-gray-200',
                //     !hasFiltersLoaded ? 'cursor-wait' : 'cursor-pointer'
                //   )}
                // title={option.value}
                // >
                <div
                  key={option.value}
                  onClick={() => {
                    if (!hasFiltersLoaded) return
                    if (action) action(option.key)
                    closeSidebar()
                  }}
                  className={classNames(
                    'flex items-center justify-center text-xs lg:text-sm md:text-sm mt-[1px] ml-[1px] outline outline-1 hover:z-10 hover:outline-gray-900 text-gray-900 capitalize text-center px-2 py-4 h-full w-full flex-[0_0_calc(50%-1px)] truncate outline-gray-200',
                    !hasFiltersLoaded ? 'cursor-wait' : 'cursor-pointer'
                  )}
                  title={option.value}
                >
                  {option.trimmedValue}
                </div>
                // </Link>
              )
            })
          : null}
      </div>
    </>
  )
}
