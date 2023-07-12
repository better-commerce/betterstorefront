// Component Imports
import { getB2BCompanyDetails } from '@framework/utils/payment-util'
import { IPaymentButtonProps } from './BasePaymentButton'
import BasePaymentButton, { IDispatchState } from './BasePaymentButton'
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
  ) {}

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
    const { uiContext }: any = this.props

    return <></>
  }
}

export default ChequePaymentButton
