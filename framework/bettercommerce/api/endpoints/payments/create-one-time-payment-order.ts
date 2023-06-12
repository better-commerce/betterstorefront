// Package Imports
import { v4 as uuid } from "uuid";

// Other Imports
import { logPaymentRequest } from "@framework/utils/app-util";
import { LOG_REQUEST_OPTIONS } from "@components/utils/payment-constants";
import { BCEnvironment, PaymentOperation } from "@better-commerce/bc-payments-sdk";
import { CLIENT_ID, SHARED_SECRET } from "@framework/utils/constants";

const logId = "Payments | OneTimePaymentOrder";
export default async function useOneTimePaymentOrder({ data, config, cookies, extras }: any) {
    let logData: any = {};
    let objectId = uuid();
    try {

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
        const oneTimePaymentResult = await new PaymentOperation().createOneTimePaymentOrder(data);

        logData = {};
        logData["response"] = oneTimePaymentResult;
        await logPaymentRequest({
            //headers: {},
            paymentGatewayId: config?.id || 0,
            data: logData,
            cookies,
            pageUrl: "",
            objectId,
        }, `${logId} Response`);

        return oneTimePaymentResult;
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

        console.log(error);
        return { hasError: true, error: error?.response?.data, };
    }
};