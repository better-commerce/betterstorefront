import React from 'react';
import BrandFilter from './BrandFilter'
import { CURRENT_THEME } from '@components/utils/constants';
interface Brand {
  manufacturerName: string;
}

interface Item {
  name: string;
}

interface Section {
  key: string;
  items: Item[];
}

interface Products {
  filters: Section[];
}

interface Props {
  products: Products;
  handleFilters: any;
  routerFilters: any;
  featuredBrand: Brand[];
}
export default function BrandFilterTop({ products = { filters: [] }, handleFilters, routerFilters, featuredBrand }: Props) {
  const filterItemsByFeaturedBrand = (items: Item[], featuredBrand: Brand[]) => {
    const featuredBrandNames = featuredBrand.map(brand => brand.manufacturerName);
    return items.filter(item => featuredBrandNames.includes(item.name));
  };

  return (
    <>
      <div key="new" className={`relative flex-col hidden w-full h-full pr-4 ml-auto overflow-y-auto bg-white dark:bg-transparent sm:flex sm:px-0 2xl:px-0 ${CURRENT_THEME == 'green' ? ' sm:col-span-2 filter-panel-3' : ' sm:col-span-3'}`}>
        {products.filters?.map((section: Section, sectionIdx: number) => {
          if (section?.key === 'brandNoAnlz') {
            const filteredItems = filterItemsByFeaturedBrand(section?.items, featuredBrand);
            return (
              <div key={`applied-filter-right-${sectionIdx}-${section?.key}`}>
                <BrandFilter handleFilters={handleFilters} sectionKey={section?.key} items={filteredItems} routerFilters={routerFilters} />
              </div>
            );
          }
          return null;
        })}
      </div>      
    </>
  );
}
