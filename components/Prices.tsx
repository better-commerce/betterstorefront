import { useTranslation } from "@commerce/utils/use-translation";
import { vatIncluded } from "@framework/utils/app-util";
import { roundToDecimalPlaces } from "@framework/utils/parse-util";
import React, { FC, useMemo } from "react";
import { InformationCircleIcon } from "@heroicons/react/24/solid";
export interface PricesProps {
  readonly className?: string;
  readonly price?: any;
  readonly listPrice?: any;
  readonly contentClass?: string;
  readonly featureToggle: any;
  readonly defaultDisplayMembership: any;
}

const Prices: FC<PricesProps> = ({ className = "w-full", price, listPrice, contentClass = "py-1 px-2 md:py-1.5 md:px-2.5 text-sm font-medium", featureToggle, defaultDisplayMembership, }) => {
  const discountPerc = 20
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
          <div className="font-semibold font-14 text-black bg-orange-200 pt-1 pl-1 mb-2">
            {isIncludeVAT ? memberPriceWithTax : memberPriceWithoutTax}{' (Member Price)'}
            <span className="pl-1 font-light text-right text-gray-900 font-10">
              {isIncludeVAT ? translate('label.orderSummary.incVATText') : translate('label.orderSummary.excVATText')} 
              <a href="#" onClick={(ev: any) => { 
                ev.preventDefault()
                ev.stopPropagation()
              }} className="inline-block align-middle -mt-1"><InformationCircleIcon className="w-4 h-4 text-black"/></a>
            </span>
          </div>
        )}
        {price?.raw?.withTax != 0 ? (
          <div className="font-semibold font-12 text-gray-400">
            {isIncludeVAT ? price?.formatted?.withTax : price?.formatted?.withoutTax}
            {isIncludeVAT ? (listPrice?.raw?.withTax > 0 && listPrice?.raw?.withTax > price?.raw?.withTax && (
              <span className="px-1 font-normal text-gray-400 line-through font-12">{listPrice?.formatted?.withTax}</span>
            )
          ) : (
              listPrice?.raw?.withoutTax > 0 && listPrice?.raw?.withoutTax > price?.raw?.withoutTax && (
                <span className="px-1 text-xs font-normal text-gray-400 line-through">{listPrice?.formatted?.withoutTax}</span>
              )
          )}
          {featureToggle?.features?.enableMembership && ' (Non-Member Price)'}
          <span className="pl-1 font-light text-right text-gray-400 font-10">{isIncludeVAT ? translate('label.orderSummary.incVATText') : translate('label.orderSummary.excVATText')}</span>
          </div>
      ) : (
          <div className="font-semibold text-green">{translate('label.orderSummary.freeText')}</div>
      )}
      </div>
    </>
  );
};

export default Prices;
