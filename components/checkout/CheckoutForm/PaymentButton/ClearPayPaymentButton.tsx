// Package Imports
import Cookies from "js-cookie";
import { ClearPayPaymentIntent } from "@better-commerce/bc-payments-sdk";

// Component Imports
import Script from "next/script";
import { IPaymentButtonProps } from "./BasePaymentButton";
import BasePaymentButton, { IDispatchState } from "./BasePaymentButton";

// Other Imports
import { stringToBoolean } from "@framework/utils/parse-util";
import { Payments } from "@components/utils/payment-constants";
import { initPayment, requestPayment } from "@framework/utils/payment-util";
import { getOrderId, getOrderInfo } from "@framework/utils/app-util";
import { BETTERCOMMERCE_COUNTRY, BETTERCOMMERCE_DEFAULT_COUNTRY, BETTERCOMMERCE_DEFAULT_LANGUAGE, BETTERCOMMERCE_LANGUAGE, EmptyString, Messages } from "@components/utils/constants";
import Router from "next/router";


declare const AfterPay: any;

export class ClearPayPaymentButton extends BasePaymentButton {

    /**
     * CTor
     * @param props 
     */
    constructor(props: IPaymentButtonProps & IDispatchState) {
        super(props);
        this.state = {
            confirmed: false,
            token: null,
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
    private async onPay(paymentMethod: any, basketOrderInfo: any, uiContext: any, dispatchState: Function) {
        uiContext?.setOverlayLoaderState({ visible: true, message: "Initiating order..." });

        const { state, result: orderResult } = await super.confirmOrder(paymentMethod, basketOrderInfo, dispatchState);
        if (orderResult?.success && orderResult?.result?.id) {
            //uiContext?.hideOverlayLoaderState();

            this.setState({
                confirmed: true,
            })
        } else {
            uiContext?.hideOverlayLoaderState();
            if (state) {
                dispatchState(state);
            } else {
                dispatchState({ type: 'SET_ERROR', payload: Messages.Errors["GENERIC_ERROR"] });
            }
        }
    }

    private onScriptReady(): void {
        const that = this;
        const { uiContext, dispatchState } = this.props;
        const redirectionUrl = `${window.location.origin}/${this.state?.paymentMethod?.notificationUrl}`;
        if (AfterPay) {
            uiContext?.setOverlayLoaderState({ visible: true, message: "initiating payment..." });
            const data = this.getOrderInputPayload();
            initPayment(this.state?.paymentMethod?.systemName, data)
                .then((clientResult: any) => {
                    AfterPay.initialize({ countryCode: Cookies.get("Country") || BETTERCOMMERCE_COUNTRY || BETTERCOMMERCE_DEFAULT_COUNTRY });

                    if (clientResult?.token) {
                        that.setState({
                            token: clientResult?.token,
                        });

                        // To avoid triggering browser anti-popup rules, the AfterPay.open()
                        // function must be directly called inside the click event listener
                        AfterPay.open();

                        // If you don't already have a checkout token at this point, you can
                        // AJAX to your backend to retrieve one here. The spinning animation
                        // will continue until `AfterPay.transfer` is called.
                        // If you fail to get a token you can call AfterPay.close()
                        AfterPay.onComplete = (event: any) => {

                            if (event?.data?.status == "SUCCESS") {

                                uiContext?.setOverlayLoaderState({ visible: true, message: "capturing payment..." });

                                // The consumer confirmed the payment schedule.
                                // The token is now ready to be captured from your server backend.
                                requestPayment(that.state?.paymentMethod?.systemName, { token: event?.data?.orderToken })
                                    .then((captureResult: any) => {

                                        uiContext?.hideOverlayLoaderState();
                                        if (captureResult?.id) {
                                            Router.push(`${redirectionUrl}?orderId=${captureResult?.id}&token=${captureResult?.token}&status=${captureResult?.status}`);
                                        }

                                    }).catch((error: any) => {
                                        uiContext?.hideOverlayLoaderState();
                                        dispatchState({ type: 'SET_ERROR', payload: Messages.Errors["GENERIC_ERROR"] });
                                    });
                            } else {
                                // The consumer cancelled the payment or close the popup window.
                                AfterPay.close();
                            }
                        };
                        AfterPay.transfer({ token: clientResult?.token });
                    } else {
                        AfterPay.close();
                        dispatchState({ type: 'SET_ERROR', payload: Messages.Errors["GENERIC_ERROR"] });
                    }
                    uiContext?.hideOverlayLoaderState();
                });
        }
    }

    /**
     * Returns the payload for PayPal CreateOrder.
     * @returns 
     */
    private getOrderInputPayload() {
        const { basketOrderInfo, uiContext } = this.props;
        const orderInfo = getOrderInfo();
        const orderResult: any = orderInfo?.orderResponse;
        if (orderResult) {
            const { billingAddress, shippingAddress } = basketOrderInfo;
            const orderId = orderResult?.id;
            const data: any = {
                purchaseCountry: Cookies.get("Country") || BETTERCOMMERCE_COUNTRY || BETTERCOMMERCE_DEFAULT_COUNTRY || EmptyString,
                description: `Order ${orderId} for basket ${orderResult?.basketId} OrderPaymentId ${getOrderId(orderInfo?.order)}`,
                amount: {
                    amount: parseFloat(orderResult?.grandTotal?.raw?.withTax?.toFixed(2)),
                    currency: orderResult?.currencyCode,
                },
                taxAmount: {
                    amount: parseFloat(orderResult?.grandTotal?.raw?.tax?.toFixed(2)),
                    currency: orderResult?.currencyCode,
                },
                shippingAmount: {
                    amount: 0,
                    currency: orderResult?.currencyCode,
                },
                items: [{
                    name: orderResult?.items?.map((x: any) => `${x?.stockCode}(${x?.qty})`)?.join(", "),
                    sku: orderResult?.items?.map((x: any) => `${x?.stockCode}`)?.join(", "),

                    // Quantity field contains sum of item quantities.
                    quantity: orderResult?.items?.map((x: any) => x?.qty)?.reduce((sum: number, current: number) => sum + current, 0),
                    price: {
                        amount: parseFloat(orderResult?.grandTotal?.raw?.withTax?.toFixed(2)),
                        currency: orderResult?.currencyCode,
                    },
                    imageUrl: orderResult?.items?.length ? `${window.location.origin}/product/${orderResult?.items[0]?.slug}` : EmptyString,
                    pageUrl: orderResult?.items?.length ? `${window.location.origin}/product/${orderResult?.items[0]?.slug}` : EmptyString,
                }],
                consumer: {
                    givenNames: billingAddress?.firstName ?? EmptyString,
                    surname: billingAddress?.lastName ?? EmptyString,
                    email: uiContext?.user?.email,
                    phoneNumber: billingAddress?.phoneNo,
                },
                billing: {
                    area1: billingAddress?.city,
                    area2: EmptyString,
                    countryCode: billingAddress?.countryCode || Cookies.get("Country") || BETTERCOMMERCE_COUNTRY || BETTERCOMMERCE_DEFAULT_COUNTRY,
                    line1: billingAddress?.address1,
                    line2: billingAddress?.address2,
                    name: `${billingAddress?.firstName ?? EmptyString} ${billingAddress?.lastName ?? EmptyString}`.trim(),
                    phoneNumber: billingAddress?.phoneNo,
                    postcode: billingAddress?.postCode,
                    //region: billingAddress?.state,
                },
                shipping: {
                    area1: shippingAddress?.city,
                    area2: EmptyString,
                    countryCode: shippingAddress?.countryCode || Cookies.get("Country") || BETTERCOMMERCE_COUNTRY || BETTERCOMMERCE_DEFAULT_COUNTRY,
                    line1: shippingAddress?.address1,
                    line2: shippingAddress?.address2,
                    name: `${shippingAddress?.firstName ?? EmptyString} ${shippingAddress?.lastName ?? EmptyString}`.trim(),
                    phoneNumber: shippingAddress?.phoneNo,
                    postcode: shippingAddress?.postCode,
                    //region: shippingAddress?.state,
                },
                merchant: {
                    redirectConfirmUrl: `${window.location.origin}/${this.state?.paymentMethod?.notificationUrl}`,
                    redirectCancelUrl: `${window.location.origin}/${this.state?.paymentMethod?.settings?.find((x: any) => x?.key === "CancelUrl")?.value || EmptyString}`,
                    popupOriginUrl: window.location.href,
                },
            };
            return data;
        }
    }

    /**
     * Called immediately after a component is mounted.
     */
    public componentDidMount(): void {
        const { dispatchState }: any = this.props;
        dispatchState({ type: 'SET_ERROR', payload: EmptyString });
    }

    /**
     * Renders the component.
     * @returns {React.JSX.Element}
     */
    public render() {
        let that = this;
        console.log(this.state.paymentMethod)
        const useSandbox = this.state?.paymentMethod?.settings?.find((x: any) => x.key === "UseSandbox")?.value || EmptyString;
        const testUrl = this.state?.paymentMethod?.settings?.find((x: any) => x.key === "TestUrl")?.value || EmptyString;
        const productionUrl = this.state?.paymentMethod?.settings?.find((x: any) => x.key === "ProductionUrl")?.value || EmptyString;
        const isSandbox = useSandbox ? stringToBoolean(useSandbox) : false;
        const scriptSrcUrl = isSandbox ? `${testUrl}/${Payments.CLEARPAY_SCRIPT_SRC}` : `${productionUrl}/${Payments.CLEARPAY_SCRIPT_SRC}`;

        return (
            <>
                {
                    <>
                        {
                            this.state.confirmed && (
                                <Script
                                    src={scriptSrcUrl}
                                    strategy="lazyOnload"
                                    onReady={() => that.onScriptReady()}
                                />
                            )
                        }
                    </>
                }
                {
                    this.baseRender({
                        ...this?.props, ...{
                            onPay: (paymentMethod: any, basketOrderInfo: any, uiContext: any, dispatchState: Function) => that.onPay(paymentMethod, basketOrderInfo, uiContext, dispatchState),
                        }
                    })
                }
            </>
        );
    }
}