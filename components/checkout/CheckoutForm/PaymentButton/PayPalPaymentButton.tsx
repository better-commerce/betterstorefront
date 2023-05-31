// Base Imports
import React from "react";

// Package Imports
import Router from "next/router";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { CreateOrderData, CreateOrderActions, OnApproveData, OnApproveActions, OnClickActions, OnInitActions } from "@paypal/paypal-js/types/components/buttons";

// Component Imports
import BasePaymentButton, { IDispatchState } from "./BasePaymentButton";
import { IPaymentButtonProps } from "./BasePaymentButton";

// Other Imports
import { BETTERCOMMERCE_DEFAULT_CURRENCY, EmptyGuid, EmptyString, Messages } from "@components/utils/constants";
import { PaymentOrderStatus } from "@components/utils/payment-constants";
import { PayPalOrderIntent } from "@framework/api/endpoints/payments/constants";
import { getOrderInfo } from "@framework/utils/app-util";

const BUTTONS_DEFAULT_LAYOUT: any = {
    layout: "vertical",
    color: "gold",
    shape: "rect",
    label: "pay"
};

export class PayPalPaymentButton extends BasePaymentButton {

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
     * Executes order generation for Paypal payment method on CommerceHub.
     * @param paymentMethod {Object} PaymentMethod info of the executing payment type.
     * @param basketOrderInfo {Object} Input data object for generating the CommerceHub order.
     * @param uiContext {Object} Method for dispatching global ui state changes.
     * @param dispatchState {Function} Method for dispatching state changes.
     */
    private async onPay(paymentMethod: any, basketOrderInfo: any, uiContext: any, dispatchState: Function) {
        uiContext?.setOverlayLoaderState({ visible: true, message: "Initiating order..." });
        //let orderData = await super.paymentOrderInfo(paymentMethod, paymentOrderInfo);
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
            };
            const { result: orderResult } = await super.confirmOrder(paymentMethod, basketOrderInfo, paymentMethodOrderRespData, dispatchState);
            if (orderResult?.success && orderResult?.result?.id) {
                uiContext?.hideOverlayLoaderState();
                /*const orderId = orderResult?.result?.result?.id;
                const createPaymentResult: any = await createPaypalPayment(orderId);
                const redirectUrl = createPaymentResult?.links?.approval_url?.href;
                if (redirectUrl) {
                    uiContext?.hideOverlayLoaderState();
                    Router.push(redirectUrl);
                }*/
            } else {
                uiContext?.hideOverlayLoaderState();
                dispatchState({ type: 'SET_ERROR', payload: Messages.Errors["GENERIC_ERROR"] });
            }
        } else {
            uiContext?.hideOverlayLoaderState();
            dispatchState({ type: 'SET_ERROR', payload: Messages.Errors["GENERIC_ERROR"] });
        }
    }

    private getPayPalOrderData() {
        const orderInfo = getOrderInfo();
        const orderResult: any = orderInfo?.orderResponse;
        if (orderResult) {
            const orderId = orderResult?.id;
            const items = [
                {
                    name: `Items for Order: ${orderId}; Basket: ${orderResult?.basketId}`,

                    // Quantity field contains sum of item quantities.
                    quantity: orderResult?.items?.map((x: any) => x?.qty)?.reduce((sum: number, current: number) => sum + current, 0),

                    // SKU field contains concatenated stock codes with item quantity in brackets i.e. "SKU1(2), SKU2(4), ..."
                    sku: orderResult?.items?.map((x: any) => `${x?.stockCode}(${x?.qty})`)?.join(", "),
                    description: EmptyString,
                    category: "DIGITAL_GOODS",
                    unit_amount: {
                        currency_code: orderResult?.currencyCode,
                        value: orderResult?.grandTotal?.raw?.withoutTax?.toFixed(2),
                    },
                    tax: {
                        currency_code: orderResult?.currencyCode,
                        value: orderResult?.grandTotal?.raw?.tax?.toFixed(2),
                    }
                }
            ];

            const purchaseUnits = [
                {
                    reference_id: orderResult?.basketId,
                    description: `Order ${orderId} for basket ${orderResult?.basketId}`,
                    //custom_id: EmptyString,
                    items: items,
                    amount: {
                        currency_code: orderResult?.currencyCode,
                        value: orderResult?.grandTotal?.raw?.withTax?.toFixed(2),
                        breakdown: {
                            item_total: {
                                currency_code: orderResult?.currencyCode,
                                value: orderResult?.grandTotal?.raw?.withoutTax?.toFixed(2),
                            },
                            tax_total: {
                                currency_code: orderResult?.currencyCode,
                                value: orderResult?.grandTotal?.raw?.tax?.toFixed(2),
                            },
                        }
                    },
                }
            ];

            /*const payer = {
                email_address: orderResult?.customer?.email || EmptyString,
                name: {
                    given_name: orderResult?.billingAddress?.firstName || EmptyString,
                    surname: orderResult?.billingAddress?.lastName || EmptyString,
                },
            };*/
            return {
                purchase_units: purchaseUnits,
                intent: PayPalOrderIntent.CAPTURE,
                /*payer: orderResult?.billingAddress ? payer : null,
                "application_context": {
                    "brand_name": "string",
                    "landing_page": "LOGIN",
                    "shipping_preference": "GET_FROM_FILE",
                    "user_action": "CONTINUE",
                    "return_url": "http://example.com",
                    "cancel_url": "http://example.com",
                    "locale": "string",
                    "payment_method": {
                        "standard_entry_class_code": "TEL",
                        "payee_preferred": "UNRESTRICTED"
                    },
                }*/
            };
        }
    }

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
        const clientId = super.getPaymentMethodSetting(this?.state?.paymentMethod, "accountcode");

        return (
            <PayPalScriptProvider
                options={{ "client-id": clientId, "currency": BETTERCOMMERCE_DEFAULT_CURRENCY }}
            >
                <PayPalButtons
                    style={BUTTONS_DEFAULT_LAYOUT}
                    fundingSource={"paypal"}
                    createOrder={(data: CreateOrderData, actions: CreateOrderActions) => {
                        const orderData: any = that.getPayPalOrderData();
                        //console.log(orderData);
                        return actions.order.create(orderData);
                    }}
                    onApprove={(data: OnApproveData, actions: OnApproveActions) => {
                        const promise = new Promise<void>(async (resolve: any, reject: any) => {
                            const orderDetails: any = await actions?.order?.capture();
                            if (orderDetails?.id) {
                                const tokenId = orderDetails?.purchase_units[0]?.payments?.captures?.length
                                    ? orderDetails?.purchase_units[0]?.payments?.captures[0]?.id
                                    : "";
                                const redirectUrl = `${that?.state?.paymentMethod?.notificationUrl}?orderId=${orderDetails?.id}&payerId=${orderDetails?.payer?.payer_id}&token=${tokenId}`;
                                Router.push(redirectUrl);
                                //console.log(orderDetails);
                            }
                            resolve();
                        });
                        return promise;
                    }}
                />
            </PayPalScriptProvider>
        );
    }
}