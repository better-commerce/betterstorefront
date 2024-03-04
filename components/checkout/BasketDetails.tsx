import {
  EmptyString,
  NEXT_GET_BASKET_PROMOS,
  NEXT_REFERRAL_ADD_USER_REFEREE,
  NEXT_REFERRAL_BY_SLUG,
  NEXT_REFERRAL_INFO,
} from '@components/utils/constants'
import {
  BEEN_REFERRED_BY_A_FRIEND,
  CLOSE_PANEL,
  FIND_THEM,
  GENERAL_SHIPPING,
  IMG_PLACEHOLDER,
  USER_NOT_FOUND,
} from '@components/utils/textVariables'
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
import { Button, LoadingDots, useUI } from '@components/ui'
import ClipboardFill from '@heroicons/react/24/solid/ClipboardIcon'
import classNames from 'classnames'
import Summary from '@components/checkout/Summary'
import { sortBy } from 'lodash'
import BasketItems from '@components/checkout/BasketItems'
interface BasketItem {
  id: string
  name: string
  quantity: number
  price: number
}

const BasketDetails = ({ basket, deviceInfo }: any) => {
  const { isMobile, isIPadorTablet } = deviceInfo
  const { user, isGuestUser, setAlert } = useUI()
  const [referralAvailable, setReferralAvailable] = useState(false)
  const [referralModalShow, setReferralModalShow] = useState(false)
  const [referralInfo, setReferralInfo] = useState<any>(null)
  const [copied, setCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [refCodeInput, setRefCodeInput] = useState('')
  const [error, setError] = useState('')
  const [referralEmail, setReferralEmail] = useState<any>('')
  const [userCartItems, setUserCartItems] = useState<any>(null)
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
      setError('Referral Vouchers not available for this user!')
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
          setError(USER_NOT_FOUND)
        }
      } else {
        setIsLoading(false)
        setError('Referral Code not found')
      }
    } else {
      setIsLoading(false)
      setError('Please enter appropriate Referral Code')
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
      {isMobile || isIPadorTablet ? (
        <>
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button className="flex items-center justify-between w-full gap-2 p-3 text-sm font-light text-left text-black normal-case border-b border-gray-700 bg-gray-50">
                  <span className="font-medium text-orange-700 font-12">
                    <ShoppingCartIcon className="inline-block w-4 h-4 text-orange-700" />{' '}
                    {open ? 'Hide' : 'Show'} order summary{' '}
                    <ChevronDownIcon className={`inline-block w-4 h-4 text-orange-700 ${open ? 'rotate-180 transform' : ''}`} />
                  </span>
                  <span className="font-semibold text-black">
                    {basket?.grandTotal?.formatted?.withTax}
                  </span>
                </Disclosure.Button>
                <Disclosure.Panel className="px-0 pt-3 pb-0 bg-gray-100">
                  <div className="h-auto border-b border-gray-300 card-summary">
                    <div className="w-full px-4 py-0 cart-items ">
                      <div className="flex items-center justify-between w-full gap-2 text-sm font-light text-left text-black normal-case">
                        <span className="font-semibold text-black">
                          {basket?.lineItems?.length}{' '}
                          {basket?.lineItems?.length > 1 ? 'items' : 'item'}
                        </span>
                      </div>
                      <div className="w-full px-0 pt-3 pb-2">
                        <BasketItems userCartItems={basket?.lineItems} />
                      </div>
                    </div>
                    {referralAvailable &&
                      isGuestUser &&
                      basket?.contactDetails?.emailAddress && ( //user?.userEmail && (
                        <h3
                          className="text-sm font-semibold underline cursor-pointer text-green"
                          onClick={() => {
                            setReferralModalShow(true)
                          }}
                        >
                          {BEEN_REFERRED_BY_A_FRIEND}
                        </h3>
                      )}
                    <Summary
                      basket={basket}
                      groupedPromotions={groupedPromotions}
                      deviceInfo={deviceInfo}
                      basketPromos={basketPromos}
                      getBasketPromos={getBasketPromos}
                    />
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </>
      ) : (
        <div className="h-auto card-summary right-panel-basket">
          <h3 className="mb-4 text-2xl font-semibold text-black uppercase">Order Summary</h3>
          {/* product list start */}
          <div className="w-full px-4 py-2 bg-white rounded shadow cart-items hover:bg-white">
            <Disclosure defaultOpen={true}>
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex items-center justify-between w-full gap-2 text-sm font-light text-left text-black normal-case">
                    <span className="font-semibold text-black">
                      {basket?.lineItems?.length}{' '}
                      {basket?.lineItems?.length > 1 ? 'items' : 'item'}
                    </span>
                    <i
                      className={`${open ? 'rotate-180 transform' : ''
                        } sprite-icons sprite-dropdown`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-0 pt-3 pb-2">
                    <div className="w-full max-basket-panel">
                      <BasketItems userCartItems={basket?.lineItems} />
                    </div>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </div>
          {referralAvailable &&
            isGuestUser &&
            basket?.contactDetails?.emailAddress && ( //user?.userEmail && (
              <h3
                className="text-sm font-semibold underline cursor-pointer text-green"
                onClick={() => {
                  setReferralModalShow(true)
                }}
              >
                {BEEN_REFERRED_BY_A_FRIEND}
              </h3>
            )}
          <Summary
            basket={basket}
            groupedPromotions={groupedPromotions}
            deviceInfo={deviceInfo}
            basketPromos={basketPromos}
            getBasketPromos={getBasketPromos}
          />
        </div>
      )}

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
                          {BEEN_REFERRED_BY_A_FRIEND}
                        </Dialog.Title>
                        <div className="flex items-center ml-3 h-7">
                          <button
                            type="button"
                            className="p-2 -m-2 text-gray-400 hover:text-gray-500"
                            onClick={() => {
                              setReferralModalShow(!referralModalShow)
                            }}
                          >
                            <span className="sr-only">{CLOSE_PANEL}</span>
                            <XMarkIcon className="w-6 h-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-row sm:px-0">
                        {/*Referal Program Info view*/}
                        {referralAvailable && !referralInfo && (
                          <div className="flex flex-col w-full max-w-lg my-10 2xl:justify-center xl:items-center px-9">
                            <h2 className="mx-2 text-[30px] text-center">
                              Search your Friend by their Referral Code
                            </h2>
                            <p className="px-8 text-[18px] text-center">
                              If you think they have signed up, please check and
                              confirm their details below
                            </p>
                            <input
                              type="text"
                              placeholder="Enter your friend's Referral Code.."
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
                              {isLoading ? <LoadingDots /> : FIND_THEM}
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
                              Congratulations, We found your friend!
                            </h2>
                            <div className="py-2 flex flex-row border-[1px] my-5 items-center justify-center border-gray-600">
                              <p className="px-3 !mt-0 text-center font-bold ">
                                Voucher-code: {referralInfo?.voucherCode}
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
                              Validity:{' '}
                              {/* {`This offer is valid for ${referralInfo?.validityDays} Days`} */}
                              {`${formatFromToDates(
                                referralInfo?.validFrom,
                                referralInfo?.validTo
                              )}`}
                            </p>
                            <p className="px-12 text-center">
                              Use this voucher code in the Apply promotion
                              section to avail this offer
                            </p>
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

export default BasketDetails
