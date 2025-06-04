// Base Imports
import React, { useState, useEffect, useReducer, memo, useMemo } from 'react'

// Package Imports
import axios from 'axios'
import Cookies from 'js-cookie'
import Router from 'next/router'
import { PaymentMethodType, PaymentSelectionType } from 'bc-payments-sdk'

// Component Imports
import { LoadingDots, useUI } from '@components/ui'
import PaymentWidget from '@components/SectionCheckoutJourney/checkout/PaymentWidget'
import PaymentButton from '@components/SectionCheckoutJourney/checkout/CheckoutForm/PaymentButton'

// Other Imports
import { matchStrings, stringToBoolean, tryParseJson } from '@framework/utils/parse-util'
import { isClearPayPriceThresholdInvalid } from '@framework/utils/payment-util'
import { Payments } from '@components/utils/payment-constants'
import { Cookie } from '@framework/utils/constants'
import { BETTERCOMMERCE_DEFAULT_COUNTRY, EmptyObject, EmptyString, Messages, NEXT_PAYMENT_METHODS_LIST, } from '@components/utils/constants'
import setSessionIdCookie from '@components/utils/setSessionId'
import cartHandler from '@components/services/cart'
import { Guid } from '@commerce/types'
import { decrypt, encrypt } from '@framework/utils/cipher'
import { useTranslation } from '@commerce/utils/use-translation'
import SaveB2BQuote from '../SaveB2BQuote'
import useAnalytics from '@components/services/analytics/useAnalytics'
import PaymentTypeSelection from '../PaymentTypeSelection'
import PaymentMethodOptions from './PaymentMethodOptions'

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
  featureToggle: any
}

const PaymentMethodSelection: React.FC<PaymentMethodSelectionProps> = memo( ({ basket, isApplePayScriptLoaded, uiContext, setAlert, selectedDeliveryMethod, onPaymentMethodSelect, setOverlayLoaderState, hideOverlayLoaderState, generateBasketId, featureToggle }) => {
    const { recordAnalytics } = useAnalytics()
    const translate = useTranslation()
    const { shippingAddress, billingAddress }: any = basket || EmptyObject
    const selectedAddress = { shippingAddress, billingAddress }
    const window: any = global.window
    const { user, basketId, setBasketId, setOrderId } = useUI()
    const { associateCart } = cartHandler()
    const [paymentMethods, setPaymentMethods] = useState<Array<any> | undefined>(undefined)
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<any>()
    const [basketOrderInfo, setBasketOrderInfo] = useState<any>(undefined)
    const [paymentType, setPaymentType] = useState('full')
    const [partialAmount, setPartialAmount] = useState(0)
    const [otherSelectedMethodForPartialPayment, setOtherSelectedMethodForPartialPayment] = useState<string>()

    const selectedPaymentSplitPaymentEnabled = useMemo(() => {
      return stringToBoolean(selectedPaymentMethod?.settings?.find((setting: any) => setting?.key === 'EnableSplitPayment')?.value) || false
    }, [selectedPaymentMethod])

    const selectedPaymentSplitPaymentPrepaidValueType = useMemo(() => {
      return selectedPaymentMethod?.settings?.find((setting: any) => setting?.key === 'PrepaidValueType')?.value
    }, [selectedPaymentMethod])

    const selectedPaymentSplitPaymentMinimumPrepaidValue = useMemo(() => {
      return parseFloat(selectedPaymentMethod?.settings?.find((setting: any) => setting?.key === 'MinimumPrepaidValue')?.value)
    }, [selectedPaymentMethod])

    const isBrowser = typeof window !== 'undefined'
    const INITIAL_STATE = {
      error: '',
      orderResponse: EmptyObject,
      showStripe: false,
      isPaymentIntent: isBrowser ? new URLSearchParams(window.location.search).get( 'payment_intent_client_secret' ) : null,
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
          if (payload) {
            setAlert({ type: 'error', msg: payload })
          }
          return { ...state, error: payload, }
        }

        case 'SET_ORDER_RESPONSE': {
          return { ...state, orderResponse: payload, }
        }

        case 'TRIGGER_STRIPE': {
          return { ...state, showStripe: payload, }
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
          JSON.stringify({ currencyCode: basket?.baseCurrency, countryCode: selectedAddress?.billingAddress?.countryCode || BETTERCOMMERCE_DEFAULT_COUNTRY, basketId: basket?.id != Guid.empty ? basket?.id : basketId, })
        )
      )
      const paymentMethods: any = tryParseJson(decrypt(response))

      if (basket?.isPartialPayment) {

        const filteredPaymentMethods = [...paymentMethods].filter((x: any) => {

          // Hide COD & Cheque if current basket contains partial payment.
          if ([PaymentMethodType.COD, PaymentMethodType.CHEQUE].includes(x?.systemName?.toLowerCase())) {
            return false
          }
          return true
        })
        setPaymentMethods(filteredPaymentMethods)
        return filteredPaymentMethods
      } else {
        setPaymentMethods(paymentMethods)
      }
      return paymentMethods
    }

    /**
     * Returns the reordered the payment methods array to place "checkout.com" at the first place for credit/debit card payments.
     * @param methods
     * @returns
     */
    const getMethods = (methods: Array<any>) => {
      return methods
        ?.filter((x: any) => matchStrings(x?.systemName, PaymentMethodType.CHECKOUT, true))
        .concat(
          methods?.filter((x: any) => {
            if (matchStrings(x?.systemName, PaymentMethodType.CLEAR_PAY, true) && isClearPayPriceThresholdInvalid(basket?.grandTotal?.raw?.withTax)) {
              return
            }
            if (!matchStrings(x?.systemName, PaymentMethodType.CHECKOUT, true))
              return x
          })
        )
    }

    const handleMethodSelection = (method: any, forPartialPayment = false) => {
      setSelectedPaymentMethod(method)
      if (forPartialPayment) {
        setOtherSelectedMethodForPartialPayment(method?.id)
      }
    }

    const getPaymentOrderInfo = async (paymentMethod: any) => {
      const paymentOrderInfo = {
        user,
        basketId: basket?.id != Guid.empty ? basket?.id : basketId,
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
        selectedShipping: basket?.shippingMethods?.find((x: any) => x?.id === basket?.shippingMethodId),
        selectedPayment: paymentMethod,
        storeId: EmptyString, //state.storeId,

        Payment: { orderAmount: basket?.grandTotal?.raw?.withTax, },
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
        if (paymentMethods?.length && !basket?.isPartialPayment) {
          const defaultSelectedPaymentMethod = paymentMethods?.find((x: any) => x.isDefault)
          if (!defaultSelectedPaymentMethod) {
            const paymentMethod = getMethods(paymentMethods)[0]
            if (paymentMethod?.id) {
              setTimeout(() => {
                const chk: any = document.querySelector(`input.pnl${paymentMethod?.systemName}`)
                if (chk) {
                  chk.checked = true
                }
                setSelectedPaymentMethod(paymentMethod)
              }, 50)
            }
          } else {
            if (defaultSelectedPaymentMethod?.id) {
              setTimeout(() => {
                const chk: any = document.querySelector(`input.pnl${defaultSelectedPaymentMethod?.systemName}`)
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
      if (otherSelectedMethodForPartialPayment && otherSelectedMethodForPartialPayment !== Guid.empty) {
        const filteredPaymentMethods = paymentMethods?.filter((x: any) => x.id === otherSelectedMethodForPartialPayment) || []
        setPaymentMethods(filteredPaymentMethods)
      }
    }, [otherSelectedMethodForPartialPayment])

    useEffect(() => {
      if (selectedPaymentMethod?.id || basket?.isPartialPayment) {
        getPaymentOrderInfo(selectedPaymentMethod)
      }
    }, [selectedPaymentMethod, basket?.isPartialPayment])

    const contactDetails: any = { userId: user?.userId, firstName: user?.firstName, lastName: user?.lastName, emailAddress: user?.email, phoneNumber: user?.mobile || user?.telephone, }
    const paymentMethodOptions = useMemo(() => {
      
      // If at least one partial payment is applied on the current basket
      if (/*selectedPaymentSplitPaymentEnabled &&*/ basket?.isPartialPayment) {

        // Filter-in partial payment methods supported by the current system
        const partialPaymentMethods = [...(paymentMethods || [])].filter((item: any) => (/*item.id === selectedPaymentMethod?.id ||*/ stringToBoolean(item?.settings?.find((setting: any) => setting?.key === 'EnableSplitPayment')?.value || 'false'))) || []

        // Find all the eligible partial payment methods by filtering-out the already paid partial payment method(s)
        const eligiblePartialPaymentMethods = partialPaymentMethods?.filter((item: any) => !basket?.partialPaidMethods?.includes(item?.systemName)) || []

        // If there are any eligible partial payment methods (with which payment is not yet taken up), return them
        if (eligiblePartialPaymentMethods?.length > 0) {
          return eligiblePartialPaymentMethods
        }

        // Else, filter-in the last paid partial payment method
        const lastPartialPaidMethod = basket?.partialPaidMethods?.[basket?.partialPaidMethods?.length - 1]

        // Return this last paid partial payment method, so that pay using other payment methods is visible to the user for further (last partial) payment
        return partialPaymentMethods?.filter((item: any) => item?.systemName?.toLowerCase() === lastPartialPaidMethod?.toLowerCase()) || []
      }
      
      // Else, return payment methods as usual
      return paymentMethods
    }, [paymentMethods, basket, selectedPaymentSplitPaymentEnabled])
    const splitPaymentMethodOptions = useMemo(() => [...(paymentMethods || [])].filter((item: any) => item.id !== selectedPaymentMethod?.id && !stringToBoolean(item?.settings?.find((setting: any) => setting?.key === 'EnableSplitPayment')?.value || 'false')), [paymentMethods, selectedPaymentMethod])

    const paymentTypeSelectionCmp = (
      <>
        {selectedPaymentSplitPaymentEnabled && ![PaymentMethodType.COD, PaymentMethodType.CHEQUE].includes(selectedPaymentMethod?.systemName?.toLowerCase())  && (
          <PaymentTypeSelection paymentType={paymentType} setPaymentType={setPaymentType} payableAmount={basket?.grandTotal?.raw?.withTax} partialAmount={partialAmount} setPartialAmount={setPartialAmount} basket={basket} dispatchState={dispatch} translate={translate} selectedPaymentMethod={selectedPaymentMethod} />
        )}
      </>
    )

    useEffect(() => {
      if (basket?.isPartialPayment && paymentMethodOptions?.length && !selectedPaymentMethod) {
        setSelectedPaymentMethod(paymentMethodOptions[0])
      }
    }, [basket?.isPartialPayment, paymentMethodOptions])

    useEffect(() => {
      if (!selectedPaymentSplitPaymentEnabled && partialAmount === 0) {
        setPaymentType(PaymentSelectionType.FULL)
        setPartialAmount(basket?.partialPayableAmount?.raw)
      }
    }, [selectedPaymentSplitPaymentEnabled, partialAmount])

    return paymentMethods ? (
      <>
        {paymentMethods?.length > 0 ? (
          <div className="">
            <div className="flex flex-col gap-2 mt-4 bg-white rounded-md sm:p-4 sm:border sm:border-gray-200 sm:bg-gray-50">
              <h5 className="px-0 font-semibold uppercase sm:px-0 font-18 dark:text-black">{translate('label.checkout.paymentMethodsText')}</h5>
              <div className="p-2 sm:p-0 bg-[#fbfbfb] sm:bg-transparent border border-gray-200 sm:border-0 rounded-md sm:rounded-none">

                {/* Refactored, refined & simplified component to display clickable payment methods(STARTS) */}
                <PaymentMethodOptions paymentMethods={paymentMethodOptions || []} basket={basket} getMethods={getMethods} selectedPaymentMethod={selectedPaymentMethod} handleMethodSelection={handleMethodSelection} translate={translate} />
                {/* Refactored, refined & simplified component to display clickable payment methods(ENDS) */}
              </div>
            </div>
            <div>
              {selectedPaymentMethod?.id && basketOrderInfo && (
                <div className="flex flex-col w-full py-5 px-5 space-y-4">

                  {/* EXCEPT for Wallet, Full & Partial Payment section is shown here(STARTS) */}
                  {!matchStrings(selectedPaymentMethod?.systemName, PaymentMethodType.WALLET, true) && (
                    <>{paymentTypeSelectionCmp}</>
                  )}
                  {/* EXCEPT for Wallet, Full & Partial Payment section is shown here(ENDS) */}

                  <div className="flex flex-col justify-center chk-payment-btn w-full gap-2 pb-5 mt-4 bg-white rounded-md sm:p-4 sm:border sm:border-gray-200 sm:bg-gray-50">

                    {/* GENERIC Payment Button */}
                    <PaymentButton translate={translate} btnTitle={translate('common.label.continueBtnText')} paymentMethod={selectedPaymentMethod} basketOrderInfo={basketOrderInfo} uiContext={uiContext} dispatchState={dispatch} contactDetails={contactDetails} isApplePayScriptLoaded={isApplePayScriptLoaded} onScrollToSection={() => { }} recordAnalytics={recordAnalytics} paymentType={selectedPaymentMethod?.systemName?.toLowerCase() === PaymentMethodType.COD ? PaymentSelectionType.FULL : paymentType} partialAmount={partialAmount ? partialAmount : 0} prepaidValueType={selectedPaymentSplitPaymentPrepaidValueType} minPrepaidValue={selectedPaymentSplitPaymentMinimumPrepaidValue} setPaymentType={setPaymentType} setPartialAmount={setPartialAmount} paymentTypeSelectionCmp={paymentTypeSelectionCmp} setSelectedPaymentMethod={setSelectedPaymentMethod} />
                    {(state?.isPaymentWidgetActive ||
                      !!state?.isPaymentIntent) && (
                        <PaymentWidget paymentMethod={selectedPaymentMethod} checkoutCallback={checkoutCallback} orderModelResponse={state?.orderResponse} />
                      )}
                    {state?.error && (
                      <h4 className="py-5 text-lg font-semibold text-red-500">
                        {state?.error}
                      </h4>
                    )}
                    <SaveB2BQuote basket={basket} />
                  </div>
                </div>
              )}

              {/* Section to display REST of the payment methods when PARTIAL PAYMENT is already completed (STARTS) */}
              {(selectedPaymentSplitPaymentEnabled && basket?.isPartialPayment && paymentType === PaymentSelectionType.PARTIAL && (basket?.partialPaidMethods || [])?.includes(selectedPaymentMethod?.systemName)) && (
                <div className="p-2 sm:p-0 bg-[#fbfbfb] sm:bg-transparent border border-gray-200 sm:border-0 rounded-md sm:rounded-none mb-6">
                  <div className="w-full text-black font-semibold capitalize p-2">Pay Remaining amount using:</div>
                  <PaymentMethodOptions paymentMethods={splitPaymentMethodOptions} basket={basket} getMethods={getMethods} selectedPaymentMethod={selectedPaymentMethod} handleMethodSelection={handleMethodSelection} translate={translate} forPartialPayment={true} />
                </div>
              )}
              {/* Section to display REST of the payment methods when PARTIAL PAYMENT is already completed (ENDS) */}
            </div>
          </div>
        ) : (
          <p className='dark:text-black'>{translate('label.checkout.noPaymentMethodText')}</p>
        )}
      </>
    ) : (
      <LoadingDots />
    )
  }
)

export default PaymentMethodSelection
