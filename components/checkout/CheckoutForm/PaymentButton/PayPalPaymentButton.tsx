// Package Imports
import Router from 'next/router';

// Component Imports
import { createPaypalPayment } from "@framework/utils/payment-util";
import BasePaymentButton, { IDispatchState } from "./BasePaymentButton";
import { IPaymentButtonProps } from "./BasePaymentButton";

// Other Imports
import { PaymentOrderStatus } from "@components/utils/payment-constants";
import { Messages } from "@components/utils/constants";

export class PayPalPaymentButton extends BasePaymentButton {

    /**
     * CTor
     * @param props 
     */
    constructor(props: IPaymentButtonProps & IDispatchState) {
        super(props);
        /*this.state = {
        };*/
    }

    /**
     * Executes order generation for Paypal payment method on CommerceHub.
     * @param paymentMethod {Object} PaymentMethod info of the executing payment type.
     * @param paymentOrderInfo {Function} Generic function that dispatches the generic input data object for generating the CommerceHub order.
     * @param uiContext {Object} Method for dispatching global ui state changes.
     * @param dispatchState {Function} Method for dispatching state changes.
     */
    private async onPay(paymentMethod: any, paymentOrderInfo: Function, uiContext: any, dispatchState: Function) {
        uiContext?.setOverlayLoaderState({ visible: true, message: "Please wait..." });
        let orderData = await super.paymentOrderInfo(paymentMethod, paymentOrderInfo);
        if (orderData) {
            orderData = {
                ...orderData,
                ...{
                    Payment: {
                        ...orderData?.Payment,
                        ...{
                            Id: null,
                            CardNo: null,
                            OrderNo: 0,
                            PaidAmount: 0.0,
                            BalanceAmount: 0.0,
                            IsValid: false,
                            Status: PaymentOrderStatus.PENDING,
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
                }
            };

            const paymentMethodOrderRespData = {
                cardNo: null,
                status: PaymentOrderStatus.PAID,
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
                upFrontAmount: `${orderData?.Payment?.OrderAmount}`,
                isPrePaid: false,
            };
            const orderResult = await super.confirmOrder(paymentMethod, orderData, paymentMethodOrderRespData, dispatchState);
            //debugger;
            if (orderResult?.status) {
                const orderId = orderResult?.result?.result?.id;
                const createPaymentResult: any = await createPaypalPayment(orderId);
                const redirectUrl = createPaymentResult?.links?.approval_url?.href;
                if (redirectUrl) {
                    uiContext?.hideOverlayLoaderState();
                    Router.push(redirectUrl);
                }
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