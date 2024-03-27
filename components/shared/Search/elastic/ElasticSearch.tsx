import React from 'react'

import AppSearchAPIConnector from '@elastic/search-ui-app-search-connector'

import {
  ErrorBoundary,
  Facet,
  SearchProvider,
  SearchBox,
  Results,
  PagingInfo,
  ResultsPerPage,
  Paging,
  Sorting,
  WithSearch,
  //Autocomplete,
} from '@elastic/react-search-ui'
import { Layout } from '@elastic/react-search-ui-views'
import '@elastic/react-search-ui-views/lib/styles/styles.css'
import Image from 'next/image'

import {
  buildAutocompleteQueryConfig,
  buildFacetConfigFromConfig,
  buildSearchOptionsFromConfig,
  buildSortOptionsFromConfig,
  getConfig,
  getFacetFields,
} from '@components/config/config-helper'
import {
  getElasticSearchPriceColumn,
  vatIncluded,
} from '@framework/utils/app-util'
import { generateUri } from '@commerce/utils/uri-util'
import { IMG_PLACEHOLDER } from '@components/utils/textVariables'

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
          <img
            src={
              generateUri(result?.imageurl?.raw, 'h=400&fm=webp') ||
              IMG_PLACEHOLDER
            }
            alt={'search'}
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
          {result?.[getElasticSearchPriceColumn(isIncludeVAT)]?.raw}
          <span className="pl-2 text-xs font-normal text-gray-400 line-through">
            {result?.currency_uk?.raw}
            {isIncludeVAT ? result?.rrp_uk?.raw : result?.rrp_uk?.raw}
          </span>
        </h5>
      </a>
    </li>
  )
}

export default function ElasticSearch() {
  return (
    <SearchProvider config={config}>
      <WithSearch mapContextToProps={({ wasSearched }) => ({ wasSearched })}>
        {({ wasSearched }) => {
          return (
            <div className="App">
              <ErrorBoundary>
                <Layout
                  header={
                    <SearchBox
                      autocompleteSuggestions={true}
                      autocompleteResults={{
                        linkTarget: '_blank',
                        sectionTitle: 'Results',
                        titleField: 'title',
                        urlField: 'nps_link',
                        shouldTrackClickThrough: true,
                        clickThroughTags: ['test'],
                      }}
                    />
                  }
                  sideContent={
                    <div>
                      {wasSearched && (
                        <Sorting
                          label={'Sort by'}
                          sortOptions={buildSortOptionsFromConfig()}
                        />
                      )}
                      {getFacetFields().map((field: any) => (
                        <>
                          <Facet
                            key={field}
                            field={field}
                            label={field}
                            // autocompleteSuggestions={true}
                          />
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
          )
        }}
      </WithSearch>
    </SearchProvider>
  )
}
