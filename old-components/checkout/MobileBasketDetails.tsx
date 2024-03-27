import BasketGroupProduct from '@components//SectionCheckoutJourney/cart/BasketGroupProduct'
import {
  EmptyString,
  NEXT_GET_BASKET_PROMOS,
  NEXT_REFERRAL_ADD_USER_REFEREE,
  NEXT_REFERRAL_BY_SLUG,
  NEXT_REFERRAL_INFO,
} from '@components//utils/constants'
import { IMG_PLACEHOLDER } from '@components//utils/textVariables'
import { vatIncluded } from '@framework/utils/app-util'
import { formatFromToDates, tryParseJson } from '@framework/utils/parse-util'
import { Dialog, Disclosure, Transition } from '@headlessui/react'
import {
  ChevronDownIcon,
  ClipboardIcon,
  ShoppingCartIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import axios from 'axios'
import React, { Fragment, useEffect, useState } from 'react'
import { Button, LoadingDots, useUI } from '@components//ui'
import ClipboardFill from '@heroicons/react/24/solid/ClipboardIcon'
import classNames from 'classnames'
import PromotionInput from '@components//SectionCheckoutJourney/cart/PromotionInput'
import { useTranslation } from '@commerce/utils/use-translation'
interface BasketItem {
  id: string
  name: string
  quantity: number
  price: number
}

const MobileBasketDetails = ({ data, deviceInfo }: any) => {
  const translate = useTranslation()
  const { user, isGuestUser, cartItems, setAlert } = useUI()
  const [referralAvailable, setReferralAvailable] = useState(false)
  const [referralModalShow, setReferralModalShow] = useState(false)
  const [referralInfo, setReferralInfo] = useState<any>(null)
  const [copied, setCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [refCodeInput, setRefCodeInput] = useState('')
  const [error, setError] = useState('')
  const [referralEmail, setReferralEmail] = useState<any>('')
  const [groupedPromotions, setGroupedPromotions] = useState<any>({
    appliedPromos: null,
    autoAppliedPromos: null,
  })
  const [basketPromos, setBasketPromos] = useState<any | undefined>(undefined)
  const isIncludeVAT = vatIncluded()
  useEffect(() => {
    const fetchReferralPromotion = async () => {
      let { data: referralPromotions } = await axios.post(NEXT_REFERRAL_INFO)
      if (referralPromotions?.referralDetails) {
        setReferralAvailable(true)
      }
    }
    fetchReferralPromotion()
  }, [])
  const handleReferralRegisterUser = async (referralId: any) => {
    // let referralEmail = ''
    // if (guestUser?.email) {
    //   referralEmail = guestUser?.email
    // } else {
    //   referralEmail = user?.userEmail
    // }
    // if(props?.contactDetails?.emailAddress){
    //   referralEmail = props?.contactDetails?.emailAddress
    // }
    let { data: voucherInfo } = await axios.post(
      NEXT_REFERRAL_ADD_USER_REFEREE,
      { referralId: referralId, email: referralEmail }
    )
    if (!voucherInfo?.referralDetails?.isUserExist) {
      setReferralInfo(voucherInfo?.referralDetails)
    } else if (voucherInfo?.referralDetails?.isUserExist) {
      setIsLoading(false)
      setError(voucherInfo?.referralDetails?.message)
    } else {
      setIsLoading(false)
      setError(translate('label.checkout.referralNotAvailableUserText'))
    }
  }
  const handleInputChange = (e: any) => {
    setRefCodeInput(e.target.value)
  }
  const handleReferralSearch = async () => {
    if (refCodeInput.trim().length > 0) {
      setIsLoading(true)
      let { data: referralSearch } = await axios.post(NEXT_REFERRAL_BY_SLUG, {
        slug: refCodeInput.trim(),
      })
      if (referralSearch?.referralDetails) {
        let referrerReferralId = referralSearch?.referralDetails?.id
        if (referrerReferralId) {
          handleReferralRegisterUser(referrerReferralId)
        } else {
          setIsLoading(false)
          setError(translate('common.message.userWithNameNotFoundErrorMsg'))
        }
      } else {
        setIsLoading(false)
        setError(translate('label.checkout.referralCodeNotFoundErrorMsg'))
      }
    } else {
      setIsLoading(false)
      setError(translate('label.checkout.EnterReferralCodeText'))
    }
  }

  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(referralInfo?.voucherCode)
      setCopied(true)
    } catch (error) {
      console.error('Failed to copy link:', error)
    }
  }

  useEffect(() => {
    const fetchReferralPromotion = async () => {
      let { data: referralPromotions } = await axios.post(NEXT_REFERRAL_INFO)
      if (referralPromotions?.referralDetails) {
        setReferralAvailable(true)
      }
    }
    fetchReferralPromotion()
  }, [])
  const getBasketPromos = async (basketId: string) => {
    const { data: basketPromos } = await axios.get(NEXT_GET_BASKET_PROMOS, {
      params: { basketId: basketId },
    })
    setBasketPromos(basketPromos)
    return basketPromos
  }

  return (
    <>
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex items-center justify-between w-full gap-2 p-3 text-sm font-light text-left text-black normal-case border-b border-gray-300 bg-gray-50">
              <span className="font-medium text-orange-700 font-12">
                <ShoppingCartIcon className="inline-block w-4 h-4 text-orange-700" />{' '}
                {open ? translate('common.label.hideText') : translate('common.label.showText') }{translate('label.orderSummary.orderSummaryText')}{' '}
                <ChevronDownIcon
                  className={`inline-block w-4 h-4 text-orange-700 ${
                    open ? 'rotate-180 transform' : ''
                  }`}
                />
              </span>
              <span className="font-semibold text-black">
                {data?.grandTotal?.formatted?.withTax}
              </span>
            </Disclosure.Button>
            <Disclosure.Panel className="px-0 pt-3 pb-0 bg-gray-100">
              <div className="h-auto border-b border-gray-300 card-summary">
                <div className="w-full px-4 py-0 cart-items ">
                  <div className="flex items-center justify-between w-full gap-2 text-sm font-light text-left text-black normal-case">
                    <span className="font-semibold text-black">
                      {data?.lineItems?.length}{' '}
                      {data?.lineItems?.length > 1 ? 'items' : 'item'}
                    </span>
                  </div>
                  <div className="px-0 pt-3 pb-2">
                    <div className="w-full">
                      {data?.lineItems?.map((product: any, index: number) => {
                        const voltageAttr: any = tryParseJson(
                          product?.attributesJson
                        )
                        const electricVoltAttrLength =
                          voltageAttr?.Attributes?.filter(
                            (x: any) => x?.FieldCode == 'electrical.voltage'
                          )

                        let productNameWithVoltageAttr: any = product?.name
                        productNameWithVoltageAttr =
                          electricVoltAttrLength?.length > 0
                            ? electricVoltAttrLength?.map(
                                (volt: any, vId: number) => (
                                  <span key={`voltage-${vId}`}>
                                    {product?.name?.toLowerCase()}{' '}
                                    <span className="p-0.5 text-xs font-bold text-black bg-white border border-gray-500 rounded">
                                      {volt?.ValueText}
                                    </span>
                                  </span>
                                )
                              )
                            : (productNameWithVoltageAttr = product?.name)
                        if (product?.length) {
                          return (
                            <div
                              className="checkout-summary"
                              key={`summary-${product?.productId}`}
                            >
                              <BasketGroupProduct
                                key={product?.productId}
                                products={product}
                              />
                            </div>
                          )
                        }
                        return (
                          <div
                            key={product?.id}
                            className={`w-full px-2 py-2 mb-2 border rounded items-list ${
                              product?.price?.raw?.withTax > 0
                                ? 'bg-white'
                                : 'bg-emerald-50 border-emerald-400'
                            }`}
                          >
                            <div className="grid grid-cols-12 gap-2">
                              <div className="col-span-3">
                                <div className="img-container">
                                  <img
                                    width={120}
                                    height={150}
                                    src={`${product?.image}` || IMG_PLACEHOLDER}
                                    alt={product?.name}
                                    className="object-cover object-center w-32 image"
                                  />
                                </div>
                              </div>
                              <div className="col-span-9">
                                <h6 className="font-light text-black">
                                  {productNameWithVoltageAttr}
                                </h6>
                                <div className="flex items-center justify-between w-full my-2 gap-y-3">
                                  <div className="justify-start text-left">
                                    {product?.price?.raw?.withTax > 0 ? (
                                      <>
                                        <span className="block font-semibold text-black font-14">
                                          {isIncludeVAT
                                            ? product?.price?.formatted?.withTax
                                            : product?.price?.formatted
                                                ?.withoutTax}
                                          {product?.listPrice?.raw.withTax >
                                            0 &&
                                          product?.listPrice?.raw.withTax !=
                                            product?.price?.raw?.withTax ? (
                                            <span className="pl-2 font-normal text-gray-400 line-through font-14">
                                              {' '}
                                              {isIncludeVAT
                                                ? product?.listPrice.formatted
                                                    ?.withTax
                                                : product?.listPrice.formatted
                                                    ?.withoutTax}
                                            </span>
                                          ) : null}
                                          <span className="pl-2 font-light text-black font-12">
                                            {isIncludeVAT ? translate('label.orderSummary.incVATText') : translate('label.orderSummary.excVATText') }
                                          </span>
                                        </span>
                                      </>
                                    ) : (
                                      <>
                                        <span className="flex flex-col font-semibold text-red-500">
                                          {translate('label.orderSummary.freeText')}
                                        </span>
                                        <span className="flex flex-col font-semibold text-black">
                                          {translate('common.label.qtyText')} {product?.qty}
                                        </span>
                                      </>
                                    )}
                                  </div>
                                  <div className="justify-end">
                                    <span className="flex flex-col font-semibold text-black">
                                      {translate('common.label.qtyText')} {product?.qty}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
                {referralAvailable &&
                  isGuestUser &&
                  data?.contactDetails?.emailAddress && ( //user?.userEmail && (
                    <h3
                      className="text-sm font-semibold underline cursor-pointer text-green"
                      onClick={() => {
                        setReferralModalShow(true)
                      }}
                    >
                      {translate('label.myAccount.beenReferredByFriendHeadingText')}
                    </h3>
                  )}
                <div className="px-4 mt-0">
                  <PromotionInput
                    deviceInfo={deviceInfo}
                    basketPromos={basketPromos}
                    items={data}
                    getBasketPromoses={getBasketPromos}
                  />
                </div>
                {/* product price summary start */}
                <div className="w-full px-4">
                  <dl className="mt-2 space-y-2 sm:space-y-2">
                    <div
                      className={
                        data?.deliveryPlans?.length > 0
                          ? 'py-3 border-b border-gray-200'
                          : ''
                      }
                    >
                      {data?.deliveryPlans?.length > 0 && (
                        <div className="flex items-end justify-between pt-2 mb-2 sm:pt-1">
                          {data?.estimatedDeliveryDate && (
                            <>
                              <dt className="flex flex-col items-start text-sm text-black">
                                <span className="font-14">{translate('label.checkout.deliveryText')}</span>
                              </dt>
                              <dd className="block text-black font-18">
                                {isIncludeVAT
                                  ? data?.shippingCharge?.raw?.withTax == 0
                                    ? 'FREE'
                                    : data?.shippingCharge?.formatted
                                        ?.withTax || EmptyString
                                  : data?.shippingCharge?.raw?.withoutTax == 0
                                  ? 'FREE'
                                  : data?.shippingCharge?.formatted
                                      ?.withoutTax || EmptyString}
                              </dd>
                            </>
                          )}
                        </div>
                      )}

                      {groupedPromotions?.autoAppliedPromos?.length > 0 && (
                        <div className="flex items-end justify-between pt-2 mb-2 sm:pt-1">
                          <dt className="flex flex-col items-start text-sm text-black">
                            <span className="font-14">{translate('label.orderSummary.discountText')}</span>
                            {groupedPromotions?.autoAppliedPromos?.map(
                              (promo: any, idx: number) => (
                                <span key={idx} className="block mt-1 font-18">
                                  {promo?.name}
                                </span>
                              )
                            )}
                          </dt>
                          {groupedPromotions?.autoAppliedPromos?.map(
                            (promo: any, idx: number) =>
                              promo?.discountAmt?.raw?.withTax > 0 && (
                                <dd
                                  key={idx}
                                  className="block text-black font-18"
                                >
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
                            <span className="font-14">{translate('label.basket.promoCodeText')}</span>
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
                              <dd
                                key={idx}
                                className="block text-black font-18"
                              >
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
                      <dt className="flex items-center text-black font-18">
                        <span>{translate('label.orderSummary.subTotalVATIncText')}</span>
                      </dt>
                      <dd className="font-semibold text-black text-md">
                        {data?.subTotal?.formatted?.withoutTax}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between pt-2 sm:pt-1">
                      <dt className="flex items-center text-black font-18">
                        <span>{translate('label.orderSummary.totalVATText')}</span>
                      </dt>
                      <dd className="font-semibold text-black text-md">
                        {data?.grandTotal?.formatted?.tax}
                      </dd>
                    </div>

                    {cartItems?.deliveryPlans?.length > 0 && (
                      <div className="flex items-center justify-between pt-2 sm:pt-1">
                        <dt className="flex items-center text-black font-18">
                          <span>{translate('label.orderSummary.shippingText')}</span>
                        </dt>
                        <dd className="font-semibold text-black text-md">
                          {isIncludeVAT
                            ? cartItems?.shippingCharge?.raw?.withTax == 0
                              ? translate('label.orderSummary.freeText')
                              : cartItems?.shippingCharge?.formatted?.withTax ||
                                EmptyString
                            : cartItems?.shippingCharge?.raw?.withoutTax == 0
                            ? translate('label.orderSummary.freeText')
                            : cartItems?.shippingCharge?.formatted
                                ?.withoutTax || EmptyString}
                        </dd>
                      </div>
                    )}

                    <div
                      className={`flex items-center justify-between py-2 my-3 text-gray-900 border-t border-gray-300`}
                    >
                      <dt className="font-bold text-black font-18">{translate('label.orderSummary.totalText')}</dt>
                      <dd className="text-xl font-bold text-black">
                        {data?.grandTotal?.formatted?.withTax}
                        {/*{isIncludeVAT
                  ? data?.grandTotal?.formatted?.withTax
                  : data?.grandTotal?.formatted?.withoutTax}*/}
                      </dd>
                    </div>
                  </dl>
                </div>
                {/* product price summary End */}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      <Transition.Root show={referralModalShow} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 overflow-hidden z-999"
          onClose={() => {
            setReferralModalShow(!referralModalShow)
          }}
        >
          <div className="absolute inset-0 overflow-hidden z-999">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay
                className="w-full h-screen bg-black opacity-50"
                onClick={() => {
                  setReferralModalShow(!referralModalShow)
                }}
              />
            </Transition.Child>

            <div className="fixed inset-0 flex items-center justify-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="2xl:w-screen 2xl:h-auto  xl:h-[500px] max-w-xl 2xl:max-w-xl">
                  <div className="flex flex-col h-full overflow-y-auto rounded shadow-xl bg-gray-50">
                    <div className="flex-1 px-0 overflow-y-auto">
                      <div className="sticky top-0 z-10 flex items-start justify-between w-full px-6 py-4 border-b shadow bg-indigo-50">
                        <Dialog.Title className="text-lg font-medium text-gray-900">
                        {translate('label.myAccount.beenReferredByFriendHeadingText')}
                        </Dialog.Title>
                        <div className="flex items-center ml-3 h-7">
                          <button
                            type="button"
                            className="p-2 -m-2 text-gray-400 hover:text-gray-500"
                            onClick={() => {
                              setReferralModalShow(!referralModalShow)
                            }}
                          >
                            <span className="sr-only">{translate('common.label.closePanelText')}</span>
                            <XMarkIcon className="w-6 h-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-row sm:px-0">
                        {/*Referal Program Info view*/}
                        {referralAvailable && !referralInfo && (
                          <div className="flex flex-col w-full max-w-lg my-10 2xl:justify-center xl:items-center px-9">
                            <h2 className="mx-2 text-[30px] text-center">
                              {translate('label.checkout.searchFriendByReferralCodeText')}
                            </h2>
                            <p className="px-8 text-[18px] text-center">
                              {translate('label.checkout.friendSignupConfirmationText')}
                            </p>
                            <input
                              type="text"
                              placeholder={translate('label.checkout.enterReferralCodeText')}
                              className="px-5 w-full my-2 py-3 border-[1px] border-gray-500"
                              onChange={handleInputChange}
                            />
                            {error && (
                              <p className="text-sm text-red-700">{error}</p>
                            )}
                            <Button
                              className="my-3"
                              onClick={() => {
                                handleReferralSearch()
                              }}
                            >
                              {isLoading ? <LoadingDots /> : translate('label.myAccount.findReferralBtnText')}
                            </Button>
                          </div>
                        )}
                        {referralInfo && (
                          <div
                            className={classNames(
                              'my-10 flex w-full flex-col justify-center items-center'
                            )}
                          >
                            <h2 className="px-5 text-center">
                              {translate('label.checkout.friendFoundConfirmationText')}
                            </h2>
                            <div className="py-2 flex flex-row border-[1px] my-5 items-center justify-center border-gray-600">
                              <p className="px-3 !mt-0 text-center font-bold ">
                                {translate('label.checkout.voucherCodeText')}: {referralInfo?.voucherCode}
                              </p>
                              <div
                                className="w-5 m-0 "
                                onClick={handleCopyClick}
                              >
                                {!copied ? (
                                  <ClipboardIcon className="flex items-center justify-center" />
                                ) : (
                                  <ClipboardFill className="flex items-center justify-center" />
                                )}
                                {/* {copied ? 'COPIED' : 'COPY CODE'} */}
                              </div>
                            </div>
                            <p className="px-5 font-bold text-center">
                              Offer: {referralInfo?.promoName}
                            </p>
                            <p className="font-bold">
                              {translate('label.checkout.validityText')}:{' '}
                              {/* {`This offer is valid for ${referralInfo?.validityDays} Days`} */}
                              {`${formatFromToDates(
                                referralInfo?.validFrom,
                                referralInfo?.validTo
                              )}`}
                            </p>
                            <p className="px-12 text-center">
                              {translate('common.label.availGiftText')}</p>
                          </div>
                        )}
                        <div className="flex w-full xl:h-[439px] 2xl:h-auto 2xl:object-none xl:object-cover">
                          <img
                            src={'/assets/images/refer-a-friend.jpg'}
                            alt="banner"
                            height={700}
                            width={480}
                            className="object-cover"
                          ></img>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}

export default MobileBasketDetails
