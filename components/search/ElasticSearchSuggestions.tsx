import { useEffect, useState } from 'react'
import { withSearch } from '@elastic/react-search-ui'
import cn from 'classnames'

function ElasticSearchSuggestions(props: any) {
  const { autocompletedSuggestions, searchTerm, setSearchTerm } = props
  const [suggestionList, setSuggestionList] = useState([])

  useEffect(() => {
    setSuggestionList(
      searchTerm ? autocompletedSuggestions?.documents || [] : []
    )
  }, [autocompletedSuggestions])

  const getHighlightedText = (text: any, highlight: any) => {
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'))
    return (
      <span>
        {parts.map((part: any, i: number) => (
          <span
            key={i}
            className={cn('', {
              'bg-yellow-200': part.toLowerCase() === highlight.toLowerCase(),
            })}
          >
            {part}
          </span>
        ))}
      </span>
    )
  }

  return (
    <fieldset className="sui-facet !mb-4">
      <legend className="sui-facet__title">
        Search Suggestions ({suggestionList?.length})
      </legend>
      {suggestionList &&
        suggestionList?.map((o: any, i: number) => (
          <div
            key={`suggession-${i}`}
            className="hover:underline cursor-pointer text-[15px] text-[#4f4f4f]"
            onClick={() => setSearchTerm(o.suggestion)}
          >
            {getHighlightedText(o.suggestion, searchTerm)}
          </div>
        ))}
    </fieldset>
  )
}

export default withSearch((state) => state)(ElasticSearchSuggestions)
