import { DATE_FORMAT } from '@components/utils/constants'
import { CURRENCY_SYMBOL_POUND } from '@components/utils/textVariables'
import { vatIncluded } from '@framework/utils/app-util'
import { priceFormat } from '@framework/utils/parse-util'
import moment from 'moment'
import React from 'react'

const OrderSummary = ({ details, subTotalAmount, openOrderHelpModal }: any) => {
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
              <h3 className="text-xl font-bold text-black">Payment Details</h3>
              <p className="text-[12px] font-light text-black">
                Prices are inclusive of all taxes
              </p>
            </div>
            <div className="flex justify-between py-1 mb-2 text-black font-small">
              <p className="font-medium text-12 text-secondary-full-opacity">
                Bag Total
              </p>
              <p className="font-medium text-12 text-secondary-full-opacity">
                {isIncludeVAT
                  ? priceFormat(details?.order.subTotal?.raw?.withTax)
                  : priceFormat(details?.order.subTotal?.raw?.withoutTax)}
              </p>
            </div>
            {details?.order.discount?.raw?.withTax > 0 ? (
              <>
                <div className="flex justify-between py-1 mb-2 text-black font-small">
                  <p className="font-medium text-12 text-secondary-full-opacity">
                    Bag Discount
                  </p>
                  <p className="font-medium text-12 text-green">
                    {isIncludeVAT
                      ? priceFormat(details?.order.discount?.raw?.withTax)
                      : priceFormat(details?.order.discount?.raw?.withoutTax)}
                  </p>
                </div>
              </>
            ) : null}
            <div className="flex justify-between py-1 mb-2 text-black font-small">
              <p className="font-medium text-12 text-secondary-full-opacity">
                Subtotal
              </p>
              <p className="font-medium text-12 text-secondary-full-opacity">
                {priceFormat(subTotalAmount)}
              </p>
            </div>
            <div className="flex justify-between py-1 mb-2 text-black font-small">
              <p className="font-medium text-12 text-secondary-full-opacity">
                Shipping charges
                {/* <span className="inline-block ml-1 leading-none align-middle"><i className="sprite-icon sprite-info"></i></span> */}
              </p>
              {details?.order.shippingCharge?.raw?.withTax > 0 ? (
                <>
                  <p className="font-medium text-12 text-secondary-full-opacity">
                    {isIncludeVAT
                      ? priceFormat(details?.order.shippingCharge?.raw?.withTax)
                      : priceFormat(
                          details?.order.shippingCharge?.raw?.withoutTax
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
                  Additional charges
                </p>
                <p className="font-medium text-12 text-secondary-full-opacity">
                  {priceFormat(
                    details?.order.paymentServiceCharge?.raw?.withTax
                  )}
                </p>
              </div>
            )}
            <div className="flex justify-between py-1 mb-2 text-black font-small">
              <p className="font-medium text-12 text-secondary-full-opacity">
                Tax
              </p>
              <p className="font-medium text-12 text-secondary-full-opacity">
                {priceFormat(details?.order.grandTotal?.raw?.tax)}
              </p>
            </div>
            <div className="flex justify-between py-4 mt-4 text-black border-t border-gray-200 border-dashed font-small">
              <p className="font-semibold text-16 text-secondary-full-opacity">
                You pay
              </p>
              <p className="font-semibold text-16 text-secondary-full-opacity">
                {priceFormat(details?.order.grandTotal?.raw?.withTax)}
              </p>
            </div>
          </div>
          {/* Item Total INFO END */}
          <div className="w-full my-3">
            <button
              type="button"
              onClick={() => openOrderHelpModal(details?.order)}
              className="block w-full px-4 py-3 mb-3 font-bold text-center text-white bg-black hover:opacity-90 btn-basic-property rounde-sm"
            >
              Need Help with Your Order?
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default OrderSummary
