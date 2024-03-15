import Router, { useRouter } from 'next/router'
import useDevice from '@commerce/utils/use-device'
import { GifIcon } from '@heroicons/react/24/solid'
import { translate } from '@components/services/localization'
interface IPromotionInputProps {
  readonly PromotionsCount?: any
  readonly items?: any
  readonly promoTypeNot22?: any
  readonly viewCoupons?: any
  readonly basketPromos?: any
}
const BasketPromo = (props: IPromotionInputProps) => {
  const { PromotionsCount, items, promoTypeNot22, viewCoupons, basketPromos } =
    props
  const { isMobile, isIPadorTablet } = useDevice()
  const { asPath } = useRouter()
  return (
    <>
      <div className="flex items-center justify-between mb-1">
        {/* {cartItems.promotionsApplied?.length === 0 ? ( */}
        <div className="flex items-center justify-start">
          <div className="flex flex-col col-span-7">
            <p className="flex items-center gap-1 font-semibold text-md dark:text-black">
              <GifIcon className="w-4 h-4 text-emerald-500" />
              {PromotionsCount > 0 ? `${PromotionsCount}` : translate('common.label.noText')}{' '}
              {PromotionsCount > 1 ? translate('label.basket.couponsAvailableText') : translate('label.basket.couponAvailableText')}
            </p>
            <p className="text-xs font-normal text-gray-500">
              {translate('label.cart.multipleCodesApplyText')}
            </p>
          </div>
        </div>
        {/* ) : ( */}

        {/* )} */}
        <div className="flex items-center justify-end">
          {PromotionsCount > 0 ? (
            <h3
              className="text-sm font-semibold text-orange-500 cursor-pointer mob-font-small-screen"
              onClick={() => {
                viewCoupons(basketPromos?.applicablePromotions, items)
              }}
            >
              {promoTypeNot22?.length > 1 ? translate('label.basket.viewCouponsText') : translate('label.basket.viewCouponText')}
            </h3>
          ) : (
            <>
              {(isMobile || isIPadorTablet) && (
                <div className="flex justify-end col-span-4">
                  <h3
                    className="text-sm font-semibold text-orange-500 truncate cursor-pointer mob-font-small-screen"
                    onClick={() => {
                      viewCoupons(basketPromos?.applicablePromotions, items)
                      Router?.push(
                        { pathname: `${asPath}#couponopen` },
                        `${asPath}#couponopen`,
                        { shallow: true, scroll: false }
                      )
                    }}
                  >
                    {translate('label.basket.applyCouponsText')}
                  </h3>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}
export default BasketPromo
