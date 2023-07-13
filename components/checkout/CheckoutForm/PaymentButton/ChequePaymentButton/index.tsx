// Component Imports
import ChequePayment, { CHEQUE_PAYMENT_FORM_ID } from './ChequePayment'
import { IPaymentButtonProps } from '../BasePaymentButton'
import BasePaymentButton, { IDispatchState } from '../BasePaymentButton'
import PaymentGatewayNotification from '@components/checkout/PaymentGatewayNotification'

// Other Imports
import { EmptyString, Messages } from '@components/utils/constants'
import { PaymentMethodType } from '@components/utils/payment-constants'
import { matchStrings } from '@framework/utils/parse-util'

export class ChequePaymentButton extends BasePaymentButton {
  /**
   * CTor
   * @param props
   */
  constructor(props: IPaymentButtonProps & IDispatchState) {
    super(props)
    this.state = {
      isPaymentInitiated: false,
      paymentMethod: super.getPaymentMethod(props?.paymentMethod),
      paymentInfo: {
        paymentInfo1: null,
        paymentInfo2: null,
        paymentInfo3: null,
        paymentInfo4: null,
        paymentInfo5: null,
        paymentInfo6: null,
        paymentInfo7: null,
        paymentInfo8: null,
      },
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
    dispatchState: Function,
    chequeNumber: string
  ) {
    uiContext?.setOverlayLoaderState({
      visible: true,
      message: 'Please wait...',
    })
    const paymentInfo = {
      paymentInfo1: null,
      paymentInfo2: null,
      paymentInfo3: null,
      paymentInfo4: null,
      paymentInfo5: null,
      paymentInfo6: null,
      paymentInfo7: chequeNumber,
      paymentInfo8: null,
    }
    this.setState({ paymentInfo: paymentInfo })
    const { state, result: orderResult } = await super.confirmOrder(
      paymentMethod,
      basketOrderInfo,
      uiContext,
      dispatchState,
      false,
      paymentInfo
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
  }

  /**
   * Called immediately after a component is mounted.
   */
  public componentDidMount(): void {
    const { uiContext, dispatchState }: any = this.props
    dispatchState({ type: 'SET_ERROR', payload: EmptyString })
  }

  private async onChequeSubmit(data: any): Promise<void> {
    const { paymentMethod, basketOrderInfo, uiContext, dispatchState } =
      this.props
    await this.onPay(
      this.state.paymentMethod,
      basketOrderInfo,
      uiContext,
      dispatchState,
      data?.chequeNo
    )
  }

  /**
   * Renders the component.
   * @returns {React.JSX.Element}
   */
  public render() {
    const that = this
    const { uiContext }: any = this.props

    return (
      <>
        <div className="w-full">
          <dl className="w-2/5 space-y-2 sm:space-y-2 py-2">
            <ChequePayment
              onSubmit={async (data: any) => await that.onChequeSubmit(data)}
            />
          </dl>

          {this.baseRender({
            ...this?.props,
            ...{
              formId: CHEQUE_PAYMENT_FORM_ID,
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
              paymentInfo: that.state.paymentInfo,
            }}
            isCancelled={false}
          />
        )}
      </>
    )
  }
}

export default ChequePaymentButton
