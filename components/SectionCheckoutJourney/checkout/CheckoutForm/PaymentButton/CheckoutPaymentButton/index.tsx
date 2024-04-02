// Package Imports
import Script from 'next/script'
import Router from 'next/router'
import {
  CheckoutPaymentSourceType,
  CheckoutPaymentType,
  CheckoutPaymentRequest,
  PaymentMethodTypeId,
  PaymentMethodType,
} from '@better-commerce/bc-payments-sdk'
import { Frames, CardNumber, ExpiryDate, Cvv } from 'frames-react'
import { t as translate } from "i18next";

// Component Imports
import BasePaymentButton, { IDispatchState } from '../BasePaymentButton'
import { IPaymentButtonProps } from '../BasePaymentButton'

// Other Imports
import { requestPayment } from '@framework/utils/payment-util'
import { LocalStorage, Payments } from '@components/utils/payment-constants'
import { getOrderId, getOrderInfo } from '@framework/utils/app-util'
import { BETTERCOMMERCE_DEFAULT_COUNTRY, BETTERCOMMERCE_DEFAULT_PHONE_COUNTRY_CODE, EmptyString, Messages, } from '@components/utils/constants'
import { getItem, setItem } from '@components/utils/localStorage'
import { roundToDecimalPlaces } from '@framework/utils/parse-util'
import { GTMUniqueEventID } from '@components/services/analytics/ga4'

export const CARD_PAYMENT_3DS_ENABLED = true
const ELEM_CARD_NUMBER = 'card-number'
const ELEM_EXPIRY_DATE = 'expiry-date'
const ELEM_CVV = 'cvv'

export class CheckoutPaymentButton extends BasePaymentButton {
  /**
   * CTor
   * @param props
   */
  constructor(props: IPaymentButtonProps & IDispatchState) {
    super(props)
    this.state = {
      confirmed: false,
      paymentMethod: super.getPaymentMethod(props?.paymentMethod),
      disabledFormSubmit: false,
      scriptLoaded: false,
      formLoaded: false,
      threeDSEnabled: CARD_PAYMENT_3DS_ENABLED,
      validations: new Array<any>(),
    }
  }

  /**
   * Executes order generation for COD payment method on CommerceHub.
   * @param paymentMethod {Object} PaymentMethod info of the executing payment type.
   * @param basketOrderInfo {Object} Input data object for generating the CommerceHub order.
   * @param uiContext {Object} Method for dispatching global ui state changes.
   * @param dispatchState {Function} Method for dispatching state changes.
   */
  private async onPay(
    paymentMethod: any,
    basketOrderInfo: any,
    uiContext: any,
    dispatchState: Function
  ) {
    uiContext?.setOverlayLoaderState({ visible: true, message: translate('common.label.initiatingOrderText'), })

    const { state, result: orderResult } = await super.confirmOrder(
      paymentMethod,
      basketOrderInfo,
      uiContext,
      dispatchState
    )
    if (orderResult?.success && orderResult?.result?.id) {
      super.recordAddPaymentInfoEvent(uiContext, this.props.recordEvent, PaymentMethodType.CHECKOUT)
      uiContext?.hideOverlayLoaderState()
    } else {
      this.setState({
        confirmed: false,
        formLoaded: false,
        scriptLoaded: false,
      })
      uiContext?.hideOverlayLoaderState()
      if (state) {
        dispatchState(state)
      } else {
        dispatchState({ type: 'SET_ERROR', payload: translate('common.message.requestCouldNotProcessErrorMsg'), })
      }
    }
  }

  private onScriptReady(): void {
    this.setState({
      scriptLoaded: true,
    })
  }

  private onFrameReady(): void {
    const { paymentMethod, basketOrderInfo, uiContext, dispatchState }: any =
      this.props
    this.onPay(this.state.paymentMethod, basketOrderInfo, uiContext, dispatchState)

    this.setState({
      formLoaded: true,
    })
  }

  private onCardSubmitted(): void {
    const { uiContext }: any = this.props
    uiContext?.setOverlayLoaderState({ visible: true, message: translate('common.label.pleaseWaitText'), })
  }

  private onCardTokenized(ev: any): void { }

  private onCardValidationChanged(): void {
    this.setState({
      disabledFormSubmit: !Frames.isCardValid(),
    })
  }

  private onCardBinChanged(ev: any): void {
    //console.log(ev);
    /*const { dispatchState, paymentMethod } = this.props
    let msg = EmptyString
    if (ev?.scheme && !matchStrings(ev?.scheme, paymentMethod?.paymentMethodType, true)) {
      msg = `Please use '${paymentMethod?.paymentMethodType}' card to proceed.`
    }
    dispatchState({ type: 'SET_ERROR', payload: msg, })
    this.setState({
      cardNotSupported: !msg ? false : true,
    })*/
  }

  private onCardTokenizationFailed(ev: any): void {
    // catch the error
  }

  private onCapturePayment(
    paymentMethod: any,
    basketOrderInfo: any,
    uiContext: any,
    dispatchState: Function
  ) {
    let that = this
    const orderInfo = getOrderInfo()
    const orderResult: any = orderInfo?.orderResponse
    const redirectConfirmUrl = `${window.location.origin}${this.state?.paymentMethod?.notificationUrl}`
    const redirectCancelUrl = `${window.location.origin}${this.state?.paymentMethod?.settings?.find(
      (x: any) => x?.key === 'CancelUrl'
    )?.value || EmptyString
      }`
    if (orderResult) {
      const orderId = orderResult?.id

      Frames.submitCard()
        .then((ev: any) => {
          const { token } = ev
          if (token) {
            const data: CheckoutPaymentRequest = {
              source: { type: CheckoutPaymentSourceType.TOKEN, token: token, },
              amount: roundToDecimalPlaces(orderResult?.grandTotal?.raw?.withTax),
              currency: orderResult?.currencyCode,
              payment_type: CheckoutPaymentType.Regular,
              reference: getOrderId(orderInfo?.order),
              description: `${translate('label.checkoutForm.itemsForOrderText')}: ${orderId}; ${translate('label.basket.basketText')}: ${orderResult?.basketId}`,
              capture: true,
              capture_on: new Date().toISOString(),

              // Required if source.type is "tamara"
              /*customer: {
                email: basketOrderInfo?.user?.email || basketOrderInfo?.user?.userEmail || EmptyString,
                name: (contactDetails?.firstName || contactDetails?.lastName)
                  ? `${contactDetails.firstName ?? ''} ${contactDetails.lastName ?? ''}`.trim()
                  : (basketOrderInfo?.user?.firstName || basketOrderInfo?.user?.lastName)
                    ? `${basketOrderInfo?.user?.firstName ?? ''} ${basketOrderInfo?.user?.lastName ?? ''}`.trim()
                    : EmptyString,
              },*/
              shipping: {
                address: {
                  address_line1: basketOrderInfo?.shippingAddress?.address1 || EmptyString,
                  address_line2: basketOrderInfo?.shippingAddress?.address2 || EmptyString,
                  city: basketOrderInfo?.shippingAddress?.city || EmptyString,
                  state: basketOrderInfo?.shippingAddress?.state || EmptyString,
                  zip: basketOrderInfo?.shippingAddress?.postCode || EmptyString,
                  country: basketOrderInfo?.shippingAddress?.countryCode || BETTERCOMMERCE_DEFAULT_COUNTRY,
                },
                phone: {
                  country_code: basketOrderInfo?.shippingAddress?.mobileCountryCode || BETTERCOMMERCE_DEFAULT_PHONE_COUNTRY_CODE,
                  number: uiContext?.user?.mobile || basketOrderInfo?.shippingAddress?.phoneNo || EmptyString,
                },
              },
              processing_channel_id:
                paymentMethod?.settings?.find(
                  (x: any) => x.key === 'MotoUserName'
                )?.value || EmptyString,
              metadata: {
                udf1: orderId,
                udf2: orderResult?.basketId,
                udf3: basketOrderInfo?.customerId,
                udf4: getOrderId(orderInfo?.order),
                udf5: '',
              },
              success_url: redirectConfirmUrl,
              failure_url: redirectCancelUrl,
              '3ds': {
                enabled: that.state.threeDSEnabled,
                //authentication_id: `sid_${shortUUID.generate()}${moment(new Date()).format("DDMM")}`,
              },
            }

            requestPayment(that.state?.paymentMethod?.systemName, {
              ...data,
            }).then((paymentResult: any) => {
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

                if (that.state.threeDSEnabled) {
                  const redirectUrl = paymentResult?._links?.redirect?.href
                  Router.push(redirectUrl)
                } else {
                  const redirectUrl = `${that?.state?.paymentMethod?.notificationUrl}?orderId=${paymentResult?.id}&payerId=${paymentResult?.customer?.id}&token= `
                  Router.push(redirectUrl)
                }
                uiContext?.hideOverlayLoaderState()
              } else {
                uiContext?.hideOverlayLoaderState()
                if (paymentResult?.hasError) {
                  if (paymentResult?.error?.data?.error_codes?.length && paymentResult?.error?.data?.error_codes.includes('payment_method_not_supported')) {
                    dispatchState({ type: 'SET_ERROR', payload: translate('common.message.checkout.paymentMethodNotSupportedErrorMsg')})
                  } else {
                    dispatchState({ type: 'SET_ERROR', payload: translate('common.message.requestCouldNotProcessErrorMsg')})
                  }
                } else {
                  dispatchState({ type: 'SET_ERROR', payload: translate('common.message.requestCouldNotProcessErrorMsg')})
                }
              }
            }).catch((error: any) => {
              console.log(error)
            })
          } else {
            uiContext?.hideOverlayLoaderState()
            dispatchState({ type: 'SET_ERROR', payload: translate('common.message.requestCouldNotProcessErrorMsg'), })
          }
        }).catch((error: any) => {
          uiContext?.hideOverlayLoaderState()
          dispatchState({ type: 'SET_ERROR', payload: translate('common.message.requestCouldNotProcessErrorMsg'), })
        })
    }
  }

  /**
   * Called immediately after a component is mounted.
   */
  public componentDidMount(): void {
    const { dispatchState }: any = this.props
    dispatchState({ type: 'SET_ERROR', payload: EmptyString })

    if (this.props?.paymentModeLoadedCallback) {
      setTimeout(() => {
        this.props?.paymentModeLoadedCallback(PaymentMethodType.CHECKOUT)
      }, 100)
    }
  }

  /**
   * Renders the component.
   * @returns {React.JSX.Element}
   */
  public render() {
    const that = this
    const { uiContext } = this.props
    const publicKey = super.getPaymentMethodSetting(
      this?.state?.paymentMethod,
      'accountcode'
    )
    const config = {
      debug: process.env.NODE_ENV === 'development',
      publicKey: publicKey,
      style: {
        base: {
          color: 'rgba(33, 37, 48, .5)',
          fontSize: '14px',
          fontWeight: '300',
          fontFamily: "'Inter', sans-serif",
        },
      },
    }

    return (
      <>
        {!this.state.confirmed &&
          this.baseRender({
            ...this?.props,
            ...{
              onPay: async (
                paymentMethod: any,
                basketOrderInfo: any,
                uiContext: any,
                dispatchState: Function
              ) => {
                uiContext?.setOverlayLoaderState({
                  visible: true,
                  message: translate('common.message.loaderLoadingText'),
                })
                that.setState({ confirmed: true })
              },
            },
          })}

        {this.state.confirmed && !this.state.formLoaded && (
          <Script
            src={Payments.CHECKOUT_FRAMES_SCRIPT_SRC_V2}
            strategy="lazyOnload"
            onReady={() => that.onScriptReady()}
          />
        )}

        {that.state?.scriptLoaded && (
          <div className="checkout-frame-container">
            <h5 className="mb-6 font-semibold text-black font-18">
              Debit/Credit Card details
            </h5>
            <Frames
              config={config}
              ready={() => that.onFrameReady()}
              frameValidationChanged={(ev: any) => {
                if (that.state.validations?.length === 0) {
                  that.setState({
                    validations: [ev],
                  })
                } else {
                  const findElem = that.state.validations.find(
                    (x: any) => x?.element === ev.element
                  )
                  if (!findElem) {
                    that.setState({
                      validations: that.state.validations.concat([ev]),
                    })
                  } else {
                    findElem.isEmpty = ev.isEmpty
                    findElem.isValid = ev.isValid
                    that.setState({
                      validations: that.state.validations.concat([findElem]),
                    })
                  }
                }
              }}
              cardValidationChanged={(ev: any) => {
                that.onCardValidationChanged()
              }}
              cardSubmitted={() => that.onCardSubmitted()}
              cardTokenized={(ev: any) => that.onCardTokenized(ev)}
              cardTokenizationFailed={(ev: any) =>
                that.onCardTokenizationFailed(ev)
              }
              cardBinChanged={(ev: any) => that.onCardBinChanged(ev)}
            >
              <div className='mb-5'>
                <label className="text-black font-14">Card number*</label>
                <CardNumber />

                {that.state.validations.length > 0 &&
                  that.state.validations.find(
                    (x: any) => x?.element === ELEM_CARD_NUMBER
                  ) &&
                  that.state.validations.find(
                    (x: any) => x?.element === ELEM_CARD_NUMBER
                  )?.isEmpty ? (
                  <span className="text-red-600">Card number is required</span>
                ) : (
                  <>
                    {that.state.validations.length > 0 &&
                      that.state.validations.find(
                        (x: any) => x?.element === ELEM_CARD_NUMBER
                      ) &&
                      !that.state.validations.find(
                        (x: any) => x?.element === ELEM_CARD_NUMBER
                      )?.isValid && (
                        <span className="text-red-600">
                          Card number is invalid
                        </span>
                      )}
                  </>
                )}
              </div>
              <div className="mb-5 date-and-code">
                <label className="text-black font-14">Expiry date*</label>
                <div className="w-auto mb-5 w-200-md">
                  <ExpiryDate />

                  {that.state.validations.length > 0 &&
                    that.state.validations.find(
                      (x: any) => x?.element === ELEM_EXPIRY_DATE
                    ) &&
                    that.state.validations.find(
                      (x: any) => x?.element === ELEM_EXPIRY_DATE
                    )?.isEmpty ? (
                    <span className="text-red-600">
                      Expiry date is required
                    </span>
                  ) : (
                    <>
                      {that.state.validations.length > 0 &&
                        that.state.validations.find(
                          (x: any) => x?.element === ELEM_EXPIRY_DATE
                        ) &&
                        !that.state.validations.find(
                          (x: any) => x?.element === ELEM_EXPIRY_DATE
                        )?.isValid && (
                          <span className="text-red-600">
                            Expiry date is invalid
                          </span>
                        )}
                    </>
                  )}
                </div>
                <label className="text-black font-14">CVV*</label>
                <div className="relative w-auto mb-5 w-100-md">
                  <Cvv inputMode="numeric" />
                  <span className="absolute top-[15px] right-2  line-height-0">
                    <i className="sprite-icons sprite-cvv-icon"></i>
                  </span>

                  {that.state.validations.length > 0 &&
                    that.state.validations.find(
                      (x: any) => x?.element === ELEM_CVV
                    ) &&
                    that.state.validations.find(
                      (x: any) => x?.element === ELEM_CVV
                    )?.isEmpty ? (
                    <span className="text-red-600">CVV is required</span>
                  ) : (
                    <>
                      {that.state.validations.length > 0 &&
                        that.state.validations.find(
                          (x: any) => x?.element === ELEM_CVV
                        ) &&
                        !that.state.validations.find(
                          (x: any) => x?.element === ELEM_CVV
                        )?.isValid && (
                          <span className="text-red-600">CVV is invalid</span>
                        )}
                    </>
                  )}
                </div>
              </div>

              <div className="items-center max-120-wd">
                {that.state.formLoaded
                  && that.baseRender({
                    ...that?.props,
                    ...{
                      disabled: that.state.disabledFormSubmit,
                      onPay: (
                        paymentMethod: any,
                        basketOrderInfo: any,
                        uiContext: any,
                        dispatchState: Function
                      ) =>
                        that.onCapturePayment(
                          that.state.paymentMethod,
                          basketOrderInfo,
                          uiContext,
                          dispatchState
                        ),
                      btnTitle: translate('label.checkout.payText'),
                    },
                  })}
              </div>
            </Frames>
          </div>
        )}
      </>
    )
  }
}
