import { SearchBox, withSearch } from '@elastic/react-search-ui'
import '@elastic/react-search-ui-views/lib/styles/styles.css'

//
import { useUI } from '@components/ui'

const CustomView = (props: any) => {
  const { value, onChange, onSubmit, setSearchTerm } = props
  const { setShowSearchBar } = useUI()

  const handleSubmit = (e: any) => {
    onSubmit()
  }

  const handleChange = (e: any) => {
    setShowSearchBar(e.target?.value?.length >= 2)
    onChange(e.target.value)
  }

  const handleClearSearch = () => {
    onChange('')
    setSearchTerm('')
    setShowSearchBar(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="sui-search-box">
        <div className="sui-search-box__wrapper">
          <input
            type="text"
            value={value}
            onChange={handleChange}
            placeholder="Search for products"
            className="sui-search-box__text-input "
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
