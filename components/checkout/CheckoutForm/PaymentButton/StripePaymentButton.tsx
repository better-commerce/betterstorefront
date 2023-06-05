// Package Imports
import Router from "next/router";
import { Stripe, StripeElements } from "@stripe/stripe-js";
import { Elements, ElementsConsumer, PaymentElement, } from '@stripe/react-stripe-js'

// Component Imports
import BasePaymentButton, { IDispatchState } from "./BasePaymentButton";
import { IPaymentButtonProps } from "./BasePaymentButton";

// Other Imports
import { EmptyString, Messages } from '@components/utils/constants';
import { getOrderInfo } from '@framework/utils/app-util';
import getStripe from "@components/utils/get-stripe";
import { initPayment } from "@framework/utils/payment-util";

export class StripePaymentButton extends BasePaymentButton {

    /**
     * CTor
     * @param props 
     */
    constructor(props: IPaymentButtonProps & IDispatchState) {
        super(props);
        this.state = {
            paymentMethod: super.getPaymentMethod(props?.paymentMethod),
            clientSecret: null,
            stripePromise: null,
            stripeOptions: null,
            message: EmptyString,
        }
    }

    /**
     * Executes order generation for COD payment method on CommerceHub.
     * @param paymentMethod {Object} PaymentMethod info of the executing payment type.
     * @param basketOrderInfo {Object} Input data object for generating the CommerceHub order.
     * @param uiContext {Object} Method for dispatching global ui state changes.
     * @param dispatchState {Function} Method for dispatching state changes.
     */
    private async onPay(paymentMethod: any, basketOrderInfo: any, uiContext: any, dispatchState: Function) {
        uiContext?.setOverlayLoaderState({ visible: true, message: "Initiating order..." });

        const { result: orderResult } = await super.confirmOrder(paymentMethod, basketOrderInfo, dispatchState);
        if (orderResult?.success && orderResult?.result?.id) {
            const { id: orderId, basketId, orderNo, grandTotal, currencyCode } = orderResult?.result;
            const stripePromise = getStripe();
            const appearance = {
                theme: "stripe",
            };
            const data = {
                amount: grandTotal.raw.withTax,
                currency: currencyCode,
                receipt_email: uiContext?.user?.email,
                description: `Order ${orderId} for basket ${basketId}`,
            };
            uiContext?.setOverlayLoaderState({ visible: true, message: "Initiating payment..." });
            const clientResult: any = await initPayment(this.state?.paymentMethod?.systemName, data);
            this.setState({
                clientSecret: clientResult?.client_secret,
                stripePromise: stripePromise,
                stripeOptions: {
                    clientSecret: clientResult?.client_secret,
                    appearance,
                }
            })
            uiContext?.hideOverlayLoaderState();
        } else {
            uiContext?.hideOverlayLoaderState();
            dispatchState({ type: 'SET_ERROR', payload: Messages.Errors["GENERIC_ERROR"] });
        }
    }

    private async onCapturePayment(paymentMethod: any, basketOrderInfo: any, uiContext: any, dispatchState: Function, stripe: Stripe, elements: StripeElements) {

        // Block native form submission.
        if (!stripe || !elements) {
            // Stripe.js has not loaded yet. Make sure to disable
            // form submission until Stripe.js has loaded.
            return;
        }

        uiContext?.setOverlayLoaderState({ visible: true, message: "Please wait..." });

        // Get a reference to a mounted CardElement. Elements knows how
        // to find your CardElement because there can only ever be one of
        // each type of element.
        // Use your card Element with other Stripe.js APIs
        const { error }: any = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Make sure to change this to your payment completion page
                return_url: `${window.location.origin}${this.state?.paymentMethod?.notificationUrl}`,
            },
        });

        if (error) {
            uiContext?.hideOverlayLoaderState();
            dispatchState({ type: 'SET_ERROR', payload: Messages.Errors["GENERIC_ERROR"] });
        }
    }

    /**
     * Called immediately after a component is mounted.
     */
    public componentDidMount(): void {
        const { paymentMethod, basketOrderInfo, uiContext, dispatchState }: any = this.props;
        this.onPay(paymentMethod, basketOrderInfo, uiContext, dispatchState);
    }

    /**
     * Renders the component.
     * @returns {React.JSX.Element}
     */
    public render() {
        const that = this;

        return (
            <>
                {
                    this.state.stripeOptions && (
                        <Elements stripe={this.state.stripePromise} options={this.state.stripeOptions}>
                            <ElementsConsumer>
                                {({ stripe, elements }: any) => (
                                    <form id="payment-form">
                                        <PaymentElement id="payment-element" />

                                        {
                                            this.baseRender({
                                                ...this?.props, ...{
                                                    onPay: async (paymentMethod: any, basketOrderInfo: any, uiContext: any, dispatchState: Function) => await that.onCapturePayment(that.state.paymentMethod, basketOrderInfo, uiContext, dispatchState, stripe, elements),
                                                    disabled: (!stripe || !elements)
                                                }
                                            })
                                        }
                                    </form>
                                )}
                            </ElementsConsumer>
                        </Elements>
                    )
                }
            </>
        );
    }
}