// Package Imports
import { v4 as uuid } from "uuid";

// Other Imports
import { logPaymentRequest } from "@framework/utils/app-util";
import { LOG_REQUEST_OPTIONS } from "@components/utils/payment-constants";
import { BCEnvironment, CommerceOperation } from "@better-commerce/bc-payments-sdk";
import { CLIENT_ID, SHARED_SECRET } from "@framework/utils/constants";

const logId = "Payments | UpdatePaymentResponse";
export default async function useUpdatePaymentResponse({ data, config, cookies, extras }: any) {
    let logData: any = {};
    let objectId = uuid();
    try {
        const params = { ...data, ...{ extras: { ...data.extras, ...{ cookies } } } };

        logData["request"] = data;
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

        BCEnvironment.init(CLIENT_ID || "", SHARED_SECRET || "", config);
        console.log("UpdatePaymentResponse params", params);
        const paymentResponseResult = await new CommerceOperation().processPayment(params);

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