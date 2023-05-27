// Component Imports
import BasePaymentButton, { IDispatchState } from "./BasePaymentButton";
import { IPaymentButtonProps } from "./BasePaymentButton";

// Other Imports


export class StripePaymentButton extends BasePaymentButton {

    /**
     * CTor
     * @param props 
     */
    constructor(props: IPaymentButtonProps & IDispatchState) {
        super(props);
    }

    /**
     * Executes order generation for COD payment method on CommerceHub.
     * @param paymentMethod {Object} PaymentMethod info of the executing payment type.
     * @param paymentOrderInfo {Function} Generic function that dispatches the generic input data object for generating the CommerceHub order.
     * @param uiContext {Object} Method for dispatching global ui state changes.
     * @param dispatchState {Function} Method for dispatching state changes.
     */
    private async onPay(paymentMethod: any, paymentOrderInfo: Function, uiContext: any, dispatchState: Function) {
    }

    /**
     * Renders the component.
     * @returns {React.JSX.Element}
     */
    public render() {
        return this.baseRender({
            ...this?.props, ...{
                onPay: this.onPay,
            }
        });
    }
}