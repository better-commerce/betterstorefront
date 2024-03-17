import React, { FC } from "react";
import HeaderFilterSection from "@new-components/HeaderFilterSection";
import ProductCard from "@new-components/ProductCard";
import ButtonPrimary from "./shared/Button/ButtonPrimary";
import { Product, PRODUCTS } from "@components/data/data";
import { useTranslation } from "@commerce/utils/use-translation";

//
export interface SectionGridFeatureItemsProps {
  data?: Product[];
}

const SectionGridFeatureItems: FC<SectionGridFeatureItemsProps> = ({
  data = PRODUCTS,
}) => {
  const translate = useTranslation()
  return (
    <div className="nc-SectionGridFeatureItems relative">
      <HeaderFilterSection />
      <div
        className={`grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 `}
      >
        {data?.map((item, index) => (
          <ProductCard data={item} key={index} />
        ))}
      </div>
      <div className="flex mt-16 justify-center items-center">
        <ButtonPrimary loading>{translate('common.label.showMeMoreText')}</ButtonPrimary>
      </div>
    </div>
  );
};

export default SectionGridFeatureItems;
