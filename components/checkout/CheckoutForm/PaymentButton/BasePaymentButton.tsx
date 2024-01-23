// Base Imports
import React from 'react'

// Package Imports
import { Stripe, StripeElements } from '@stripe/stripe-js'

// Component Imports
import DefaultButton from '@components/ui/IndigoButton'

// Other Imports
import { convertOrder } from '@framework/utils/payment-util'
import {
  LocalStorage,
  PaymentStatus,
} from '@components/utils/payment-constants'
import { parsePaymentMethods } from '@framework/utils/app-util'
import { matchStrings } from '@framework/utils/parse-util'
import { EmptyString, Messages } from '@components/utils/constants'
import { IPaymentInfo } from '@better-commerce/bc-payments-sdk'

export interface IPaymentButtonProps {
  readonly paymentMethod: any | null
  readonly btnTitle: string
  readonly basketOrderInfo: any
  readonly onPay?: Function
  readonly disabled?: boolean
  readonly stripe?: Stripe | null
  readonly stripeElements?: StripeElements | null
  paymentModeLoadedCallback?: any
  readonly scrollToBottomEnabled?: boolean
  readonly contactDetails?: any
  onScrollToSection?: any
  recordEvent?: any
}
export interface IApplePaymentProps {
  readonly isApplePayScriptLoaded?: boolean
  onApplePayScriptLoaded?: any
}
export interface IDispatchState {
  readonly uiContext?: any
  readonly dispatchState: (value: { type?: string; payload?: any }) => void
}

interface IPaymentButton {
  readonly confirmOrder: Function
}

/**
 * Abstract factory component for <PaymentButton>
 */
export default abstract class BasePaymentButton
  extends React.Component<IPaymentButtonProps & IDispatchState, any>
  implements IPaymentButton
{
  /**
   * Executes create order on CommerceHub for generic payment methods on storefront.
   * @param paymentMethod {Object} PaymentMethod info of the executing payment type.
   * @param data {Object} Basket, Address, Order info.
   * @param dispatchState {Function} Method for dispatching state changes.
   * @returns { status: boolean, state: any, result?: any }
   */
  public async confirmOrder(
    paymentMethod: any,
    data: any,
    uiContext: any,
    dispatchState: Function,
    isCOD: boolean = false,
    paymentInfo?: IPaymentInfo
  ): Promise<{ status: boolean; state: any; result?: any }> {
    try {
      const convertOrderInput: any = !isCOD
        ? this.getNonCODConvertOrderPayload(
            paymentMethod,
            data,
            uiContext,
            paymentInfo
          )
        : this.getCODConvertOrderPayload(
            paymentMethod,
            data,
            uiContext,
            paymentInfo
          )
      const orderResult: any = await convertOrder(convertOrderInput)
      if (orderResult?.message || orderResult?.errors?.length) {
        let errorResult
        if (orderResult?.errors?.length) {
          errorResult = {
            status: false,
            state: { type: 'SET_ERROR', payload: orderResult?.errors[0] },
            result: null,
          }
        } else {
          if (orderResult?.message === 'YourBag.Links.EmptyBag') {
            errorResult = {
              status: false,
              state: {
                type: 'SET_ERROR',
                payload: Messages.Errors[orderResult?.message],
              },
              result: null,
            }
          } else {
            errorResult = {
              status: false,
              state: { type: 'SET_ERROR', payload: orderResult?.message },
              result: null,
            }
          }
        }
        return errorResult
      } else if (orderResult?.result?.id) {
        dispatchState({
          type: 'SET_ORDER_RESPONSE',
          payload: orderResult?.result,
        })
        localStorage.setItem(
          LocalStorage.Key.ORDER_RESPONSE,
          JSON.stringify({
            ...orderResult?.result,
            ...{ basketId: data?.basketId },
          })
        )

        const orderModel = {
          ...convertOrderInput?.payment,
          id: orderResult?.result?.payment?.id,
          orderNo: orderResult?.result?.orderNo,
          orderAmount: orderResult?.result?.grandTotal?.raw?.withTax,
          paidAmount: orderResult?.result?.grandTotal?.raw?.withTax,
          balanceAmount: '0.00',
          isValid: true,
          paymentGatewayId: paymentMethod?.id,
          paymentGateway: paymentMethod?.systemName,
          paymentMethod: paymentMethod?.systemName,
          selectedPayment: paymentMethod,
        }
        localStorage.setItem(
          LocalStorage.Key.ORDER_PAYMENT,
          JSON.stringify(orderModel)
        )

        return {
          status: true,
          state: { type: 'TRIGGER_PAYMENT_WIDGET', payload: true },
          result: orderResult,
        }
      } else {
        return {
          status: false,
          state: { type: 'SET_ERROR', payload: orderResult?.message },
          result: orderResult,
        }
      }
    } catch (error) {
      console.log(error)
      return {
        status: false,
        state: null,
      }
    }
  }

  /**
   * Renders <PaymentButton>
   * @param param0 {IPaymentButtonProps & IDispatchState}
   * @returns {React.JSX.Element}
   */
  public baseRender({
    btnTitle,
    paymentMethod,
    basketOrderInfo,
    uiContext,
    dispatchState,
    onPay,
    disabled,
    stripe = null,
    stripeElements = null,
    formId = null,
  }: any) {
    return (
      <DefaultButton
        // For the scenario where formId is provided, buttonType will be overridden to "submit"
        formId={formId}
        buttonType="button"
        action={async () => {
          if (onPay) {
            onPay(paymentMethod, basketOrderInfo, uiContext, dispatchState)
          }
        }}
        title={btnTitle}
        disabled={disabled}
      />
    )
  }

  protected getPaymentInfoPayload(paymentInfo: IPaymentInfo) {
    /* ******
        Info
        ******
        paymentInfo1 is for [pspInformation[]
        paymentInfo2 is for [paymentIdentifier]
        paymentInfo3 is for gateway type i.e. Billdesk, Razorpay, etc
        paymentInfo4 is for [cardType]
        paymentInfo5 is for [cardIssuer]
        paymentInfo6 is for [cardBrand]
        paymentInfo7 is for [chequeNumber]
        paymentInfo8 is untilized
    */

    let info: any = {}
    if (paymentInfo?.paymentInfo1) {
      info = {
        ...info,
        paymentInfo1: paymentInfo?.paymentInfo1,
      }
    }
    if (paymentInfo?.paymentInfo2) {
      info = {
        ...info,
        paymentInfo2: paymentInfo?.paymentInfo2,
      }
    }
    if (paymentInfo?.paymentInfo3) {
      info = {
        ...info,
        paymentInfo3: paymentInfo?.paymentInfo3,
      }
    }
    if (paymentInfo?.paymentInfo4) {
      info = {
        ...info,
        paymentInfo4: paymentInfo?.paymentInfo4,
      }
    }
    if (paymentInfo?.paymentInfo5) {
      info = {
        ...info,
        paymentInfo5: paymentInfo?.paymentInfo5,
      }
    }
    if (paymentInfo?.paymentInfo6) {
      info = {
        ...info,
        paymentInfo6: paymentInfo?.paymentInfo6,
      }
    }
    if (paymentInfo?.paymentInfo7) {
      info = {
        ...info,
        paymentInfo7: paymentInfo?.paymentInfo7,
      }
    }
    if (paymentInfo?.paymentInfo8) {
      info = {
        ...info,
        paymentInfo8: paymentInfo?.paymentInfo8,
      }
    }
    return info
  }

  protected getCODConvertOrderPayload(
    paymentMethod: any,
    basketOrderInfo: any,
    uiContext: any,
    paymentInfo?: IPaymentInfo
  ) {
    let additionalServiceCharge =
      paymentMethod?.settings?.find((x: any) =>
        matchStrings(x?.key, 'AdditionalServiceCharge', true)
      )?.value || '0'
    if (basketOrderInfo) {
      basketOrderInfo = {
        ...basketOrderInfo,
        ...{ selectedPayment: paymentMethod },
        ...{
          basket: {
            ...basketOrderInfo?.basket,
            ...{
              userId: uiContext?.user?.userId || EmptyString,
              userEmail: uiContext?.user?.email || EmptyString,
            },
          },
        },
        ...{
          Payment: {
            ...basketOrderInfo?.Payment,
            ...{ selectedPayment: paymentMethod },
            ...{
              id: null,
              cardNo: null,
              orderNo: 0,
              paidAmount: 0.0,
              balanceAmount: 0.0,
              isValid: false,
              status: 0,
              authCode: null,
              issuerUrl: null,
              paRequest: null,
              pspSessionCookie: null,
              pspResponseCode: null,
              pspResponseMessage: null,
              paymentGatewayId: paymentMethod?.id,
              paymentGateway: paymentMethod?.systemName,
              token: null,
              payerId: null,
              cvcResult: null,
              avsResult: null,
              secure3DResult: null,
              cardHolderName: null,
              issuerCountry: null,
              info1: null,
              fraudScore: null,
              paymentMethod: paymentMethod?.systemName,
              isVerify: false,
              isValidAddress: false,
              lastUpdatedBy: null,
              operatorId: null,
              refStoreId: null,
              tillNumber: null,
              externalRefNo: null,
              expiryYear: null,
              expiryMonth: null,
              isMoto: false,
              additionalServiceCharge,
            },
            ...{ ...this.getPaymentInfoPayload(paymentInfo || {}) },
          },
        },
      }

      return basketOrderInfo
    }
    return null
  }

  protected getNonCODConvertOrderPayload(
    paymentMethod: any,
    basketOrderInfo: any,
    uiContext: any,
    paymentInfo?: IPaymentInfo
  ) {
    let additionalServiceCharge =
      paymentMethod?.settings?.find((x: any) =>
        matchStrings(x?.key, 'AdditionalServiceCharge', true)
      )?.value || '0'
    if (basketOrderInfo) {
      basketOrderInfo = {
        ...basketOrderInfo,
        ...{ selectedPayment: paymentMethod },
        ...{
          basket: {
            ...basketOrderInfo?.basket,
            ...{
              userId: uiContext?.user?.userId || EmptyString,
              userEmail: uiContext?.user?.email || EmptyString,
            },
          },
        },
        ...{
          Payment: {
            ...basketOrderInfo?.Payment,
            ...{
              id: null,
              cardNo: null,
              orderNo: 0,
              paidAmount: 0.0,
              balanceAmount: 0.0,
              isValid: false,
              status: PaymentStatus.PENDING,
              authCode: null,
              issuerUrl: null,
              paRequest: null,
              pspSessionCookie: null,
              pspResponseCode: null,
              pspResponseMessage: null,
              paymentGatewayId: paymentMethod?.id,
              paymentGateway: paymentMethod?.systemName,
              token: null,
              payerId: null,
              cvcResult: null,
              avsResult: null,
              secure3DResult: null,
              cardHolderName: null,
              issuerCountry: null,
              info1: null,
              fraudScore: null,
              paymentMethod: paymentMethod?.systemName,
              isVerify: false,
              isValidAddress: false,
              lastUpdatedBy: null,
              operatorId: null,
              refStoreId: null,
              tillNumber: null,
              externalRefNo: null,
              expiryYear: null,
              expiryMonth: null,
              isMoto: false,
              additionalServiceCharge,
            },
            ...{ ...this.getPaymentInfoPayload(paymentInfo || {}) },
          },
        },
      }
      return basketOrderInfo
    }
    return null
  }

  protected getPaymentMethod(paymentMethod: any) {
    return paymentMethod ? parsePaymentMethods([paymentMethod], false)[0] : null
  }

  protected getPaymentMethodSetting(paymentMethod: any, settingKey: string) {
    if (paymentMethod?.settings?.length) {
      return (
        paymentMethod?.settings?.find((x: any) =>
          matchStrings(x?.key, settingKey, true)
        )?.value || ''
      )
    }
    return null
  }
}
