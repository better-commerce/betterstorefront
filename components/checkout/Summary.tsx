import PromotionInput from '@components/cart/PromotionInput'
import { EmptyString } from '@components/utils/constants'
import { GENERAL_SHIPPING } from '@components/utils/textVariables'
import { vatIncluded } from '@framework/utils/app-util'

const Summary = ({
  basket,
  groupedPromotions,
  deviceInfo,
  basketPromos,
  getBasketPromos,
}: any) => {
  const isIncludeVAT = vatIncluded()
  return (
    <>
      <div className="w-full px-4 sm:px-0">
        <div className="mt-4">
          <PromotionInput
            deviceInfo={deviceInfo}
            basketPromos={basketPromos}
            items={basket}
            getBasketPromoses={getBasketPromos}
          />
        </div>
        <dl className="space-y-2 sm:space-y-2">
          <div
            className={
              basket?.deliveryPlans?.length > 0
                ? 'border-b border-gray-200'
                : ''
            }
          >
            {groupedPromotions?.autoAppliedPromos?.length > 0 && (
              <div className="flex items-end justify-between pt-2 mb-2 sm:pt-1">
                <dt className="flex flex-col items-start text-sm text-black">
                  <span className="font-14">Discount</span>
                  {groupedPromotions?.autoAppliedPromos?.map(
                    (promo: any, idx: number) => (
                      <span key={idx} className="block mt-1 font-14">
                        {promo?.name}
                      </span>
                    )
                  )}
                </dt>
                {groupedPromotions?.autoAppliedPromos?.map(
                  (promo: any, idx: number) =>
                    promo?.discountAmt?.raw?.withTax > 0 && (
                      <dd key={idx} className="block text-black font-18">
                        -
                        {isIncludeVAT
                          ? promo?.discountAmt?.formatted?.withTax
                          : promo?.discountAmt?.formatted?.withoutTax}
                      </dd>
                    )
                )}
              </div>
            )}

            {groupedPromotions?.appliedPromos?.length > 0 && (
              <div className="flex items-end justify-between pt-2 mb-2 sm:pt-1">
                <dt className="flex flex-col items-start text-sm text-black">
                  <span className="font-14">Promo code</span>
                  {groupedPromotions?.appliedPromos?.map(
                    (promo: any, idx: number) => (
                      <span key={idx} className="block mt-1 font-18">
                        {promo?.promoCode}
                      </span>
                    )
                  )}
                </dt>
                {groupedPromotions?.appliedPromos?.map(
                  (promo: any, idx: number) => (
                    <dd key={idx} className="block text-black font-18">
                      -
                      {isIncludeVAT
                        ? promo?.discountAmt?.formatted?.withTax
                        : promo?.discountAmt?.formatted?.withoutTax}
                    </dd>
                  )
                )}
              </div>
            )}
          </div>
          <div className="flex items-center justify-between pt-2 sm:pt-1">
            <dt className="flex items-center text-black font-14">
              <span>Subtotal (ex. VAT)</span>
            </dt>
            <dd className="font-semibold text-black text-md">
              {basket?.subTotal?.formatted?.withoutTax}
            </dd>
          </div>
          <div className="flex items-center justify-between pt-2 sm:pt-1">
            <dt className="flex items-center text-black font-14">
              <span>Total VAT</span>
            </dt>
            <dd className="font-semibold text-black text-md">
              {basket?.grandTotal?.formatted?.tax}
            </dd>
          </div>

          {basket?.deliveryPlans?.length > 0 && (
            <div className="flex items-center justify-between pt-2 sm:pt-1">
              <dt className="flex items-center text-black font-14">
                <span>{GENERAL_SHIPPING}</span>
              </dt>
              <dd className="font-semibold text-black text-md">
                {isIncludeVAT
                  ? basket?.shippingCharge?.raw?.withTax == 0
                    ? 'FREE'
                    : basket?.shippingCharge?.formatted?.withTax || EmptyString
                  : basket?.shippingCharge?.raw?.withoutTax == 0
                  ? 'FREE'
                  : basket?.shippingCharge?.formatted?.withoutTax ||
                    EmptyString}
              </dd>
            </div>
          )}

          <div
            className={`flex items-center justify-between py-2 my-3 text-gray-900 border-t border-gray-300`}
          >
            <dt className="font-bold text-black font-18">Total</dt>
            <dd className="font-bold text-black font-18">
              {basket?.grandTotal?.formatted?.withTax}
            </dd>
          </div>
        </dl>
      </div>
    </>
  )
}

export default Summary
