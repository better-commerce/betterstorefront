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
import { NoSymbolIcon, XMarkIcon } from '@heroicons/react/24/outline'

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
import { CloudIcon } from '@heroicons/react/20/solid'
import Link from 'next/link'

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
      {children.length > 0 ? (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-5">{children}</ul>
      ) : (
        <div className="flex items-center justify-center w-full py-6 mt-3 text-lg font-medium text-center text-black bg-gray-100">
          <div className="flex items-center gap-2">
            <NoSymbolIcon className="mx-auto text-gray-200 w-7 h-7" /> No
            Product Found
          </div>
        </div>
      )}
    </div>
  )
}

const CustomResultView = ({ result }: any) => {
  return (
    <li className="mb-4 bg-white snap-start hover:text-blue-600 group">
      <Link href={`/${result?.weburl?.raw}` || '#'} passHref legacyBehavior>
        <a>
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
      </Link>
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
    <div className="absolute z-10 w-full h-auto border-b border-gray-300 shadow min-h-screen bg-white sm:top-[64px] top-[64px]">
      <div className="absolute text-gray-900 cursor-pointer top-1 h-7 w-7 sm:right-10 sm:top-7 right-4">
        <XMarkIcon
          onClick={() => {
            closeWrapper()
            setSearchTerm('')
            clearFilters()
          }}
        />
      </div>
      <div className="flex flex-col items-center justify-center w-full px-0 pb-5 mt-0 sm:mt-5 sm:px-0">
        <div className="App">
          <ErrorBoundary>
            <Layout
              sideContent={
                <div>
                  <div className="flex-col hidden sm:flex">
                    <ElasticSearchSuggestions />
                  </div>
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
