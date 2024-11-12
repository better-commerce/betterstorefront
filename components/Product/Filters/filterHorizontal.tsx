import React, { useState, useEffect, useRef } from 'react';
import { DEFAULT_FILTER_PAGE_TYPES } from '@components/utils/constants';
import groupBy from 'lodash/groupBy';
import FilterHorizontalList from './filterHorizontalList';
import { ChevronDown } from '@components/icons';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface Props {
  products: any;
  handleFilters: any;
  routerFilters: any;
  pageType: any;
}

export default function FilterHorizontal({ products = { filters: [] }, handleFilters, routerFilters, pageType }: Props) {
  const [filterIndex, setFilterIndex] = useState(null);
  const [displayedFiltersCount, setDisplayedFiltersCount] = useState(10); // Initialize to display the first 10 filters
  const filterRef: any = useRef([]);

  const filtersToShow = products?.filters?.slice(0, displayedFiltersCount);

  const filteredFilters = filtersToShow?.filter((o: any) => {
    const lowerPageType = pageType?.toLowerCase();
    if (lowerPageType && DEFAULT_FILTER_PAGE_TYPES[lowerPageType]) {
      return o?.key !== DEFAULT_FILTER_PAGE_TYPES[lowerPageType];
    }
    return o;
  });

  const getFilter = () => {
    const filters: any = [];
    let mappedFilters: any = products?.filters?.map((filter: any) => {
      filter?.items?.forEach((item: any) => (item.filterKey = filter.key));
      return filter;
    });
    mappedFilters = mappedFilters?.filter((item: any) => item?.name?.toLowerCase() !== pageType?.toLowerCase());
    const groupedFilters = groupBy(mappedFilters, 'name');
    Object.entries(groupedFilters)?.forEach(([groupName, groupItems]: any) => {
      let groupKey = '';
      const filterItems: any = [];
      groupItems?.forEach((item: any) => {
        filterItems.push(item?.items);
        groupKey += groupKey.length > 0 ? `,${item.key}` : item.key;
      });
      filters.push({
        groupName,
        groupKey,
        filters: filterItems.flat().sort((a: any, b: any) => a?.name.localeCompare(b?.name)),
      });
    });
    return filters || [];
  };

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

  useEffect(() => {
    filterRef?.current?.forEach((ref: any, index: any) => {
      if (ref && index !== filterIndex) {
        ref.classList.remove('open-filter-class');
      }
    });
  }, [filterIndex]);

  const loadMoreFilters = () => {
    setDisplayedFiltersCount(prevCount => Math.min(prevCount + 10, products?.filters?.length));
  };

  const showLessFilters = () => {
    setDisplayedFiltersCount(10); // Reset to show only the first 10 filters
  };

  return (
    <div className='relative flex flex-wrap w-full col-span-12 gap-2 pt-4'>
      {getFilter()?.slice(0, displayedFiltersCount).map((infoWidget: any, index: number) => (
        <div className="relative inline-block text-left" key={`applied-filter-right-${index}`} ref={(ref) => (filterRef.current[index] = ref)}>
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
        </div>
      ))}
      {displayedFiltersCount < getFilter()?.length ? (
        <div className='relative inline-block mx-1 text-left'>
          <button className='inline-flex justify-center w-full cursor-pointer select-none filter-dropdown more !bg-yellow-100 !border !border-yellow-300 hover:!bg-yellow-200' onClick={loadMoreFilters}>
            Load More <ChevronDownIcon className='w-4 h-4'/>
          </button>
        </div>
      ) : (
        <div className='relative inline-block mx-1 text-left'>
          <button className='inline-flex justify-center w-full cursor-pointer select-none filter-dropdown !bg-red-100 !border !border-red-300 hover:!bg-red-200' onClick={showLessFilters}>
            Show Less  <ChevronUpIcon className='w-4 h-4'/>
          </button>
        </div>
      )}
    </div>
  );
}
