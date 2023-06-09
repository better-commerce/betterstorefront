// Package Imports
import Script from 'next/script';
import Router from 'next/router';
import { CheckoutPaymentSourceType, CheckoutPaymentType, CheckoutPaymentRequest } from "@better-commerce/bc-payments-sdk";
import { Frames, CardNumber, ExpiryDate, Cvv } from 'frames-react';

// Component Imports
import BasePaymentButton, { IDispatchState } from "./BasePaymentButton";
import { IPaymentButtonProps } from "./BasePaymentButton";

// Other Imports
import { requestPayment } from '@framework/utils/payment-util';
import { PaymentStatus, Payments } from '@components/utils/payment-constants';
import { getOrderId, getOrderInfo } from "@framework/utils/app-util";
import { BETTERCOMMERCE_DEFAULT_COUNTRY, BETTERCOMMERCE_DEFAULT_PHONE_COUNTRY_CODE, EmptyString, Messages } from '@components/utils/constants';
import { GENERAL_PAY } from '@components/utils/textVariables';

export class CheckoutPaymentButton extends BasePaymentButton {

    /**
     * CTor
     * @param props 
     */
    constructor(props: IPaymentButtonProps & IDispatchState) {
        super(props);
        this.state = {
            confirmed: false,
            paymentMethod: super.getPaymentMethod(props?.paymentMethod),
            disabledFormSubmit: false,
            scriptLoaded: false,
            formLoaded: false,
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
        this.setState({
            scriptLoaded: true,
        });
    }

    private onFrameReady(): void {
        const { paymentMethod, basketOrderInfo, uiContext, dispatchState }: any = this.props;
        this.onPay(paymentMethod, basketOrderInfo, uiContext, dispatchState);

        this.setState({
            formLoaded: true,
        });
    }

    private onCardSubmitted(): void {
        const { uiContext }: any = this.props;
        uiContext?.setOverlayLoaderState({ visible: true, message: "Please wait..." });
    }

    private onCardTokenized(ev: any): void {
    }

    private onCardValidationChanged(): void {
        this.setState({
            disabledFormSubmit: !Frames.isCardValid(),
        });
    }

    private onCardBinChanged(ev: any): void {
        //console.log(ev);
    }

    private onCardTokenizationFailed(ev: any): void {
        // catch the error
    }

    private onCapturePayment(paymentMethod: any, basketOrderInfo: any, uiContext: any, dispatchState: Function) {
        let that = this;
        const orderInfo = getOrderInfo();
        const orderResult: any = orderInfo?.orderResponse;
        if (orderResult) {
            const orderId = orderResult?.id;

            Frames.submitCard()
                .then((ev: any) => {
                    const { token } = ev;
                    if (token) {
                        const data: CheckoutPaymentRequest = {
                            source: {
                                type: CheckoutPaymentSourceType.TOKEN,
                                token: token,
                            },
                            amount: parseFloat(orderResult?.grandTotal?.raw?.withTax?.toFixed(2)),
                            currency: orderResult?.currencyCode,
                            payment_type: CheckoutPaymentType.Regular,
                            reference: getOrderId(orderInfo?.order),
                            description: `Items for Order: ${orderId}; Basket: ${orderResult?.basketId}`,
                            capture: true,
                            capture_on: new Date().toISOString(),
                            customer: {
                                email: basketOrderInfo?.user?.email || EmptyString,
                                name: (basketOrderInfo?.user?.firstName || basketOrderInfo?.user?.lastName)
                                    ? `${basketOrderInfo?.user?.firstName ?? ""} ${basketOrderInfo?.user?.lastName ?? ""}`.trim()
                                    : basketOrderInfo?.user?.email || EmptyString,
                            },
                            shipping: {
                                address: {
                                    address_line1: basketOrderInfo?.shippingAddress?.address1 || EmptyString,
                                    address_line2: basketOrderInfo?.shippingAddress?.address2 || EmptyString,
                                    city: basketOrderInfo?.shippingAddress?.city || EmptyString,
                                    state: EmptyString,
                                    zip: basketOrderInfo?.shippingAddress?.postCode || EmptyString,
                                    country: basketOrderInfo?.shippingAddress?.countryCode || BETTERCOMMERCE_DEFAULT_COUNTRY,
                                },
                                phone: {
                                    country_code: basketOrderInfo?.shippingAddress?.mobileCountryCode || BETTERCOMMERCE_DEFAULT_PHONE_COUNTRY_CODE,
                                    number: basketOrderInfo?.shippingAddress?.phoneNo || EmptyString,
                                },
                            },
                            processing_channel_id: paymentMethod?.settings?.find((x: any) => x.key === "MotoUserName")?.value || EmptyString,
                            metadata: {
                                udf1: orderId,
                                udf2: orderResult?.basketId,
                                udf3: basketOrderInfo?.customerId,
                                udf4: getOrderId(orderInfo?.order),
                                udf5: "",
                            },
                        };

                        requestPayment(that.state?.paymentMethod?.systemName, data)
                            .then((paymentResult: any) => {
                                if (paymentResult?.id) {
                                    const redirectUrl = `${that?.state?.paymentMethod?.notificationUrl}?orderId=${paymentResult?.id}&payerId=${paymentResult?.customer?.id}&token= `;
                                    Router.push(redirectUrl);
                                    uiContext?.hideOverlayLoaderState();
                                } else {
                                    uiContext?.hideOverlayLoaderState();
                                    dispatchState({ type: 'SET_ERROR', payload: Messages.Errors["GENERIC_ERROR"] });
                                }
                            }).catch((error: any) => {
                                console.log(error);
                            });
                    } else {
                        uiContext?.hideOverlayLoaderState();
                        dispatchState({ type: 'SET_ERROR', payload: Messages.Errors["GENERIC_ERROR"] });
                    }
                }).catch((error: any) => {
                    uiContext?.hideOverlayLoaderState();
                    dispatchState({ type: 'SET_ERROR', payload: Messages.Errors["GENERIC_ERROR"] });
                });
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
        const that = this;
        const publicKey = super.getPaymentMethodSetting(this?.state?.paymentMethod, "accountcode");
        const config = {
            debug: (process.env.NODE_ENV === "development"),
            publicKey: publicKey,
        };

        return (
            <>

                {
                    !this.state.confirmed && (
                        this.baseRender({
                            ...this?.props, ...{
                                onPay: async (paymentMethod: any, basketOrderInfo: any, uiContext: any, dispatchState: Function) => {
                                    uiContext?.setOverlayLoaderState({ visible: true, message: "Please wait..." });
                                    that.setState({ confirmed: true, })
                                },
                            }
                        })
                    )
                }

                {
                    this.state.confirmed && !this.state.formLoaded && (
                        <Script src={Payments.CHECKOUT_FRAMES_SCRIPT_SRC_V2}
                            strategy="lazyOnload"
                            onReady={() => that.onScriptReady()}
                        />
                    )
                }

                {
                    that.state?.scriptLoaded && (
                        <div className="checkout-frame-container">
                            <Frames
                                config={config}
                                ready={() => that.onFrameReady()}
                                cardValidationChanged={(ev: any) => that.onCardValidationChanged()}
                                cardSubmitted={() => that.onCardSubmitted()}
                                cardTokenized={(ev: any) => that.onCardTokenized(ev)}
                                cardTokenizationFailed={(ev: any) => that.onCardTokenizationFailed(ev)}
                                cardBinChanged={(ev: any) => that.onCardBinChanged(ev)}
                            >
                                <div>
                                    <CardNumber />
                                </div>
                                <div className="date-and-code">
                                    <ExpiryDate />
                                    <Cvv />
                                </div>

                                {
                                    that.state.formLoaded ? that.baseRender({
                                        ...that?.props, ...{
                                            disabled: that.state.disabledFormSubmit,
                                            onPay: (paymentMethod: any, basketOrderInfo: any, uiContext: any, dispatchState: Function) => that.onCapturePayment(that.state.paymentMethod, basketOrderInfo, uiContext, dispatchState),
                                            btnTitle: GENERAL_PAY
                                        }
                                    }) : null
                                }
                            </Frames>
                        </div>
                    )
                }
            </>
        )
    }
}