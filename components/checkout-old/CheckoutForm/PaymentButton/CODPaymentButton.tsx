// Component Imports
import { PaymentMethodType } from '@better-commerce/bc-payments-sdk'
import { IPaymentButtonProps } from './BasePaymentButton'
import BasePaymentButton, { IDispatchState } from './BasePaymentButton'
import PaymentGatewayNotification from '@components/checkout-old/PaymentGatewayNotification'

// Other Imports
import { t as translate } from "i18next";
import { EmptyString } from '@components/utils/constants'

export class CODPaymentButton extends BasePaymentButton {
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
      super.recordAddPaymentInfoEvent(uiContext, this.props.recordEvent, PaymentMethodType.COD)
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
    const that = this
    return (
      <>
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

        {this.state.isPaymentInitiated && (
          <PaymentGatewayNotification
            isCOD={true}
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
