import { useTranslation } from '@commerce/utils/use-translation'
import { vatIncluded } from '@framework/utils/app-util'
import { priceFormat } from '@framework/utils/parse-util'
import React from 'react'

const OrderSummary = ({ details, subTotalAmount, openOrderHelpModal,handleReOrder}: any) => {
  const translate = useTranslation()
  const isIncludeVAT = vatIncluded()
  return (
    <>
      <div className="flex flex-col w-full py-2">
        <div className="flex flex-col mb-4">
          <h3 className="text-xl font-semibold text-black">{translate('label.orderSummary.paymentDetailsBtnText')}</h3>
          <p className="text-[12px] font-light text-black">
            {translate('label.orderSummary.priceTaxInclusiveText')} </p>
        </div>
        {details?.discount?.raw?.withTax > 0 && (
          <>
            <div className="flex justify-between py-1 mb-2 text-black font-small">
              <p className="font-medium text-12 text-secondary-full-opacity"> {translate('label.orderSummary.bagDiscountText')} </p>
              <p className="font-medium text-12 text-green">
                {isIncludeVAT ? details?.discount?.formatted?.withTax : details?.discount?.formatted?.withoutTax}
              </p>
            </div>
          </>
        )}
        <div className="flex justify-between py-1 mb-2 text-black font-small">
          <p className="font-medium text-12 text-secondary-full-opacity"> {translate('label.orderSummary.subTotalText')} </p>
          <p className="font-medium text-12 text-secondary-full-opacity">
            {priceFormat(subTotalAmount, undefined, details?.subTotal?.currencySymbol)}
          </p>
        </div>
        <div className="flex justify-between py-1 mb-2 text-black font-small">
          <p className="font-medium text-12 text-secondary-full-opacity">
            {translate('label.orderSummary.shippingChargesText')} {/* <span className="inline-block ml-1 leading-none align-middle"><i className="sprite-icon sprite-info"></i></span> */}
          </p>
          {details?.shippingCharge?.raw?.withTax > 0 ? (
            <p className="font-medium text-12 text-secondary-full-opacity">
              {isIncludeVAT ? priceFormat(details?.shippingCharge?.raw?.withTax, undefined, details?.shippingCharge?.currencySymbol) : priceFormat(details?.shippingCharge?.raw?.withoutTax, undefined, details?.shippingCharge?.currencySymbol)}
            </p>
          ) : (
            <p className="font-medium text-12 text-green">{translate('label.orderSummary.freeText')}</p>
          )}
        </div>
        {details?.paymentServiceCharge?.raw?.withTax > 0 && (
          <div className="flex justify-between py-1 mb-2 text-black font-small">
            <p className="font-normal text-12 text-secondary-full-opacity"> {translate('label.orderSummary.additionalChargesText')} </p>
            <p className="font-medium text-12 text-secondary-full-opacity">
              {priceFormat(details?.paymentServiceCharge?.raw?.withTax, undefined, details?.paymentServiceCharge?.currencySymbol)}
            </p>
          </div>
        )}
        {details?.grandTotal?.raw?.tax > 0 &&
          <div className="flex justify-between py-1 mb-2 text-black font-small">
            <p className="font-medium text-12 text-secondary-full-opacity"> {translate('label.orderSummary.taxText')} </p>
            <p className="font-medium text-12 text-secondary-full-opacity">
              {priceFormat(details?.grandTotal?.raw?.tax, undefined, details?.grandTotal?.currencySymbol)}
            </p>
          </div>
        }
        <div className="flex justify-between py-4 mt-4 text-black border-t border-gray-200 border-dashed font-small">
          <p className="font-semibold text-16 text-secondary-full-opacity"> {translate('label.orderSummary.youPayText')} </p>
          <p className="font-semibold text-16 text-secondary-full-opacity"> {priceFormat(details?.grandTotal?.raw?.withTax, undefined, details?.grandTotal?.currencySymbol)} </p>
        </div>
      </div>
      {/* Item Total INFO END */}
      <div className="flex justify-end gap-4 mx-auto my-3">  
        <button type="button" onClick={() => openOrderHelpModal(details)} className="nc-Button relative h-auto inline-flex items-center justify-center !rounded-full transition-colors text-sm sm:text-base font-medium py-3 px-4 sm:py-2.5 sm:px-6  ttnc-ButtonPrimary disabled:bg-opacity-90 bg-slate-900 dark:bg-slate-900 hover:bg-slate-800 !text-slate-50 dark:text-slate-800 shadow-xl  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-6000 dark:focus:ring-offset-0">
          {translate('label.orderDetails.needHelpWithOrderBtnText')}
        </button>
        <button type="button" onClick={() => handleReOrder()} className="nc-Button relative h-auto inline-flex items-center justify-center rounded-full transition-colors text-sm sm:text-base font-medium py-3 px-4 sm:py-2.5 sm:px-6 disabled:bg-opacity-90 bg-transparent dark:bg-slate-900 hover:transparent !bg-white !text-black border border-gray-800 dark:text-slate-800 shadow-xl  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-6000 dark:focus:ring-offset-0">
            {translate('label.orderDetails.reOrderText')}
        </button>
      </div>
    </>
  )
}

export default OrderSummary
