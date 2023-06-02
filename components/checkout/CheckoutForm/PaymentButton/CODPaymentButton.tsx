// Component Imports
import BasePaymentButton, { IDispatchState } from "./BasePaymentButton";
import { IPaymentButtonProps } from "./BasePaymentButton";

// Other Imports
import { matchStrings } from "@framework/utils/parse-util";
import { PaymentOrderStatus } from "@components/utils/payment-constants";
import { Messages } from "@components/utils/constants";

export class CODPaymentButton extends BasePaymentButton {

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
     * @param basketOrderInfo {Object} Input data object for generating the CommerceHub order.
     * @param uiContext {Object} Method for dispatching global ui state changes.
     * @param dispatchState {Function} Method for dispatching state changes.
     */
    private async onPay(paymentMethod: any, basketOrderInfo: any, uiContext: any, dispatchState: Function) {
        uiContext?.setOverlayLoaderState({ visible: true, message: "Please wait..." });
        const paymentMethodOrderRespData = super.getCODConvertOrderPayload(paymentMethod, basketOrderInfo);
        if (paymentMethodOrderRespData) {

            const orderResult = await super.confirmOrder(paymentMethod, basketOrderInfo, paymentMethodOrderRespData, dispatchState);
            if (orderResult?.state) {
                uiContext?.hideOverlayLoaderState();
                dispatchState(orderResult?.state);
            } else {
                uiContext?.hideOverlayLoaderState();
                dispatchState({ type: 'SET_ERROR', payload: Messages.Errors["GENERIC_ERROR"] });
            }
        } else {
            uiContext?.hideOverlayLoaderState();
            dispatchState({ type: 'SET_ERROR', payload: Messages.Errors["GENERIC_ERROR"] });
        }
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