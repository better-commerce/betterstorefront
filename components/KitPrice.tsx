
import { vatIncluded } from "@framework/utils/app-util";
import React, { FC } from "react";

export interface PricesProps {
  readonly price?: any;
  readonly listPrice?: any;
  readonly contentClass?: string;
  readonly featureToggle: any;
  readonly defaultDisplayMembership: any;
}

const Prices: FC<PricesProps> = ({
  price,
  featureToggle,
}) => {
  const isIncludeVAT = vatIncluded();

  return (
    <>
      {price?.raw?.withTax !== 0 ? (
         <span className="">
         {featureToggle?.features?.enableForPCSite ? (
           (() => {
            const rawPrice = isIncludeVAT ? price?.formatted?.withTax : price?.formatted?.withoutTax;
            const match = rawPrice?.match(/^(\D*)([\d,]+)(\.\d+)?$/);
            const symbol = match?.[1] || '';
            const main = match?.[2] || ''; // keep commas here
            const decimal = match?.[3]?.replace('.', '') || '';

             return (
              <span className="relative">
              <span className="text-xs mr-0.5">{symbol}</span>
              <span className="text-xs font-semibold">{main}</span>
              {decimal && (<span className="text-xs">.{decimal}</span>)}
            </span>
             );
           })()
         ) : (
           isIncludeVAT ? price?.formatted?.withTax : price?.formatted?.withoutTax
         )}
       </span>
        ) : (
          <span className="text-black text-xs">
            0
          </span>
        )}
    </>
  );
};

export default Prices;
