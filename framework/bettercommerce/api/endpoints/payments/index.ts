// Package Imports
import store from "store";

// Other Imports
import { BCPaymentEndpoint } from "./constants";
import { decrypt, encrypt } from "@framework/utils/cipher";
import { getPaymentMethods } from "@framework/payment";
import { parsePaymentMethodConfig } from "@framework/utils/app-util";
import { BETTERCOMMERCE_COUNTRY, BETTERCOMMERCE_CURRENCY, BETTERCOMMERCE_DEFAULT_COUNTRY, BETTERCOMMERCE_DEFAULT_CURRENCY } from "@components/utils/constants";
import { getGatewayName } from "@framework/utils/payment-util";
import useUpdatePaymentResponse from "./update-payment-response";

export default async function useBCPayments({ data = {}, params = {}, headers, cookies, origin }: any) {
    const { t: type, s: isSecured, gid: gatewayId } = params;
    let response = undefined;
    try {
        const paymentConfig = await getPaymentConfig({
            paymentGateway: getGatewayName(gatewayId ? parseInt(gatewayId) : -1),
            cookies,
            origin,
            isSecured,
        });

        if (paymentConfig) {
            switch (type) {

                // ------------------ Payments ------------------
                case BCPaymentEndpoint.GET_ORDER_DETAILS:
                    break;

                case BCPaymentEndpoint.PAYMENT_RESPONSE:

                    response = await useUpdatePaymentResponse({ data, config: paymentConfig, cookies, });
                    break;
            }

            if (response) {
                return isSecured ? encrypt(JSON.stringify(response)) : JSON.stringify(response);
            }
        }
    } catch (error: any) {
        console.log(error);
        return { hasError: true, error: error?.message }
    }
    return null;
};

export function bcPaymentsHandler() {
    return async function handler({ data = {}, params = {}, cookies, origin }: any) {
        return await useBCPayments({
            data,
            params,
            cookies,
            origin,
        });
    }
};

const getPaymentConfig = async ({ paymentGateway, cookies, origin, isSecured }: any) => {
    const response: Array<any> = await getPaymentMethods()({
        countryCode: cookies?.Country || store?.get('Country') || BETTERCOMMERCE_COUNTRY || BETTERCOMMERCE_DEFAULT_COUNTRY,
        currencyCode: cookies?.Currency || store?.get('Currency') || BETTERCOMMERCE_CURRENCY || BETTERCOMMERCE_DEFAULT_CURRENCY,
        basketId: cookies?.basketId,
        secureFieldValuessExplicitlyDisabled: true,
    });
    const paymentConfig = response?.length ? response?.find(x => x?.systemName?.toLowerCase() === paymentGateway?.toLowerCase()) : undefined;
    /*const paymentConfig = response?.length ? response?.find(x => matchStrings(x.systemName, PAYPAL_PAY_METHOD_SYSTEM_NAME || "", true)) : undefined;
    if (paymentConfig?.settings?.length) {
        const config = parsePaymentMethodConfig(paymentConfig?.settings, isSecured);
        const result = {
            ...config,
            ...{ returnUrl: `${origin}${isSecured ? decrypt(paymentConfig?.notificationUrl) : paymentConfig?.notificationUrl}` },
            ...{ cancelUrl: `${origin}/${config?.cancelUrl}` },
            ...{ paymentGatewayId: paymentConfig?.id },
        };
        return result;
    }*/
    return paymentConfig;
};