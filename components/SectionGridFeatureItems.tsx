import React, { FC } from "react";
import HeaderFilterSection from "@components/HeaderFilterSection";
import ProductCard from "@components/ProductCard";
import ButtonPrimary from "./shared/Button/ButtonPrimary";
import { useTranslation } from "@commerce/utils/use-translation";
import { PRODUCTS, Product } from "./Product/data";

//
export interface SectionGridFeatureItemsProps {
  data?: Product[];
  featureToggle: any;
  defaultDisplayMembership: any;
}

const SectionGridFeatureItems: FC<SectionGridFeatureItemsProps> = ({
  data = PRODUCTS,
  featureToggle, 
  defaultDisplayMembership,
}) => {
  const translate = useTranslation()
  return (
    <div className="relative nc-SectionGridFeatureItems">
      <HeaderFilterSection />
      <div
        className={`grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 `}
      >
        {data?.map((item, index) => (
          <ProductCard data={item} key={index} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership} />
        ))}
      </div>
      <div className="flex items-center justify-center mt-16">
        <ButtonPrimary loading>{translate('common.label.showMeMoreText')}</ButtonPrimary>
      </div>
    </div>
  );
};

export default SectionGridFeatureItems;
