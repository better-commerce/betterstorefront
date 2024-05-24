import { useMemo } from 'react'

//
import { useTranslation } from "@commerce/utils/use-translation"
import { QuantityBreakRule } from "@components/utils/constants"
import { isIncludeVATInPriceDisplay, vatIncluded } from "@framework/utils/app-util"
import { roundToDecimalPlaces } from "@framework/utils/parse-util"

export default function QuantityBreak({ product, rules, selectedAttrData, defaultDisplayMembership }: any) {
  const isIncludeVAT = vatIncluded()
  const translate = useTranslation()
  
  const memberProductPrice = useMemo(() => {
    const discountPerc = defaultDisplayMembership?.membershipPromoDiscountPerc || 0
    let price = 0
    if (isIncludeVATInPriceDisplay(isIncludeVAT, selectedAttrData)) {
      price = roundToDecimalPlaces(selectedAttrData?.price?.raw?.withTax * ((100.0 - discountPerc) * 1.0 / 100.0))
    } else {
      price = roundToDecimalPlaces(selectedAttrData?.price?.raw?.withoutTax * ((100.0 - discountPerc) * 1.0 / 100.0))
    }
    return +price
  }, [defaultDisplayMembership, isIncludeVAT, selectedAttrData])

  const productPrice = useMemo(() => {
    if (isIncludeVATInPriceDisplay(isIncludeVAT, selectedAttrData)) {
      return selectedAttrData?.price?.raw?.withTax
    }
    return selectedAttrData?.price?.raw?.withoutTax
  }, [isIncludeVAT, selectedAttrData])

  const getPriceAndSavingsPerItem = useMemo(() => {
    return (rule: any) => {
      let pricePerItem = rule?.priceValue
      let memberPricePerItem = rule?.priceValue
      let savings: any = 0
      if (rule?.pricingMechanism == QuantityBreakRule.PERCENTAGE) {
        const price = productPrice * rule?.priceValue / 100
        pricePerItem = productPrice - price
        const memberPrice = memberProductPrice * rule?.priceValue / 100
        memberPricePerItem = memberProductPrice - memberPrice
      } else {
        pricePerItem = rule?.priceValue
        memberPricePerItem = rule?.priceValue
        savings = productPrice - rule?.priceValue
      }
      return { pricePerItem, memberPricePerItem, savings }
    }
  }, [productPrice, memberProductPrice])

  return (
    <div className='flex flex-col w-full'>
      <div className='items-center justify-center p-2 font-semibold text-center text-white uppercase bg-black rounded-t-2xl font-14'>{translate('label.product.buyMoreAndSaveMoreText')}</div>
      <div className='flex font-semibold text-black bg-gray-100 border border-gray-300 font-12 justify-evenly'>
        <div className='w-1/4 p-1 text-center uppercase border-r border-gray-300'>{translate('label.product.qtyText')}</div>
        <div className='w-1/4 p-1 text-center uppercase border-r border-gray-300'>{translate('label.product.pricePerItemText')}</div>
        <div className='p-1 text-center uppercase bg-yellow-100 border-r border-gray-300 w-52'>Member {translate('label.product.pricePerItemText')}</div>
        <div className='w-16 p-1 text-center uppercase'>{translate('label.product.savingText')}</div>
      </div>
      {rules?.map((rule: any, ruleIdx: number) => {
        const { pricePerItem, memberPricePerItem, savings } = getPriceAndSavingsPerItem(rule)
        return (
          <div className='flex font-medium text-black border-b border-gray-300 border-x font-12 justify-evenly' key={`quantity-break-${ruleIdx}`}>
            <div className='items-center w-1/4 p-1 text-center border-r border-gray-300'>{rule?.quantity}+ <span className="font-10">({rule?.displayLabel})</span></div>
            <div className='w-1/4 p-1 font-semibold text-center border-r border-gray-300'>{product?.price?.currencySymbol}{roundToDecimalPlaces(pricePerItem)}</div>
            <div className='p-1 font-semibold text-center bg-yellow-100 border-r border-gray-300 w-52'>{product?.price?.currencySymbol}{roundToDecimalPlaces(memberPricePerItem)}</div>
            <div className='w-16 p-1 text-center'>{rule?.pricingMechanism == QuantityBreakRule.PERCENTAGE ? rule?.priceValue + '%' : product?.price?.currencySymbol + roundToDecimalPlaces(savings)}</div>
          </div>
        )
      })}
    </div>
  )
}
