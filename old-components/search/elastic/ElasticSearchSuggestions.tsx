import { useEffect, useState } from 'react'
import { withSearch } from '@elastic/react-search-ui'
import cn from 'classnames'
import { useTranslation } from '@commerce/utils/use-translation'

function ElasticSearchSuggestions(props: any) {
  const translate = useTranslation()
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
      <span className="flex-1">
        {parts.map((part: any, i: number) => (
          <span
            key={i}
            className={cn('', {
              'bg-white': part.toLowerCase() === highlight.toLowerCase(),
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
      {suggestionList?.length > 0 && (
        <legend className="mb-3 font-bold text-black uppercase font-18 sm:mb-4">
          {translate('label.search.topSuggestionsText')}
        </legend>
      )}
      <div className="flex flex-wrap justify-start gap-1">
        {suggestionList &&
          suggestionList?.slice(0, 4)?.map((o: any, i: number) => (
            <div
              key={`suggession-${i}`}
              className="hover:underline border border-black text-left items-start rounded text-sm font-semibold flex cursor-pointer mb-[6px] px-2 py-0.5 text-[14px] text-black"
              onClick={() => setSearchTerm(o.suggestion)}
            >
              {getHighlightedText(o.suggestion, searchTerm)}
            </div>
          ))}
      </div>
    </fieldset>
  )
}
export default withSearch((state) => state)(ElasticSearchSuggestions)
