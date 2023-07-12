import { FC, memo, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Transition } from '@headlessui/react'
import { BTN_SEARCH } from '@components/utils/textVariables'
import ElasticSearch from '@components/search/Elastic'
//import ElasticSearchBar from '@components/search/ElasticSearchBar'
import { ENABLE_ELASTIC_SEARCH } from '@components/utils/constants'
import dynamic from 'next/dynamic'
import ElasticSearchBar from '@components/search/ElasticSearchBar'
const SearchWrapper = dynamic(() => import('@components/search'))

interface ISearchBarProps {
  id?: string
  onClick: any
}

const SearchBar: FC<React.PropsWithChildren<ISearchBarProps>> = ({
  id = 'search',
  onClick,
}) => {
  return (
    <>
      {ENABLE_ELASTIC_SEARCH ? (
        <>
          {/*<SearchWrapper
            keywords={""}
            closeWrapper={() => { }}
          />*/}
          {/* <div className="flex flex-row rounded-sm sm:mr-8 sm:pr-2 sm:bg-gray-100 sm:border">
            <button
              onClick={onClick}
              className="relative pr-3 text-gray-400 sm:p-1 sm:pl-3 sm:pr-16 hover:text-gray-500"
              aria-label="Search"
            >
              <span className="sr-only" aria-label="Search">
                {BTN_SEARCH}
              </span>
              <span className="hidden pr-2 text-sm font-normal text-black sm:inline-block sm:pr-32">
                Search
              </span>
              <MagnifyingGlassIcon
                className="w-6 h-6 text-black sm:w-4 sm:h-4 sm:absolute sm:top-2 sm:right-0 sm:text-gray-400"
                aria-hidden="true"
                aria-label="Search"
              />
            </button>
          </div> */}
          <div className="flex flex-row rounded-sm w-96">
            <button
              onClick={onClick}
              className="relative items-start w-full pr-3 text-left text-gray-400 sm:p-1 hover:text-gray-500"
              aria-label="Search"
            >
              <ElasticSearchBar />
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-row rounded-sm sm:mr-8 sm:pr-2 sm:bg-gray-100 sm:border">
            <button
              onClick={onClick}
              className="relative pr-3 text-gray-400 sm:p-1 sm:pl-3 sm:pr-16 hover:text-gray-500"
              aria-label="Search"
            >
              <span className="sr-only" aria-label="Search">
                {BTN_SEARCH}
              </span>
              <span className="hidden pr-2 text-sm font-normal text-black sm:inline-block sm:pr-32">
                Search
              </span>
              <MagnifyingGlassIcon
                className="w-6 h-6 text-black sm:w-4 sm:h-4 sm:absolute sm:top-2 sm:right-0 sm:text-gray-400"
                aria-hidden="true"
                aria-label="Search"
              />
            </button>
          </div>
        </>
      )}
    </>
  )
}

export default memo(SearchBar)
