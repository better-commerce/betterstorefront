// Package Imports
import { Frames, CardNumber, ExpiryDate, Cvv } from 'frames-react';

// Component Imports
import BasePaymentButton, { IDispatchState } from "./BasePaymentButton";
import { IPaymentButtonProps } from "./BasePaymentButton";

// Other Imports


export class CheckoutPaymentButton extends BasePaymentButton {

    /**
     * CTor
     * @param props 
     */
    constructor(props: IPaymentButtonProps & IDispatchState) {
        super(props);
        this.state = {
            paymentMethod: super.getPaymentMethod(props?.paymentMethod),
        };
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
        const publicKey = super.getPaymentMethodSetting(this?.state?.paymentMethod, "accountcode");

        return (
            <div className="checkout-frame-container">
                <Frames
                    config={{
                        debug: true,
                        publicKey: publicKey,
                        schemeChoice: true,
                        localization: {
                            cardNumberPlaceholder: 'Card number',
                            expiryMonthPlaceholder: 'MM',
                            expiryYearPlaceholder: 'YY',
                            cvvPlaceholder: 'CVV',
                        },
                    }}
                    ready={() => { }}
                    frameActivated={(e) => { }}
                    frameFocus={(e) => { }}
                    frameBlur={(e) => { }}
                    frameValidationChanged={(e) => { }}
                    paymentMethodChanged={(e) => { }}
                    cardValidationChanged={(e) => { }}
                    cardSubmitted={() => { }}
                    cardTokenized={(e) => { }}
                    cardTokenizationFailed={(e) => { }}
                    cardBinChanged={(e) => { }}
                >
                    <div>
                        <CardNumber />
                    </div>
                    <div className="date-and-code">
                        <ExpiryDate />
                        <Cvv />
                    </div>

                    {
                        this.baseRender({
                            ...this?.props, ...{
                                onPay: this.onPay,
                            }
                        })
                    }
                </Frames>
            </div>

        )
    }
}