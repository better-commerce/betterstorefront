import { FC, memo } from 'react'
import { useRouter } from 'next/router'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'
//import ElasticSearchBar from '@components/search/ElasticSearchBar'
import { SEARCH_PROVIDER } from '@components/utils/constants'
import dynamic from 'next/dynamic'
import ElasticSearchBar from '@components/search/elastic/ElasticSearchBar'
import { SearchProvider } from '@elastic/react-search-ui'
import AppSearchAPIConnector from '@elastic/search-ui-app-search-connector'

import {
  buildAutocompleteQueryConfig,
  buildFacetConfigFromConfig,
  buildSearchOptionsFromConfig,
  getConfig,
} from '@components/config/config-helper'
import { useUI } from '@components/ui'
import { matchStrings } from '@framework/utils/parse-util'
import { SearchProvider as Provider } from '@framework/utils/enums'
import InstantSearchBar from '@components/search/algolia/InstantSearchBar'

const SearchWrapper = dynamic(() => import('@components/search'))
let connector: any
if (process.env.ELASTIC_ENGINE_NAME) {
  const { hostIdentifier, searchKey, endpointBase, engineName } = getConfig()
  connector = new AppSearchAPIConnector({
    searchKey,
    engineName,
    hostIdentifier,
    endpointBase,
  })
}
const elasticConfig = {
  searchQuery: {
    facets: buildFacetConfigFromConfig(),
    ...buildSearchOptionsFromConfig(),
  },
  autocompleteQuery: buildAutocompleteQueryConfig(),
  apiConnector: connector,
  alwaysSearchOnInitialLoad: true,
  trackUrlState: false,
}
interface ISearchBarProps {
  id?: string
  onClick: any
  keywords?: any
  maxBasketItemsCount?: any
  deviceInfo?: any
}

const SearchBar: FC<React.PropsWithChildren<ISearchBarProps>> = ({ id = 'search', onClick, keywords, maxBasketItemsCount, deviceInfo, }) => {
  const { showSearchBar, setShowSearchBar } = useUI()
  const defaultSearch = (
    <>
      <div className="relative items-center justify-center w-10 h-10 rounded-full top-2 lg:flex sm:w-12 sm:h-12 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none" onClick={onClick}>
        <svg width={22} height={22} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" >
          <path d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M22 22L20 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      {showSearchBar && (
        <SearchWrapper keywords={keywords} closeWrapper={() => setShowSearchBar(false)} />
      )}
    </>
  )
  const elasticSearch = (
    <SearchProvider config={elasticConfig}>
      <div className="flex flex-row w-full rounded-sm sm:w-80 md:w-64 xl:w-96">
        <div className="relative items-start w-full pr-3 text-left text-gray-400 sm:p-1 hover:text-gray-500" aria-label="Search" >
          <ElasticSearchBar />
        </div>
      </div>
      {showSearchBar && (
        <SearchWrapper keywords={keywords} closeWrapper={() => setShowSearchBar(false)} />
      )}
    </SearchProvider>
  )
  const instantSearch = (
    <div className="flex flex-row w-full rounded-sm sm:w-80 md:w-64 xl:w-96 instant-search-bar sm:pr-4 mobile-search-ui search-input-icon">
      <InstantSearchBar maxBasketItemsCount={maxBasketItemsCount} deviceInfo={deviceInfo} />
    </div>
  )

  return (
    <>
      {matchStrings(SEARCH_PROVIDER!, Provider.DEFAULT) && <>{defaultSearch}</>}

      {matchStrings(SEARCH_PROVIDER!, Provider.ELASTIC) && <>{elasticSearch}</>}

      {matchStrings(SEARCH_PROVIDER!, Provider.ALGOLIA) && <>{instantSearch}</>}
    </>
  )
}

export default memo(SearchBar)
