import { useEffect, useState } from 'react'
import { ACTION_TYPES } from 'pages/search'
import { useTranslation } from '@commerce/utils/use-translation'
import { getCurrencySymbol } from '@framework/utils/app-util'
import { CURRENT_THEME } from '@components/utils/constants'

const FILTER_KEYS = {
  BRAND: 'brandNoAnlz',
  CATEGORY: 'classification.category',
  PRICE: 'price.raw.withTax',
  RATING: 'rating',
  CLOTHING_TYPE: 'attributes.value~clothing.type',
  COLOR: 'attributes.value~global.colour',
  DRESS_STYLE: 'attributes.value~dress.style',
  GENDER: 'attributes.value~global.gender',
  OCCASION: 'attributes.value~occasion.type',
  SIZE: 'attributes.value~clothing.size',
}

const FilterItem = ({ option, optionIdx, sectionKey, isChecked = false, isCheckboxTickDisabled = false, bgColor = () => false, onSelect, closeSidebar = () => { }, ...props }: any) => {
  const [isCheckboxChecked, setCheckbox] = useState(isChecked)
  const currencySymbol = getCurrencySymbol()

  useEffect(() => {
    setCheckbox(isChecked)
  }, [isChecked])

  const handleCheckbox = () => {
    setCheckbox(!isCheckboxChecked)
    let obj = { Key: sectionKey, Value: option.name, IsSelected: true, }
    let type = !isCheckboxChecked ? ACTION_TYPES.ADD_FILTERS : ACTION_TYPES.REMOVE_FILTERS
    onSelect(obj, type)
    closeSidebar()
  }

  const generateOptionName = () => {
    if (sectionKey === FILTER_KEYS.PRICE)
      return <>
        <span className='text-sm font-semibold text-black'>{currencySymbol != undefined ? currencySymbol : ''}{option?.from}</span>
        -<span className='text-sm font-semibold text-black'>{currencySymbol != undefined ? option?.to != null ? currencySymbol : '' : ''}
          {option?.to != null ? option?.to : 'Max'}
        </span>
      </>
    if (sectionKey === FILTER_KEYS.COLOR) return option.name.split('|')[1]?.toLowerCase()
    if (sectionKey === FILTER_KEYS.RATING) {
      // Check if the option name contains a decimal point
      if (option.name.includes('.')) {
        const ratingValue = parseFloat(option.name); // Parse string to float
        const formattedRating = ratingValue.toFixed(2); // Format to always display 2 digits after the decimal point
        return formattedRating.toString(); // Convert it back to string and return
      } else {
        return option.name;
      }
    }

    else return option.name
  }

  let bw = '20px'
  let mr = '6px'
  let bg_Color = '#ffffff'
  let border_Color = '#cccccc'
  if (sectionKey === FILTER_KEYS.COLOR && CURRENT_THEME == 'green') {
    bw = '40px'
    mr = '0px'
  }
  if (sectionKey != FILTER_KEYS.COLOR && CURRENT_THEME == 'green') {
    bw = '20px'
    mr = '6px'
    bg_Color = "#EEEEEE"
    border_Color = '#EEEEEE'
  }

  const checkboxBgColor = bgColor(option) || 'transparent'
  return (
    <div key={`option-right-value-${option.value}-${optionIdx}`} className={`flex items-center pt-4 ${sectionKey === FILTER_KEYS.COLOR && CURRENT_THEME == 'green' ? 'flex-col' : sectionKey != FILTER_KEYS.COLOR && CURRENT_THEME == 'green' ? 'justify-between' : ''}`} >
      <label htmlFor={`${optionIdx}-input[]`} onClick={handleCheckbox} className={`relative ml-0 text-sm text-gray-500 cursor-pointer filter-label dark:text-white ${sectionKey === FILTER_KEYS.COLOR && CURRENT_THEME == 'green' ? 'flex flex-col-reverse gap-1 justify-center items-center align-middle' : ''}`} >
        <span>
          <input name={`${optionIdx}-input[]`} defaultValue={option.value} type="checkbox" className="w-4 h-4 border-gray-300 rounded filter-input" />
        </span>
        {isCheckboxChecked && !isCheckboxTickDisabled && (
          <div
            style={{
              content: '',
              float: 'left',
              left: '6px',
              top: '0px',
              zIndex: 99999,
              position: 'absolute',
              width: '10px',
              height: '14px',
              border: 'solid #000',
              borderWidth: '0 2px 2px 0',
              transform: 'rotate(45deg)',
            }}
          />
        )}
        <span className={`long-f-name capitalize text-black dark:text-black ${sectionKey === FILTER_KEYS.COLOR && CURRENT_THEME == 'green' ? 'text-xs font-medium' : ''}`}>{generateOptionName()}</span>
        {sectionKey === FILTER_KEYS.COLOR && (
          <div
            style={{
              content: '',
              top: '2px',
              float: 'left',
              height: bw,
              width: bw,
              borderRadius: bw,
              background: checkboxBgColor,
              border: '1px solid #cccccc',
              position: 'relative',
              marginRight: mr,
            }}
          />
        )}
        {sectionKey != FILTER_KEYS.COLOR && (
          <div
            style={{
              content: '',
              top: '0px',
              float: 'left',
              height: bw,
              width: bw,
              borderRadius: '6px',
              background: bg_Color,
              border: `1px solid ${border_Color}`,
              position: 'relative',
              marginRight: '6px',
            }}
          />
        )}
      </label>
      {sectionKey != FILTER_KEYS.COLOR && CURRENT_THEME != 'green' &&
        <span className="px-1 text-xs font-semibold text-black dark:text-white">
          ({option.count})
        </span>
      }
      {sectionKey != FILTER_KEYS.COLOR && CURRENT_THEME === 'green' &&
        <span className="justify-end float-right pl-1 pr-2 text-sm font-semibold text-right text-slate-400 dark:text-slate-400">
          {option.count}
        </span>
      }
    </div>
  )
}

const SearchInput = ({ placeholder, handleSearch }: any) => {
  const translate = useTranslation()
  return (
    <>
      <label className="sr-only">{translate('label.search.searchText')}</label>
      <input type="text" onChange={(e) => handleSearch(e.target.value)} autoComplete={translate('label.search.searchText')} placeholder={translate('label.search.searchText')} className="w-full min-w-0 px-4 py-1 text-gray-900 placeholder-gray-500 bg-white border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
    </>
  )
}

const getCustomComponent = (type: string) => {
  switch (type) {
    case FILTER_KEYS.BRAND:
      return (props: any) => <SearchInput {...props} />
    case FILTER_KEYS.CATEGORY:
      return (props: any) => <SearchInput {...props} />
    case FILTER_KEYS.SIZE:
      return (props: any) => <SearchInput {...props} />
    case FILTER_KEYS.OCCASION:
      return (props: any) => <SearchInput {...props} />
    default:
      return () => null
  }
}

export default function FilterList({
  items = [],
  sectionKey,
  handleFilters,
  routerFilters,
  closeSidebar,
}: any) {
  const [filterItems, setFilterItems] = useState(items)

  useEffect(() => { setFilterItems(items) }, [items?.length])

  const handleSearch = (value: string) => {
    const itemsClone = [...items]
    const filteredItems = itemsClone.filter((item: any) =>
      item.name?.toLowerCase().includes(value?.toLowerCase())
    )
    setFilterItems(filteredItems)
  }

  const PROPS_LIST = {
    [FILTER_KEYS.BRAND]: {
      handleSearch: (value: string) => handleSearch(value),
    },
    [FILTER_KEYS.CATEGORY]: {
      handleSearch: (value: string) => handleSearch(value),
    },
    [FILTER_KEYS.SIZE]: {
      handleSearch: (value: string) => handleSearch(value),
    },
    [FILTER_KEYS.OCCASION]: {
      handleSearch: (value: string) => handleSearch(value),
    },
    [FILTER_KEYS.COLOR]: {
      isCheckboxTickDisabled: true,
      bgColor: (item: any) => item.name.split('|')[0],
    },
  }

  const isDefaultChecked = (sectionKey: string, value: string) => {
    return !!routerFilters.find(
      (filter: any) => filter.Key === sectionKey && filter.Value === value
    )
  }

  return (
    <>
      {getCustomComponent(sectionKey)({ ...PROPS_LIST[sectionKey] })}
      <div className={`pb-5 mt-1 max-panel ${sectionKey === FILTER_KEYS.COLOR && CURRENT_THEME == 'green' ? 'grid grid-cols-4' : ''}`}>
        {filterItems.map((option: any, optionIdx: number) => {
          const isChecked = isDefaultChecked(sectionKey, option.name)
          return (
            <FilterItem
              sectionKey={sectionKey}
              option={option}
              onSelect={handleFilters}
              optionIdx={optionIdx}
              key={optionIdx}
              isChecked={isChecked}
              closeSidebar={closeSidebar}
              {...PROPS_LIST[sectionKey]}
            />
          )
        })}
      </div>
    </>
  )
}
