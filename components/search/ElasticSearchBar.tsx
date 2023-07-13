import React from 'react'
import { SearchBox, withSearch } from '@elastic/react-search-ui'
import '@elastic/react-search-ui-views/lib/styles/styles.css'

function ElasticSearchBar() {
  return (
    <SearchBox
      searchAsYouType={true}
      autocompleteSuggestions={true}
      debounceLength={300}
      onSubmit={(searchTerm) => {
        window.location.href = `?q=${searchTerm}`
      }}
    />
  )
}

export default withSearch((state) => state)(ElasticSearchBar)
