"use client";

import React, { useState } from "react";
import Slider from "rc-slider";
import MySwitch from "@new-components/MySwitch";
import Checkbox from "./shared/Checkbox/Checkbox";
import Radio from "./shared/Radio/Radio";
import { useTranslation } from "@commerce/utils/use-translation";

const SidebarFilters = () => {
  const translate = useTranslation()
  //
  const [isOnSale, setIsIsOnSale] = useState(true);
  const [rangePrices, setRangePrices] = useState([100, 500]);
  const [categoriesState, setCategoriesState] = useState<string[]>([]);
  const [colorsState, setColorsState] = useState<string[]>([]);
  const [sizesState, setSizesState] = useState<string[]>([]);
  const [sortOrderStates, setSortOrderStates] = useState<string>("");
  // DEMO DATA
  const DATA_categories = [
    {
      name: translate('label.category.newArrivalsText'),
    },
    {
      name: translate('label.category.saleText'),
    },
    {
      name: translate('label.category.backpacksText'),
    },
    {
      name: translate('label.category.travelBagsText'),
    },
    {
      name: translate('label.category.laptopSleevesText'),
    },
    {
      name: translate('label.category.organizationText'),
    },
    {
      name: translate('label.category.accessoriesText'),
    },
  ];
  
  const DATA_colors = [
    { name: translate('label.color.whiteText') },
    { name: translate('label.color.beigeText') },
    { name: translate('label.color.blueText') },
    { name: translate('label.color.blackText') },
    { name: translate('label.color.brownText') },
    { name: translate('label.color.greenText') },
    { name: translate('label.color.navyText') },
  ];
  
  const DATA_sizes = [
    { name: "XXS" },
    { name: "XS" },
    { name: "S" },
    { name: "M" },
    { name: "L" },
    { name: "XL" },
    { name: "2XL" },
  ];
  
  const DATA_sortOrderRadios = [
    { name: translate('label.sortOrder.mostPopularText'), id: "Most-Popular" },
    { name: translate('label.sortOrder.bestRatingText'), id: "Best-Rating" },
    { name: translate('label.sortOrder.newestText'), id: "Newest" },
    { name: translate('label.sortOrder.priceLowToHighText'), id: "Price-low-hight" },
    { name: translate('label.sortOrder.priceHightToLowText'), id: "Price-hight-low" },
  ];

  const PRICE_RANGE = [1, 500];

  //
  const handleChangeCategories = (checked: boolean, name: string) => {
    checked
      ? setCategoriesState([...categoriesState, name])
      : setCategoriesState(categoriesState.filter((i) => i !== name));
  };

  const handleChangeColors = (checked: boolean, name: string) => {
    checked
      ? setColorsState([...colorsState, name])
      : setColorsState(colorsState.filter((i) => i !== name));
  };

  const handleChangeSizes = (checked: boolean, name: string) => {
    checked
      ? setSizesState([...sizesState, name])
      : setSizesState(sizesState.filter((i) => i !== name));
  };

  //

  // OK
  const renderTabsCategories = () => {
    return (
      <div className="relative flex flex-col pb-8 space-y-4">
        <h3 className="font-semibold mb-2.5">{translate('label.category.catogoriesText')}</h3>
        {DATA_categories.map((item) => (
          <div key={item.name} className="">
            <Checkbox
              name={item.name}
              label={item.name}
              defaultChecked={categoriesState.includes(item.name)}
              sizeClassName="w-5 h-5"
              labelClassName="text-sm font-normal"
              onChange={(checked) => handleChangeCategories(checked, item.name)}
            />
          </div>
        ))}
      </div>
    );
  };

  // OK
  const renderTabsColor = () => {
    return (
      <div className="relative flex flex-col py-8 space-y-4">
        <h3 className="font-semibold mb-2.5">{translate('common.label.colorsText')}</h3>
        {DATA_colors.map((item) => (
          <div key={item.name} className="">
            <Checkbox
              sizeClassName="w-5 h-5"
              labelClassName="text-sm font-normal"
              name={item.name}
              label={item.name}
              defaultChecked={colorsState.includes(item.name)}
              onChange={(checked) => handleChangeColors(checked, item.name)}
            />
          </div>
        ))}
      </div>
    );
  };

  // OK
  const renderTabsSize = () => {
    return (
      <div className="relative flex flex-col py-8 space-y-4">
        <h3 className="font-semibold mb-2.5">{translate('common.label.sizesText')}</h3>
        {DATA_sizes.map((item) => (
          <div key={item.name} className="">
            <Checkbox
              name={item.name}
              label={item.name}
              defaultChecked={sizesState.includes(item.name)}
              onChange={(checked) => handleChangeSizes(checked, item.name)}
              sizeClassName="w-5 h-5"
              labelClassName="text-sm font-normal"
            />
          </div>
        ))}
      </div>
    );
  };

  // OK
  const renderTabsPriceRage = () => {
    return (
      <div className="relative flex flex-col py-8 pr-3 space-y-5">
        <div className="space-y-5">
          <span className="font-semibold">{translate('label.price.priceRangeText')}</span>
          <Slider
            range
            min={PRICE_RANGE[0]}
            max={PRICE_RANGE[1]}
            step={1}
            defaultValue={[rangePrices[0], rangePrices[1]]}
            allowCross={false}
            onChange={(_input: number | number[]) =>
              setRangePrices(_input as number[])
            }
          />
        </div>

        <div className="flex justify-between space-x-5">
          <div>
            <label
              htmlFor="minPrice"
              className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
            >
              {translate('label.price.minPriceText')} 
            </label>
            <div className="relative mt-1 rounded-md">
              <span className="absolute inset-y-0 flex items-center pointer-events-none right-4 text-neutral-500 sm:text-sm">
                $
              </span>
              <input
                type="text"
                name="minPrice"
                disabled
                id="minPrice"
                className="block w-32 pl-4 pr-10 bg-transparent rounded-full sm:text-sm border-neutral-200 dark:border-neutral-700"
                value={rangePrices[0]}
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="maxPrice"
              className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
            >
              {translate('label.price.maxPricetext')} 
            </label>
            <div className="relative mt-1 rounded-md">
              <span className="absolute inset-y-0 flex items-center pointer-events-none right-4 text-neutral-500 sm:text-sm">
                $
              </span>
              <input
                type="text"
                disabled
                name="maxPrice"
                id="maxPrice"
                className="block w-32 pl-4 pr-10 bg-transparent rounded-full sm:text-sm border-neutral-200 dark:border-neutral-700"
                value={rangePrices[1]}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // OK
  const renderTabsSortOrder = () => {
    return (
      <div className="relative flex flex-col py-8 space-y-4">
        <h3 className="font-semibold mb-2.5">{translate('label.filters.sortOrderText')}</h3>
        {DATA_sortOrderRadios.map((item) => (
          <Radio
            id={item.id}
            key={item.id}
            name="radioNameSort"
            label={item.name}
            defaultChecked={sortOrderStates === item.id}
            sizeClassName="w-5 h-5"
            onChange={setSortOrderStates}
            className="!text-sm"
          />
        ))}
      </div>
    );
  };

  return (
    <div className="divide-y divide-slate-200 dark:divide-slate-700">
      {renderTabsCategories()}
      {renderTabsColor()}
      {renderTabsSize()}
      {renderTabsPriceRage()}
      <div className="py-8 pr-2">
        <MySwitch
          label={translate('label.filters.onSaleWithMarkText')}
          desc={translate('common.label.productCurrentlyOnSaleText')}
          enabled={isOnSale}
          onChange={setIsIsOnSale}
        />
      </div>
      {renderTabsSortOrder()}
    </div>
  );
};

export default SidebarFilters;
