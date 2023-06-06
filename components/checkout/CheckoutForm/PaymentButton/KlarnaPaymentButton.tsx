// Package Imports
import Script from "next/script";
import Cookies from "js-cookie";

// Component Imports
import { PaymentGateway, Payments } from "@components/utils/payment-constants";
import BasePaymentButton, { IDispatchState } from "./BasePaymentButton";
import { IPaymentButtonProps } from "./BasePaymentButton";

// Other Imports
import { BETTERCOMMERCE_COUNTRY, BETTERCOMMERCE_DEFAULT_COUNTRY, BETTERCOMMERCE_DEFAULT_LANGUAGE, BETTERCOMMERCE_LANGUAGE, EmptyString, Messages } from "@components/utils/constants";
import { GENERAL_PAY, GENERAL_PAY_WITH_KLARNA } from "@components/utils/textVariables";
import { initPayment } from "@framework/utils/payment-util";
import { getOrderId, getOrderInfo } from "@framework/utils/app-util";

declare const Klarna: any;

export class KlarnaPaymentButton extends BasePaymentButton {

    /**
     * CTor
     * @param props 
     */
    constructor(props: IPaymentButtonProps & IDispatchState) {
        super(props);
        this.state = {
            confirmed: false,
            clientSession: null,
            paymentMethod: super.getPaymentMethod(props?.paymentMethod),
        };
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
            uiContext?.hideOverlayLoaderState();

            uiContext?.setOverlayLoaderState({ visible: true, message: "Initiating payment..." });
            const orderInput = this.getOrderInputPayload();
            const clientResult: any = await initPayment(this.state?.paymentMethod?.systemName, orderInput)
            if (clientResult?.session_id) {
                this.setState({
                    confirmed: true,
                    clientSession: clientResult,
                });
            } else {
                uiContext?.hideOverlayLoaderState();
                dispatchState({ type: 'SET_ERROR', payload: Messages.Errors["GENERIC_ERROR"] });
            }
        } else {
            uiContext?.hideOverlayLoaderState();
            if (state) {
                dispatchState(state);
            } else {
                dispatchState({ type: 'SET_ERROR', payload: Messages.Errors["GENERIC_ERROR"] });
            }
        }
    }

    private async onCapturePayment(paymentMethod: any, basketOrderInfo: any, uiContext: any, dispatchState: Function) {
        uiContext?.setOverlayLoaderState({ visible: true, message: "Please wait..." });
        const orderInput = this.getOrderInputPayload();
        const authorizeInput = {
            ...orderInput,
            billing_address: {
                given_name: basketOrderInfo?.billingAddress?.firstName,
                family_name: basketOrderInfo?.billingAddress?.lastName,
                email: basketOrderInfo?.user?.email || EmptyString,
                title: basketOrderInfo?.billingAddress?.title,
                street_address: basketOrderInfo?.billingAddress?.address1,
                street_address2: basketOrderInfo?.billingAddress?.address2,
                postal_code: basketOrderInfo?.billingAddress?.postCode,
                city: basketOrderInfo?.billingAddress?.city,
                region: basketOrderInfo?.billingAddress?.state,
                phone: basketOrderInfo?.billingAddress?.phoneNo,
                country: basketOrderInfo?.billingAddress?.country || Cookies.get("Country") || BETTERCOMMERCE_COUNTRY || BETTERCOMMERCE_DEFAULT_COUNTRY,
            },
            shipping_address: {
                given_name: basketOrderInfo?.shippingAddress?.firstName,
                family_name: basketOrderInfo?.shippingAddress?.lastName,
                email: basketOrderInfo?.user?.email || EmptyString,
                title: basketOrderInfo?.shippingAddress?.title,
                street_address: basketOrderInfo?.shippingAddress?.address1,
                street_address2: basketOrderInfo?.shippingAddress?.address2,
                postal_code: basketOrderInfo?.shippingAddress?.postCode,
                city: basketOrderInfo?.shippingAddress?.city,
                region: basketOrderInfo?.shippingAddress?.state,
                phone: basketOrderInfo?.shippingAddress?.phoneNo,
                country: basketOrderInfo?.shippingAddress?.country || Cookies.get("Country") || BETTERCOMMERCE_COUNTRY || BETTERCOMMERCE_DEFAULT_COUNTRY,
            },
            customer: {
                //date_of_birth: ,
            },
        };
        Klarna.Payments.authorize({
            payment_method_category: PaymentGateway.KLARNA,
        }, authorizeInput, (authorizeResult: any) => {

            if (authorizeResult?.approved && authorizeResult?.show_form) {
            } else {
                uiContext?.hideOverlayLoaderState();
                dispatchState({ type: 'SET_ERROR', payload: Messages.Errors["GENERIC_ERROR"] });
            }
        });
    }

    private onScriptReady(): void {
        let that = this;
        const { basketOrderInfo, uiContext, dispatchState }: any = this.props;
        const clientToken = this.state?.clientSession?.client_token;
        if (clientToken) {
            Klarna.Payments.init({
                client_token: clientToken,
            });

            setTimeout(() => {
                Klarna.Payments.load({
                    container: '#klarna-payments-container',
                    payment_method_category: PaymentGateway.KLARNA,
                }, (result: any) => {
                    uiContext?.hideOverlayLoaderState();
                    //console.debug(res);
                });
            }, 300);
        } else {
            uiContext?.hideOverlayLoaderState();
            dispatchState({ type: 'SET_ERROR', payload: Messages.Errors["GENERIC_ERROR"] });
        }
    }

    /**
     * Returns the payload for PayPal CreateOrder.
     * @returns 
     */
    private getOrderInputPayload() {
        const orderInfo = getOrderInfo();
        const orderResult: any = orderInfo?.orderResponse;
        if (orderResult) {
            const orderId = orderResult?.id;
            return {
                intent: "buy",
                purchase_country: Cookies.get("Country") || BETTERCOMMERCE_COUNTRY || BETTERCOMMERCE_DEFAULT_COUNTRY,
                purchase_currency: orderResult?.currencyCode,
                locale: Cookies.get("Language") || BETTERCOMMERCE_LANGUAGE || BETTERCOMMERCE_DEFAULT_LANGUAGE,
                order_amount: parseFloat(orderResult?.grandTotal?.raw?.withoutTax?.toFixed(2)),
                order_tax_amount: parseFloat(orderResult?.grandTotal?.raw?.tax?.toFixed(2)),
                order_lines: [{
                    type: "physical",
                    reference: `Order ${orderId} for basket ${orderResult?.basketId} OrderPaymentId ${getOrderId(orderInfo?.order)}`,
                    name: orderResult?.items?.map((x: any) => `${x?.stockCode}(${x?.qty})`)?.join(", "),

                    // Quantity field contains sum of item quantities.
                    quantity: orderResult?.items?.map((x: any) => x?.qty)?.reduce((sum: number, current: number) => sum + current, 0),
                    unit_price: parseFloat(orderResult?.grandTotal?.raw?.withoutTax?.toFixed(2)),
                    tax_rate: parseFloat((((orderResult?.grandTotal?.raw?.withTax - orderResult?.grandTotal?.raw?.withoutTax) / orderResult?.grandTotal?.raw?.withTax) * 100.0).toFixed(2)),
                    total_amount: parseFloat(orderResult?.grandTotal?.raw?.withTax?.toFixed(2)),
                    total_discount_amount: 0,
                    total_tax_amount: parseFloat(orderResult?.grandTotal?.raw?.tax?.toFixed(2)),
                    image_url: orderResult?.items?.length ? `${window.location.origin}/product/${orderResult?.items[0]?.slug}` : EmptyString,
                    product_url: orderResult?.items?.length ? `${window.location.origin}/product/${orderResult?.items[0]?.slug}` : EmptyString,
                }],
            };
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
        const { basketOrderInfo } = this.props;
        console.log(basketOrderInfo);
        let that = this;
        return (
            <>
                {
                    !this.state.confirmed ? (
                        <div>
                            <p className="text-muted pb-10">Click Pay Later With Klarna to check if you are eligible</p>
                            {this.baseRender({
                                ...this?.props, ...{
                                    onPay: async (paymentMethod: any, basketOrderInfo: any, uiContext: any, dispatchState: Function) => await that.onPay(paymentMethod, basketOrderInfo, uiContext, dispatchState),
                                    btnTitle: GENERAL_PAY_WITH_KLARNA,
                                }
                            })}
                        </div>
                    ) : (

                        <>
                            <div>
                                <div id="klarna-payments-container"></div>
                                {this.baseRender({
                                    ...this?.props, ...{
                                        onPay: async (paymentMethod: any, basketOrderInfo: any, uiContext: any, dispatchState: Function) => await that.onCapturePayment(paymentMethod, basketOrderInfo, uiContext, dispatchState),
                                        btnTitle: GENERAL_PAY,
                                    }
                                })}
                            </div>

                            <Script src={Payments.KLARNA_FRAMES_SCRIPT_SRC_V1}
                                strategy="lazyOnload"
                                onReady={() => that.onScriptReady()}
                            />
                        </>
                    )
                }

            </>
        );
    }
}