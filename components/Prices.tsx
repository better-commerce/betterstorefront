import { useTranslation } from "@commerce/utils/use-translation";
import { vatIncluded } from "@framework/utils/app-util";
import { roundToDecimalPlaces } from "@framework/utils/parse-util";
import React, { FC, useMemo, useState } from "react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
export interface PricesProps {
  readonly className?: string;
  readonly price?: any;
  readonly listPrice?: any;
  readonly contentClass?: string;
  readonly featureToggle: any;
  readonly defaultDisplayMembership: any;
}

const Prices: FC<PricesProps> = ({ className = "w-full price-div", price, listPrice, contentClass = "py-1 px-2 md:py-1.5 md:px-2.5 text-sm font-medium", featureToggle, defaultDisplayMembership, }) => {
  const discountPerc = defaultDisplayMembership?.membershipPromoDiscountPerc || 0
  const isIncludeVAT = vatIncluded()
  const translate = useTranslation()

  const memberPriceWithTax = useMemo(() => {
    const discountedPrice = (price?.raw?.withTax * ((100.0 - discountPerc) * 1.0 / 100.0))
    return `${price?.currencySymbol}${roundToDecimalPlaces(discountedPrice)}`
  }, [price?.raw?.withTax])

  const memberPriceWithoutTax = useMemo(() => {
    const discountedPrice = (price?.raw?.withoutTax * ((100.0 - discountPerc) * 1.0 / 100.0))
    return `${price?.currencySymbol}${roundToDecimalPlaces(discountedPrice)}`
  }, [price?.raw?.withoutTax])

  return (
    <>
      <div className={`${className}`}>
        {featureToggle?.features?.enableMembership && (
          <div className="py-1 pl-2 mb-2 font-semibold text-black bg-yellow-100 rounded-md font-14">
            {isIncludeVAT ? memberPriceWithTax : memberPriceWithoutTax}<span className="text-xs font-normal text-gray-500">{` ${translate('label.membership.memberPriceText')}`}</span>
            <span className="pl-1 font-light text-right text-gray-900 font-10">
              {isIncludeVAT ? translate('label.orderSummary.incVATText') : translate('label.orderSummary.excVATText')}
              <a href="#" onClick={(ev: any) => {
                ev.preventDefault()
                ev.stopPropagation()
                window.dispatchEvent(new CustomEvent('MemberProductPriceInfoViewed', { detail: { defaultDisplayMembership, price, isIncludeVAT } }))
              }} className="inline-block -mt-1 align-middle"><InformationCircleIcon className="w-4 h-4 ml-1 text-gray-500" /></a>
            </span>
          </div>
        )}
        {price?.raw?.withTax != 0 ? (
          <div className="flex items-center text-sm font-semibold text-gray-400 price">
            <span className="">
              {isIncludeVAT ? price?.formatted?.withTax : price?.formatted?.withoutTax}
              {isIncludeVAT ? (listPrice?.raw?.withTax > 0 && listPrice?.raw?.withTax > price?.raw?.withTax && (
                <span className="px-1 text-sm font-normal text-gray-400 line-through list-price">{listPrice?.formatted?.withTax}</span>
              )) : (
                listPrice?.raw?.withoutTax > 0 && listPrice?.raw?.withoutTax > price?.raw?.withoutTax && (
                  <span className="px-1 text-xs font-normal text-gray-400 line-through list-price">{listPrice?.formatted?.withoutTax}</span>
                )
              )}
            </span>
            <span className="text-xs font-normal text-gray-400">{featureToggle?.features?.enableMembership && `${translate('label.membership.nonMemberPriceText')}`}</span>
            <span className="pl-1 font-light text-right text-gray-400 ex-vat-text font-10">{isIncludeVAT ? translate('label.orderSummary.incVATText') : translate('label.orderSummary.excVATText')}</span>
          </div>
        ) : (
          <div className="font-semibold text-green">{translate('label.orderSummary.freeText')}</div>
        )}
      </div>
    </>
  );
};

export default Prices;
