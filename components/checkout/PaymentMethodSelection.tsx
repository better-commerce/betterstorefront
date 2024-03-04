// Base Imports
import React, { useState, useEffect, useReducer, memo } from 'react'

// Package Imports
import axios from 'axios'
import Cookies from 'js-cookie'
import Router from 'next/router'
import { PaymentMethodType } from '@better-commerce/bc-payments-sdk'

// Component Imports
import { LoadingDots, useUI } from '@components/ui'
import PaymentWidget from '@components/checkout-old/PaymentWidget'
import PaymentButton from '@components/checkout-old/CheckoutForm/PaymentButton'

// Other Imports
import { matchStrings, tryParseJson } from '@framework/utils/parse-util'
import { isClearPayPriceThresholdInvalid } from '@framework/utils/payment-util'
import { Payments } from '@components/utils/payment-constants'
import { GENERAL_CONFIRM } from '@components/utils/textVariables'
import { Cookie } from '@framework/utils/constants'
import {
  BETTERCOMMERCE_DEFAULT_COUNTRY,
  EmptyObject,
  EmptyString,
  Messages,
  NEXT_PAYMENT_METHODS_LIST,
} from '@components/utils/constants'
import setSessionIdCookie from '@components/utils/setSessionId'
import cartHandler from '@components/services/cart'
import { Guid } from '@commerce/types'
import { decrypt, encrypt } from '@framework/utils/cipher'
import { recordGA4Event } from '@components/services/analytics/ga4'

interface PaymentMethodSelectionProps {
  readonly basket: any
  readonly isApplePayScriptLoaded: any
  readonly uiContext: any
  readonly setAlert: any
  readonly selectedDeliveryMethod: any
  readonly setOverlayLoaderState: any
  readonly hideOverlayLoaderState: any
  generateBasketId: any
  onPaymentMethodSelect: (method: any) => void
}

const PaymentMethodSelection: React.FC<PaymentMethodSelectionProps> = memo(
  ({
    basket,
    isApplePayScriptLoaded,
    uiContext,
    setAlert,
    selectedDeliveryMethod,
    onPaymentMethodSelect,
    setOverlayLoaderState,
    hideOverlayLoaderState,
    generateBasketId,
  }) => {
    const { shippingAddress, billingAddress }: any = basket || EmptyObject
    const selectedAddress = { shippingAddress, billingAddress }
    const window: any = global.window
    const { user, basketId, setBasketId, setOrderId } = useUI()
    const { associateCart } = cartHandler()
    const [paymentMethods, setPaymentMethods] = useState<
      Array<any> | undefined
    >(undefined)
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<any>()
    const [basketOrderInfo, setBasketOrderInfo] = useState<any>(undefined)

    const isBrowser = typeof window !== 'undefined'
    const INITIAL_STATE = {
      error: '',
      orderResponse: EmptyObject,
      showStripe: false,
      isPaymentIntent: isBrowser
        ? new URLSearchParams(window.location.search).get(
          'payment_intent_client_secret'
        )
        : null,
      isPaymentWidgetActive: false,
    }

    interface stateInterface {
      error: string
      orderResponse: any
      showStripe: boolean
      isPaymentIntent: boolean
      isPaymentWidgetActive: boolean
    }

    interface actionInterface {
      type?: string
      payload?: any
    }

    function reducer(
      state: stateInterface,
      { type, payload }: actionInterface
    ) {
      switch (type) {
        case 'SET_ERROR': {
          return {
            ...state,
            error: payload,
          }
        }

        case 'SET_ORDER_RESPONSE': {
          return {
            ...state,
            orderResponse: payload,
          }
        }

        case 'TRIGGER_STRIPE': {
          return {
            ...state,
            showStripe: payload,
          }
        }
        default: {
          return state
        }
      }
    }
    const [state, dispatch]: any = useReducer<any>(reducer, INITIAL_STATE)

    const loadPaymentMethods = async () => {
      const { data: response }: any = await axios.post(
        NEXT_PAYMENT_METHODS_LIST,
        encrypt(
          JSON.stringify({
            currencyCode: basket?.baseCurrency,
            countryCode:
              selectedAddress?.billingAddress?.countryCode ||
              BETTERCOMMERCE_DEFAULT_COUNTRY,
            basketId: basketId,
          })
        )
      )
      const paymentMethods: any = tryParseJson(decrypt(response))
      setPaymentMethods(paymentMethods)
      return paymentMethods
    }

    /**
     * Returns the reordered the payment methods array to place "checkout.com" at the first place for credit/debit card payments.
     * @param methods
     * @returns
     */
    const getMethods = (methods: Array<any>) => {
      return methods
        ?.filter((x: any) =>
          matchStrings(x?.systemName, PaymentMethodType.CHECKOUT, true)
        )
        .concat(
          methods?.filter((x: any) => {
            if (
              matchStrings(x?.systemName, PaymentMethodType.CLEAR_PAY, true) &&
              isClearPayPriceThresholdInvalid(basket?.grandTotal?.raw?.withTax)
            ) {
              return
            }
            if (!matchStrings(x?.systemName, PaymentMethodType.CHECKOUT, true))
              return x
          })
        )
    }

    const showPaymentOption = (method: any): boolean => {
      if (
        matchStrings(
          method?.systemName,
          PaymentMethodType.CHECKOUT_APPLE_PAY,
          true
        )
      ) {
        //return isApplePayScriptLoaded
        return (
          window?.ApplePaySession !== undefined &&
          window?.ApplePaySession?.canMakePaymentsWithActiveCard(
            Payments.APPLE_PAY_MERCHANT_ID
          )
        )
      }
      return true
    }

    const spriteIcon = (systemName: string) => {
      if (matchStrings(systemName, PaymentMethodType.CHECKOUT, true)) {
        return 'sprite-debit-lg'
      } else if (matchStrings(systemName, PaymentMethodType.CLEAR_PAY, true)) {
        return 'sprite-clearpay-xsm'
      } else if (matchStrings(systemName, PaymentMethodType.PAYPAL, true)) {
        return 'sprite-paypal-xsm'
      } else if (matchStrings(systemName, PaymentMethodType.COD, true)) {
        return 'sprite-cod'
      } else if (matchStrings(systemName, PaymentMethodType.KLARNA, true)) {
        return 'sprite-klarna'
      } else if (matchStrings(systemName, PaymentMethodType.STRIPE, true)) {
        return 'sprite-stripe'
      } else if (
        matchStrings(systemName, PaymentMethodType.CHECKOUT_APPLE_PAY, true)
      ) {
        return 'sprite-apple-pay-sm'
      }
      return EmptyString
    }

    const handleMethodSelection = (method: any) => {
      setSelectedPaymentMethod(method)
    }

    const getPaymentOrderInfo = async (paymentMethod: any) => {
      const paymentOrderInfo = {
        user,
        basketId,
        customerId: basket.userId != Guid.empty ? basket.userId : user?.userId,
        basket,
        billingAddress: {
          ...selectedAddress?.billingAddress,
          country: selectedAddress?.billingAddress?.countryCode,
          countryCode:
            selectedAddress?.billingAddress
              ?.countryCode /*|| state.deliveryMethod.twoLetterIsoCode*/,
        },
        shippingAddress: {
          ...selectedAddress?.shippingAddress,
          country: selectedAddress?.shippingAddress?.countryCode,
          countryCode:
            selectedAddress?.shippingAddress
              ?.countryCode /*|| state.deliveryMethod.twoLetterIsoCode*/,
        },
        //selectedShipping: state.shippingMethod,
        selectedShipping: basket?.shippingMethods?.find(
          (x: any) => x?.id === basket?.shippingMethodId
        ),
        selectedPayment: paymentMethod,
        storeId: EmptyString, //state.storeId,

        Payment: {
          orderAmount: basket?.grandTotal?.raw?.withTax,
        },
      }
      /*const billingAddrId = await lookupAddressId(paymentOrderInfo.billingAddress)
    paymentOrderInfo.billingAddress.id = billingAddrId
    const shippingAddrId = await lookupAddressId(
      paymentOrderInfo.shippingAddress
    )
    paymentOrderInfo.shippingAddress.id = shippingAddrId*/
      setBasketOrderInfo(paymentOrderInfo)
      return paymentOrderInfo
    }

    const checkoutCallback = async (orderId: any) => {
      Cookies.remove(Cookie.Key.SESSION_ID)
      setSessionIdCookie()
      Cookies.remove(Cookie.Key.BASKET_ID)
      const generatedBasketId = generateBasketId()
      setBasketId(generatedBasketId)
      const userId = basket.userId
      const newCart = await associateCart(userId, generatedBasketId)
      //setCartItems(newCart.data)
      setOrderId(orderId)
      Router.push('/thank-you')
    }

    useEffect(() => {
      const asyncHandler = async () => {
        const paymentMethods: any = await loadPaymentMethods()

        if (paymentMethods?.length) {
          const defaultSelectedPaymentMethod = paymentMethods?.find(
            (x: any) => x.isDefault
          )
          if (!defaultSelectedPaymentMethod) {
            const paymentMethod = getMethods(paymentMethods)[0]
            if (paymentMethod?.id) {
              setTimeout(() => {
                const chk: any = document.querySelector(
                  `input.pnl${paymentMethod?.systemName}`
                )
                if (chk) {
                  chk.checked = true
                }
                setSelectedPaymentMethod(paymentMethod)
              }, 50)
            }
          } else {
            if (defaultSelectedPaymentMethod?.id) {
              setTimeout(() => {
                const chk: any = document.querySelector(
                  `input.pnl${defaultSelectedPaymentMethod?.systemName}`
                )
                if (chk) {
                  chk.checked = true
                }
                setSelectedPaymentMethod(defaultSelectedPaymentMethod)
              }, 50)
            }
          }
        }
      }
      asyncHandler()
    }, [])

    useEffect(() => {
      if (selectedPaymentMethod?.id) {
        getPaymentOrderInfo(selectedPaymentMethod)
      }
    }, [selectedPaymentMethod])

    const contactDetails: any = {
      userId: user?.userId,
      firstName: user?.firstName,
      lastName: user?.lastName,
      emailAddress: user?.email,
      phoneNumber: user?.mobile || user?.telephone,
    }

    const recordEvent = (event: { name: string; data: any }) => {
      if (event?.name && typeof window !== undefined) {
        recordGA4Event(window, event?.name, {
          ...event?.data,
          originalLocation: window.location.href,
        })
      }
    }

    return paymentMethods ? (
      <>
        {paymentMethods?.length > 0 ? (
          <div className="">
            <div className="flex flex-col gap-2 mt-4 bg-white rounded-md sm:p-4 sm:border sm:border-gray-200 sm:bg-gray-50">
              <h5 className="px-0 font-semibold uppercase sm:px-0 font-18 dark:text-black">
                Payment Methods
              </h5>
              <div className="p-2 sm:p-0 bg-[#fbfbfb] sm:bg-transparent border border-gray-200 sm:border-0 rounded-md sm:rounded-none">
                <div
                  className={`grid grid-cols-2 sm:grid-cols-3 gap-3 sm:mt-2 mt-0`}
                >
                  {getMethods(paymentMethods)?.map((item: any, idx: number) => (
                    <>
                      {showPaymentOption(item) && (
                        <div
                          key={idx}
                          id={`pnl${item?.systemName}`}
                          onClick={() => handleMethodSelection(item)}
                          className={`${selectedPaymentMethod?.id === item?.id ? '' : ''
                            }  pointer mb-0 flex justify-start flex-row`}
                        >
                          <div className="w-full mb-0">
                            <label className="custom-radio">
                              <input
                                className={`pnl${item?.systemName}`}
                                id="debit"
                                type="radio"
                                name="payment"
                                value=""
                                defaultChecked={
                                  selectedPaymentMethod?.id === item?.id
                                }
                              />
                              <div
                                className={`items-center justify-center w-24 h-20 px-3 py-3 bg-white radio-btn orange-border gap-x-4 height-auto-rm`}
                              >
                                <div className="flex items-center justify-center text-span">
                                  <i
                                    className={`sprite-icons ${spriteIcon(
                                      item?.systemName
                                    )}`.trim()}
                                  ></i>
                                  {matchStrings(
                                    item?.systemName,
                                    PaymentMethodType.KLARNA,
                                    true
                                  ) ? (
                                    <>
                                      <i className="sprite-icons"></i>
                                    </>
                                  ) : matchStrings(
                                    item?.systemName,
                                    PaymentMethodType.COD,
                                    true
                                  ) ? (
                                    <i className="sprite-icons"></i>
                                  ) : matchStrings(
                                    item?.systemName,
                                    PaymentMethodType.ACCOUNT_CREDIT,
                                    true
                                  ) ? (
                                    <>
                                      <i className="sprite-icons icon-btn-accountcredit"></i>
                                      <span className="pl-2 capitalize font-12 dark:text-black">
                                        Account{' '}
                                        <span className="block">Credit</span>
                                      </span>
                                    </>
                                  ) : matchStrings(
                                    item?.systemName,
                                    PaymentMethodType.CHEQUE,
                                    true
                                  ) ? (
                                    <>
                                      <i className="sprite-icons icon-btn-cheque"></i>
                                      <span className="pl-2 capitalize font-12 dark:text-black">
                                        Cheque
                                      </span>
                                    </>
                                  ) : (
                                    matchStrings(
                                      item?.systemName,
                                      PaymentMethodType.CHECKOUT,
                                      true
                                    ) && (
                                      <>
                                        <span className="pl-2 capitalize font-12 dark:text-black">
                                          Debit/Credit{' '}
                                          <span className="block">Card</span>
                                        </span>
                                      </>
                                    )
                                  )}
                                </div>
                              </div>
                            </label>
                          </div>
                        </div>
                      )}
                    </>
                  ))}
                </div>
              </div>
            </div>
            <div>
              {selectedPaymentMethod?.id && basketOrderInfo && (
                <>
                  <div className="flex flex-col justify-center w-full gap-2 pb-5 mt-4 bg-white rounded-md sm:p-4 sm:border sm:border-gray-200 sm:bg-gray-50">
                    <PaymentButton
                      btnTitle={GENERAL_CONFIRM}
                      paymentMethod={selectedPaymentMethod}
                      basketOrderInfo={basketOrderInfo}
                      uiContext={uiContext}
                      dispatchState={dispatch}
                      contactDetails={contactDetails}
                      isApplePayScriptLoaded={isApplePayScriptLoaded}
                      onScrollToSection={() => { }}
                      recordEvent={recordEvent}
                    />
                    {(state?.isPaymentWidgetActive ||
                      !!state?.isPaymentIntent) && (
                        <PaymentWidget
                          paymentMethod={selectedPaymentMethod}
                          checkoutCallback={checkoutCallback}
                          orderModelResponse={state?.orderResponse}
                        />
                      )}
                  </div>
                  {state?.error && (
                    <h4 className="py-5 text-lg font-semibold text-red-500">
                      {state?.error}
                    </h4>
                  )}
                </>
              )}
            </div>
          </div>
        ) : (
          <p>No payment method(s).</p>
        )}
      </>
    ) : (
      <LoadingDots />
    )
  }
)

export default PaymentMethodSelection
