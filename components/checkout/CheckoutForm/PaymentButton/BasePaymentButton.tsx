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
import { Messages } from '@components/utils/constants'

export interface IPaymentButtonProps {
  readonly paymentMethod: any | null
  readonly btnTitle: string
  readonly basketOrderInfo: any
  readonly onPay?: Function
  readonly disabled?: boolean
  readonly stripe?: Stripe | null
  readonly stripeElements?: StripeElements | null
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
    dispatchState: Function,
    isCOD: boolean = false
  ): Promise<{ status: boolean; state: any; result?: any }> {
    try {
      const orderResult: any = await convertOrder(data)
      if (orderResult?.message) {
        if (orderResult?.message === 'YourBag.Links.EmptyBag') {
          return {
            status: false,
            state: {
              type: 'SET_ERROR',
              payload: Messages.Errors[orderResult?.message],
            },
            result: null,
          }
        }

        return {
          status: false,
          state: { type: 'SET_ERROR', payload: orderResult?.message },
          result: null,
        }
      } else if (orderResult?.result?.id) {
        const paymentMethodOrderRespData = !isCOD
          ? this.getNonCODConvertOrderPayload(paymentMethod, data)
          : this.getCODConvertOrderPayload(paymentMethod, data)
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
          id: orderResult?.result?.payment?.id,
          orderNo: orderResult?.result?.orderNo,
          orderAmount: orderResult?.result?.grandTotal?.raw?.withTax,
          paidAmount: orderResult?.result?.grandTotal?.raw?.withTax,
          balanceAmount: '0.00',
          isValid: true,
          paymentGatewayId: paymentMethod?.id,
          paymentGateway: paymentMethod?.systemName,
          paymentMethod: paymentMethod?.systemName,
          ...paymentMethodOrderRespData,
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
    disabled = false,
  }: IPaymentButtonProps & IDispatchState) {
    return (
      <DefaultButton
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

  protected getCODConvertOrderPayload(
    paymentMethod: any,
    basketOrderInfo: any
  ) {
    let additionalServiceCharge =
      paymentMethod?.settings?.find((x: any) =>
        matchStrings(x?.key, 'AdditionalServiceCharge', true)
      )?.value || '0'
    if (basketOrderInfo) {
      basketOrderInfo = {
        ...basketOrderInfo,
        ...{
          Payment: {
            ...basketOrderInfo?.Payment,
            ...{
              Id: null,
              CardNo: null,
              OrderNo: 0,
              PaidAmount: 0.0,
              BalanceAmount: 0.0,
              IsValid: false,
              Status: 0,
              AuthCode: null,
              IssuerUrl: null,
              PaRequest: null,
              PspSessionCookie: null,
              PspResponseCode: null,
              PspResponseMessage: null,
              PaymentGatewayId: paymentMethod?.id,
              PaymentGateway: paymentMethod?.systemName,
              Token: null,
              PayerId: null,
              CvcResult: null,
              AvsResult: null,
              Secure3DResult: null,
              CardHolderName: null,
              IssuerCountry: null,
              Info1: null,
              FraudScore: null,
              PaymentMethod: paymentMethod?.systemName,
              IsVerify: false,
              IsValidAddress: false,
              LastUpdatedBy: null,
              OperatorId: null,
              RefStoreId: null,
              TillNumber: null,
              ExternalRefNo: null,
              ExpiryYear: null,
              ExpiryMonth: null,
              IsMoto: false,
              additionalServiceCharge: additionalServiceCharge,
            },
          },
        },
      }

      const paymentMethodOrderRespData = {
        cardNo: null,
        status: PaymentStatus.PAID,
        authCode: null,
        issuerUrl: null,
        paRequest: null,
        pspSessionCookie: null,
        pspResponseCode: null,
        pspResponseMessage: null,
        token: null,
        payerId: null,
        cvcResult: null,
        avsResult: null,
        secure3DResult: null,
        cardHolderName: null,
        issuerCountry: null,
        info1: '',
        fraudScore: null,
        cardType: null,
        operatorId: null,
        refStoreId: null,
        tillNumber: null,
        externalRefNo: null,
        expiryYear: null,
        expiryMonth: null,
        isMoto: true,
        upFrontPayment: false,
        upFrontAmount: '0.00',
        upFrontTerm: '76245369',
        isPrePaid: false,
      }
      return paymentMethodOrderRespData
    }
    return null
  }

  protected getNonCODConvertOrderPayload(
    paymentMethod: any,
    basketOrderInfo: any
  ) {
    let additionalServiceCharge =
      paymentMethod?.settings?.find((x: any) =>
        matchStrings(x?.key, 'AdditionalServiceCharge', true)
      )?.value || '0'
    if (basketOrderInfo) {
      basketOrderInfo = {
        ...basketOrderInfo,
        ...{
          Payment: {
            ...basketOrderInfo?.Payment,
            ...{
              Id: null,
              CardNo: null,
              OrderNo: 0,
              PaidAmount: 0.0,
              BalanceAmount: 0.0,
              IsValid: false,
              Status: PaymentStatus.PENDING,
              AuthCode: null,
              IssuerUrl: null,
              PaRequest: null,
              PspSessionCookie: null,
              PspResponseCode: null,
              PspResponseMessage: null,
              PaymentGatewayId: paymentMethod?.id,
              PaymentGateway: paymentMethod?.systemName,
              Token: null,
              PayerId: null,
              CvcResult: null,
              AvsResult: null,
              Secure3DResult: null,
              CardHolderName: null,
              IssuerCountry: null,
              Info1: null,
              FraudScore: null,
              PaymentMethod: paymentMethod?.systemName,
              IsVerify: false,
              IsValidAddress: false,
              LastUpdatedBy: null,
              OperatorId: null,
              RefStoreId: null,
              TillNumber: null,
              ExternalRefNo: null,
              ExpiryYear: null,
              ExpiryMonth: null,
              IsMoto: false,
            },
          },
        },
      }

      const paymentMethodOrderRespData = {
        cardNo: null,
        status: PaymentStatus.PAID,
        authCode: null,
        issuerUrl: null,
        paRequest: null,
        pspSessionCookie: null,
        pspResponseCode: null,
        pspResponseMessage: null,
        token: null,
        payerId: null,
        cvcResult: null,
        avsResult: null,
        secure3DResult: null,
        cardHolderName: null,
        issuerCountry: null,
        info1: '',
        fraudScore: null,
        cardType: null,
        operatorId: null,
        refStoreId: null,
        tillNumber: null,
        externalRefNo: null,
        expiryYear: null,
        expiryMonth: null,
        isMoto: false,
        upFrontPayment: false,
        upFrontAmount: `${basketOrderInfo?.Payment?.OrderAmount}`,
        isPrePaid: false,
        additionalServiceCharge: additionalServiceCharge,
      }
      return paymentMethodOrderRespData
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
