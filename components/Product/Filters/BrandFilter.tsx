import { useEffect, useState } from 'react'
import { ACTION_TYPES } from 'pages/search'
import { useTranslation } from '@commerce/utils/use-translation'
import { getCurrencySymbol } from '@framework/utils/app-util'
import { generateUri } from "@commerce/utils/uri-util";
import { IMG_PLACEHOLDER } from "@components/utils/textVariables";
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import { CURRENT_THEME } from '@components/utils/constants';
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

const BrandFilterItem = ({ option, optionIdx, sectionKey, isChecked = false, isCheckboxTickDisabled = false, bgColor = () => false, onSelect, closeSidebar = () => { }, ...props }: any) => {
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
    return option.name
  }

  return (
    <div key={`option-right-value-${option.value}-${optionIdx}`} className={`flex items-center justify-center flex-col overflow-hidden cursor-pointer bg-[#EFEFEF] border  rounded-lg flex-shrink-0 ${isCheckboxChecked ? 'border-gray-500 hover:border-gray-500' : 'border-gray-200 hover:border-gray-300'}`} >
      <label htmlFor={`${optionIdx}-input[]`} onClick={handleCheckbox} className={`relative ml-0 text-sm text-gray-500 cursor-pointer filter-label dark:text-white ${sectionKey === FILTER_KEYS.COLOR && CURRENT_THEME == 'green' ? 'flex flex-col-reverse gap-1 justify-center items-center align-middle' : ''}`} >
        <span>
          <input name={`${optionIdx}-input[]`} defaultValue={option.value} type="checkbox" className="w-4 h-4 border-gray-300 rounded filter-input" />
        </span>
        <img src={CURRENT_THEME === 'green' ? (generateUri(`https://www.imagedelivery.space/tagdeal/brand/${option?.name?.toLowerCase().replaceAll(" ", "-")}.jpg`, 'h=50&fm=webp') || IMG_PLACEHOLDER) : (generateUri(`https://www.imagedelivery.space/fashion/brand/${option?.name?.toLowerCase().replaceAll(" ", "-")}.jpg`, 'h=50&fm=webp') || IMG_PLACEHOLDER)} title={option.name} className="object-contain object-center h-10 brand-logo-category max-h-[50px] dark:text-black" alt={option.name} width={100} height={50} />
      </label>
    </div>
  )
}

export default function FilterList({ items = [], sectionKey, handleFilters, routerFilters, closeSidebar, }: any) {
  const [filterItems, setFilterItems] = useState(items)
  useEffect(() => { setFilterItems(items) }, [items?.length])

  const handleSearch = (value: string) => {
    const itemsClone = [...items]
    const filteredItems = itemsClone.filter((item: any) =>
      item.name.toLowerCase().includes(value.toLowerCase())
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
      <Swiper spaceBetween={10} slidesPerView={1} navigation={false} loop={false} breakpoints={{ 640: { slidesPerView: 2, }, 768: { slidesPerView: 3, }, 1024: { slidesPerView: 7, }, 1400: { slidesPerView: 8, }, }} className="mySwiper center-content swiper-center" >
        {filterItems?.map((option: any, optionIdx: number) => {
          const isChecked = isDefaultChecked(sectionKey, option.name)
          return (
            sectionKey === FILTER_KEYS.BRAND &&
            <SwiperSlide key={optionIdx}>
              <BrandFilterItem
                sectionKey={sectionKey}
                option={option}
                onSelect={handleFilters}
                optionIdx={optionIdx}
                key={optionIdx}
                isChecked={isChecked}
                closeSidebar={closeSidebar}
                {...PROPS_LIST[sectionKey]}
              />
            </SwiperSlide>
          )
        })}
      </Swiper>
    </>
  )
}
