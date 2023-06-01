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
        let additionalServiceCharge = paymentMethod?.settings?.find((x: any) => matchStrings(x?.key, "AdditionalServiceCharge", true))?.value || "0";
        if (basketOrderInfo) {
            basketOrderInfo = {
                ...basketOrderInfo,
                ...{
                    Payment: {
                        ...basketOrderInfo?.Payment,
                        ...{
                            Id: null,
                            CardNo: null,
                            OrderNo: 0,
                            PaidAmount: 0.0,
                            BalanceAmount: 0.0,
                            IsValid: false,
                            Status: 0,
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
                            additionalServiceCharge: additionalServiceCharge,
                        },
                    },
                }
            }

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
                isMoto: true,
                upFrontPayment: false,
                upFrontAmount: '0.00',
                upFrontTerm: '76245369',
                isPrePaid: false,
            };
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