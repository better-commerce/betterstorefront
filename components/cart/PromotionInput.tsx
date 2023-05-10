import axios from 'axios'
import { useState,Fragment } from 'react'
import { useUI } from '@components/ui/context'
import { NEXT_APPLY_PROMOTION,SHOW_APPLY_COUPON_SECTION } from '@components/utils/constants'
import { PROMO_ERROR } from '@components/utils/textVariables'
import { ArrowLeftIcon,XMarkIcon,TrashIcon,ReceiptPercentIcon } from '@heroicons/react/24/outline'
import { Dialog, Transition } from '@headlessui/react'


// Component Imports
import SwiperCore, { Navigation } from 'swiper'
import Button from '@components/ui/IndigoButton'
import {
  APPLY_PROMOTION,
  APPLY_PROMOTION_SUCCESS_MESSAGE,
  GENERAL_APPLY_TEXT
} from '@components/utils/textVariables'
import { IExtraProps } from '@components/common/Layout/Layout'


interface IPromotionInputProps {
  readonly basketPromos: any | undefined
  readonly paymentOffers: any | undefined
  readonly items: any
  readonly getBasketPromoses?: any
}


export default function PromotionInput(props: IPromotionInputProps ) {
  const {
    basketPromos,
    paymentOffers,
    items,
    getBasketPromoses = () => { },
    // deviceInfo,
  } = props
  const [error, setError] = useState(false)
  const [isShowCoupon, setShowCoupon] = useState(false)  
  const { basketId, setCartItems, cartItems } = useUI()
  const [multiPromo, setMultipromo] = useState<any[]>([])
  const [value, setValue] = useState('')

  const handleChange = (e: any) => {
    setValue(e.target.value)
  }

  const applyCoupon = async (promo: any, ev: any = null) => {
    const applyPromoResult = await handleSubmit('apply', promo?.code)

    // if (applyPromoResult) {
    //   setAppliedBasketPromo(promo)
    //   setShowCoupon(false)
    //   setCouponApplied(true)
    // }
  }

  const viewCoupons = (promo: any, items: any) => {
    setShowCoupon(true)

    // if (typeof window !== "undefined") {
    //   recordGA4Event(window, 'view_promotion', {
    //     ecommerce: {
    //       items: [
    //         items?.lineItems?.map((item: any, itemId: number) => ({
    //           item_name: item?.name,
    //           price: item?.price?.raw?.withTax,
    //           quantity: item?.qty,
    //           item_brand: item?.brand,
    //           item_id: item?.sku,
    //           item_size: getLineItemSize(
    //             item?.stockCode
    //               ?.toUpperCase()
    //               ?.substring(item?.stockCode?.lastIndexOf('-') + 1),
    //             item?.variantProductsAttribute
    //           ),
    //           item_variant: items?.colorName,
    //         })),
    //       ],
    //       coupon_list: [
    //         promo?.map((promo: any, promoId: number) => ({
    //           coupon_name: promo?.name,
    //           coupon_value: promo?.additionalInfo1,
    //         })),
    //       ],
    //     },
    //   })
    // }
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
      if (data.result) {
        setError(data.result.isValid)
        setCartItems(data.result.basket)
      } else setError(!data.isValid)
    } catch (error) {
      console.log(error)
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

    // if (typeof window !== "undefined") {
    //   recordGA4Event(window, 'offer_popup', {
    //     offer_module: 'PDP orange offer modal',
    //     current_page: 'PDP',
    //     offer_details: promo,
    //   })
    // }

    // recordMoEngageEvent(window.moEvent, 'PDP orange offer modal', {
    //   URL: window.location.href,
    //   Product_name: items?.lineItems[0]?.name,
    //   Product_category: items?.lineItems[0]?.categoryItems[1]?.categoryName,
    //   Product_category_2: items?.lineItems[0]?.categoryItems[2]?.categoryName,
    // })

    // if (typeof window !== "undefined") {
    //   recordGA4Event(window, 'select_promotion', {
    //     ecommerce: {
    //       items: [
    //         items?.lineItems?.map((item: any, itemId: number) => ({
    //           item_name: item?.name,
    //           price: item?.price?.raw?.withTax,
    //           quantity: item?.qty,
    //           item_brand: item?.brand,
    //           item_id: item?.sku,
    //           item_size: getLineItemSize(
    //             item?.stockCode
    //               ?.toUpperCase()
    //               ?.substring(item?.stockCode?.lastIndexOf('-') + 1),
    //             item?.variantProductsAttribute
    //           ),
    //           item_variant: item?.colorName,
    //         })),
    //       ],
    //       promotion_name: promo?.name,
    //       selected_coupon: 'Multi',
    //       discount_applied: items?.discount?.raw?.withTax,
    //     },
    //   })
    // }

    // recordMoEngageEvent(window.moEvent, 'cart coupon', {
    //   URL: window.location.href,
    //   label: promo?.name,
    //   discount_applied: items?.discount?.raw?.withTax,
    // })
  }

  const applyMultiPromo = async () => {
    // try {
    //   if (multiPromo?.length > 0) {
    //     const applyMultiPromoResult = await Promise.all(
    //       multiPromo.map(async (p: any) => {
    //         const thisPromoApplyResult = await handleSubmit('apply', p?.code)
    //         if (!thisPromoApplyResult) setError(true)
    //       })
    //     )
    //     if (applyMultiPromoResult) {
    //       setMultipromo([])
    //       setShowCoupon(false)
    //     }
    //   }
    // } catch (err) {
    //   console.log(err)
    // }
  }

  const multiSelectPromo = basketPromos?.applicablePromotions?.filter(
    (x: any) => x?.useWithOtherDiscountCode == 3
  )
  const singleSelectPromo =
    basketPromos?.applicablePromotions?.filter(
      (x: any) => x?.useWithOtherDiscountCode == 1
    ) ||
    basketPromos?.applicablePromotions?.filter(
      (x: any) => x?.useWithOtherDiscountCode == 2
    )
  const applied = cartItems?.promotionsApplied?.find((x: any) => x.promoCode)
  const promoTypeNot22 = basketPromos?.applicablePromotions?.filter(
    (x: any) => x?.promoType != 22
  )

  const PromotionsCount =
    basketPromos?.applicablePromotions?.length 
     +  basketPromos?.availablePromotions

  return (
    <>
    <div className="flex items-center px-4 sm:px-6">
      <div className='w-full'>
          {!!basketPromos && (
          <div className='flex justify-between my-2'>
            <div className='flex items-center'>
                <ReceiptPercentIcon className='h-5 w-5 mx-1'/>
            <h2 className='font-semibold text-md dark:text-black'>
              {basketPromos?.applicablePromotions?.length > 0 ? `${basketPromos?.applicablePromotions?.length}`:`No`} {' '} {basketPromos?.applicablePromotions?.length!==1 ? `Coupons Available`:`Coupon Available`}
            </h2>
            </div>
            <div className='flex items-end'>
              <h3 className='text-sm font-semibold cursor-pointer text-yellow-600  text-orange-500 mob-font-small-screen' 
              onClick={() =>
                      viewCoupons(basketPromos, items)
                    }>
                { basketPromos?.applicablePromotions?.length > 1 ? 'View Coupons' : 'View Coupon'}
              </h3>
            </div>
          </div>
          )
          }
        <label className="text-black uppercase font-semibold text-xs">{APPLY_PROMOTION}</label>
        <div className="flex flex-col">
          <div className="flex justify-start flex-col sm:my-0 my-0">
            {cartItems.promotionsApplied?.length
              ? cartItems.promotionsApplied.map((promo: any, key: number) => {
                  return (
                    <div className="flex items-center py-2" key={promo.name}>
                      <span className="text-black">
                        <span className='text-black p-1 rounded-full border bg-gray-50 text-sm px-4 font-bold'>{promo.name}</span> {' '}{APPLY_PROMOTION_SUCCESS_MESSAGE}
                      </span>
                      <TrashIcon
                        className="ml-5 cursor-pointer text-red-500 hover:text-red-700 max-w-xs h-5"
                        onClick={() => handleSubmit('remove', promo.promoCode)}
                      />
                    </div>
                  )
                })
              : null}
          </div>

          <div className="flex justify-center items-center">
            <input
              name={'promotion-code'}
              placeholder={APPLY_PROMOTION}
              onChange={handleChange}
              value={value}
              className="mb-2 mt-2 appearance-none min-w-0 w-full bg-white border border-gray-300 rounded-sm shadow-sm py-3 px-4 text-black placeholder-gray-300 focus:outline-none focus:border-black focus:ring-1 focus:ring-black "
            />
            <Button
              action={async () => await handleSubmit('apply')}
              type="button"
              title={GENERAL_APPLY_TEXT}
              className={`max-w-xs flex-1 ml-2 bg-black border border-transparent rounded-sm uppercase py-2 px-4 flex items-center justify-center font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-black sm:w-full`}
            />
          </div>
        </div>
        {error ? (
          <div className="text-red-400 text-xs capitalize mb-2">
            {PROMO_ERROR}
          </div>
        ) : null}
      </div>
      <div></div>
    </div>
    {/* SHOW COUPONS PANEL */}
    <Transition.Root show={isShowCoupon} as={Fragment}>
        <Dialog as="div" className="relative !z-9999" onClose={setShowCoupon}>
          <div className="fixed inset-0 left-0 bg-orange-900/20" />
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
                    <div className="relative flex flex-col h-full overflow-y-auto bg-white shadow-xl !z-9999">
                      <div className="sticky top-0 !z-9999 \z-10 px-4 py-4 bg-white border-b border-gray-200 sm:px-6 left-1">
                        <div className="flex">
                          <button
                            type="button"
                            className="mr-2 text-black rounded-md outline-none hover:text-gray-500"
                            onClick={() => setShowCoupon(false)}
                          >
                            <span className="sr-only">Close panel</span>
                            <ArrowLeftIcon
                              className="relative top-0 w-6 h-6"
                              aria-hidden="true"
                            />
                          </button>
                          <h3 className="font-bold text-20 xs-text-16 text-dark dark:text-black">
                            Apply Coupons
                          </h3>
                        </div>
                        {SHOW_APPLY_COUPON_SECTION &&
                          // (isMobile || isIPadorTablet) &&
                           (
                            <div className="flex items-center pt-2 my-2">
                              <div>
                                <div className="flex flex-col">
                                  <div className="flex items-center justify-center w-full border border-gray-100 bg-dark-grey hover:border-orange-400">
                                    <input
                                      name={'promotion-code'}
                                      placeholder={APPLY_PROMOTION}
                                      onChange={handleChange}
                                      value={value}
                                      className="w-full min-w-0 px-4 py-3 text-gray-900 placeholder-gray-500 bg-transparent appearance-none focus:outline-none"
                                    />

                                    <button
                                      // onClick={async () =>
                                      //   await applyCouponInput(
                                      //     'applyInput',
                                      //     value
                                      //   )
                                      // }
                                      type="button"
                                      title={GENERAL_APPLY_TEXT}
                                      className={`max-w-xs flex-1 ml-5 py-2 px-4 flex items-center bg-transparent border-transparent justify-center font-medium hover:text-orange-500 text-orange-500 hover:bg-transparent sm:w-full`}
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
                      {basketPromos?.applicablePromotions?.length > 0 && (
                        <div className="p-6">
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
                                                <div className="relative col-span-1 text-white bg-orange-500 coupon-code-panel coupon-cross">
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
                                                          handleMultiPromo(
                                                            promo
                                                          )
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
                                      <h4 className="text-lg font-semibold text-dark-brown">
                                        Applicable Offers
                                      </h4>
                                    </div>
                                    {singleSelectPromo?.map(
                                      (promo: any, idx: number) => {
                                        return (
                                          promo?.promoType != 22 &&
                                          (promo?.useWithOtherDiscountCode ==
                                            1 ||
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
                                                    className={`relative col-span-1 text-white coupon-cross ${applied?.promoCode ==
                                                      promo?.code
                                                      ? `bg-orange-500 coupon-code-panel`
                                                      : 'bg-orange-500 coupon-code-panel'
                                                      }`}
                                                  >
                                                    <h3 className="font-semibold text-white uppercase coupon-text-rotate">
                                                      {promo?.additionalInfo7}
                                                    </h3>
                                                  </div>
                                                  <div className="col-span-11 p-4 coupon-code-data">
                                                    <div className="flex justify-between">
                                                      <h3 className="mb-1 text-sm font-semibold text-black uppercase">
                                                        {promo?.code}
                                                      </h3>
                                                      {applied?.promoCode ==
                                                        promo?.code ? (
                                                        <>
                                                          <button
                                                            type="button"
                                                            className="text-sm font-semibold text-emerald-500"
                                                          >
                                                            Applied
                                                          </button>
                                                        </>
                                                      ) : (
                                                        <>
                                                          <button
                                                            type="button"
                                                            className="text-sm font-semibold text-orange-500"
                                                            onClick={(
                                                              ev: any
                                                            ) =>
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
                                        )
                                      }
                                    )}
                                  </div>
                                </div>
                              </>
                            )}

                            {/* {!APPLY_JUSPAY_OFFERS_DISABLED &&
                              getPaymentOffers()?.length > 0 && (
                                <div className="flex flex-col mt-6">
                                  <div className="grid grid-cols-1">
                                    <div>
                                      <h4 className="text-lg font-semibold text-dark-brown">
                                        Payment Offers
                                      </h4>
                                    </div>

                                    {getPaymentOffers()?.map(
                                      (offer: any, idx: number) => (
                                        <div
                                          key={idx}
                                          className="mt-3 border border-gray-200"
                                        >
                                          <div className="grid grid-cols-12">
                                            <div className="col-span-12 p-4">
                                              <div className="flex justify-between">
                                                <h3 className="mb-1 text-sm font-semibold text-black uppercase">
                                                  {offer?.offer_code}
                                                </h3>
                                              </div>
                                              <div className="flex flex-col">
                                                <p className="text-xs font-medium text-emerald-500">
                                                  {
                                                    offer?.offer_description
                                                      ?.title
                                                  }
                                                </p>
                                              </div>
                                              <div className="flex flex-col pt-4 mt-4 border-t border-gray-200 border-dotted px">
                                                <p className="text-xs font-normal text-gray-400">
                                                  {getOfferTexts(offer)
                                                    ?.length > 0 && (
                                                      <>
                                                        {getOfferTexts(
                                                          offer
                                                        )?.map(
                                                          (
                                                            text: string,
                                                            idx: number
                                                          ) => (
                                                            <span key={idx}>
                                                              {text}
                                                            </span>
                                                          )
                                                        )}
                                                      </>
                                                    )}
                                                </p>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              )} */}
                          </div>
                        </div>
                      )}
                      {multiPromo?.length > 0 ? (
                        <div className="sticky bottom-0 z-10 flex flex-col w-full px-6 py-4 bg-white">
                          <button
                            onClick={() => applyMultiPromo()}
                            type="button"
                            className="w-full text-white bg-black hover:bg-gray-800 btn-basic-property"
                          >{`Apply ${multiPromo?.length} ${multiPromo?.length > 1 ? 'Coupons' : 'Coupon'
                            }`}</button>
                        </div>
                      ) : null}

                      {basketPromos?.availablePromotions > 0 && ( 
                        <div className="p-6">
                          <div className="flex flex-col w-full">
                            <div className="flex flex-col mb-4">
                              <div className="grid grid-cols-1">
                                <div>
                                  <h4 className="text-lg font-semibold text-dark-brown">
                                    More Offers
                                  </h4>
                                </div>
                                {basketPromos?.availablePromotions?.map(
                                  (promo: any, idx: number) => {
                                    return (
                                      <>
                                        <div
                                          key={idx}
                                          className="mt-3 border border-gray-200"
                                        >
                                          <div className="grid grid-cols-12">
                                            <div className="relative col-span-1 text-white bg-gray-500 coupon-code-panel coupon-cross-gray">
                                              <h3 className="font-semibold text-white uppercase coupon-text-rotate">
                                                {promo?.additionalInfo7}
                                              </h3>
                                            </div>
                                            <div className="col-span-11 p-4 coupon-code-data">
                                              <div className="flex justify-between">
                                                <h3 className="mb-1 text-sm font-semibold text-black uppercase">
                                                  {promo?.code}
                                                </h3>
                                                <button
                                                  type="button"
                                                  className="text-sm font-semibold text-gray-300"
                                                >
                                                  Apply
                                                </button>
                                              </div>

                                              {/* <div className="flex flex-col">
                                                <p className="text-xs font-medium text-gray-300">
                                                  {promo?.name}
                                                </p>
                                              </div> */}
                                              {
                                                promo?.croMessage && (
                                                  <div className='m-offer-info my-1 bg-sky-offer offer-m-sec text-secondary-full-opacity relative pl-10-view'>
                                                    {promo.croMessage}
                                                  </div>
                                                )
                                              }
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
                          </div>
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
    
   </> 
  )
}

