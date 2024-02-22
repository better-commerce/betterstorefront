import Router, { useRouter } from 'next/router'
import useDevice from '@commerce/utils/use-device'
import { GifIcon } from '@heroicons/react/24/solid'
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
      {/* <div className="grid content-center justify-between grid-cols-12 gap-4 mb-1">
              <div className="flex mt-3 col-spn-1">
                <span className="sprite-icon-svg coupon-icon"></span>
              </div>
              {getBasketPromos(basketPromos).filter(
                (x: any) => x?.promoType != 22
              )?.length > 1 ? (
                <>
                  <div className="flex flex-col col-span-7">
                    <h3 className="font-semibold text-md dark:text-black">
                      {getBasketPromos(basketPromos.applicablePromotions)?.length > 0
                        ? `${
                            getBasketPromos(basketPromos).filter(
                              (x: any) => x?.promoType != 22
                            )?.length
                          }`
                        : 'No'}{' '}
                      Coupons Available
                    </h3>
                    <p className="text-xs font-normal text-gray-500">
                      You may apply mutliple codes
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-col col-span-7">
                    <h3 className="font-display text-md dark:text-black">
                      {getBasketPromos(basketPromos)?.length > 0
                        ? `${
                            getBasketPromos(basketPromos).filter(
                              (x: any) => x?.promoType != 22
                            )?.length
                          }`
                        : 'No'}{' '}
                      Coupon Available
                    </h3>
                    <p className="text-xs font-normal text-gray-500">
                      You may apply mutliple codes
                    </p>
                  </div>
                </>
              )}

              <div className="flex justify-end col-span-4 mt-3">
                {getBasketPromos(basketPromos)?.length > 0 ? (
                  <h3
                    className="text-sm text-black cursor-pointer font-display mob-font-small-screen"
                    onClick={() => viewCoupons(basketPromos, items)}
                  >
                    View Coupons
                  </h3>
                ) : (
                  <>
                    {(isMobile || isIPadorTablet) && (
                      <div className="flex justify-end col-span-4">
                        <h3
                          className="text-sm text-black cursor-pointer font-display mob-font-small-screen"
                          onClick={() => viewCoupons(basketPromos, items)}
                        >
                          Apply Coupons
                        </h3>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div> */}

      <div className="flex items-center justify-between mb-1">
        {/* {cartItems.promotionsApplied?.length === 0 ? ( */}
        <div className="flex items-center justify-start">
          <div className="flex flex-col col-span-7">
            <p className="flex items-center gap-1 font-semibold text-md dark:text-black">
              <GifIcon className="w-4 h-4 text-emerald-500" />
              {PromotionsCount > 0 ? `${PromotionsCount}` : 'No'}{' '}
              {PromotionsCount > 1 ? 'Coupons Available' : 'Coupon Available'}
            </p>
            <p className="text-xs font-normal text-gray-500">
              You may apply mutliple codes
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
              {promoTypeNot22?.length > 1 ? 'View Coupons' : 'View Coupon'}
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
                    Apply Coupons
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
