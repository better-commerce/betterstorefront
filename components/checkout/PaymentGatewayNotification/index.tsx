// Base Imports
import React, { useEffect, useState } from "react";

// Package Imports
import Cookies from "js-cookie";
import Router from "next/router";

// Other Imports
import cartHandler from "@components/services/cart";
import { getOrderId, getOrderInfo } from "@framework/utils/app-util";
import setSessionIdCookie from '@components/utils/setSessionId';
import { processPaymentResponse } from "@framework/utils/payment-util";
import { PaymentOrderStatus } from "@components/utils/payment-constants";
import { IGatewayPageProps } from "pages/payment-notification/[...gateway]";
import { useUI, basketId as generateBasketId } from '@components/ui/context';

const IS_RESPONSE_REDIRECT_ENABLED = true;

const PaymentGatewayNotification = (props: IGatewayPageProps) => {

    const orderInfo = getOrderInfo();
    const { associateCart } = cartHandler();
    const { gateway, params, isCancelled, isCOD = false } = props;
    const { user, setCartItems, basketId, cartItems, setOrderId, orderId: uiOrderId, setBasketId, } = useUI();
    const [redirectUrl, setRedirectUrl] = useState<string>();

    /**
     * Update order status.
     */
    const asyncHandler = async (gateway: string, params: any, isCancelled: boolean) => {

        let paymentDetailsResult: any;
        let bankOfferDetails:
            | {
                voucherCode: string
                offerCode: string
                value: string
                status: string
                discountedTotal: number
            }
            | undefined;
        const extras = {
            ...params,
            gateway: gateway,
            isCancelled: isCancelled,
        };

        const paymentResponseRequest: any /*IPaymentProcessingData*/ = {
            isCOD: isCOD,
            orderId: orderInfo?.orderResponse?.id,
            txnOrderId: getOrderId(orderInfo?.order),
            bankOfferDetails: bankOfferDetails,
            extras,
        };

        const paymentResponseResult: any = await processPaymentResponse(gateway, paymentResponseRequest);
        if (paymentResponseResult === PaymentOrderStatus.PAID || paymentResponseResult === PaymentOrderStatus.AUTHORIZED) {

            Cookies.remove('sessionId');
            setSessionIdCookie();
            Cookies.remove('basketId');
            const generatedBasketId = generateBasketId();
            setBasketId(generatedBasketId)
            const userId = cartItems.userId
            const newCart = await associateCart(userId, generatedBasketId);
            setCartItems(newCart.data);
            setOrderId(paymentResponseRequest?.orderId);

            if (IS_RESPONSE_REDIRECT_ENABLED) {
                setRedirectUrl('/thank-you');
            }
        } else if (paymentResponseResult === PaymentOrderStatus.PENDING || paymentResponseResult === PaymentOrderStatus.DECLINED) {

            setOrderId(paymentResponseRequest?.orderId);
            if (IS_RESPONSE_REDIRECT_ENABLED) {
                setRedirectUrl(`/payment-failed`); // TODO: Show order failed screen.
            }
        }
    };

    useEffect(() => {
        setTimeout(() => {
            asyncHandler(gateway, params, isCancelled);
        }, 500);
    }, []);

    useEffect(() => {
        if (redirectUrl) {
            Router.replace(redirectUrl)
        }
    }, [redirectUrl]);

    return (
        <></>
    );
};

export default PaymentGatewayNotification;