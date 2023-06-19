// Base Imports
import React from 'react'

// Package Imports
import Router from 'next/router'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import {
  CreateOrderData,
  CreateOrderActions,
  OnApproveData,
  OnApproveActions,
} from '@paypal/paypal-js/types/components/buttons'

// Component Imports
import BasePaymentButton, { IDispatchState } from './BasePaymentButton'
import { IPaymentButtonProps } from './BasePaymentButton'

// Other Imports
import {
  BETTERCOMMERCE_DEFAULT_CURRENCY,
  EmptyGuid,
  EmptyString,
  Messages,
} from '@components/utils/constants'
import { PayPalOrderIntent } from '@framework/api/endpoints/payments/constants'
import { getOrderInfo } from '@framework/utils/app-util'

const BUTTONS_DEFAULT_LAYOUT: any = {
  layout: 'vertical',
  color: 'gold',
  shape: 'rect',
  label: 'pay',
}

export class PayPalPaymentButton extends BasePaymentButton {
  /**
   * CTor
   * @param props
   */
  constructor(props: IPaymentButtonProps & IDispatchState) {
    super(props)
    this.state = {
      confirmed: false,
      paymentMethod: super.getPaymentMethod(props?.paymentMethod),
    }
  }

  /**
   * Executes order generation for Paypal payment method on CommerceHub.
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
    uiContext?.setOverlayLoaderState({
      visible: true,
      message: 'Initiating order...',
    })

    const { state, result: orderResult } = await super.confirmOrder(
      paymentMethod,
      basketOrderInfo,
      uiContext,
      dispatchState
    )
    if (orderResult?.success && orderResult?.result?.id) {
      uiContext?.hideOverlayLoaderState()
      this.setState({
        confirmed: true,
      })
    } else {
      uiContext?.hideOverlayLoaderState()
      if (state) {
        dispatchState(state)
      } else {
        dispatchState({
          type: 'SET_ERROR',
          payload: Messages.Errors['GENERIC_ERROR'],
        })
      }
    }
  }

  /**
   * Creates a PayPal order while payment modal is opened over the window.
   * @param data
   * @param actions
   * @returns
   */
  private onCreateOrder(data: CreateOrderData, actions: CreateOrderActions) {
    const orderData: any = this.getOrderInputPayload()
    return actions.order.create(orderData)
  }

  /**
   * onApprove callback handler executes after the payment is authorized from the payment modal.
   * @param data
   * @param actions
   * @returns
   */
  private onApprove(data: OnApproveData, actions: OnApproveActions) {
    const promise = new Promise<void>(async (resolve: any, reject: any) => {
      const orderDetails: any = await actions?.order?.capture()
      if (orderDetails?.id) {
        const tokenId = orderDetails?.purchase_units[0]?.payments?.captures
          ?.length
          ? orderDetails?.purchase_units[0]?.payments?.captures[0]?.id
          : ''
        const redirectUrl = `${this?.state?.paymentMethod?.notificationUrl}?orderId=${orderDetails?.id}&payerId=${orderDetails?.payer?.payer_id}&token=${tokenId}`
        Router.push(redirectUrl)
      }
      resolve()
    })
    return promise
  }

  /**
   * Returns the payload for PayPal CreateOrder.
   * @returns
   */
  private getOrderInputPayload() {
    const orderInfo = getOrderInfo()
    const orderResult: any = orderInfo?.orderResponse
    if (orderResult) {
      const orderId = orderResult?.id
      const items = [
        {
          name: `Items for Order: ${orderId}; Basket: ${orderResult?.basketId}`,

          // Quantity field contains sum of item quantities.
          quantity: orderResult?.items
            ?.map((x: any) => x?.qty)
            ?.reduce((sum: number, current: number) => sum + current, 0),

          // SKU field contains concatenated stock codes with item quantity in brackets i.e. "SKU1(2), SKU2(4), ..."
          sku: orderResult?.items
            ?.map((x: any) => `${x?.stockCode}(${x?.qty})`)
            ?.join(', '),
          description: EmptyString,
          category: 'DIGITAL_GOODS',
          unit_amount: {
            currency_code: orderResult?.currencyCode,
            value: orderResult?.grandTotal?.raw?.withoutTax?.toFixed(2),
          },
          tax: {
            currency_code: orderResult?.currencyCode,
            value: orderResult?.grandTotal?.raw?.tax?.toFixed(2),
          },
        },
      ]

      const purchaseUnits = [
        {
          reference_id: orderResult?.basketId,
          description: `Order ${orderId} for basket ${orderResult?.basketId}`,
          //custom_id: EmptyString,
          items: items,
          amount: {
            currency_code: orderResult?.currencyCode,
            value: orderResult?.grandTotal?.raw?.withTax?.toFixed(2),
            breakdown: {
              item_total: {
                currency_code: orderResult?.currencyCode,
                value: orderResult?.grandTotal?.raw?.withoutTax?.toFixed(2),
              },
              tax_total: {
                currency_code: orderResult?.currencyCode,
                value: orderResult?.grandTotal?.raw?.tax?.toFixed(2),
              },
            },
          },
        },
      ]

      /*const payer = {
                email_address: orderResult?.customer?.email || EmptyString,
                name: {
                    given_name: orderResult?.billingAddress?.firstName || EmptyString,
                    surname: orderResult?.billingAddress?.lastName || EmptyString,
                },
            };*/
      return {
        purchase_units: purchaseUnits,
        intent: PayPalOrderIntent.CAPTURE,
        /*payer: orderResult?.billingAddress ? payer : null,
                "application_context": {
                    "brand_name": "string",
                    "landing_page": "LOGIN",
                    "shipping_preference": "GET_FROM_FILE",
                    "user_action": "CONTINUE",
                    "return_url": "http://example.com",
                    "cancel_url": "http://example.com",
                    "locale": "string",
                    "payment_method": {
                        "standard_entry_class_code": "TEL",
                        "payee_preferred": "UNRESTRICTED"
                    },
                }*/
      }
    }
  }

  /**
   * Called immediately after a component is mounted.
   */
  public componentDidMount(): void {
    const { paymentMethod, basketOrderInfo, uiContext, dispatchState }: any =
      this.props
    dispatchState({ type: 'SET_ERROR', payload: EmptyString })
    this.onPay(
      this.state.paymentMethod,
      basketOrderInfo,
      uiContext,
      dispatchState
    )
  }

  /**
   * Renders the component.
   * @returns {React.JSX.Element}
   */
  public render() {
    const that = this
    const clientId = super.getPaymentMethodSetting(
      this?.state?.paymentMethod,
      'accountcode'
    )

    return (
      this.state.confirmed && (
        <PayPalScriptProvider
          options={{
            'client-id': clientId,
            currency: BETTERCOMMERCE_DEFAULT_CURRENCY,
          }}
        >
          <PayPalButtons
            style={BUTTONS_DEFAULT_LAYOUT}
            fundingSource={'paypal'}
            createOrder={(data: CreateOrderData, actions: CreateOrderActions) =>
              that.onCreateOrder(data, actions)
            }
            onApprove={(data: OnApproveData, actions: OnApproveActions) =>
              that.onApprove(data, actions)
            }
          />
        </PayPalScriptProvider>
      )
    )
  }
}
