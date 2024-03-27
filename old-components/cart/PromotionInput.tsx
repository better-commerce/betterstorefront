// Base Imports
import { useEffect, useState } from 'react'

// Package Imports
import axios from 'axios'
import Router, { useRouter } from 'next/router'

// Component Imports
import SwiperCore, { Navigation } from 'swiper'
import { useUI } from '@new-components/ui/context'

// Other Imports
import 'swiper/css'
import 'swiper/css/navigation'
import { NEXT_APPLY_PROMOTION, SHOW_APPLY_COUPON_SECTION } from '@new-components/utils/constants'
import { TrashIcon } from '@heroicons/react/24/outline'
import useDevice from '@commerce/utils/use-device'
import Coupon from './Coupon'
import BasketPromo from './BasketPromo'
import { useTranslation } from '@commerce/utils/use-translation'

declare const window: any
SwiperCore.use([Navigation])

interface IPromotionInputProps {
  readonly basketPromos: any | undefined
  // readonly paymentOffers: any | undefined
  readonly items: any
  readonly getBasketPromoses?: any
  readonly deviceInfo?: any
}

const PromotionInput = (props: IPromotionInputProps) => {
  const translate = useTranslation()
  const { isMobile, isIPadorTablet } = useDevice()
  const {
    basketPromos,
    // paymentOffers,
    items,
    getBasketPromoses = () => {},
  } = props
  const [error, setError] = useState(false)
  const { basketId, setCartItems, cartItems } = useUI()
  const [isShowCoupon, setShowCoupon] = useState(false)
  const [isCouponApplied, setCouponApplied] = useState(false)
  const [appliedBasketPromo, setAppliedBasketPromo] = useState<any>()
  const [multiPromo, setMultipromo] = useState<any[]>([])
  const { asPath } = useRouter()
  const [value, setValue] = useState('')
  const handleChange = (e: any) => {
    setValue(e.target.value)
  }

  const handleCloseCoupon = (e: any) => {
    const newUrl = asPath?.replaceAll('#couponopen', '')
    const isCouponShouldOpen = asPath?.includes('#couponopen')
    Router.replace(newUrl)
    if (isShowCoupon && isCouponShouldOpen) {
      Router.back()
    }
    // Router?.push({ pathname: newUrl}, newUrl,{ shallow: true, scroll: false })
    setShowCoupon(e)
  }

  useEffect(() => {
    const isCouponShouldOpen = asPath?.includes('#couponopen')
    if (isShowCoupon || isCouponShouldOpen) {
      if (isCouponShouldOpen) {
        viewCoupons(basketPromos?.applicablePromotions, items)
      } else {
        handleCloseCoupon(false)
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asPath])

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(false)
      }, 2000)
    }
  }, [error])

  const viewCoupons = (promo: any, items: any) => {
    setShowCoupon(true)
  }

  const handleSubmit = async (
    method: string = 'apply',
    promoCode: string = value
  ) => {
    try {
      const { data }: any = await axios.post(NEXT_APPLY_PROMOTION, {
        basketId,
        promoCode,
        method,
      })
      if (data?.result) {
        //setError(data?.result?.isVaild);
        setCartItems(data?.result?.basket)
        setValue('')
      } else {
        setError(!data?.result?.isVaild)
        setValue('')
        setTimeout(() => {
          setError(false)
          setShowCoupon(false)
        }, 3000)
      }
      getBasketPromoses(basketId)

      return data?.result?.isVaild ?? false
    } catch (error) {
      setValue('')
      console.log(error)
    }
    return false
  }

  const handleSubmitInput = async (
    method: string = 'apply',
    promoCode: string = value
  ) => {
    try {
      const { data }: any = await axios.post(NEXT_APPLY_PROMOTION, {
        basketId,
        promoCode,
        method,
      })
      if (data?.result) {
        //setError(data?.result?.isVaild);
        setCartItems(data?.result?.basket)
        setValue('')
      } else {
        setError(!data?.result?.isVaild)
        setValue('')
        setTimeout(() => {
          setError(false)
        }, 3000)
      }
      getBasketPromoses(basketId)

      return data?.result?.isVaild ?? false
    } catch (error) {
      console.log(error)
    }
    return false
  }

  const getBasketPromos = (promos: Array<any> | undefined) => {
    if (promos) {
      return promos
    }
    return []
  }

  const applyCouponInput = async (ev: any, promo: any) => {
    const applyPromoResult = await handleSubmitInput('apply', promo)

    if (applyPromoResult) {
      setAppliedBasketPromo(promo)
      setShowCoupon(false)
      setCouponApplied(true)
    }
  }

  const promoTypeNot22 = basketPromos?.availablePromotions?.filter(
    (x: any) => x?.promoType != 22
  )

  const PromotionsCount =
    basketPromos?.applicablePromotions?.length +
    basketPromos?.availablePromotions?.length
  return (
    <>
      <div
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit('apply')
        }}
        className="grid content-center w-full px-0 sm:px-0"
      >
        {basketPromos && (
          <>
          <BasketPromo PromotionsCount={PromotionsCount} items={items} promoTypeNot22={promoTypeNot22} viewCoupons={viewCoupons} basketPromos={basketPromos}/>
          </>
        )}
      </div>

      <div className="mt-7 text-sm text-slate-500 dark:text-slate-400 divide-y divide-slate-200/70 dark:divide-slate-700/80">
        {cartItems.promotionsApplied?.length
          ? cartItems.promotionsApplied.map((promo: any, key: number) => {
              return (
                <div
                  className="pt-2 mt-2"
                  key={`promo-${key}`}
                >
                  <div
                    className="flex justify-between gap-4 pb-2 my-1"
                    key={key}
                  >
                    <div className="flex">
                      <h5 className="text-sm text-gray-600">
                        {' '}
                        {promo.promoCode}
                      </h5>
                    </div>
                    <div className="flex justify-end">
                      <h5 className="font-semibold text-black text-md">
                        {promo?.discountAmt?.raw?.withTax > 0 ? (
                          <div className="flex">
                            <span>
                              -{promo?.discountAmt?.formatted?.withTax}
                            </span>
                            <TrashIcon
                              className="h-5 max-w-xs ml-5 text-black cursor-pointer hover:text-gray-700"
                              onClick={() =>
                                handleSubmit(
                                  'remove',
                                  cartItems?.promotionsApplied[0]?.promoCode
                                )
                              }
                            />
                          </div>
                        ) : (
                          <span className='text-emerald-600'>{translate('label.basket.freeGiftAddedText')}</span>
                        )}
                        {!promo?.autoApply && (
                          <a href="javascript: void(0);">
                            <span
                              className="relative ml-2 sprite-icon cross-icon top-0.5"
                              onClick={() =>
                                handleSubmit('remove', promo.promoCode)
                              }
                            ></span>
                          </a>
                        )}
                      </h5>
                    </div>
                  </div>
                </div>
              )
            }): null }
      </div>

      {/* More Offer MSG */}
      <div className="flex flex-col gap-2 my-2">
        {basketPromos?.availablePromotions?.length > 0 &&
          basketPromos?.availablePromotions
            ?.filter((x: any) => !!x?.croMessage)
            ?.map((promo: any, crdx: number) => {
              return (
                <div
                  className="relative px-2 py-1 font-semibold border rounded border-emerald-500 m-offer-info bg-emerald-100 text-emerald-500 offer-m-sec text-secondary-full-opacity"
                  key={crdx}
                >
                  <span className="absolute leading-none top-img-15 -translate-y-2/4 left-2">
                    <img
                      className="w-auto"
                      src="/assets/icons/more-offer-icon.svg"
                      alt=""
                      width={15}
                      height={10}
                    />
                  </span>{' '}
                  {promo.croMessage}
                </div>
              )
            })}

        {basketPromos?.applicablePromotions?.length > 0 && (
          <>
            {basketPromos?.applicablePromotions
              ?.filter((x: any) => x?.promoType == 21 && !!x?.croMessage)
              ?.map((promo: any, crdx: number) => {
                return (
                  <div
                    className="relative pl-16 my-1 m-offer-info bg-sky-offer offer-m-sec text-secondary-full-opacity"
                    key={`promo-sec-${crdx}`}
                  >
                    <span className="absolute leading-none top-img-15 -translate-y-2/4 left-2">
                      <img
                        className="w-auto"
                        src="/assets/icons/more-offer-icon.svg"
                        alt=""
                        width={15}
                        height={10}
                      />
                    </span>{' '}
                    {promo.croMessage}
                  </div>
                )
              })}
          </>
        )}
      </div>
      {/* More Offer MSG */}

      {SHOW_APPLY_COUPON_SECTION && !(isMobile || isIPadorTablet) && (
        <div className="flex items-center w-full pt-0 mt-3">
          <div className="w-full">
            {/* <h3 className="text-lg text-gray-900 font-display">Use Coupon</h3>
            <label className="text-sm font-light text-gray-600">
              You may apply mutliple codes for max discount
            </label> */}
            <div className="flex flex-col mt-0">
              <div className="flex items-center justify-between gap-2 mb-2 -mt-1 text">
                <input
                  name={'promotion-code'}
                  placeholder={translate('label.promotion.applyPromotionText')}
                  onChange={handleChange}
                  value={value}
                  className="w-full min-w-0 placeholder-gray-500 border border-gray-300 appearance-none placeholder:text-sm focus:outline-none focus:border-gray-700 btn !font-semibold"
                  required
                />

                <button
                  onClick={async () =>
                    await applyCouponInput('applyInput', value)
                  }
                  type="submit"
                  title={translate('common.label.applyText')}
                  className={`flex items-center justify-center btn btn-secondary w-full !font-medium`}
                >
                  {translate('common.label.applyText')}
                </button>
              </div>
            </div>
            {error && (
              <div className="mb-2 text-xs text-red-400 capitalize">
                {translate('common.message.promoCodeInvalidErrorMsg')}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SHOW COUPONS PANEL */}
      <Coupon basketPromos={basketPromos} getBasketPromoses={getBasketPromoses} isShowCoupon={isShowCoupon} setShowCoupon={setShowCoupon} isCouponApplied={isCouponApplied} setCouponApplied={setCouponApplied} appliedBasketPromo={appliedBasketPromo} setAppliedBasketPromo={setAppliedBasketPromo} multiPromo={multiPromo} setMultipromo={setMultipromo} value={value} setValue={setValue} error={error} setError={setError} />
    </>
  )
}
export default PromotionInput