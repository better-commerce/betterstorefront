// Package Imports
import axios from "axios";

// Other Imports
import { decipherPayload } from "./app-util";
import { PaymentGateway, PaymentGatewayId } from "@components/utils/payment-constants";
import { ENABLE_SECURED_PAYMENT_PAYLOAD, NEXT_CANCEL_ORDER, NEXT_CONFIRM_ORDER, NEXT_POST_PAYMENT_RESPONSE, PAYMENTS_API } from "@components/utils/constants";
import { Payments } from "@components/utils/payment-constants";
import { matchStrings, tryParseJson } from "./parse-util";
import { encrypt } from "./cipher";

export const getReferer = (origin: string) => {
    let referer;
    if (origin) {
        if (origin.startsWith("http://")) {
            referer = origin.replace("http://", "");
        } else if (origin.startsWith("https://")) {
            referer = origin.replace("https://", "");
        }

        referer = referer?.substring(0, referer?.indexOf("/"));
        referer = `${origin.startsWith("https://") ? "https" : "http"}://${referer}`;
        if (referer.endsWith("/")) {
            referer = referer.substring(0, referer.length - 1);
        }
    }
    return referer;
};

export const createStorefrontOrder = async (data: any) => {
    const { basketId } = data;
    const { data: orderResponse }: any = await axios.post(NEXT_CONFIRM_ORDER, {
        basketId,
        model: data,
    });
    return orderResponse;
};

export const cancelStorefrontOrder = async (orderId: string) => {
    const { data: orderResponse }: any = await axios.post(NEXT_CANCEL_ORDER, {
        id: orderId,
    });
    return orderResponse;
};

export const confirmPayment = async (data: any) => {
    return await axios.post(NEXT_POST_PAYMENT_RESPONSE, data);
};

export const getGatewayId = (gatewayName: string) => {
    if (matchStrings(gatewayName, PaymentGateway.PAYPAL, true)) {
        return PaymentGatewayId.PAYPAL;
    } else if (matchStrings(gatewayName, PaymentGateway.CHECKOUT, true)) {
        return PaymentGatewayId.CHECKOUT;
    } else if (matchStrings(gatewayName, PaymentGateway.KLARNA, true)) {
        return PaymentGatewayId.KLARNA;
    } else if (matchStrings(gatewayName, PaymentGateway.CLEAR_PAY, true)) {
        return PaymentGatewayId.CLEAR_PAY;
    } else if (matchStrings(gatewayName, PaymentGateway.MASTER_CARD, true)) {
        return PaymentGatewayId.MASTER_CARD;
    } else if (matchStrings(gatewayName, PaymentGateway.JUSPAY, true)) {
        return PaymentGatewayId.JUSPAY;
    } else if (matchStrings(gatewayName, PaymentGateway.STRIPE, true)) {
        return PaymentGatewayId.STRIPE;
    } else if (matchStrings(gatewayName, PaymentGateway.COD, true)) {
        return PaymentGatewayId.COD;
    }
    return -1;
};

export const getGatewayName = (id: number) => {
    if (id === PaymentGatewayId.PAYPAL) {
        return PaymentGateway.PAYPAL;
    } else if (id === PaymentGatewayId.CHECKOUT) {
        return PaymentGateway.CHECKOUT;
    } else if (id === PaymentGatewayId.KLARNA) {
        return PaymentGateway.KLARNA;
    } else if (id === PaymentGatewayId.CLEAR_PAY) {
        return PaymentGateway.CLEAR_PAY;
    } else if (id === PaymentGatewayId.MASTER_CARD) {
        return PaymentGateway.MASTER_CARD;
    } else if (id === PaymentGatewayId.JUSPAY) {
        return PaymentGateway.JUSPAY;
    } else if (id === PaymentGatewayId.STRIPE) {
        return PaymentGateway.STRIPE;
    } else if (id === PaymentGatewayId.COD) {
        return PaymentGateway.COD;
    }
    return -1;
};

export const initPayment = async (gatewayName: string, data: any) => {
    const gid = getGatewayId(gatewayName);
    const { data: orderDetailResult } = await axios.post(PAYMENTS_API, // Endpoint url
        ENABLE_SECURED_PAYMENT_PAYLOAD ? encrypt(JSON.stringify(data)) : JSON.stringify(data), // Data
        {
            params: { ...Payments.RequestParams.INIT_PAYMENT, gid, },
        }); // Params
    return ENABLE_SECURED_PAYMENT_PAYLOAD
        ? decipherPayload(orderDetailResult)
        : tryParseJson(orderDetailResult);
};

export const requestPayment = async (gatewayName: string, data: any) => {
    const gid = getGatewayId(gatewayName);
    const { data: orderDetailResult } = await axios.post(PAYMENTS_API, // Endpoint url
        ENABLE_SECURED_PAYMENT_PAYLOAD ? encrypt(JSON.stringify(data)) : JSON.stringify(data), // Data
        {
            params: { ...Payments.RequestParams.REQUEST_PAYMENT, gid, },
        }); // Params
    return ENABLE_SECURED_PAYMENT_PAYLOAD
        ? decipherPayload(orderDetailResult)
        : tryParseJson(orderDetailResult);
};

export const createOneTimePaymentOrder = async (gatewayName: string, data: any) => {
    const gid = getGatewayId(gatewayName);
    const { data: orderDetailResult } = await axios.post(PAYMENTS_API, // Endpoint url
        ENABLE_SECURED_PAYMENT_PAYLOAD ? encrypt(JSON.stringify(data)) : JSON.stringify(data), // Data
        {
            params: { ...Payments.RequestParams.CREATE_ONE_TIME_PAY_ORDER, gid, },
        }); // Params
    return ENABLE_SECURED_PAYMENT_PAYLOAD
        ? decipherPayload(orderDetailResult)
        : tryParseJson(orderDetailResult);
};

export const getPaymentOrderDetails = async (gatewayName: string, data: any) => {
    const gid = getGatewayId(gatewayName);
    const { data: orderDetailResult } = await axios.post(PAYMENTS_API, // Endpoint url
        ENABLE_SECURED_PAYMENT_PAYLOAD ? encrypt(JSON.stringify(data)) : JSON.stringify(data), // Data
        {
            params: { ...Payments.RequestParams.GET_ORDER_DETAILS, gid, },
        }); // Params
    return ENABLE_SECURED_PAYMENT_PAYLOAD
        ? decipherPayload(orderDetailResult)
        : tryParseJson(orderDetailResult);
};

export const processPaymentResponse = async (gatewayName: string, data: any) => {
    const gid = getGatewayId(gatewayName);
    const { data: paymentResponseResult } = await axios.post(PAYMENTS_API,  // Endpoint url
        ENABLE_SECURED_PAYMENT_PAYLOAD ? encrypt(JSON.stringify(data)) : JSON.stringify(data), // Data
        {
            params: { ...Payments.RequestParams.PROCESS_PAYMENT_RESPONSE, gid, },
        }); // Params
    return ENABLE_SECURED_PAYMENT_PAYLOAD
        ? decipherPayload(paymentResponseResult)
        : tryParseJson(paymentResponseResult);
};