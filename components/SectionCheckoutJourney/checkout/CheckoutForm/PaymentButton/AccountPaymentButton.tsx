// Component Imports
import { getB2BCompanyDetails } from '@framework/utils/payment-util'
import { IPaymentButtonProps } from './BasePaymentButton'
import BasePaymentButton, { IDispatchState } from './BasePaymentButton'
import PaymentGatewayNotification from '@components/SectionCheckoutJourney/checkout/PaymentGatewayNotification'

// Other Imports
import { EmptyString, Messages } from '@components/utils/constants'
import { PaymentMethodType } from '@better-commerce/bc-payments-sdk'
import { matchStrings } from '@framework/utils/parse-util'
import { t as translate } from "i18next";

export class AccountPaymentButton extends BasePaymentButton {
  /**
   * CTor
   * @param props
   */
  constructor(props: IPaymentButtonProps & IDispatchState) {
    super(props)
    this.state = {
      isPaymentInitiated: false,
      paymentMethod: super.getPaymentMethod(props?.paymentMethod),
      availableCredit: 0,
      creditLimit: 0,
      orderTotal: props?.basketOrderInfo?.basket?.grandTotal?.raw?.withTax,
    }
  }

  /**
   * Executes order generation for Account payment method on CommerceHub.
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
    if (uiContext?.user?.userId) {
      const userId = uiContext?.user?.userId
      uiContext?.setOverlayLoaderState({
        visible: true,
        message: translate('label.checkoutForm.validatingAccount'),
      })
      const {
        errors = [],
        message,
        messageCode,
        result: b2bCompanyDetails,
      }: any = await getB2BCompanyDetails(PaymentMethodType.ACCOUNT_CREDIT, {
        userId: uiContext?.user?.userId,
      })

      if (errors?.length || message || messageCode) {
        if (errors?.length) {
          dispatchState({
            type: 'SET_ERROR',
            payload: errors[0],
          })
        } else if (message) {
          dispatchState({
            type: 'SET_ERROR',
            payload: message,
          })
        } else if (message) {
          dispatchState({
            type: 'SET_ERROR',
            payload: messageCode,
          })
        }
      } else {
        if (b2bCompanyDetails?.companyId) {
          const { creditLimit, creditAvailable } = b2bCompanyDetails
          if (creditAvailable?.raw?.withTax <= creditLimit?.raw?.withTax) {
            uiContext?.setOverlayLoaderState({
              visible: true,
              message: translate('label.checkoutForm.pleaseWaitText'),
            })
            const { state, result: orderResult } = await super.confirmOrder(
              paymentMethod,
              basketOrderInfo,
              uiContext,
              dispatchState,
              true
            )
            if (orderResult?.success && orderResult?.result?.id) {
              uiContext?.hideOverlayLoaderState()

              if (state) {
                dispatchState(state)
              }

              this.setState({
                isPaymentInitiated: true,
              })
            } else {
              uiContext?.hideOverlayLoaderState()
              if (state) {
                dispatchState(state)
              } else {
                dispatchState({
                  type: 'SET_ERROR',
                  payload: translate('common.message.requestCouldNotProcessErrorMsg'),
                })
              }
            }
          } else {
            uiContext?.hideOverlayLoaderState()
            dispatchState({
              type: 'SET_ERROR',
              payload: translate('common.message.checkout.notEnoughCreditErrorMsg'),
            })
          }
        } else {
          uiContext?.hideOverlayLoaderState()
          dispatchState({
            type: 'SET_ERROR',
            payload: translate('common.message.companyNotFoundErrorMsg'),
          })
        }
      }
    }
  }

  /**
   * Called immediately after a component is mounted.
   */
  public componentDidMount(): void {
    const that = this
    const { uiContext, dispatchState }: any = this.props
    dispatchState({ type: 'SET_ERROR', payload: EmptyString })
    getB2BCompanyDetails(PaymentMethodType.ACCOUNT_CREDIT, { userId: uiContext?.user?.userId, })
    .then(({ errors = [], message, messageCode, result: b2bCompanyDetails, }: any) => {
      const { creditLimit, creditAvailable } = b2bCompanyDetails
      that.setState({
        creditLimit: creditLimit?.raw?.withTax,
        availableCredit: creditAvailable?.raw?.withTax
      })
    })
  }

  /**
   * Renders the component.
   * @returns {React.JSX.Element}
   */
  public render() {
    const that = this
    const { uiContext }: any = this.props
    const orderTotalGrThAvailableCredit = (this?.state?.orderTotal > this?.state?.availableCredit)

    return (
      <>
        <div className="w-full">
          <dl className="w-2/5 px-2 py-3 mt-2 space-y-2 sm:space-y-2">
            <div className="flex items-center justify-between">
              <dt className="text-sm text-gray-600">{translate('label.checkout.availableCreditText')}</dt>
              <dd className="font-semibold text-black text-md">
                {uiContext?.cartItems?.currencySymbol || EmptyString}
                {this.state?.paymentMethod?.settings?.find((x: any) =>
                  matchStrings(x?.key, 'AvailableCredit', true)
                )?.value || EmptyString}
              </dd>
            </div>
            <div className="flex items-center justify-between pt-2 sm:pt-1">
              <dt className="flex items-center text-sm text-gray-600">
                <span>{translate('label.checkout.acreditLimitText')}</span>
              </dt>
              <dd className="font-semibold text-black text-md">
                {uiContext?.cartItems?.currencySymbol || EmptyString}
                {this.state?.paymentMethod?.settings?.find((x: any) =>
                  matchStrings(x?.key, 'CreditLimit', true)
                )?.value || EmptyString}
              </dd>
            </div>
          </dl>

          {this.baseRender({
            ...this?.props,
            disabled: (orderTotalGrThAvailableCredit || this?.state?.creditLimit === 0 || this?.state?.availableCredit === 0),
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
        </div>

        {this.state.isPaymentInitiated && (
          <PaymentGatewayNotification
            isCOD={false}
            gateway={this.state?.paymentMethod?.systemName}
            params={{
              token: EmptyString,
              orderId: EmptyString,
              payerId: EmptyString,
            }}
            isCancelled={false}
          />
        )}
      </>
    )
  }
}

export default AccountPaymentButton
