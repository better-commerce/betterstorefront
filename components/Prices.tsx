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
  readonly cashbackAmount: any;
}

const Prices: FC<PricesProps> = ({ className = "w-full price-div", price, listPrice, contentClass = "py-1 px-2 md:py-1.5 md:px-2.5 text-sm font-medium", featureToggle, defaultDisplayMembership, cashbackAmount = "" }) => {
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

  const saving = isIncludeVAT ? listPrice?.raw?.withTax - price?.raw?.withTax : listPrice?.raw?.withoutTax - price?.raw?.withoutTax
  const cashback = cashbackAmount
  return (
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
      {featureToggle?.features?.enableForPCSite ? (
        price?.raw?.withTax != 0 ? (
          <div className="flex flex-col items-start justify-start gap-2 text-sm font-semibold text-gray-400 price">
            {cashback && <span className="bg-[#2D4D9C] text-xs w-full text-white px-2 py-1 rounded text-left font-semibold">{price?.currencySymbol}{price?.raw?.withTax ? cashback : 'N/A'} Cashback</span>}
            <span className="flex flex-col items-start w-full gap-1 min-h-[58px]">
              <span className="flex items-end gap-6 justify-start w-full pr-6">
                {(() => {
                  const rawPrice = isIncludeVAT ? price?.formatted?.withTax : price?.formatted?.withoutTax;
                  const match = rawPrice?.match(/^(\D*)([\d,]+)(\.\d+)?$/);
                  const symbol = match?.[1] || '';
                  const main = match?.[2] || ''; // keep commas here
                  const decimal = match?.[3]?.replace('.', '') || '';
                  return (
                    <span className="relative inline-flex items-start">
                      <span className="text-sm mr-0.5">{symbol}</span>
                      <span className="text-3xl font-semibold font-32">{main}</span>
                      {decimal && (<span className="text-xs absolute top-0 right-[-1.1rem]">{decimal}</span>)}
                    </span>
                  );
                })()}
                {isIncludeVAT ? (
                  listPrice?.raw?.withTax > 0 && listPrice?.raw?.withTax > price?.raw?.withTax && (
                    <span className="pl-1 font-normal text-gray-600 text-x-small">Was: {listPrice?.formatted?.withTax} </span>
                  )
                ) : (
                  listPrice?.raw?.withoutTax > 0 && listPrice?.raw?.withoutTax > price?.raw?.withoutTax && (
                    <span className="pl-1 font-normal text-gray-600 text-x-small">Was: {listPrice?.formatted?.withoutTax} </span>
                  )
                )}
              </span>
              {saving > 0 && <span className="px-2 py-0.5 text-xs font-semibold flex-1 text-white bg-[#009951] rounded save-price-sec">Save {price?.currencySymbol}{saving.toFixed(2)}</span>}
            </span>
            {cashback && <span className="text-sm w-full font-medium text-black py-0.5 text-left">
              Effective price{' '}
              <span className="font-semibold text-red-500">{price?.currencySymbol}{(price.raw.withTax - cashback).toFixed(2)}</span>
              {' '}after{' '}
              <span> {price?.currencySymbol}{cashback}</span>
              {' '}cashback and voucher.
            </span>}
            <span className="text-xs font-normal text-gray-400"> {featureToggle?.features?.enableMembership && `${translate('label.membership.nonMemberPriceText')}`} </span>
            {!featureToggle?.features?.enableForPCSite && <span className="pl-2 font-light text-right text-gray-400 ex-vat-text font-10"> {isIncludeVAT ? translate('label.orderSummary.incVATText') : translate('label.orderSummary.excVATText')} </span>}
          </div>
        ) : (
          <div className="font-semibold text-green"> {translate('label.orderSummary.freeText')} </div>
        )
      ) : (
        price?.raw?.withTax != 0 ? (
          <div className="flex items-center text-sm font-semibold text-gray-400 price sm:px-2">
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
        )
      )}
    </div>
  );
};

export default Prices;
