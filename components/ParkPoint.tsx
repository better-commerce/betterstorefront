
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
             const main = match?.[2] || ''; // keep commas here

             return (
              <span className="text-black text-xs">{main}</span>
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
