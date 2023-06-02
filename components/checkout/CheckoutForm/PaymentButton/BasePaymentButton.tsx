// Base Imports
import React from "react";

// Component Imports
import DefaultButton from "@components/ui/IndigoButton";

// Other Imports
import { createStorefrontOrder } from "@framework/utils/payment-util";
import { LocalStorage, PaymentOrderStatus } from "@components/utils/payment-constants";
import { parsePaymentMethods } from "@framework/utils/app-util";
import { matchStrings } from "@framework/utils/parse-util";

export interface IPaymentButtonProps {
    readonly paymentMethod: any | null;
    readonly btnTitle: string;
    readonly basketOrderInfo: any;
    readonly onPay?: Function;
    readonly disabled?: boolean;
}

export interface IDispatchState {
    readonly uiContext?: any;
    readonly dispatchState: (value: {
        type?: string
        payload?: any
    }) => void;
};

interface IPaymentButton {
    readonly confirmOrder: Function;
}

/**
 * Abstract factory component for <PaymentButton>
 */
export default abstract class BasePaymentButton extends React.Component<IPaymentButtonProps & IDispatchState, any> implements IPaymentButton {

    /**
     * Executes create order on CommerceHub for generic payment methods on storefront.
     * @param paymentMethod {Object} PaymentMethod info of the executing payment type.
     * @param data {Object} Basket, Address, Order info.
     * @param paymentMethodOrderRespData {Object} OrderModel data specific to payment type, appended to the OrderModelResponse object.
     * @param dispatchState {Function} Method for dispatching state changes.
     * @returns { status: boolean, state: any, result?: any }
     */
    public async confirmOrder(paymentMethod: any, data: any, paymentMethodOrderRespData: any, dispatchState: Function): Promise<{ status: boolean, state: any, result?: any }> {
        try {
            const orderResult = await createStorefrontOrder(data);
            if (orderResult?.result?.id) {
                dispatchState({
                    type: "SET_ORDER_RESPONSE",
                    payload: orderResult?.result,
                });
                localStorage.setItem(LocalStorage.Key.ORDER_RESPONSE, JSON.stringify({ ...orderResult?.result, ...{ basketId: data?.basketId } }))

                const orderModel = {
                    id: orderResult?.result?.payment?.id,
                    orderNo: orderResult?.result?.orderNo,
                    orderAmount: orderResult?.result?.grandTotal?.raw?.withTax,
                    paidAmount: orderResult?.result?.grandTotal?.raw?.withTax,
                    balanceAmount: '0.00',
                    isValid: true,
                    paymentGatewayId: paymentMethod?.id,
                    paymentGateway: paymentMethod?.systemName,
                    paymentMethod: paymentMethod?.systemName,
                    ...paymentMethodOrderRespData,
                }
                localStorage.setItem(LocalStorage.Key.ORDER_PAYMENT, JSON.stringify(orderModel));

                return {
                    status: true,
                    state: { type: 'TRIGGER_PAYMENT_WIDGET', payload: true },
                    result: orderResult,
                };
            } else {
                return {
                    status: false,
                    state: { type: 'SET_ERROR', payload: orderResult?.message },
                    result: orderResult,
                };
            }
        } catch (error) {
            window.alert(error);
            console.log(error);
            return {
                status: false,
                state: null,
            };
        }
    }

    /**
     * Renders <PaymentButton>
     * @param param0 {IPaymentButtonProps & IDispatchState}
     * @returns {React.JSX.Element}
     */
    public baseRender({ btnTitle, paymentMethod, basketOrderInfo, uiContext, dispatchState, onPay, disabled = false }: IPaymentButtonProps & IDispatchState) {
        return (
            <DefaultButton
                buttonType="button"
                action={async () => {
                    if (onPay) {
                        onPay(paymentMethod, basketOrderInfo, uiContext, dispatchState);
                    }
                }}
                title={btnTitle}
                disabled={disabled}
            />
        );
    }

    protected getCODConvertOrderPayload(paymentMethod: any, basketOrderInfo: any) {
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
            return paymentMethodOrderRespData;
        }
        return null;
    }

    protected getNonCODConvertOrderPayload(paymentMethod: any, basketOrderInfo: any) {
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
                upFrontAmount: `${basketOrderInfo?.Payment?.OrderAmount}`,
                isPrePaid: false,
                additionalServiceCharge: additionalServiceCharge,
            };
            return paymentMethodOrderRespData;
        }
        return null;
    }

    /**
     * Returns generic input data object for generating CommerceHub order, 
     * containing information of Basket, Address, Shipping, PaymentMethod relevant for all payment types.
     * @param paymentMethod {Object} PaymentMethod info of the executing payment type.
     * @param getPaymentOrderInfo {Function} Generic function that dispatches the generic input data object for generating the CommerceHub order.
     * @returns 
     */
    protected async paymentOrderInfo(paymentMethod: any, getPaymentOrderInfo: Function): Promise<any> {
        return await getPaymentOrderInfo(paymentMethod);
    }

    protected getPaymentMethod(paymentMethod: any) {
        return paymentMethod
            ? parsePaymentMethods([paymentMethod], false)[0]
            : null;
    }

    protected getPaymentMethodSetting(paymentMethod: any, settingKey: string) {
        if (paymentMethod?.settings?.length) {
            return paymentMethod?.settings?.find((x: any) => matchStrings(x?.key, settingKey, true))?.value || "";
        }
        return null;
    }
}