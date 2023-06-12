// Base Imports
import { Fragment, useEffect, useState } from 'react'

// Package Imports
import axios from 'axios'
import { Dialog, Transition } from '@headlessui/react'
import Router, { useRouter } from 'next/router'
import { ArrowLeftIcon, XMarkIcon } from '@heroicons/react/24/outline'

// Component Imports
import SwiperCore, { Navigation } from 'swiper'
import { useUI } from '@components/ui/context'

//
// Other Imports
import 'swiper/css'
import 'swiper/css/navigation'
import {
  NEXT_APPLY_PROMOTION,
  SHOW_APPLY_COUPON_SECTION,
} from '@components/utils/constants'
import { PROMO_ERROR } from '@components/utils/textVariables'
import { TrashIcon } from '@heroicons/react/24/outline'
import Button from '@components/ui/Button'
import {
  APPLY_PROMOTION,
  APPLY_PROMOTION_SUCCESS_MESSAGE,
  GENERAL_APPLY_TEXT,
} from '@components/utils/textVariables'
import useDevice from '@commerce/utils/use-device'

declare const window: any

SwiperCore.use([Navigation])

interface IPromotionInputProps {
  readonly basketPromos: any | undefined
  // readonly paymentOffers: any | undefined
  readonly items: any
  readonly getBasketPromoses?: any
}

const PromotionInput = (props: IPromotionInputProps) => {
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

  const applyCoupon = async (promo: any, ev: any = null) => {
    const applyPromoResult = await handleSubmit('apply', promo?.code)

    if (applyPromoResult) {
      setAppliedBasketPromo(promo)
      setShowCoupon(false)
      setCouponApplied(true)
    }
  }

  const applyCouponInput = async (ev: any, promo: any) => {
    const applyPromoResult = await handleSubmitInput('apply', promo)

    if (applyPromoResult) {
      setAppliedBasketPromo(promo)
      setShowCoupon(false)
      setCouponApplied(true)
    }
  }

  const handleMultiPromo = (promo: any) => {
    if (multiPromo.includes(promo))
      setMultipromo(multiPromo?.filter((p: any) => p !== promo))
    else setMultipromo([...multiPromo, promo])

    let promoDiscount = ''
    if (promo?.promoType == 1) {
      promoDiscount = promo?.additionalInfo1
    }
    if (
      promo?.promoType == 2 ||
      promo?.promoType == 4 ||
      promo?.promoType == 9
    ) {
      promoDiscount = 'FREE GIFT ITEM'
    }

    if (promo?.promoType == 16) {
      promoDiscount = '50% OFF on 3rd Item'
    }
  }

  // missing success popup and error message if one of the coupon fails or all succeed
  const applyMultiPromo = async () => {
    try {
      if (multiPromo?.length > 0) {
        const applyMultiPromoResult = await Promise.all(
          multiPromo.map(async (p: any) => {
            const thisPromoApplyResult = await handleSubmit('apply', p?.code)
            if (!thisPromoApplyResult) setError(true)
          })
        )
        if (applyMultiPromoResult) {
          setMultipromo([])
          setShowCoupon(false)
        }
      }
    } catch (err) {
      console.log(err)
    }
  }

  const multiSelectPromo = basketPromos?.availablePromotions?.filter(
    (x: any) => x?.useWithOtherDiscountCode == 3
  )
  const singleSelectPromo =
    basketPromos?.availablePromotions?.filter(
      (x: any) => x?.useWithOtherDiscountCode == 1
    ) ||
    basketPromos?.availablePromotions?.filter(
      (x: any) => x?.useWithOtherDiscountCode == 2
    )
  const applied = cartItems?.promotionsApplied?.find((x: any) => x.promoCode)
  const promoTypeNot22 = basketPromos?.availablePromotions?.filter(
    (x: any) => x?.promoType != 22
  )

  const PromotionsCount =
    basketPromos?.availablePromotions?.length +
    basketPromos?.availablePromotions?.length
  return (
    <>
      {/* {JSON.stringify(singleSelectPromo)} */}
      <div
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit('apply')
        }}
        className="grid content-center w-full px-0 sm:px-0"
      >
        {basketPromos && (
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
                    className="text-sm font-display text-black cursor-pointer mob-font-small-screen"
                    onClick={() => viewCoupons(basketPromos, items)}
                  >
                    View Coupons
                  </h3>
                ) : (
                  <>
                    {(isMobile || isIPadorTablet) && (
                      <div className="flex justify-end col-span-4">
                        <h3
                          className="text-sm font-display text-black cursor-pointer mob-font-small-screen"
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
              <div className="flex items-center justify-start gap-4">
                <div className="flex">
                  <span className="sprite-icon coupon-icon"></span>
                </div>
                <div className="flex flex-col col-span-7">
                  <p className="font-semibold text-md dark:text-black">
                    {PromotionsCount > 0 ? `${PromotionsCount}` : 'No'}{' '}
                    {PromotionsCount > 1
                      ? 'Coupons Available'
                      : 'Coupon Available'}
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
                      Router?.push(
                        { pathname: `${asPath}#couponopen` },
                        `${asPath}`,
                        { shallow: true, scroll: false }
                      )
                    }}
                  >
                    {promoTypeNot22?.length > 1
                      ? 'View Coupons'
                      : 'View Coupon'}
                  </h3>
                ) : (
                  <>
                    {(isMobile || isIPadorTablet) && (
                      <div className="flex justify-end col-span-4">
                        <h3
                          className="text-sm font-semibold text-orange-500 cursor-pointer truncate mob-font-small-screen"
                          onClick={() => {
                            viewCoupons(
                              basketPromos?.applicablePromotions,
                              items
                            )
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
        )}
      </div>
      {/* <div className="flex flex-col justify-start my-0 sm:my-0">
        {cartItems.promotionsApplied?.length
          ? cartItems.promotionsApplied.map((promo: any, key: number) => {
              return (
                <>
                  <div className="pt-2 mt-2 border-t border-gray-200">
                    <div
                      className="flex justify-between gap-4 pb-2 my-1"
                      key={key}
                    >
                      <div className="flex">
                        <h5 className="font-medium uppercase text-primary dark:text-black text-14 xs-text-14">
                          {' '}
                          {promo.promoCode}
                        </h5>
                      </div>
                      <div className="flex justify-end">
                        <h5 className="font-medium uppercase text-14 xs-text-14 text-emerald-600">
                          {promo?.discountAmt?.raw?.withTax > 0 ? (
                            <>
                              <span>
                                -{promo?.discountAmt?.formatted?.withTax}
                              </span>
                            </>
                          ) : (
                            <>
                              <span>Free Gift Added</span>
                            </>
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
                </>
              )
            })
          : null}
      </div> */}

      <div className="flex flex-col justify-start my-0 sm:my-0">
        {cartItems.promotionsApplied?.length
          ? cartItems.promotionsApplied.map((promo: any, key: number) => {
              return (
                <>
                  <div className="pt-2 mt-2 border-t border-gray-200">
                    <div
                      className="flex justify-between gap-4 pb-2 my-1"
                      key={key}
                    >
                      <div className="flex">
                        <h5 className="font-medium uppercase text-primary dark:text-black text-14 xs-text-14">
                          {' '}
                          {promo.promoCode}
                        </h5>
                      </div>
                      <div className="flex justify-end">
                        <h5 className="font-medium uppercase text-14 xs-text-14 text-emerald-600">
                          {promo?.discountAmt?.raw?.withTax > 0 ? (
                            <>
                              <div className="flex">
                                <span>
                                  -{promo?.discountAmt?.formatted?.withTax}
                                </span>
                                <TrashIcon
                                  className="ml-5 cursor-pointer text-black hover:text-gray-700 max-w-xs h-5"
                                  onClick={() =>
                                    handleSubmit(
                                      'remove',
                                      cartItems?.promotionsApplied[0]?.promoCode
                                    )
                                  }
                                />
                              </div>
                            </>
                          ) : (
                            <span>Free Gift Added</span>
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
                </>
              )
            })
          : null}
      </div>

      {/* More Offer MSG */}
      <div className="flex flex-col my-2">
        {basketPromos?.availablePromotions?.length > 0 && (
          <>
            {basketPromos?.availablePromotions
              ?.filter((x: any) => !!x?.croMessage)
              ?.map((promo: any, crdx: number) => {
                return (
                  <>
                    <div
                      className="m-offer-info my-1 bg-sky-offer offer-m-sec text-secondary-full-opacity pl-16 relative"
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
                  </>
                )
              })}
          </>
        )}

        {basketPromos?.applicablePromotions?.length > 0 && (
          <>
            {basketPromos?.applicablePromotions
              ?.filter((x: any) => x?.promoType == 21 && !!x?.croMessage)
              ?.map((promo: any, crdx: number) => {
                return (
                  <>
                    <div
                      className="m-offer-info my-1 bg-sky-offer offer-m-sec text-secondary-full-opacity pl-16 relative"
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
                  </>
                )
              })}
          </>
        )}
      </div>
      {/* More Offer MSG */}

      {SHOW_APPLY_COUPON_SECTION && !(isMobile || isIPadorTablet) && (
        <div className="flex items-center w-full pt-0 mt-0">
          <div className="w-full">
            {/* <h3 className="text-lg font-display text-gray-900">Use Coupon</h3>
            <label className="text-sm font-light text-gray-600">
              You may apply mutliple codes for max discount
            </label> */}
            <div className="flex flex-col mt-0">
              <div className="flex mb-2 gap-2 justify-between items-center -mt-1 text">
                <input
                  name={'promotion-code'}
                  placeholder={APPLY_PROMOTION}
                  onChange={handleChange}
                  value={value}
                  className="text-md text-gray-900 appearance-none min-w-0 lg:h-10 md:h-10 border xsm:h-10 border-gray-300 py-1 px-3 placeholder-gray-500 placeholder:text-sm focus:outline-none focus:border-gray-700 bg-white w-full"
                  required
                />

                <button
                  onClick={async () =>
                    await applyCouponInput('applyInput', value)
                  }
                  type="submit"
                  title={GENERAL_APPLY_TEXT}
                  className={`py-1 px-3 xsm:h-10 flex items-center justify-center bg-black lg:h-10 md:h-10 hover:opacity-75 text-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-black w-full`}
                >
                  {GENERAL_APPLY_TEXT}
                </button>
              </div>
            </div>
            {error ? (
              <div className="mb-2 text-xs text-red-400 capitalize">
                {PROMO_ERROR}
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* SHOW COUPONS PANEL */}
      <Transition.Root show={isShowCoupon} as={Fragment}>
        <Dialog
          aria-label="list-coupons"
          as="div"
          className="relative z-9999"
          onClose={setShowCoupon}
        >
          <div className="fixed inset-0 left-0 bg-black/20" />
          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="fixed inset-y-0 right-0 flex max-w-full pointer-events-none bottom-to-top">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-400"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-400"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="w-screen max-w-md pointer-events-auto width-cart">
                    <div className="relative flex flex-col h-full bg-white shadow-xl z-99">
                      <div className="sticky top-0 z-10 px-4 py-4 border-b border-gray-200 sm:px-6 left-1">
                        <div className="flex">
                          <button
                            type="button"
                            className="mr-2 text-black rounded-md outline-none hover:text-gray-500"
                            onClick={() => setShowCoupon(false)}
                          >
                            <span className="sr-only">Close panel</span>
                            <ArrowLeftIcon
                              className="relative top-0 w-5 h-5"
                              aria-hidden="true"
                            />
                          </button>
                          <h3 className="font-display text-md sm:text-lg">
                            Apply Coupons
                          </h3>
                        </div>
                        {/* {SHOW_APPLY_COUPON_SECTION &&
                          (isMobile || isIPadorTablet) && (
                            <div className="flex items-center pt-2 my-2">
                              <div>
                                <div className="flex flex-col">
                                  <div className="flex items-center justify-center w-full border border-gray-100 bg-dark-grey hover:border-black"><p></p>
                                    <input
                                      name={'promotion-code'}
                                      placeholder={APPLY_PROMOTION}
                                      onChange={handleChange}
                                      value={value}
                                      className="w-full min-w-0 px-4 py-3 text-gray-900 placeholder-gray-500 bg-transparent appearance-none focus:outline-none"
                                    />

                                    <button
                                      onClick={async () =>
                                        await applyCouponInput(
                                          'applyInput',
                                          value
                                        )
                                      }
                                      type="button"
                                      title={GENERAL_APPLY_TEXT}
                                      className={`max-w-xs flex-1 ml-5 py-2 px-4 flex items-center bg-transparent border-transparent justify-center font-medium hover:text-black text-black hover:bg-transparent sm:w-full`}
                                    >
                                      {GENERAL_APPLY_TEXT}
                                    </button>
                                  </div>
                                </div>
                                {error ? (
                                  <div className="mb-2 text-xs text-red-400 capitalize">
                                    {PROMO_ERROR}
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          )
                          } */}
                        <div className="flex flex-col justify-start my-0 sm:hidden sm:my-0">
                          {cartItems.promotionsApplied?.length
                            ? cartItems.promotionsApplied.map(
                                (promo: any, key: number) => {
                                  return (
                                    <>
                                      <div
                                        className="flex justify-between gap-4 pt-2 my-1"
                                        key={key}
                                      >
                                        {/* //promo code applied */}
                                        <div className="flex">
                                          <h5 className="font-medium uppercase text-primary dark:text-black text-14 xs-text-14">
                                            {' '}
                                            {promo.promoCode}
                                          </h5>
                                        </div>
                                        <div className="flex justify-end">
                                          <h5 className="font-medium uppercase text-14 xs-text-14 text-emerald-600">
                                            {promo?.discountAmt?.raw?.withTax >
                                            0 ? (
                                              <>
                                                <span>
                                                  -
                                                  {
                                                    promo?.discountAmt
                                                      ?.formatted?.withTax
                                                  }
                                                </span>
                                              </>
                                            ) : (
                                              <>
                                                <span>Free Gift Added</span>
                                              </>
                                            )}
                                            {!promo?.autoApply && (
                                              <a href="javascript: void(0);">
                                                <span
                                                  className="relative ml-2 sprite-icon cross-icon top-0.5"
                                                  onClick={() =>
                                                    handleSubmit(
                                                      'remove',
                                                      promo.promoCode
                                                    )
                                                  }
                                                ></span>
                                              </a>
                                            )}
                                          </h5>
                                        </div>
                                      </div>
                                    </>
                                  )
                                }
                              )
                            : null}
                        </div>
                      </div>
                      <div className="p-6 overflow-y-auto">
                        <div className="flex flex-col w-full">
                          {/* MULTI-SELCET PROMOTION WITH useWithOtherDiscountCode=3 */}
                          {multiSelectPromo?.length > 0 && (
                            <>
                              <div className="flex flex-col mb-4">
                                <div className="grid grid-cols-1">
                                  <div>
                                    <h4 className="text-lg font-semibold text-dark-brown">
                                      Select and apply multiple coupons
                                    </h4>
                                  </div>
                                  {multiSelectPromo?.map(
                                    (promo: any, idx: number) => {
                                      return (
                                        <>
                                          <div
                                            key={idx}
                                            className="mt-3 border border-gray-200"
                                          >
                                            <div className="grid grid-cols-12">
                                              <div className="relative col-span-1 text-white bg-black coupon-code-panel coupon-cross">
                                                <h3 className="font-semibold text-white uppercase coupon-text-rotate">
                                                  {promo?.additionalInfo7}
                                                </h3>
                                              </div>
                                              <div className="col-span-11 p-4 coupon-code-data">
                                                <div className="flex justify-between">
                                                  <h3 className="mb-1 text-sm font-semibold text-black uppercase">
                                                    {promo?.code}
                                                  </h3>
                                                  <div className="font-medium text-left text-black text-md">
                                                    <input
                                                      type="checkbox"
                                                      className="custom-checkbox-promo"
                                                      checked={multiPromo?.includes(
                                                        promo
                                                      )}
                                                      onChange={() =>
                                                        handleMultiPromo(promo)
                                                      }
                                                      value={promo?.code}
                                                      name="applyPromo"
                                                    />
                                                  </div>
                                                </div>
                                                <div className="flex flex-col">
                                                  <p className="text-xs font-medium text-emerald-500">
                                                    {promo?.name}
                                                  </p>
                                                </div>
                                                <div className="flex flex-col pt-4 mt-4 border-t border-gray-200 border-dotted px">
                                                  <p className="text-xs font-normal text-gray-400">
                                                    {promo?.additionalInfo6}
                                                  </p>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </>
                                      )
                                    }
                                  )}
                                </div>
                              </div>
                            </>
                          )}

                          {/* INDIVIDUAL PROMOTION WITH useWithOtherDiscountCode=1 OR 2 */}
                          {singleSelectPromo?.length > 0 && (
                            <>
                              <div className="flex flex-col">
                                <div className="grid grid-cols-1">
                                  <div>
                                    <h4 className="text-lg">More Offers</h4>
                                  </div>
                                  {singleSelectPromo?.map(
                                    (promo: any, idx: number) => {
                                      return (
                                        promo?.promoType != 22 &&
                                        (promo?.useWithOtherDiscountCode == 1 ||
                                          promo?.useWithOtherDiscountCode ==
                                            2 ||
                                          promo?.useWithOtherDiscountCode ==
                                            4) && (
                                          <>
                                            <div
                                              key={idx}
                                              className="mt-3 border border-gray-200"
                                            >
                                              <div className="grid grid-cols-12">
                                                <div
                                                  className={`relative col-span-1 text-white coupon-cross ${
                                                    applied?.promoCode ==
                                                    promo?.code
                                                      ? `bg-black coupon-code-panel`
                                                      : 'bg-black coupon-code-panel'
                                                  }`}
                                                >
                                                  <h3 className="font-display text-white uppercase coupon-text-rotate">
                                                    {promo?.additionalInfo7}
                                                  </h3>
                                                </div>
                                                <div className="col-span-11 p-4 coupon-code-data">
                                                  <div className="flex justify-between">
                                                    <h3 className="mb-1 text-md font-display text-black uppercase">
                                                      {promo?.code}
                                                    </h3>
                                                    {applied?.promoCode ==
                                                    promo?.code ? (
                                                      <>
                                                        <button
                                                          type="button"
                                                          className="text-md font-display text-emerald-500"
                                                        >
                                                          Applied
                                                        </button>
                                                      </>
                                                    ) : (
                                                      <>
                                                        <button
                                                          type="button"
                                                          className="text-md font-display text-black"
                                                          onClick={(ev: any) =>
                                                            applyCoupon(
                                                              promo,
                                                              ev
                                                            )
                                                          }
                                                        >
                                                          Apply
                                                        </button>
                                                      </>
                                                    )}
                                                  </div>
                                                  <div className="flex flex-col">
                                                    <p className="text-ms font-medium text-emerald-500">
                                                      {promo?.name}
                                                    </p>
                                                  </div>
                                                  <div className="flex flex-col pt-4 mt-4 border-t border-gray-200 border-dotted px">
                                                    <p className="text-ms font-normal text-gray-400">
                                                      {promo?.additionalInfo6}
                                                    </p>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </>
                                        )
                                      )
                                    }
                                  )}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      {multiPromo?.length > 0 ? (
                        <div className="sticky bottom-0 z-10 flex flex-col w-full px-6 py-4 bg-white">
                          <button
                            onClick={() => applyMultiPromo()}
                            type="button"
                            className="w-full text-white bg-black hover:bg-gray-800 btn-basic-property"
                          >{`Apply ${multiPromo?.length} ${
                            multiPromo?.length > 1 ? 'Coupons' : 'Coupon'
                          }`}</button>
                        </div>
                      ) : null}
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      <Transition.Root show={isCouponApplied} as={Fragment}>
        <Dialog as="div" className="relative z-9999" onClose={setCouponApplied}>
          <div className="fixed inset-0 left-0 bg-black/20" />
          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="fixed inset-0 right-0 flex max-w-full pl-0 pointer-events-none sm:pl-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Dialog.Panel className="w-screen pointer-events-auto">
                    <div className="relative flex flex-col h-full shadow-xl bg-black/20 z-99">
                      <div className="w-full h-auto max-w-md mx-auto bg-white center-fix-panel top-2/4 -translate-y-2/4 relative">
                        <div className="sticky top-0 z-10 px-4 py-4 border-b border-gray-200 sm:px-6 left-1">
                          <div className="flex justify-between">
                            <h3 className="text-xl font-bold text-black dark:text-black">
                              Coupon Applied
                            </h3>
                            <button
                              type="button"
                              className="mr-2 text-black rounded-md outline-none hover:text-gray-500"
                              onClick={() => setCouponApplied(false)}
                            >
                              <span className="sr-only">Close panel</span>
                              <XMarkIcon
                                className="relative top-0 w-6 h-6"
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-col px-6">
                          <div className="mt-3 border border-gray-200">
                            <div className="grid grid-cols-12">
                              <div className="relative col-span-1 text-white coupon-code-panel coupon-cross-success">
                                <h3 className="text-sm font-semibold text-white uppercase coupon-text-rotate">
                                  Applied
                                </h3>
                              </div>
                              {/* {JSON.stringify(cartItems?.promotionsApplied)} */}
                              {cartItems?.promotionsApplied?.filter(
                                (x: any) => x?.promoType == 9
                              )?.length > 0 ||
                              cartItems?.promotionsApplied?.filter(
                                (x: any) => x?.promoType == 2
                              )?.length > 0 ||
                              cartItems?.promotionsApplied?.filter(
                                (x: any) => x?.promoType == 4
                              )?.length > 0 ||
                              cartItems?.promotionsApplied?.length == 0 ? (
                                <>
                                  <div className="col-span-11 p-4 coupon-code-data">
                                    <div className="flex justify-between">
                                      <h3 className="text-sm font-semibold text-black uppercase">
                                        FREE GIFT
                                      </h3>
                                    </div>
                                    <div className="flex flex-col mt-2">
                                      <p className="text-xs font-normal text-emerald-500">
                                        You've got free gift in your basket.
                                      </p>
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="col-span-11 p-4 coupon-code-data">
                                    <div className="flex justify-between">
                                      <h3 className="text-sm font-semibold text-black uppercase">
                                        {appliedBasketPromo?.code}
                                      </h3>
                                    </div>
                                    <div className="flex flex-col mt-2">
                                      <p className="text-xs font-normal text-emerald-500">
                                        You've got{' '}
                                        {
                                          cartItems?.discount?.formatted
                                            ?.withTax
                                        }{' '}
                                        discount
                                      </p>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col px-6 py-4">
                          <button
                            type="button"
                            className="w-full text-white bg-black border border-black btn-basic-property hover:text-white hover:bg-gray-800"
                            onClick={() => setCouponApplied(false)}
                          >
                            Awesome!
                          </button>
                        </div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}
export default PromotionInput
