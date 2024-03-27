import { useTranslation } from "@commerce/utils/use-translation";
import { QuantityBreakRule } from "@components//utils/constants";
import { isIncludeVATInPriceDisplay, vatIncluded } from "@framework/utils/app-util";
import { roundToDecimalPlaces } from "@framework/utils/parse-util";

export default function QuantityBreak({ product, rules, selectedAttrData }: any) {
  const isIncludeVAT = vatIncluded()
  const translate = useTranslation()
  return (
    <div className='flex flex-col w-full'>
      <div className='items-center justify-center p-1 font-semibold text-center text-white uppercase bg-orange-600 font-12'>{translate('label.product.buyMoreAndSaveMoreText')}</div>
      <div className='flex font-semibold text-black bg-gray-300 border border-gray-200 font-12 justify-evenly'>
        <div className='w-1/3 p-1 text-center uppercase border-r border-gray-100'>{translate('label.product.qtyText')}</div>
        <div className='w-1/3 p-1 text-center uppercase border-r border-gray-100'>{translate('label.product.pricePerItemText')}</div>
        <div className='w-1/3 p-1 text-center uppercase'>{translate('label.product.savingText')}</div>
      </div>
      {rules?.map((rule: any, ruleIdx: number) => {
        let productPrice = isIncludeVATInPriceDisplay(isIncludeVAT, selectedAttrData) ? selectedAttrData?.price?.raw?.withTax : selectedAttrData?.price?.raw?.withoutTax
        let pricePerItem = rule?.priceValue;
        let savings: any = ''
        if (rule?.pricingMechanism == QuantityBreakRule.PERCENTAGE) {
          const price = productPrice * rule?.priceValue / 100;
          pricePerItem = productPrice - price
        } else {
          pricePerItem = rule?.priceValue;
          savings = productPrice - rule?.priceValue;
        }
        return (
          <div className='flex font-medium text-black border-b border-gray-300 border-x font-12 justify-evenly' key={`quantity-break-${ruleIdx}`}>
            <div className='w-1/3 p-1 text-center border-r border-gray-300 items-center'>{rule?.quantity}+ <span className="font-10">({rule?.displayLabel})</span></div>
            <div className='w-1/3 p-1 text-center font-semibold border-r border-gray-300'>{product?.price?.currencySymbol}{roundToDecimalPlaces(pricePerItem, 2)}</div>
            <div className='w-1/3 p-1 text-center'>{rule?.pricingMechanism == QuantityBreakRule.PERCENTAGE ? rule?.priceValue + '%' : product?.price?.currencySymbol + roundToDecimalPlaces(savings)}</div>
          </div>
        )
      })}
    </div>
  )
}
