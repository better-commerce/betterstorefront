// Base Imports
import React from 'react'

// Package Imports
import axios from 'axios'
import Cookies from 'js-cookie'
import Router from 'next/router'
import { t as translate } from "i18next";
import { CheckoutPaymentSourceType, CheckoutPaymentType, PaymentMethodType, PaymentMethodTypeId } from '@better-commerce/bc-payments-sdk'

// Component Imports
import { CARD_PAYMENT_3DS_ENABLED } from '..'
import BasePaymentButton, { IApplePaymentProps, IDispatchState, IPaymentButtonProps, } from '../../BasePaymentButton'

// Other Imports
import { Guid } from '@commerce/types'
import { encrypt } from '@framework/utils/cipher'
import { Cookie } from '@framework/utils/constants'
import { getItem, setItem } from '@components//utils/localStorage'
import { roundToDecimalPlaces } from '@framework/utils/parse-util'
import { getOrderId, getOrderInfo } from '@framework/utils/app-util'
import { LocalStorage, Payments } from '@components//utils/payment-constants'
import { BETTERCOMMERCE_COUNTRY, BETTERCOMMERCE_DEFAULT_COUNTRY, BETTERCOMMERCE_DEFAULT_CURRENCY, BETTERCOMMERCE_DEFAULT_LANGUAGE, EmptyString, Messages, NEXT_LOG_ACTIVITY, } from '@components//utils/constants'
import { requestPayment, requestToken, validatePaymentSession } from '@framework/utils/payment-util'
import { GTMUniqueEventID } from '@components//services/analytics/ga4'

declare const ApplePaySession: any

export class CheckoutApplePayPaymentButton extends BasePaymentButton {
  /**
   * CTor
   * @param props
   */
  constructor(
    props: IPaymentButtonProps & IApplePaymentProps & IDispatchState
  ) {
    super(props)
    this.state = {
      isScriptLoaded: false, //(document.querySelector(`script[src='${Payments.APPLE_PAY_SCRIPT_SRC_V1}']`) !== null), //props.isApplePayScriptLoaded,
      confirmed: false,
      paymentMethod: super.getPaymentMethod(props?.paymentMethod),
      threeDSEnabled: CARD_PAYMENT_3DS_ENABLED,
    }
  }

  /**
   * Executes order generation for Paypal payment method on CommerceHub.
   * @param paymentMethod {Object} PaymentMethod info of the executing payment type.
   * @param basketOrderInfo {Object} Input data object for generating the CommerceHub order.
   * @param uiContext {Object} Method for dispatching global ui state changes.
   * @param dispatchState {Function} Method for dispatching state changes.
   */
  private async onPay(paymentMethod: any, basketOrderInfo: any, uiContext: any, dispatchState: Function) {
    uiContext?.setOverlayLoaderState({ visible: true, message: translate('common.label.initiatingOrderText'), })

    const { state, result: orderResult } = await super.confirmOrder(paymentMethod, basketOrderInfo, uiContext, dispatchState)
    if (orderResult?.success && orderResult?.result?.id) {
      this.setState({
        confirmed: true,
      })
      if (this.props?.paymentModeLoadedCallback) {
        setTimeout(() => {
          uiContext?.hideOverlayLoaderState()
          this.props?.paymentModeLoadedCallback(PaymentMethodType.CHECKOUT_APPLE_PAY)
        }, 100)
      } else {
        uiContext?.hideOverlayLoaderState()
      }
      return true
    } else {
      uiContext?.hideOverlayLoaderState()
      if (state) {
        dispatchState(state)
      } else {
        dispatchState({ type: 'SET_ERROR', payload: translate('common.message.requestCouldNotProcessErrorMsg'), })
      }
    }
    return false
  }

  /**
   * Called immediately after a component is mounted.
   */
  public componentDidMount(): void {
    const that = this
    const { paymentMethod, basketOrderInfo, uiContext, dispatchState, }: any = this.props
    dispatchState({ type: 'SET_ERROR', payload: EmptyString })

    const threeDSEnabled = this.state.threeDSEnabled
    const processingChannelId = this?.state?.paymentMethod?.settings?.find((x: any) => x.key === 'Signature')?.value || EmptyString
    uiContext?.setOverlayLoaderState({ visible: true, message: translate('common.label.initiatingOrderText'), })
    this.onPay(this.state.paymentMethod, basketOrderInfo, uiContext, dispatchState).then((isOrderConfirmed: boolean) => {

      /**
       * Log user activity data.
       * @param data
       */
      const logActivity = (data: any) => {
        axios.post(NEXT_LOG_ACTIVITY, encrypt(JSON.stringify(data)))
      }

      if (isOrderConfirmed) {
        that.recordAddPaymentInfoEvent(uiContext, that.props.recordEvent, PaymentMethodType.CHECKOUT_APPLE_PAY)

        that.setState({
          isScriptLoaded: true,
        })

        setTimeout(() => {
          const container: any = document.querySelector('div.apple-pay-btn-container')
          if (container) {
            container.classList.remove('hidden')

            const btnId = `btn${that.state.paymentMethod?.systemName}`
            const applePayBtn: any = document.querySelector(`#${btnId}`)
            if (applePayBtn) {
              applePayBtn.addEventListener('click', () => {
                uiContext?.setOverlayLoaderState({ visible: true, message: translate('common.label.pleaseWaitText'), })

                const orderInfo = getOrderInfo()
                const orderResult: any = orderInfo?.orderResponse
                const selectedShippingMethod = uiContext?.cartItems?.shippingMethods?.find(
                  (x: any) => x.id === uiContext?.cartItems?.shippingMethodId
                )
                const shippingMethods = that.getShippingMethods(uiContext)
                if (orderResult?.id && orderResult?.id != Guid.empty) {

                  const currencyCode = orderResult?.currencyCode || BETTERCOMMERCE_DEFAULT_CURRENCY
                  const countryCode = basketOrderInfo?.billingAddress?.countryCode || Cookies.get(Cookie.Key.COUNTRY) || BETTERCOMMERCE_COUNTRY || BETTERCOMMERCE_DEFAULT_COUNTRY
                  const orderId = orderResult?.id
                  const displayName = that.state?.paymentMethod?.settings?.find((x: any) => x.key === "MotoPassword")?.value || EmptyString
                  const totalAmount = roundToDecimalPlaces(orderResult?.grandTotal?.raw?.withTax)

                  /*const sessionPayload = {
                      countryCode: countryCode,
                      currencyCode: currencyCode,
                      supportedNetworks: ['visa', 'masterCard'//, 'amex', 'discover',],
                      merchantCapabilities: ['supports3DS'//, 'supportsEMV', 'supportsCredit', 'supportsDebit'],
                      total: { label: displayName, amount: totalAmount },
                    }*/

                  const sessionPayload = {
                    requiredBillingContactFields: Payments.APPLE_PAY_REQUIRED_BILLING_CONTACT_FIELDS,
                    requiredShippingContactFields: Payments.APPLE_PAY_REQUIRED_SHIPPING_CONTACT_FIELDS,
                    shippingMethods: shippingMethods,
                    shippingType: 'shipping',
                    countryCode: countryCode,
                    currencyCode: currencyCode,
                    supportedNetworks: Payments.APPLE_PAY_SUPPORTED_NETWORKS,
                    merchantCapabilities: Payments.APPLE_PAY_MERCHANT_CAPABILITIES,
                    lineItems: that.buildLineItems(uiContext),
                    total: that.buildTotal(orderResult, selectedShippingMethod),
                  }
                  const applePaySession: any = new ApplePaySession(Payments.APPLE_PAY_VERSION, sessionPayload)
                  if (applePaySession) {

                    applePaySession.onvalidatemerchant = (event: any) => {

                      const validationUrl = event?.validationURL
                      if (validationUrl) {
                        that.onValidateSession(
                          validationUrl,
                          (merchantSession: any) => { // Success Callback

                            const logData = {
                              message: "ApplePay | onValidateSession Result",
                              logData: { validationUrl, merchantSession, },
                              pageUrl: document.URL,
                              userId: uiContext?.user?.userId,
                              userName: uiContext?.user?.username,
                              ipAddress: EmptyString
                            }
                            logActivity(logData)

                            try {
                              applePaySession.completeMerchantValidation(merchantSession)
                            } catch (error: any) {

                              const logData = {
                                message: "ApplePay | completeMerchantValidation Error",
                                logData: { error, },
                                pageUrl: document.URL,
                                userId: uiContext?.user?.userId,
                                userName: uiContext?.user?.username,
                                ipAddress: EmptyString
                              }
                              logActivity(logData)
                            }
                          },
                          () => { // Error Callback
                            applePaySession.abort()
                          }
                        )
                      }
                    }

                    applePaySession.onpaymentauthorized = (event: any) => {

                      uiContext?.setOverlayLoaderState({ visible: true, message: translate('common.label.authorizingPaymentText'), })

                      const logData = {
                        message: "ApplePay | onpaymentauthorized Started",
                        logData: { payment: event?.payment, },
                        pageUrl: document.URL,
                        userId: uiContext?.user?.userId,
                        userName: uiContext?.user?.username,
                        ipAddress: EmptyString
                      }
                      logActivity(logData)

                      const token = event?.payment?.token
                      if (token) {
                        that.onCompletePayment(orderResult, token, processingChannelId, threeDSEnabled, logActivity, (status: any) => { // Callback method
                          if (status) {
                            uiContext?.hideOverlayLoaderState()
                            applePaySession.completePayment(ApplePaySession.STATUS_SUCCESS)
                          } else {
                            uiContext?.hideOverlayLoaderState()
                            applePaySession.completePayment(ApplePaySession.STATUS_FAILURE)
                          }
                        })
                      }
                    }

                    /*applePaySession.onpaymentstatusauthorized = (event: any) => {

                        const logData = {
                          message: "ApplePay | onpaymentstatusauthorized Started",
                          logData: { payment: event?.payment, },
                          pageUrl: document.URL,
                          userId: uiContext?.user?.userId,
                          userName: uiContext?.user?.username,
                          ipAddress: EmptyString
                        }
                        logActivity(logData)

                        const token = event?.payment?.token
                        if (token) {
                          that.onCompletePayment(
                            orderResult,
                            token,
                            (status: any) => {
                              if (status) {
                                applePaySession.completePayment(ApplePaySession.STATUS_SUCCESS)
                              } else {
                                applePaySession.completePayment(ApplePaySession.STATUS_FAILURE)
                              }
                            }
                          )
                        }
                      }*/

                    applePaySession.oncancel = (event: any) => { // USER PRESSED CANCEL BUTTON ON THE PAY SCREEN ON APPLE DEVICE
                      applePaySession.abort()
                      // console.log("payment cancel error " + JSON.stringify(event));
                    }

                    applePaySession.onshippingmethodselected = (event: any) => {
                      // You can do work asynchronously here; just call
                      // session.completeShippingMethodSelection when you're done.
                      applePaySession.completeShippingMethodSelection(
                        ApplePaySession.STATUS_SUCCESS,
                        that.buildTotal(orderResult, event.shippingMethod),
                        that.buildLineItems(uiContext)
                      )
                    }

                    applePaySession.onshippingcontactselected = (event: any) => {

                      var shippingContact = event.shippingContact;
                      // You can do work asynchronously here; just call
                      // session.completeShippingMethodSelection when you're done.
                      applePaySession.completeShippingContactSelection(
                        ApplePaySession.STATUS_SUCCESS,
                        shippingMethods,
                        that.buildTotal(orderResult, shippingMethods[0]),
                        that.buildLineItems(uiContext)
                      )
                    }

                    uiContext?.hideOverlayLoaderState()
                    applePaySession.begin()
                  }
                }
                uiContext?.hideOverlayLoaderState()
              })
            }
          }
        }, 50)
      }
    })
  }

  private onValidateSession(validationUrl: string, successCallback: Function, errorCallback: Function) {
    const { uiContext, dispatchState }: any = this.props
    const gatewayName = this.state.paymentMethod?.systemName
    const validateSessionInput = {
      validationUrl,
    }
    validatePaymentSession(gatewayName, validateSessionInput).then((validateResult: any) => {
      uiContext?.hideOverlayLoaderState()
      if (successCallback) {
        successCallback(validateResult)
      }
    }).catch((error: any) => {
      uiContext?.hideOverlayLoaderState()
      dispatchState({ type: 'SET_ERROR', payload: translate('common.message.requestCouldNotProcessErrorMsg'), })

      if (errorCallback) {
        errorCallback()
      }
    })
  }

  private onCompletePayment(orderResult: any, token: any, processingChannelId: string, threeDSEnabled: boolean, logActivity: any, callback: Function) {
    const that = this
    const { uiContext, dispatchState }: any = this.props

    if (token?.paymentData) {
      const { version, data, signature, header } = token?.paymentData
      //const gatewayName = this.state.paymentMethod?.systemName
      const payload = {
        type: "applepay",
        token_data: { version, data, signature, header, }
      }
      requestToken(PaymentMethodType.CHECKOUT, payload).then((tokenResult: any) => {

        const logData = {
          message: "ApplePay | RequestToken Result",
          logData: { tokenResult, },
          pageUrl: document.URL,
          userId: uiContext?.user?.userId,
          userName: uiContext?.user?.username,
          ipAddress: EmptyString
        }
        logActivity(logData)

        if (tokenResult && tokenResult?.token) {
          const orderId = orderResult?.id
          const notificationUrl = that.state?.paymentMethod?.notificationUrl
          const redirectConfirmUrl = `${window.location.origin}${notificationUrl}`
          const redirectCancelUrl = `${window.location.origin}${that.state?.paymentMethod?.settings?.find((x: any) => x?.key === 'CancelUrl')?.value || EmptyString}`
          const payload = {
            source: { type: CheckoutPaymentSourceType.TOKEN, token: tokenResult?.token },
            amount: roundToDecimalPlaces(orderResult?.grandTotal?.raw?.withTax),
            currency: orderResult?.currencyCode,
            payment_type: CheckoutPaymentType.Regular,
            description: `Items for Order: ${orderId}; Basket: ${orderResult?.basketId}`,
            capture: true,
            capture_on: new Date().toISOString(),
            processing_channel_id: processingChannelId,
            success_url: redirectConfirmUrl,
            failure_url: redirectCancelUrl,
            '3ds': {
              enabled: threeDSEnabled,
              //authentication_id: `sid_${shortUUID.generate()}${moment(new Date()).format("DDMM")}`,
            },
          }
          requestPayment(PaymentMethodType.CHECKOUT, payload).then((paymentResult: any) => {

            const logData = {
              message: "ApplePay | RequestPayment Result",
              logData: { tokenResult, },
              pageUrl: document.URL,
              userId: uiContext?.user?.userId,
              userName: uiContext?.user?.username,
              ipAddress: EmptyString
            }
            logActivity(logData)

            if (paymentResult?.id) {
              const orderResponse = getItem(LocalStorage.Key.ORDER_RESPONSE)
              if (orderResponse) {
                setItem(LocalStorage.Key.ORDER_RESPONSE, {
                  ...orderResponse,
                  p: {
                    t: PaymentMethodTypeId.CHECKOUT,
                    i: paymentResult?.id,
                    c: paymentResult?.customer?.id,
                  },
                })
              }

              if (callback) {
                callback(true)
              }

              const redirectUrl = `${notificationUrl}?orderId=${paymentResult?.id}&payerId=${paymentResult?.customer?.id}&token= `
              Router.push(redirectUrl)
              uiContext?.hideOverlayLoaderState()
            } else {
              if (callback) {
                callback(false)
              }
              uiContext?.hideOverlayLoaderState()
              dispatchState({ type: 'SET_ERROR', payload: translate('common.message.requestCouldNotProcessErrorMsg'), })
            }
          })
        } else {
          if (callback) {
            callback(false)
          }
          uiContext?.hideOverlayLoaderState()
          dispatchState({ type: 'SET_ERROR', payload: translate('common.message.requestCouldNotProcessErrorMsg'), })
        }
      }).catch((error: any) => {
        if (callback) {
          callback(false)
        }
        uiContext?.hideOverlayLoaderState()
        dispatchState({ type: 'SET_ERROR', payload: translate('common.message.requestCouldNotProcessErrorMsg'), })
      })
    } else {
      const logData = {
        message: "ApplePay | onCompletePayment not invoked error",
        logData: { orderResult, token, },
        pageUrl: document.URL,
        userId: uiContext?.user?.userId,
        userName: uiContext?.user?.username,
        ipAddress: EmptyString
      }
      logActivity(logData)
    }
  }

  private getShippingMethods(uiContext: any) {
    const shippingMethods = uiContext?.cartItems?.shippingMethods?.filter((x: any) => {
      x?.id === uiContext?.cartItems?.shippingMethodId
    })?.map((x: any, index: number) => ({
      label: x?.displayName,
      detail: x?.displayName, //x?.description,
      amount: roundToDecimalPlaces(x?.price?.raw?.withTax),
      identifier: index,
    }))

    return shippingMethods
  }

  private buildLineItems(uiContext: any) {
    const selectedShippingMethod = uiContext?.cartItems?.shippingMethods?.find(
      (x: any) => x.id === uiContext?.cartItems?.shippingMethodId
    )

    const lineItems = uiContext?.cartItems?.lineItems?.map((x: any) => ({
      type: 'final',
      label: x?.name,
      amount: roundToDecimalPlaces(x?.price?.raw?.withTax)
    })).concat([{
      type: 'final',
      label: 'Shipping',
      amount: roundToDecimalPlaces(selectedShippingMethod?.price?.raw?.withTax),
    }])
    return lineItems
  }

  private buildTotal(orderResult: any, selectedShippingMethod: any) {
    const displayName = this.state?.paymentMethod?.settings?.find((x: any) => x.key === "MotoPassword")?.value || EmptyString
    //const totalAmount = (parseFloat(selectedShippingMethod.amount) + amount).toFixed(2)
    const totalAmount = roundToDecimalPlaces(orderResult?.grandTotal?.raw?.withTax)
    return {
      //label: `Order ${orderId} for basket ${orderResult?.basketId} OrderPaymentId ${getOrderId(orderInfo?.order)}`,
      label: displayName,
      amount: totalAmount
    }
  }

  /**
   * Renders the component.
   * @returns {React.JSX.Element}
   */
  public render() {
    const btnId = `btn${this.state.paymentMethod?.systemName}`
    const locale = `${BETTERCOMMERCE_DEFAULT_LANGUAGE}-${BETTERCOMMERCE_DEFAULT_COUNTRY}`
    const btnHtml = `
      <style>
        apple-pay-button {
          --apple-pay-button-width: 140px;
          --apple-pay-button-height: 45px;
          --apple-pay-button-border-radius: 5px;
          --apple-pay-button-padding: 5px 0px;
          display: initial;
        }
        apple-pay-button {
          display: inline-block;
          -webkit-appearance: -apple-pay-button;
      }
      .apple-pay-button-black {
          -apple-pay-button-style: black;
      }
      .apple-pay-button-white {
          -apple-pay-button-style: white;
      }
      .apple-pay-button-white-with-line {
          -apple-pay-button-style: white-outline;
      }
      </style>
      <apple-pay-button class="apple-pay-button apple-pay-button-black" id="${btnId}" buttonstyle="black" type="plain" locale="${locale}"></apple-pay-button>
    `

    const applePayBtn = (
      <>
        {
          this.state.isScriptLoaded && (
            <div
              className="apple-pay-btn-container"
              dangerouslySetInnerHTML={{
                __html: btnHtml,
              }}
            />
          )
        }
      </>
    )

    return (
      <>
        {applePayBtn}
      </>
    )
  }
}
