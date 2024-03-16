import { DATE_FORMAT } from '@components/utils/constants'
import { vatIncluded } from '@framework/utils/app-util'
import { priceFormat } from '@framework/utils/parse-util'
import moment from 'moment'
import React from 'react'
import { useTranslation } from '@commerce/utils/use-translation'

const OrderSummary = ({ details, subTotalAmount, openOrderHelpModal }: any) => {
  const translate = useTranslation()
  const isIncludeVAT = vatIncluded()
  return (
    <>
      <div className="flex flex-col">
        <div className="m-0 section-devider"></div>
      </div>
      <div className="w-full py-6">
        <div className="o-detail-continer">
          {/* Item Total INFO Start */}
          <div className="flex flex-col">
            <div className="flex flex-col mb-4">
              <h3 className="text-xl font-bold text-black">{translate('label.orderSummary.paymentDetailsBtnText')}</h3>
              <p className="text-[12px] font-light text-black">
                {translate('label.orderSummary.priceTaxInclusiveText')} </p>
            </div>
            <div className="flex justify-between py-1 mb-2 text-black font-small">
              <p className="font-medium text-12 text-secondary-full-opacity">
                {translate('label.orderSummary.bagTotalText')} </p>
              <p className="font-medium text-12 text-secondary-full-opacity">
                {isIncludeVAT
                  ? priceFormat(
                      details?.order.subTotal?.raw?.withTax,
                      undefined,
                      details?.order.subTotal?.currencySymbol
                    )
                  : priceFormat(
                      details?.order.subTotal?.raw?.withoutTax,
                      undefined,
                      details?.order.subTotal?.currencySymbol
                    )}
              </p>
            </div>
            {details?.order.discount?.raw?.withTax > 0 && (
              <>
                <div className="flex justify-between py-1 mb-2 text-black font-small">
                  <p className="font-medium text-12 text-secondary-full-opacity">
                    {translate('label.orderSummary.bagDiscountText')} </p>
                  <p className="font-medium text-12 text-green">
                    {isIncludeVAT
                      ? priceFormat(
                          details?.order.discount?.raw?.withTax,
                          undefined,
                          details?.order.discount?.currencySymbol
                        )
                      : priceFormat(
                          details?.order.discount?.raw?.withoutTax,
                          undefined,
                          details?.order.discount?.currencySymbol
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
                  details?.order.subTotal?.currencySymbol
                )}
              </p>
            </div>
            <div className="flex justify-between py-1 mb-2 text-black font-small">
              <p className="font-medium text-12 text-secondary-full-opacity">
                {translate('label.orderSummary.shippingChargesText')} {/* <span className="inline-block ml-1 leading-none align-middle"><i className="sprite-icon sprite-info"></i></span> */}
              </p>
              {details?.order.shippingCharge?.raw?.withTax > 0 ? (
                <>
                  <p className="font-medium text-12 text-secondary-full-opacity">
                    {isIncludeVAT
                      ? priceFormat(
                          details?.order.shippingCharge?.raw?.withTax,
                          undefined,
                          details?.order.shippingCharge?.currencySymbol
                        )
                      : priceFormat(
                          details?.order.shippingCharge?.raw?.withoutTax,
                          undefined,
                          details?.order.shippingCharge?.currencySymbol
                        )}
                  </p>
                </>
              ) : (
                <>
                  <p className="font-medium text-12 text-green">Free</p>
                </>
              )}
            </div>
            {details?.order.paymentServiceCharge?.raw?.withTax > 0 && (
              <div className="flex justify-between py-1 mb-2 text-black font-small">
                <p className="font-normal text-12 text-secondary-full-opacity">
                  {translate('label.orderSummary.additionalChargesText')} </p>
                <p className="font-medium text-12 text-secondary-full-opacity">
                  {priceFormat(
                    details?.order.paymentServiceCharge?.raw?.withTax,
                    undefined,
                    details?.order.paymentServiceCharge?.currencySymbol
                  )}
                </p>
              </div>
            )}
            <div className="flex justify-between py-1 mb-2 text-black font-small">
              <p className="font-medium text-12 text-secondary-full-opacity">
                {translate('label.orderSummary.taxText')} </p>
              <p className="font-medium text-12 text-secondary-full-opacity">
                {priceFormat(
                  details?.order.grandTotal?.raw?.tax,
                  undefined,
                  details?.order.grandTotal?.currencySymbol
                )}
              </p>
            </div>
            <div className="flex justify-between py-4 mt-4 text-black border-t border-gray-200 border-dashed font-small">
              <p className="font-semibold text-16 text-secondary-full-opacity">
                {translate('label.orderSummary.youPayText')} </p>
              <p className="font-semibold text-16 text-secondary-full-opacity">
                {priceFormat(
                  details?.order.grandTotal?.raw?.withTax,
                  undefined,
                  details?.order.grandTotal?.currencySymbol
                )}
              </p>
            </div>
          </div>
          {/* Item Total INFO END */}
          <div className="w-full my-3">
            <button
              type="button"
              onClick={() => openOrderHelpModal(details?.order)}
              className="block w-full mb-3 btn-basic-property btn btn-primary"
            >
              {translate('label.orderDetails.needHelpWithOrderBtnText')} </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default OrderSummary
