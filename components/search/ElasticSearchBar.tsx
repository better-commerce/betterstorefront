import React from 'react'
import { SearchBox, withSearch } from '@elastic/react-search-ui'
import '@elastic/react-search-ui-views/lib/styles/styles.css'

function ElasticSearchBar() {
  return (
    <SearchBox
      autocompleteSuggestions={true}
      onSubmit={(searchTerm) => {
        window.location.href = `?q=${searchTerm}`
      }}
    />
  )
}

export default withSearch((state) => state)(ElasticSearchBar)
