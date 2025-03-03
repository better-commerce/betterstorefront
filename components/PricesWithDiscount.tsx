import { useTranslation } from "@commerce/utils/use-translation";
import { vatIncluded } from "@framework/utils/app-util";
import { roundToDecimalPlaces } from "@framework/utils/parse-util";
import React, { FC, useMemo } from "react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

export interface PricesProps {
  readonly className?: string;
  readonly price?: any;
  readonly listPrice?: any;
  readonly contentClass?: string;
  readonly featureToggle: any;
  readonly defaultDisplayMembership: any;
}

const Prices: FC<PricesProps> = ({
  className = "w-full price-div",
  price,
  listPrice,
  contentClass = "py-1 px-2 md:py-1.5 md:px-2.5 text-sm font-medium",
  featureToggle,
  defaultDisplayMembership,
}) => {
  const discountPerc = defaultDisplayMembership?.membershipPromoDiscountPerc || 0;
  const isIncludeVAT = vatIncluded();
  const translate = useTranslation();

  // Calculate membership prices
  const memberPriceWithTax = useMemo(() => {
    const discountedPrice = price?.raw?.withTax * ((100.0 - discountPerc) / 100.0);
    return `${price?.currencySymbol}${roundToDecimalPlaces(discountedPrice)}`;
  }, [price?.raw?.withTax, discountPerc]);

  const memberPriceWithoutTax = useMemo(() => {
    const discountedPrice = price?.raw?.withoutTax * ((100.0 - discountPerc) / 100.0);
    return `${price?.currencySymbol}${roundToDecimalPlaces(discountedPrice)}`;
  }, [price?.raw?.withoutTax, discountPerc]);

  // Calculate discount percentage for the non-member price
  const originalPrice = isIncludeVAT ? listPrice?.raw?.withTax : listPrice?.raw?.withoutTax;
  const currentPrice = isIncludeVAT ? price?.raw?.withTax : price?.raw?.withoutTax;
  const nonMemberDiscountPercentage =
    originalPrice > currentPrice
      ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
      : 0;

  return (
    <>
      <div className={`${className}`}>
        {/* Membership Price Display */}
        {featureToggle?.features?.enableMembership && (
          <div className="py-1 pl-2 mb-2 font-semibold text-black bg-yellow-100 rounded-md font-14">
            {isIncludeVAT ? memberPriceWithTax : memberPriceWithoutTax}
            <span className="text-xs font-normal text-gray-500">
              {` ${translate("label.membership.memberPriceText")}`}
            </span>
            <span className="pl-1 font-light text-right text-gray-900 font-10">
              {isIncludeVAT
                ? translate("label.orderSummary.incVATText")
                : translate("label.orderSummary.excVATText")}
              <a
                href="#"
                onClick={(ev: any) => {
                  ev.preventDefault();
                  ev.stopPropagation();
                  window.dispatchEvent(
                    new CustomEvent("MemberProductPriceInfoViewed", {
                      detail: { defaultDisplayMembership, price, isIncludeVAT },
                    })
                  );
                }}
                className="inline-block -mt-1 align-middle"
              >
                <InformationCircleIcon className="w-4 h-4 ml-1 text-gray-500" />
              </a>
            </span>
          </div>
        )}
         
        {/* Non-member Price Display */}
        {/** Only show "Limited time deal" if discount is present */}
        {nonMemberDiscountPercentage > 0 && (
          <div className="flex mb-3">
            <span className="inline-block rounded bg-red-600 px-2 py-1 text-xs font-semibold text-white">
              Limited time deal
            </span>
          </div>
        )}
        
        {price?.raw?.withTax !== 0 ? (
          <div className={`flex ${nonMemberDiscountPercentage > 0 ? "flex-col" : "flex-row"} items-start text-sm font-semibold text-gray-400 price`}>
            <div className="flex gap-x-1 items-center">
            {/* Discount Percentage */}
            {nonMemberDiscountPercentage > 0 && (
              <span className="mr-2 text-red-600 text-lg font-normal">
                -{nonMemberDiscountPercentage}%
              </span>
            )}
            {isIncludeVAT ? price?.formatted?.withTax : price?.formatted?.withoutTax}
            </div>
            <div className="flex items-center">
            <span className="flex items-center">
              {/* Strike-through list price if there's a discount */}
              {isIncludeVAT ? (
                listPrice?.raw?.withTax > 0 &&
                listPrice?.raw?.withTax > price?.raw?.withTax && (
                  <span className="px-1 text-sm font-normal text-gray-400 line-through">
                    {listPrice?.formatted?.withTax}
                  </span>
                )
              ) : (
                listPrice?.raw?.withoutTax > 0 &&
                listPrice?.raw?.withoutTax > price?.raw?.withoutTax && (
                  <span className="px-1 text-sm font-normal text-gray-400 line-through">
                    {listPrice?.formatted?.withoutTax}
                  </span>
                )
              )}
            </span>
            <span className="text-xs font-normal text-gray-400 ml-1">
              {featureToggle?.features?.enableMembership &&
                `${translate("label.membership.nonMemberPriceText")}`}
            </span>
            <span className="pl-1 font-light text-right text-gray-400 text-sm">
              {isIncludeVAT
                ? translate("label.orderSummary.incVATText")
                : translate("label.orderSummary.excVATText")}
            </span>
          </div>
          </div>
        ) : (
          <div className="font-semibold text-green">
            {translate("label.orderSummary.freeText")}
          </div>
        )}
      </div>
    </>
  );
};

export default Prices;
