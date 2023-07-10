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
  Autocomplete,
} from '@elastic/react-search-ui'
import { Layout } from '@elastic/react-search-ui-views'
import '@elastic/react-search-ui-views/lib/styles/styles.css'

import {
  buildAutocompleteQueryConfig,
  buildFacetConfigFromConfig,
  buildSearchOptionsFromConfig,
  buildSortOptionsFromConfig,
  getConfig,
  getFacetFields,
} from '@components/config/config-helper'

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

const CustomResultsView = ({ children }) => {
  return (
    <div className="relative overflow-x-auto">
      <ul className="flex snap-x">{children}</ul>
    </div>
  )
}

const CustomResultView = ({ result }) => {
  return (
    <li
      className="px-3 py-3 snap-start hover:text-blue-600"
      style={{ width: '200px' }}
    >
      <a href={result.url.raw}>
        <img
          src={result.image.raw}
          alt={result.name.raw}
          className="object-contain w-48 h-48"
        />
        <h4 className="text-sm truncate">{result.name.raw}</h4>
      </a>
    </li>
  )
}

export default function App() {
  return (
    <SearchProvider config={config}>
      <WithSearch mapContextToProps={({ wasSearched }) => ({ wasSearched })}>
        {({ wasSearched }) => {
          return (
            <div className="App">
              <ErrorBoundary>
                <Layout
                  header={<SearchBox autocompleteSuggestions={true} />}
                  sideContent={
                    <div>
                      {wasSearched && (
                        <Sorting
                          label={'Sort by'}
                          sortOptions={buildSortOptionsFromConfig()}
                        />
                      )}
                      {getFacetFields().map((field) => (
                        <>
                          <Facet
                            key={field}
                            field={field}
                            label={field}
                            autocompleteSuggestions={true}
                          />
                        </>
                      ))}
                    </div>
                  }
                  bodyContent={
                    <>
                      <Results
                        view={CustomResultsView}
                        resultView={CustomResultView}
                      />
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
