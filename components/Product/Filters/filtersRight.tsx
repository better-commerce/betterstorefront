import React, { useState, useEffect } from 'react'
import { Disclosure } from '@headlessui/react'
import FilterList, { FILTER_KEYS } from './FilterList'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import PriceFilterSlider from '@components/Product/Filters/PriceFilterSlider'
import { CURRENT_THEME } from '@components/utils/constants'


interface Props {
  products: any
  handleFilters: any
  routerFilters: any
  isBrandPLP?: boolean
  featureToggle?:any
}

export default function FiltersRightOpen({ products = { filters: [] }, handleFilters, routerFilters, isBrandPLP = false, featureToggle }: Props) {
  // Generate appliedFilters correctly
  const appliedFilters = products?.filters?.reduce((acc: any, obj: any) => {
    if (routerFilters.some((filter: any) => filter.Key === obj.key)) {
      acc.push({
        ...obj,
        ...routerFilters.find((filter: any) => filter.Key === obj.key)
      });
    }
    return acc;
  }, []);

  // State to track which accordions are open
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({});

  // Initialize open accordions based on feature toggle and other conditions
  useEffect(() => {
    // Debug log to check feature toggle value
    console.log('Feature toggle enableForPCSite:', featureToggle.features?.enableForPCSite);

    const initialOpenState: Record<string, boolean> = {};

    // If feature toggle is enabled, open all accordions
    if (featureToggle.features?.enableForPCSite) {
      products.filters?.forEach((section: any, sectionIdx: number) => {
        if (section?.key === "rating") return;
        initialOpenState[`filter-${sectionIdx}-${section?.key}`] = true;
      });
    } else {
      // Otherwise, follow the original logic
      products.filters?.forEach((section: any, sectionIdx: number) => {
        if (section?.key === "rating") return;

        const isFilterApplied = appliedFilters.some((filter: any) => filter.Key === section?.key);
        const shouldBeOpen = sectionIdx === 0 || (isBrandPLP && sectionIdx === 1) || isFilterApplied;

        if (shouldBeOpen) {
          initialOpenState[`filter-${sectionIdx}-${section?.key}`] = true;
        }
      });
    }

    setOpenAccordions(initialOpenState);
  }, [products.filters, appliedFilters, isBrandPLP, featureToggle.features?.enableForPCSite]);

  // Function to toggle accordion state
  const toggleAccordion = (accordionId: string) => {
    // If feature toggle is enabled, don't allow toggling
    if (featureToggle.features?.enableForPCSite) {
      return; // Do nothing, keep all accordions open
    }

    setOpenAccordions(prev => ({
      ...prev,
      [accordionId]: true // Always keep it open
    }));
  };

  return (
    <div key="new" className={`relative flex-col hidden w-full h-full max-w-xs max-w-full-sec pr-4 ml-auto overflow-y-auto bg-white dark:bg-transparent sm:flex ${featureToggle.features?.enableForPCSite ? ' sm:pr-4 2xl:pr-4':' sm:px-0 2xl:px-0'} ${CURRENT_THEME == 'green' ? ' sm:col-span-2 filter-panel-3' : ' sm:col-span-3'}`}>
      {products.filters?.map((section: any, sectionIdx: number) => {
        if (isBrandPLP && section?.name === "Brand") return null;
        // isFilterApplied is now handled in the useEffect
        return (
          section?.key != "rating" &&
          <div key={`filter-right-${sectionIdx}-${section?.key}`} className={`${featureToggle.features?.enableForPCSite ? '' : 'border-b border-slate-300'}`}>
            {/* When feature toggle is enabled, render content directly without Disclosure */}
            {featureToggle.features?.enableForPCSite ? (
              <div className="filter-always-open">
                <div className={`flex items-center justify-between w-full gap-2 px-0 py-3 text-left text-black bg-white rounded-lg outline-none dark:bg-transparent ${CURRENT_THEME == 'green' ? 'text-xl font-medium' : 'uppercase text-sm font-semibold'}`}>
                  <span className='dark:text-black'>{section?.name}</span>
                </div>
                <div className="px-0 pt-0 pb-2">
                  {(section?.key === FILTER_KEYS.PRICE || section?.key === FILTER_KEYS.ONLY_PRICE) ?
                    <PriceFilterSlider handleFilters={handleFilters} sectionKey={section?.key} items={section?.items} routerFilters={routerFilters} /> :
                    <FilterList handleFilters={handleFilters} sectionName={section?.name} sectionKey={section?.key} items={section?.items} routerFilters={routerFilters} />}
                </div>
              </div>
            ) : (
              <Disclosure defaultOpen={openAccordions[`filter-${sectionIdx}-${section?.key}`] || false} as="div">
              {({ open }) => (
                <>
                  <Disclosure.Button
                    className={`flex items-center justify-between w-full gap-2 px-0 py-3 text-left text-black bg-white rounded-lg outline-none dark:bg-transparent hover:bg-white dark:hover:bg-transparent active:outline-none hover:outline-none ${CURRENT_THEME == 'green' ? 'text-xl font-medium' : 'uppercase text-sm font-semibold'} ${featureToggle.features?.enableForPCSite ? 'pointer-events-none' : ''}`}
                    onClick={() => toggleAccordion(`filter-${sectionIdx}-${section?.key}`)}
                  >
                    <span className='dark:text-black'>{section?.name}</span>
                    {!featureToggle.features?.enableForPCSite && <ChevronDownIcon className={`${open ? 'rotate-180 transform' : ''} w-5 h-5 dark:text-black`} />}
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-0 pt-0 pb-2">
                    {(section?.key === FILTER_KEYS.PRICE || section?.key === FILTER_KEYS.ONLY_PRICE) ? <PriceFilterSlider handleFilters={handleFilters} sectionKey={section?.key} items={section?.items} routerFilters={routerFilters} /> :
                      <FilterList handleFilters={handleFilters} sectionName={section?.name} sectionKey={section?.key} items={section?.items} routerFilters={routerFilters} />}
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
            )}
          </div>
        )
      })}
    </div>
  )
}
