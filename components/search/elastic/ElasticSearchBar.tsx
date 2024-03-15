import { useEffect, useRef } from 'react'
import { SearchBox, withSearch } from '@elastic/react-search-ui'
import '@elastic/react-search-ui-views/lib/styles/styles.css'
import { useRouter } from 'next/router'
import { useUI } from '@components/ui'
import { useTranslation } from '@commerce/utils/use-translation'

const CustomView = (props: any) => {
  const translate = useTranslation()
  const { value, onChange, setSearchTerm } = props
  const router = useRouter()
  const inputRef = useRef<any>(null)
  const { setShowSearchBar } = useUI()

  useEffect(() => {
    // Listener for snippet injector reset.
    router.events.on('routeChangeStart', () => {
      handleClearSearch()
    })

    // Dispose listener.
    return () => {
      router.events.off('routeChangeStart', () => {})
    }
  }, [router.events])

  const handleSubmit = (e: any) => {
    e.preventDefault()
    router.push({
      pathname: '/search',
      query: {
        freeText: value,
      },
    })
  }

  const handleChange = (e: any) => {
    setShowSearchBar(e.target?.value?.length >= 2)
    onChange(e.target.value)
  }

  const handleClearSearch = () => {
    onChange('')
    setSearchTerm('')
    setShowSearchBar(false)
    inputRef.current?.blur()
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="sui-search-box">
        <div className="sui-search-box__wrapper">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={handleChange}
            placeholder={translate('label.search.searchForProductsText')}
            className="sui-search-box__text-input dark:bg-white"
          />
        </div>
        {/* <input
          type="submit"
          value="Search"
          className="button sui-search-box__submit"
        /> */}
        {value && (
          <input
            type="button"
            value="X"
            className="button sui-search-box__submit"
            onClick={handleClearSearch}
          />
        )}
      </div>
    </form>
  )
}

function ElasticSearchBar() {
  return (
    <SearchBox
      autocompleteSuggestions={true}
      debounceLength={300}
      searchAsYouType={true}
      view={CustomView}
    />
  )
}

export default withSearch((state) => state)(ElasticSearchBar)
