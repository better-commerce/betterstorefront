import { useTranslation } from '@commerce/utils/use-translation'
import { DATE_FORMAT } from '@new-components/utils/constants'
import { vatIncluded } from '@framework/utils/app-util'
import { priceFormat } from '@framework/utils/parse-util'
import React from 'react'

const OrderSummary = ({ details, subTotalAmount, openOrderHelpModal }: any) => {
  const translate = useTranslation()
  const isIncludeVAT = vatIncluded()
  return (
    <>
      <div className="flex flex-col">
      <hr className="my-6 border-slate-200 dark:border-slate-700"></hr>
      </div>
      <div className="w-full py-6">
        <div className="w-full">
          {/* Item Total INFO Start */}
          <div className="flex flex-col">
            <div className="flex flex-col mb-4">
              <h3 className="text-xl font-semibold text-black">{translate('label.orderSummary.paymentDetailsBtnText')}</h3>
              <p className="text-[12px] font-light text-black">
                {translate('label.orderSummary.priceTaxInclusiveText')} </p>
            </div>
            <div className="flex justify-between py-1 mb-2 text-black font-small">
              <p className="font-medium text-12 text-secondary-full-opacity">
                {translate('label.orderSummary.bagTotalText')} </p>
              <p className="font-medium text-12 text-secondary-full-opacity">
                {isIncludeVAT
                  ? priceFormat(
                      details?.subTotal?.raw?.withTax,
                      undefined,
                      details?.subTotal?.currencySymbol
                    )
                  : priceFormat(
                      details?.subTotal?.raw?.withoutTax,
                      undefined,
                      details?.subTotal?.currencySymbol
                    )}
              </p>
            </div>
            {details?.discount?.raw?.withTax > 0 && (
              <>
                <div className="flex justify-between py-1 mb-2 text-black font-small">
                  <p className="font-medium text-12 text-secondary-full-opacity">
                    {translate('label.orderSummary.bagDiscountText')} </p>
                  <p className="font-medium text-12 text-green">
                    {isIncludeVAT
                      ? priceFormat(
                          details?.discount?.raw?.withTax,
                          undefined,
                          details?.discount?.currencySymbol
                        )
                      : priceFormat(
                          details?.discount?.raw?.withoutTax,
                          undefined,
                          details?.discount?.currencySymbol
                        )}
                  </p>
                </div>
              </>
            )}
            <div className="flex justify-between py-1 mb-2 text-black font-small">
              <p className="font-medium text-12 text-secondary-full-opacity">
                {translate('label.orderSummary.subTotalText')} </p>
              <p className="font-medium text-12 text-secondary-full-opacity">
                {priceFormat(
                  subTotalAmount,
                  undefined,
                  details?.subTotal?.currencySymbol
                )}
              </p>
            </div>
            <div className="flex justify-between py-1 mb-2 text-black font-small">
              <p className="font-medium text-12 text-secondary-full-opacity">
                {translate('label.orderSummary.shippingChargesText')} {/* <span className="inline-block ml-1 leading-none align-middle"><i className="sprite-icon sprite-info"></i></span> */}
              </p>
              {details?.shippingCharge?.raw?.withTax > 0 ? (
                <>
                  <p className="font-medium text-12 text-secondary-full-opacity">
                    {isIncludeVAT
                      ? priceFormat(
                          details?.shippingCharge?.raw?.withTax,
                          undefined,
                          details?.shippingCharge?.currencySymbol
                        )
                      : priceFormat(
                          details?.shippingCharge?.raw?.withoutTax,
                          undefined,
                          details?.shippingCharge?.currencySymbol
                        )}
                  </p>
                </>
              ) : (
                <>
                  <p className="font-medium text-12 text-green">Free</p>
                </>
              )}
            </div>
            {details?.paymentServiceCharge?.raw?.withTax > 0 && (
              <div className="flex justify-between py-1 mb-2 text-black font-small">
                <p className="font-normal text-12 text-secondary-full-opacity">
                  {translate('label.orderSummary.additionalChargesText')} </p>
                <p className="font-medium text-12 text-secondary-full-opacity">
                  {priceFormat(
                    details?.paymentServiceCharge?.raw?.withTax,
                    undefined,
                    details?.paymentServiceCharge?.currencySymbol
                  )}
                </p>
              </div>
            )}
            <div className="flex justify-between py-1 mb-2 text-black font-small">
              <p className="font-medium text-12 text-secondary-full-opacity">
                {translate('label.orderSummary.taxText')} </p>
              <p className="font-medium text-12 text-secondary-full-opacity">
                {priceFormat(
                  details?.grandTotal?.raw?.tax,
                  undefined,
                  details?.grandTotal?.currencySymbol
                )}
              </p>
            </div>
            <div className="flex justify-between py-4 mt-4 text-black border-t border-gray-200 border-dashed font-small">
              <p className="font-semibold text-16 text-secondary-full-opacity">
                {translate('label.orderSummary.youPayText')} </p>
              <p className="font-semibold text-16 text-secondary-full-opacity">
                {priceFormat(
                  details?.grandTotal?.raw?.withTax,
                  undefined,
                  details?.grandTotal?.currencySymbol
                )}
              </p>
            </div>
          </div>
          {/* Item Total INFO END */}
          <div className="w-full my-3">
            <button
              type="button"
              onClick={() => openOrderHelpModal(details)}
              className="nc-Button relative h-auto inline-flex items-center justify-center rounded-full transition-colors text-sm sm:text-base font-medium py-3 px-4 sm:py-3.5 sm:px-6  ttnc-ButtonPrimary disabled:bg-opacity-90 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 !text-slate-50 dark:text-slate-800 shadow-xl  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-6000 dark:focus:ring-offset-0"
            >
              {translate('label.orderDetails.needHelpWithOrderBtnText')} </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default OrderSummary
