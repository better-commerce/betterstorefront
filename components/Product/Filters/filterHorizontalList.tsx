import { useEffect, useState } from 'react'
import { ACTION_TYPES } from 'pages/search'
import { BTN_SEARCH } from '@components/utils/textVariables'

const FILTER_KEYS = {
  BRAND: 'brandNoAnlz',
  CATEGORY: 'classification.category',
  PRICE: 'price.raw.withTax',
  RATING: 'rating',
  CLOTHING_TYPE: 'attributes.value~clothing.type',
  COLOR: '_global.colour',
  DRESS_STYLE: 'attributes.value~dress.style',
  GENDER: 'attributes.value~global.gender',
  OCCASION: 'attributes.value~occasion.type',
  SIZE: 'attributes.value~clothing.size',
}

const FilterItem = ({
  option,
  optionIdx,
  sectionName,
  sectionKey,
  isChecked = false,
  isCheckboxTickDisabled = false,
  bgColor = () => false,
  onSelect,
  closeSidebar = () => {},
  ...props
}: any) => {
  const [isCheckboxChecked, setCheckbox] = useState(isChecked)

  useEffect(() => {
    setCheckbox(isChecked)
  }, [isChecked])

  const handleCheckbox = () => {
    setCheckbox(!isCheckboxChecked)
    let obj = {
      Name: sectionName,
      Key: sectionKey,
      Value: option?.name,
      IsSelected: true,
    }
    let type = !isCheckboxChecked
      ? ACTION_TYPES.ADD_FILTERS
      : ACTION_TYPES.REMOVE_FILTERS
    onSelect(obj, type)
    closeSidebar()
  }

  const generateOptionName = () => {
    if (sectionKey === FILTER_KEYS.PRICE) {
      // Remove decimal part from price range if it's zero
      const priceRange = option.name.trim().replace(/\.0/g, '');
      return `${priceRange} £`;
    }
    // if (sectionKey === FILTER_KEYS.PRICE) return `${option.name} £` //TBD
    if (sectionKey === FILTER_KEYS.COLOR) {
      return option?.name?.split('|')[1];
    }
  
    if (option?.name?.toLowerCase() === 'true') {
      return 'Yes';
    } else if (option?.name?.toLowerCase() === 'false') {
      return 'No';
    } else {
      return option?.name;
    }
  }

  const checkboxBgColor = bgColor(option) || '#ffffff'
  return (
    <div
      key={`option-right-value-${option?.value}-${optionIdx}`}
      className={`${
        isCheckboxChecked && !isCheckboxTickDisabled
          ? 'bg-teal'
          : 'sm:bg-white bg-gray-100'
      } flex items-center w-full px-2 py-3 mb-2 rounded`}
    >
      <input
        name={`${optionIdx}-input[]`}
        defaultValue={option?.value}
        type="checkbox"
        className="w-4 h-4 border-gray-300 rounded filter-input"
      />
      <label
        htmlFor={`${optionIdx}-input[]`}
        onClick={handleCheckbox}
        className={`${
          isCheckboxChecked && !isCheckboxTickDisabled
            ? 'text-white'
            : 'text-black'
        } relative w-full ml-0 text-sm cursor-pointer filter-label`}
      >
        <span className="long-f-name">
          {generateOptionName()} ({option?.count})
        </span>
        {isCheckboxChecked && !isCheckboxTickDisabled && (
          <div
            style={{
              content: '',
              float: 'right',
              right: '11px',
              top: '4px',
              zIndex: 99999,
              position: 'absolute',
              width: '6px',
              height: '10px',
              border: 'solid #000',
              borderWidth: '0 2px 2px 0',
              transform: 'rotate(45deg)',
            }}
          />
        )}
        {sectionKey === FILTER_KEYS.COLOR && (
          <div
            style={{
              content: '',
              top: '2px',
              float: 'right',
              height: '16px',
              width: '16px',
              borderRadius: '16px',
              background: checkboxBgColor,
              border: '1px solid #ffffff',
              position: 'relative',
              marginRight: '6px',
            }}
          />
        )}
        {sectionKey != FILTER_KEYS.COLOR && (
          <div
            style={{
              content: '',
              top: '2px',
              float: 'right',
              height: '16px',
              width: '16px',
              borderRadius: '16px',
              background: checkboxBgColor,
              border: '1px solid #cccccc',
              position: 'relative',
              marginRight: '6px',
            }}
          />
        )}
      </label>
    </div>
  )
}

const SearchInput = ({ placeholder, handleSearch }: any) => {
  return (
    <>
      <label className="sr-only">{BTN_SEARCH}</label>
      <input
        type="text"
        onChange={(e) => handleSearch(e.target.value)}
        autoComplete={BTN_SEARCH}
        placeholder={BTN_SEARCH}
        className="w-full min-w-0 px-4 py-1 mb-2 text-gray-900 placeholder-gray-500 bg-white border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
      />
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

export default function FilterHorizontalList({
  items = [],
  sectionName,
  sectionKey,
  handleFilters,
  routerFilters,
  closeSidebar,
}: any) {
  const [filterItems, setFilterItems] = useState(items)

  useEffect(() => {
    setFilterItems(items)
  }, [items])

  const handleSearch = (value: string) => {
    const itemsClone = [...items]
    const filteredItems = itemsClone.filter((item: any) =>
      item?.name.toLowerCase().includes(value?.toLowerCase())
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
      bgColor: (item: any) => item.name.split('|')[0],
    },
  }

  const isDefaultChecked = (sectionKey: string, value: string) => {
    return !!routerFilters?.find(
      (filter: any) => filter?.Key === sectionKey && filter?.Value === value
    )
  }

  const getCustomComponentProps = (sectionKey: any) => {
    let componentProps = {}
    Object.entries(PROPS_LIST).forEach(([key, props]: any) => {
      if (sectionKey?.indexOf(key) > -1) {
        componentProps = props
      }
    })
    return componentProps
  }
  return (
    <>
      {getCustomComponent(sectionKey)({ ...getCustomComponentProps(sectionKey) })}
      <div>
        {filterItems?.map((option: any, optionIdx: number) => {
          const isChecked = isDefaultChecked(option?.filterKey, option?.name)
          return (
            <FilterItem
              sectionName={sectionName}
              sectionKey={option?.filterKey}
              option={option}
              onSelect={handleFilters}
              optionIdx={optionIdx}
              key={optionIdx}
              isChecked={isChecked}
              closeSidebar={closeSidebar}
              {...getCustomComponentProps(sectionKey)}
            />
          )
        })}
      </div>
    </>
  )
}
