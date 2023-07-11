// Component Imports
import { getB2BCompanyDetails } from '@framework/utils/payment-util'
import { IPaymentButtonProps } from './BasePaymentButton'
import BasePaymentButton, { IDispatchState } from './BasePaymentButton'
import PaymentGatewayNotification from '@components/checkout/PaymentGatewayNotification'

// Other Imports
import { EmptyString, Messages } from '@components/utils/constants'
import { PaymentMethodType } from '@components/utils/payment-constants'
import { matchStrings } from '@framework/utils/parse-util'

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
        message: 'Validating account...',
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
          if (creditAvailable?.raw?.withTax < creditLimit?.raw?.withTax) {
            uiContext?.setOverlayLoaderState({
              visible: true,
              message: 'Please wait...',
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
                  payload: Messages.Errors['GENERIC_ERROR'],
                })
              }
            }
          } else {
            uiContext?.hideOverlayLoaderState()
            dispatchState({
              type: 'SET_ERROR',
              payload: Messages.Errors['COMPANY_CREDIT_LIMIT_EXCEEDED'],
            })
          }
        } else {
          uiContext?.hideOverlayLoaderState()
          dispatchState({
            type: 'SET_ERROR',
            payload: Messages.Errors['COMPANY_NOT_FOUND'],
          })
        }
      }
    }
  }

  /**
   * Called immediately after a component is mounted.
   */
  public componentDidMount(): void {
    const { uiContext, dispatchState }: any = this.props
    dispatchState({ type: 'SET_ERROR', payload: EmptyString })
  }

  /**
   * Renders the component.
   * @returns {React.JSX.Element}
   */
  public render() {
    const that = this
    return (
      <>
        <div className="w-full">
          <p className="text-muted text-center">
            Credit Available:{' '}
            {this.state?.paymentMethod?.settings?.find((x: any) =>
              matchStrings(x?.key, 'AvailableCredit', true)
            )?.value || EmptyString}
          </p>
          <p className="text-muted text-center pb-10">
            Credit Limit:{' '}
            {this.state?.paymentMethod?.settings?.find((x: any) =>
              matchStrings(x?.key, 'CreditLimit', true)
            )?.value || EmptyString}
          </p>

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
