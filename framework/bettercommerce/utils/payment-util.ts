// Package Imports
import axios from "axios";

// Other Imports
import { decipherResult } from "./app-util";
import { PayPal } from "@components/utils/payment-constants";
import { NEXT_CANCEL_ORDER, NEXT_CONFIRM_ORDER, NEXT_POST_PAYMENT_RESPONSE, PAYPAL_API } from "@components/utils/constants";

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

export const parsePayPalOrder = (desc: string): { orderId: string, basketId: string } | null => {
    if (desc) {
        const regEx = new RegExp(PayPal.PARSE_ORDER_ID_REGEX);
        const matches = regEx.exec(desc);
        if (matches?.length && matches?.length > 2) {
            return {
                orderId: matches[1] ? matches[1].trim() : "",
                basketId: matches[2] ? matches[2].trim() : "",
            };
        }
    }
    return null;
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

export const createPaypalPayment = async (data: any) => {
    const { data: createPaymentResult } = await axios.post(PAYPAL_API, data, {
        params: PayPal.RequestParams.CREATE_PAYMENT,
    });
    return decipherResult(createPaymentResult);
};

export const getPaypalPaymentDetails = async (data: any) => {
    const { data: paymentDetailsResult } = await axios.post(PAYPAL_API, data, {
        params: PayPal.RequestParams.GET_PAYMENT_DETAILS,
    });
    return decipherResult(paymentDetailsResult);
};

export const executePaypalPayment = async (data: any) => {
    const { data: executePaymentResult } = await axios.post(PAYPAL_API, data, {
        params: PayPal.RequestParams.EXECUTE_PAYMENT,
    });
    return decipherResult(executePaymentResult);
};