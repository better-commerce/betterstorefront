// Base Imports
import { Fragment, useState } from 'react'

// Package Imports
import axios from 'axios'
import { Dialog, Transition } from '@headlessui/react'
import { ArrowLeftIcon, XMarkIcon } from '@heroicons/react/24/outline'

// Component Imports
import SwiperCore, { Navigation } from 'swiper'
import { useUI } from '@components//ui/context'

//
// Other Imports
import 'swiper/css'
import 'swiper/css/navigation'
import { NEXT_APPLY_PROMOTION } from '@components//utils/constants'
import { useTranslation } from '@commerce/utils/use-translation'

declare const window: any
SwiperCore.use([Navigation])

interface IPromotionInputProps {
  readonly basketPromos: any | undefined
  // readonly paymentOffers: any | undefined
   readonly getBasketPromoses?: any
  readonly deviceInfo?: any
  readonly isShowCoupon?: any
  readonly setShowCoupon?: any
  readonly isCouponApplied?: any
  readonly setCouponApplied?: any
  readonly appliedBasketPromo?: any
  readonly setAppliedBasketPromo?: any
  readonly multiPromo?: any
  readonly setMultipromo?: any
  readonly value?: any
  readonly setValue?: any
  readonly error?: any
  readonly setError?: any
}

const Coupon = (props: IPromotionInputProps) => {
  const {
    basketPromos,
    getBasketPromoses = () => {},
    isShowCoupon,
    setShowCoupon,
    isCouponApplied,
    setCouponApplied,
    appliedBasketPromo,
    setAppliedBasketPromo,
    multiPromo,
    setMultipromo,
    value,
    setValue,
    error,
    setError
  } = props
  const { basketId, setCartItems, cartItems } = useUI()
  const translate = useTranslation()
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

  const applyCoupon = async (promo: any, ev: any = null) => {
    const applyPromoResult = await handleSubmit('apply', promo?.code)

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
      promoDiscount = translate('label.basket.freeGiftItemText')
    }

    if (promo?.promoType == 16) {
      promoDiscount = translate('label.basket.offer50PercOffOnThirdItemText')
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

  return (
    <>
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
                            <span className="sr-only">{translate('common.label.closePanelText')}</span>
                            <ArrowLeftIcon
                              className="relative top-0 w-5 h-5"
                              aria-hidden="true"
                            />
                          </button>
                          <h3 className="font-display text-md sm:text-lg">
                            {translate('label.basket.applyCouponsText')}
                          </h3>
                        </div>

                        <div className="flex flex-col justify-start my-0 sm:hidden sm:my-0">
                          {cartItems.promotionsApplied?.length ?
                            cartItems.promotionsApplied.map(
                              (promo: any, key: number) => {
                                return (
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
                                                promo?.discountAmt?.formatted
                                                  ?.withTax
                                              }
                                            </span>
                                          </>
                                        ) : (
                                          <>
                                            <span>{translate('label.basket.freeGiftAddedText')}</span>
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
                                )
                              }
                            ) : null}
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
                                      {translate('label.basket.multiplePromoSelectionText')}
                                    </h4>
                                  </div>
                                  {multiSelectPromo?.map(
                                    (promo: any, idx: number) => {
                                      return (
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
                                    <h4 className="text-lg">{translate('label.basket.moreOffersText')}</h4>
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
                                                  <h3 className="text-white uppercase font-display coupon-text-rotate">
                                                    {promo?.additionalInfo7}
                                                  </h3>
                                                </div>
                                                <div className="col-span-11 p-4 coupon-code-data">
                                                  <div className="flex justify-between">
                                                    <h3 className="mb-1 text-black uppercase text-md font-display">
                                                      {promo?.code}
                                                    </h3>
                                                    {applied?.promoCode ==
                                                    promo?.code ? (
                                                      <>
                                                        <button
                                                          type="button"
                                                          className="text-md font-display text-emerald-500"
                                                        >
                                                          {translate('label.basket.appliedText')}
                                                        </button>
                                                      </>
                                                    ) : (
                                                      <>
                                                        <button
                                                          type="button"
                                                          className="text-black text-md font-display"
                                                          onClick={(ev: any) =>
                                                            applyCoupon(
                                                              promo,
                                                              ev
                                                            )
                                                          }
                                                        >
                                                          {translate('label.basket.appliedText')}
                                                        </button>
                                                      </>
                                                    )}
                                                  </div>
                                                  <div className="flex flex-col">
                                                    <p className="font-medium text-ms text-emerald-500">
                                                      {promo?.name}
                                                    </p>
                                                  </div>
                                                  <div className="flex flex-col pt-4 mt-4 border-t border-gray-200 border-dotted px">
                                                    <p className="font-normal text-gray-400 text-ms">
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
                      {multiPromo?.length > 0 && (
                        <div className="sticky bottom-0 z-10 flex flex-col w-full px-6 py-4 bg-white">
                          <button
                            onClick={() => applyMultiPromo()}
                            type="button"
                            className="w-full btn btn-primary"
                          >{translate('label.basket.appliedText')}{' '}{multiPromo?.length} {
                            multiPromo?.length > 1 ? translate('label.basket.couponsText') : translate('label.basket.couponText')
                          }</button>
                        </div>
                      )}
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
                      <div className="relative w-full h-auto max-w-md mx-auto bg-white center-fix-panel top-2/4 -translate-y-2/4">
                        <div className="sticky top-0 z-10 px-4 py-4 border-b border-gray-200 sm:px-6 left-1">
                          <div className="flex justify-between">
                            <h3 className="text-xl font-bold text-black dark:text-black">
                              {translate('label.basket.couponAppliedText')}
                            </h3>
                            <button
                              type="button"
                              className="mr-2 text-black rounded-md outline-none hover:text-gray-500"
                              onClick={() => setCouponApplied(false)}
                            >
                              <span className="sr-only">{translate('common.label.closePanelText')}</span>
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
                                  {translate('label.basket.appliedText')}
                                </h3>
                              </div>
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
                                        {translate('label.basket.freeGiftText')}
                                      </h3>
                                    </div>
                                    <div className="flex flex-col mt-2">
                                      <p className="text-xs font-normal text-emerald-500">
                                        {translate('label.basket.freeGiftMsg')}
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
                                        {translate('label.basket.youHaveGotText')}{' '}
                                        {
                                          cartItems?.discount?.formatted
                                            ?.withTax
                                        }{' '}
                                        {translate('label.orderSummary.discountText')}
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
                            {translate('label.basket.awesomeText')}
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
export default Coupon