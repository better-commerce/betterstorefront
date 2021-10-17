import { useState } from 'react'
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

const FilterItem = ({ option, optionIdx }: any) => {
  return (
    <div key={option.value} className="flex items-center">
      <input
        name={`${optionIdx}-input[]`}
        defaultValue={option.value}
        type="checkbox"
        className="h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
      />
      <label
        htmlFor={`${optionIdx}-input[]`}
        className="ml-3 text-sm text-gray-500"
      >
        {option.name}
      </label>
    </div>
  )
}

const SearchInput = ({ placeholder, handleSearch }: any) => {
  return (
    <>
      <label htmlFor="search-input" className="sr-only">
        Email address
      </label>
      <input
        id="search-input"
        type="text"
        onChange={(e) => handleSearch(e.target.value)}
        autoComplete="email"
        placeholder="Search brands"
        className="appearance-none min-w-0 w-full bg-white border border-gray-300 rounded-md shadow-sm py-1 px-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
      />
    </>
  )
}

export default function FilterList({ items = [], sectionKey }: any) {
  const [filterItems, setFilterItems] = useState(items)

  const handleSearch = (value: string) => {
    const itemsClone = [...items]
    const filteredItems = itemsClone.filter((item: any) =>
      item.name.toLowerCase().includes(value.toLowerCase())
    )
    setFilterItems(filteredItems)
  }

  return (
    <>
      {sectionKey === FILTER_KEYS.BRAND ? (
        <SearchInput handleSearch={handleSearch} />
      ) : null}
      {filterItems.map((option: any, optionIdx: number) => {
        return (
          <FilterItem option={option} optionIdx={optionIdx} key={optionIdx} />
        )
      })}
    </>
  )
}
