// Package Imports
import store from "store";

// API Service Imports
import useCreatePayment from "./create-payment";
import useGetPaymentDetails from "./get-payment-details";
import useExecutePayment from "./execute-payment";

// Other Imports
import { PayPalEndpoint } from "./constants";
import { decrypt, encrypt } from "@framework/utils/cipher";
import { getPaymentMethods } from "@framework/payment";
import { matchStrings } from "@framework/utils/parse-util";
import { parsePaymentMethodConfig } from "@framework/utils/app-util";
import { BETTERCOMMERCE_COUNTRY, BETTERCOMMERCE_CURRENCY, BETTERCOMMERCE_DEFAULT_COUNTRY, BETTERCOMMERCE_DEFAULT_CURRENCY, PAYPAL_PAY_METHOD_SYSTEM_NAME } from "@components/utils/constants";

export default async function usePaypal({ data = {}, params = {}, cookies, origin }: any) {
    const { t: type, s: isSecured } = params;
    let response = undefined;

    try {
        const payPalConfig = await getPaypalConfig({
            cookies: cookies,
            origin: origin,
            isSecured,
        });

        if (payPalConfig) {
            switch (type) {

                // ------------------ Payments ------------------
                case PayPalEndpoint.CREATE_PAYMENT:
                    response = await useCreatePayment({ data, config: payPalConfig, cookies, });
                    break;

                case PayPalEndpoint.GET_PAYMENT_DETAILS:
                    response = await useGetPaymentDetails({ data, config: payPalConfig, cookies, });
                    break;

                case PayPalEndpoint.EXECUTE_PAYMENT:
                    response = await useExecutePayment({ data, config: payPalConfig, cookies, });
                    break;
            }

            if (response) {
                return encrypt(JSON.stringify(response));
            }
        }
    } catch (error: any) {
        console.log(error);
        return { hasError: true, error: error?.message }
    }
    return null;
};

export function payPalHandler() {
    return async function handler({ data = {}, params = {}, cookies, origin }: any) {
        return await usePaypal({
            data,
            params,
            cookies,
            origin,
        });
    }
};

const getPaypalConfig = async ({ cookies, countryCode, currencyCode, origin, isSecured }: any) => {
    const response: Array<any> = await getPaymentMethods()({
        countryCode: countryCode ? countryCode : cookies?.Country || store?.get('Country') || BETTERCOMMERCE_COUNTRY || BETTERCOMMERCE_DEFAULT_COUNTRY,
        currencyCode: currencyCode ? currencyCode : cookies?.Currency || store?.get('Currency') || BETTERCOMMERCE_CURRENCY || BETTERCOMMERCE_DEFAULT_CURRENCY,
        basketId: cookies?.basketId,
    });
    const jusPayConfig = response?.length ? response?.find(x => matchStrings(x.systemName, PAYPAL_PAY_METHOD_SYSTEM_NAME || "", true)) : undefined;
    if (jusPayConfig?.settings?.length) {
        const config = parsePaymentMethodConfig(jusPayConfig?.settings, isSecured);
        const result = {
            ...config,
            ...{ returnUrl: `${origin}${isSecured ? decrypt(jusPayConfig?.notificationUrl) : jusPayConfig?.notificationUrl}` },
            ...{ cancelUrl: `${origin}/${config?.cancelUrl}` },
            ...{ paymentGatewayId: jusPayConfig?.id },
        };
        return result;
    }
    return jusPayConfig;
};