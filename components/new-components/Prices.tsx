import { vatIncluded } from "@framework/utils/app-util";
import React, { FC } from "react";

export interface PricesProps {
  className?: string;
  price?: any;
  listPrice?: any;
  contentClass?: string;
}

const Prices: FC<PricesProps> = ({ className = "", price, listPrice, contentClass = "py-1 px-2 md:py-1.5 md:px-2.5 text-sm font-medium", }) => {
  const isIncludeVAT = vatIncluded()
  return (
    <div className={`${className}`}>
      <div className="font-semibold text-green">
        {isIncludeVAT ? price?.formatted?.withTax : price?.formatted?.withoutTax}
        {isIncludeVAT ? (listPrice?.raw?.withTax > 0 && listPrice?.raw?.withTax > price?.raw?.withTax && (
          <span className="px-1 font-normal text-gray-400 line-through">{listPrice?.formatted?.withTax}</span>
        )
        ) : (
          listPrice?.raw?.withoutTax > 0 && listPrice?.raw?.withoutTax > price?.raw?.withoutTax && (
            <span className="px-1 font-normal text-gray-400 line-through">{listPrice?.formatted?.withoutTax}</span>
          )
        )}
        <span className="pl-1 text-xs font-light text-right text-gray-400">{isIncludeVAT ? 'inc. VAT' : 'ex. VAT'}</span>
      </div>
    </div>
  );
};

export default Prices;
