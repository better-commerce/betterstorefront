import React from 'react'

import AppSearchAPIConnector from '@elastic/search-ui-app-search-connector'

import {
  ErrorBoundary,
  Facet,
  Results,
  PagingInfo,
  ResultsPerPage,
  Paging,
  Sorting,
  withSearch,
} from '@elastic/react-search-ui'
import { Layout } from '@elastic/react-search-ui-views'
import '@elastic/react-search-ui-views/lib/styles/styles.css'
import Image from 'next/image'
import { XMarkIcon } from '@heroicons/react/24/outline'

import {
  buildAutocompleteQueryConfig,
  buildFacetConfigFromConfig,
  buildSearchOptionsFromConfig,
  buildSortOptionsFromConfig,
  getConfig,
  getFacetFields,
} from '@components/config/config-helper'
import { vatIncluded } from '@framework/utils/app-util'
import ElasticSearchSuggestions from './ElasticSearchSuggestions'

const { hostIdentifier, searchKey, endpointBase, engineName } = getConfig()
const connector = new AppSearchAPIConnector({
  searchKey,
  engineName,
  hostIdentifier,
  endpointBase,
})
const config = {
  searchQuery: {
    facets: buildFacetConfigFromConfig(),
    ...buildSearchOptionsFromConfig(),
  },
  autocompleteQuery: buildAutocompleteQueryConfig(),
  apiConnector: connector,
  alwaysSearchOnInitialLoad: true,
}
const isIncludeVAT = vatIncluded()
const CustomResultsView = ({ children }: any) => {
  return (
    <div className="relative ">
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-5">{children}</ul>
    </div>
  )
}

const CustomResultView = ({ result }: any) => {
  return (
    <li className="mb-4 bg-white snap-start hover:text-blue-600 group">
      <a href="">
        <div className="p-2 mb-4 border border-gray-200 group-hover:border-gray-700">
          <Image
            src={result?.imageurl?.raw}
            alt={''}
            className="object-contain w-48 h-48"
            width={300}
            height={400}
          />
        </div>
        <h3 className="text-sm font-semibold text-black capitalize">
          {result?.brand?.raw}
        </h3>

        <h4 className="text-xs font-medium text-black capitalize h-14">
          {result?.title?.raw}
        </h4>
        <h5 className="mt-2 text-sm font-semibold text-black capitalize">
          {result?.currency_uk?.raw}
          {isIncludeVAT ? result?.price_uk?.raw : result?.priceex_uk?.raw}
          <span className="pl-2 text-xs font-normal text-gray-400 line-through">
            {result?.currency_uk?.raw}
            {isIncludeVAT ? result?.rrp_uk?.raw : result?.rrp_uk?.raw}
          </span>
        </h5>
      </a>
    </li>
  )
}

function ElasticSearchResult({
  closeWrapper,
  wasSearched,
  setSearchTerm,
  clearFilters,
}: any) {
  return (
    <div className="absolute z-10 w-full h-auto border-b border-gray-300 shadow min-h-screen bg-white top-[88px]">
      <div className="absolute text-gray-900 cursor-pointer h-7 w-7 right-10 top-7">
        <XMarkIcon
          onClick={() => {
            closeWrapper()
            setSearchTerm('')
            clearFilters()
          }}
        />
      </div>
      <div className="flex flex-col items-center justify-center w-full px-0 pb-5 mt-5 sm:px-0">
        <div className="App">
          <ErrorBoundary>
            <Layout
              sideContent={
                <div>
                  <ElasticSearchSuggestions />
                  {wasSearched && (
                    <Sorting
                      label={'Sort by'}
                      sortOptions={buildSortOptionsFromConfig()}
                    />
                  )}
                  {getFacetFields().map((field: any) => (
                    <>
                      <Facet key={field} field={field} label={field} />
                    </>
                  ))}
                </div>
              }
              bodyContent={
                <>
                  {wasSearched && (
                    <Results
                      titleField={getConfig().titleField}
                      urlField={getConfig().urlField}
                      thumbnailField={getConfig().titleField}
                      shouldTrackClickThrough={true}
                      view={CustomResultsView}
                      resultView={CustomResultView}
                    />
                  )}
                </>
              }
              bodyHeader={
                <React.Fragment>
                  {wasSearched && <PagingInfo />}
                  {wasSearched && <ResultsPerPage />}
                </React.Fragment>
              }
              bodyFooter={<Paging />}
            />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  )
}

export default withSearch(({ wasSearched, setSearchTerm, clearFilters }) => ({
  wasSearched,
  setSearchTerm,
  clearFilters,
}))(ElasticSearchResult)