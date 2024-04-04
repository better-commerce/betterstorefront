// Package Imports
import Cookies from 'js-cookie'
import { withTranslation } from 'react-i18next'
import { ClearPayPaymentIntent, PaymentMethodType } from '@better-commerce/bc-payments-sdk'

// Component Imports
import Script from 'next/script'
import { IPaymentButtonProps } from './BasePaymentButton'
import BasePaymentButton, { IDispatchState } from './BasePaymentButton'

// Other Imports
import { roundToDecimalPlaces, stringToBoolean } from '@framework/utils/parse-util'
import { Payments } from '@components/utils/payment-constants'
import { initPayment, requestPayment } from '@framework/utils/payment-util'
import { getOrderId, getOrderInfo } from '@framework/utils/app-util'
import {
  BETTERCOMMERCE_COUNTRY,
  BETTERCOMMERCE_DEFAULT_COUNTRY,
  BETTERCOMMERCE_DEFAULT_LANGUAGE,
  BETTERCOMMERCE_LANGUAGE,
  EmptyString,
  Messages,
} from '@components/utils/constants'
import Router from 'next/router'
import { Cookie } from '@framework/utils/constants'
import { GTMUniqueEventID } from '@components/services/analytics/ga4'

declare const AfterPay: any

class ClearPayPaymentButton extends BasePaymentButton {
  /**
   * CTor
   * @param props
   */
  constructor(props: IPaymentButtonProps & IDispatchState) {
    super(props)
    this.state = {
      confirmed: false,
      token: null,
      paymentMethod: super.getPaymentMethod(props?.paymentMethod),
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
    const { t: translate } = this.props
    uiContext?.setOverlayLoaderState({ visible: true, message: translate('common.label.initiatingOrderText'), })

    const { state, result: orderResult } = await super.confirmOrder(
      paymentMethod,
      basketOrderInfo,
      uiContext,
      dispatchState
    )
    if (orderResult?.success && orderResult?.result?.id) {
      //uiContext?.hideOverlayLoaderState();
      super.recordAddPaymentInfoEvent(uiContext, this.props.recordEvent, PaymentMethodType.CLEAR_PAY)
      this.setState({
        confirmed: true,
      })
    } else {
      uiContext?.hideOverlayLoaderState()
      if (state) {
        dispatchState(state)
      } else {
        dispatchState({ type: 'SET_ERROR', payload: translate('common.message.requestCouldNotProcessErrorMsg'), })
      }
    }
  }

  private onScriptReady(): void {
    const that = this
    const { uiContext, dispatchState, t: translate } = this.props
    const redirectionUrl = `${window.location.origin}${this.state?.paymentMethod?.notificationUrl}`
    if (AfterPay) {
      const shippingMethodId = uiContext?.cartItems?.shippingMethodId
      const shippingCountry = uiContext?.cartItems?.shippingMethods?.find((x: any) => x?.id === shippingMethodId)?.countryCode || EmptyString
      uiContext?.setOverlayLoaderState({ visible: true, message: translate('common.label.initiatingPaymentText'), })
      const data = this.getOrderInputPayload()
      initPayment(this.state?.paymentMethod?.systemName, data).then(
        (clientResult: any) => {
          AfterPay.initialize({
            countryCode: shippingCountry || Cookies.get(Cookie.Key.COUNTRY) || BETTERCOMMERCE_COUNTRY || BETTERCOMMERCE_DEFAULT_COUNTRY,
          })

          if (clientResult?.token) {
            that.setState({
              token: clientResult?.token,
            })

            // To avoid triggering browser anti-popup rules, the AfterPay.open()
            // function must be directly called inside the click event listener
            AfterPay.open()

            // If you don't already have a checkout token at this point, you can
            // AJAX to your backend to retrieve one here. The spinning animation
            // will continue until `AfterPay.transfer` is called.
            // If you fail to get a token you can call AfterPay.close()
            AfterPay.onComplete = (event: any) => {
              if (event?.data?.status == 'SUCCESS') {
                uiContext?.setOverlayLoaderState({ visible: true, message: translate('common.label.capturingPaymentText'), })

                // The consumer confirmed the payment schedule.
                // The token is now ready to be captured from your server backend.
                requestPayment(that.state?.paymentMethod?.systemName, {
                  token: event?.data?.orderToken,
                })
                  .then((captureResult: any) => {
                    uiContext?.hideOverlayLoaderState()
                    if (captureResult?.id) {
                      Router.push(`${redirectionUrl}?orderId=${captureResult?.id}&token=${captureResult?.token}&status=${captureResult?.status}`)
                    }
                  })
                  .catch((error: any) => {
                    uiContext?.hideOverlayLoaderState()
                    dispatchState({ type: 'SET_ERROR', payload: translate('common.message.requestCouldNotProcessErrorMsg'), })
                  })
              } else {
                // The consumer cancelled the payment or close the popup window.
                AfterPay.close()
              }
            }
            AfterPay.transfer({ token: clientResult?.token })
          } else {
            AfterPay.close()
            dispatchState({
              type: 'SET_ERROR',
              payload: translate('common.message.requestCouldNotProcessErrorMsg'),
            })
          }
          uiContext?.hideOverlayLoaderState()
        }
      )
    }
  }

  /**
   * Returns the payload for PayPal CreateOrder.
   * @returns
   */
  private getOrderInputPayload() {
    const { basketOrderInfo, uiContext } = this.props

    const shippingMethodId = uiContext?.cartItems?.shippingMethodId
    const shippingCountry = uiContext?.cartItems?.shippingMethods?.find((x: any) => x?.id === shippingMethodId)?.countryCode || EmptyString
    const orderInfo = getOrderInfo()
    const orderResult: any = orderInfo?.orderResponse
    if (orderResult) {
      const { billingAddress, shippingAddress } = basketOrderInfo
      const orderId = orderResult?.id
      const data: any = {
        merchantReference: getOrderId(orderInfo?.order),
        purchaseCountry: shippingCountry || Cookies.get(Cookie.Key.COUNTRY) || BETTERCOMMERCE_COUNTRY || BETTERCOMMERCE_DEFAULT_COUNTRY || EmptyString,
        description: `Order ${orderId} for basket ${orderResult?.basketId} OrderPaymentId ${getOrderId(orderInfo?.order)}`,
        amount: {
          amount: roundToDecimalPlaces(orderResult?.grandTotal?.raw?.withTax),
          currency: orderResult?.currencyCode,
        },
        taxAmount: {
          amount: roundToDecimalPlaces(orderResult?.grandTotal?.raw?.tax),
          currency: orderResult?.currencyCode,
        },
        shippingAmount: {
          amount: 0,
          currency: orderResult?.currencyCode,
        },
        items: [
          {
            name: orderResult?.items
              ?.map((x: any) => `${x?.stockCode}(${x?.qty})`)
              ?.join(', '),
            sku: orderResult?.items
              ?.map((x: any) => `${x?.stockCode}`)
              ?.join(', '),

            // Quantity field contains sum of item quantities.
            quantity: orderResult?.items
              ?.map((x: any) => x?.qty)
              ?.reduce((sum: number, current: number) => sum + current, 0),
            price: {
              amount: roundToDecimalPlaces(orderResult?.grandTotal?.raw?.withTax),
              currency: orderResult?.currencyCode,
            },
            imageUrl: orderResult?.items?.length
              ? `${window.location.origin}/product/${orderResult?.items[0]?.slug}`
              : EmptyString,
            pageUrl: orderResult?.items?.length
              ? `${window.location.origin}/product/${orderResult?.items[0]?.slug}`
              : EmptyString,
          },
        ],
        consumer: {
          givenNames: billingAddress?.firstName || EmptyString,
          surname: billingAddress?.lastName ?? EmptyString,
          email: uiContext?.user?.email,
          phoneNumber: uiContext?.user?.mobile || billingAddress?.phoneNo,
        },
        billing: {
          area1: billingAddress?.city,
          area2: EmptyString,
          countryCode: billingAddress?.countryCode || Cookies.get(Cookie.Key.COUNTRY) || BETTERCOMMERCE_COUNTRY || BETTERCOMMERCE_DEFAULT_COUNTRY,
          line1: billingAddress?.address1,
          line2: billingAddress?.address2,
          name: `${billingAddress?.firstName || EmptyString} ${billingAddress?.lastName || EmptyString
            }`.trim(),
          phoneNumber: billingAddress?.phoneNo,
          postcode: billingAddress?.postCode,
          //region: billingAddress?.state,
        },
        shipping: {
          area1: shippingAddress?.city,
          area2: EmptyString,
          countryCode:
            shippingAddress?.countryCode ||
            Cookies.get(Cookie.Key.COUNTRY) ||
            BETTERCOMMERCE_COUNTRY ||
            BETTERCOMMERCE_DEFAULT_COUNTRY,
          line1: shippingAddress?.address1,
          line2: shippingAddress?.address2,
          name: `${shippingAddress?.firstName || EmptyString} ${shippingAddress?.lastName || EmptyString
            }`.trim(),
          phoneNumber: shippingAddress?.phoneNo,
          postcode: shippingAddress?.postCode,
          //region: shippingAddress?.state,
        },
        merchant: {
          redirectConfirmUrl: `${window.location.origin}${this.state?.paymentMethod?.notificationUrl}`,
          redirectCancelUrl: `${window.location.origin}${this.state?.paymentMethod?.settings?.find(
            (x: any) => x?.key === 'CancelUrl'
          )?.value || EmptyString
            }`,
          popupOriginUrl: window.location.href,
        },
      }
      return data
    }
  }

  /**
   * Called immediately after a component is mounted.
   */
  public componentDidMount(): void {
    const { dispatchState }: any = this.props
    dispatchState({ type: 'SET_ERROR', payload: EmptyString })
  }

  /**
   * Renders the component.
   * @returns {React.JSX.Element}
   */
  public render() {
    let that = this
    const useSandbox = this.state?.paymentMethod?.settings?.find(
      (x: any) => x.key === 'UseSandbox'
    )?.value || EmptyString
    const testUrl = this.state?.paymentMethod?.settings?.find((x: any) => x.key === 'TestUrl')
      ?.value || EmptyString
    const productionUrl = this.state?.paymentMethod?.settings?.find(
      (x: any) => x.key === 'ProductionUrl'
    )?.value || EmptyString
    const isSandbox = useSandbox ? stringToBoolean(useSandbox) : false
    const scriptSrcUrl = isSandbox
      ? `${testUrl}/${Payments.CLEARPAY_SCRIPT_SRC}`
      : `${productionUrl}/${Payments.CLEARPAY_SCRIPT_SRC}`

    return (
      <>
        {
          <>
            {this.state.confirmed && (
              <Script
                src={scriptSrcUrl}
                strategy="lazyOnload"
                onReady={() => that.onScriptReady()}
              />
            )}
          </>
        }
        {this.baseRender({
          ...this?.props,
          ...{
            onPay: (
              paymentMethod: any,
              basketOrderInfo: any,
              uiContext: any,
              dispatchState: Function
            ) =>
              that.onPay(
                that.state.paymentMethod,
                basketOrderInfo,
                uiContext,
                dispatchState
              ),
          },
        })}
      </>
    )
  }
}

export default withTranslation()(ClearPayPaymentButton)