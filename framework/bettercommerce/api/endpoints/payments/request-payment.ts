// Package Imports
import { v4 as uuid } from "uuid";

// Other Imports
import { logPaymentRequest } from "@framework/utils/app-util";
import { LOG_REQUEST_OPTIONS } from "@components/utils/payment-constants";
import { BCEnvironment, PaymentOperation } from "@better-commerce/bc-payments-sdk";
import { CLIENT_ID, SHARED_SECRET } from "@framework/utils/constants";

const logId = "Payments | RequestPayment";
export default async function useRequestPayment({ data, config, cookies, extras }: any) {
    let logData: any = {};
    let objectId = uuid();
    try {

        BCEnvironment.init(config);
        BCEnvironment.withCredentials(CLIENT_ID || "", SHARED_SECRET || "");

        logData["request"] = BCEnvironment;
        if (LOG_REQUEST_OPTIONS) {
            console.log(config);
            logData["requestOptions"] = config;
        }
        await logPaymentRequest({
            //headers: {},
            paymentGatewayId: config?.id || 0,
            data: logData,
            cookies,
            pageUrl: "",
            objectId,
        }, `${logId} Request`);

        const paymentResponseResult = await new PaymentOperation().requestPayment(data);

        logData = {};
        logData["response"] = paymentResponseResult;
        await logPaymentRequest({
            //headers: {},
            paymentGatewayId: config?.id || 0,
            data: logData,
            cookies,
            pageUrl: "",
            objectId,
        }, `${logId} Response`);

        return paymentResponseResult;
    } catch (error: any) {

        logData = {};
        logData["error"] = error;
        await logPaymentRequest({
            //headers: {},
            paymentGatewayId: config?.id || 0,
            data: logData,
            cookies,
            pageUrl: "",
            objectId,
        }, `${logId} Error`);

        //console.log(error);
        return { hasError: true, error: error?.response?.data, };
    }
};