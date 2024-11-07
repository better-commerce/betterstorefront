import React, { useState, useEffect, useRef } from 'react';

import { DEFAULT_FILTER_PAGE_TYPES } from '@components/utils/constants'
import groupBy from 'lodash/groupBy';
import FilterHorizontalList from './filterHorizontalList';
// import isEmpty from 'lodash/isEmpty';
interface Props {
  products: any
  handleFilters: any
  routerFilters: any
  pageType: any
}

export default function FilterHorizontal({ products = { filters: [] }, handleFilters, routerFilters, pageType }: Props) {
  const [showMore, setShowMore] = useState(false);
  const [filterIndex, setFilterIndex] = useState(null);
  const filterRef: any = useRef([]);
  let filtersToShow = showMore ? products?.filters : products?.filters?.slice(0, 7);

  filtersToShow = filtersToShow?.filter((o: any) => {
    pageType = pageType?.toLowerCase()
    if (pageType && DEFAULT_FILTER_PAGE_TYPES[pageType]) {
      if (o?.key) return o?.key !== DEFAULT_FILTER_PAGE_TYPES[pageType]
      return o?.Key !== DEFAULT_FILTER_PAGE_TYPES[pageType]
    }
    return o;
  })

  // const getFilterOld = (infoFilter: any) => {
  //   let filters = [];
  //   const groupedFilter = groupBy(products?.filters, 'name');
  //   if (!isEmpty(groupedFilter)) {
  //     for (const group in groupedFilter) {
  //       filters.push({ groupName: group, filters: groupedFilter[group] });
  //     }
  //   }
  //   return filters;
  // };

  const getFilter = () => {
    const filters: any = new Array()
    let mappedFilters: any = products?.filters?.map((filter: any) => {
      filter?.items?.forEach((item: any) => (item.filterKey = filter.key))
      return filter
    })
    mappedFilters = mappedFilters?.filter((item: any) => item?.name?.toLowerCase() !== pageType?.toLowerCase())
    const groupedFilters = groupBy(mappedFilters, 'name')
    Object.entries(groupedFilters)?.forEach(([groupName, groupItems]: any) => {
      let groupKey = ''
      const filterItems: any = []
      groupItems?.forEach((item: any) => {
        filterItems.push(item?.items)
        if (groupKey?.length > 0) groupKey += `,${item.key}`
        else groupKey = item.key
      })
      filters.push({
        groupName,
        groupKey,
        filters: filterItems
          .flat()
          .sort((a: any, b: any) => (a?.name).localeCompare(b?.name)),
      })
    })
    return filters || []
  }

  useEffect(() => {
    const handleOutsideClick = (event: any) => {
      if (filterIndex !== null && filterRef?.current?.[filterIndex]?.contains(event.target)) {
        return;
      }
      setFilterIndex(null);
    };
    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [filterIndex]);

  const handleFilterClick = (index: any) => {
    setFilterIndex(index === filterIndex ? null : index);
  };

  // Function to remove class based on clickedIndex
  useEffect(() => {
    filterRef?.current?.forEach((ref: any, index: any) => {
      if (ref && index !== filterIndex) {
        ref.classList.remove('open-filter-class');
      }
    });
  }, [filterIndex]);

  return (
    <div className='relative col-span-12 gap-2 pt-4'>
      {getFilter()?.map((infoWidget: any, index: number) =>
        <div className="relative inline-block m-1 text-left" key={`applied-filter-right-${index}`} ref={(ref) => (filterRef.current[index] = ref)}>
          <>
            <div>
              <div className="inline-flex justify-center w-full cursor-pointer select-none filter-dropdown" onClick={() => handleFilterClick(index)} >
                {infoWidget?.groupName}<i className="relative sprite-icons sprite-down-sml z-1" />
              </div>
            </div>
            <div className={`absolute left-0 origin-top-right bg-gray-100 rounded shadow-xl z-999 top-10 max-panel hidden ${filterIndex === index && 'open-filter-class'}`}>
              <div className="w-64 p-4 py-1 focus:outline-none" key={index}>
                <FilterHorizontalList handleFilters={handleFilters} sectionName={infoWidget?.groupName} sectionKey={infoWidget?.groupKey} items={infoWidget?.filters} routerFilters={routerFilters} />
              </div>
            </div>
          </>
        </div>
      )}
    </div>
  )
}