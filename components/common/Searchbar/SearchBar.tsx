import { FC, memo } from 'react'
import { useRouter } from 'next/router'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { BTN_SEARCH } from '@components/utils/textVariables'
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

const SearchBar: FC<React.PropsWithChildren<ISearchBarProps>> = ({
  id = 'search',
  onClick,
  keywords,
  maxBasketItemsCount,
  deviceInfo,
}) => {
  const { showSearchBar, setShowSearchBar } = useUI()

  const defaultSearch = (
    <>
      <div className="flex flex-row w-full rounded-sm sm:w-80 md:w-64 xl:w-96 mobile-search-icon">
        <button onClick={onClick} className="relative w-full px-2 pr-3 text-gray-400 bg-gray-100 border border-gray-400 rounded-md sm:px-4 sm:p-2 sm:pl-3 sm:pr-16 hover:text-gray-500 search-mob-btn" aria-label="Search" >
          <span className="sr-only" aria-label="Search">
            {BTN_SEARCH}
          </span>
          <span className="hidden w-full pr-2 text-sm font-normal text-left text-black sm:inline-block">
            Search
          </span>
          <MagnifyingGlassIcon className="w-4 h-6 text-black sm:w-4 sm:h-4 sm:absolute right-4 sm:top-3 sm:right-4 sm:text-gray-400" aria-hidden="true" aria-label="Search" />
        </button>
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
