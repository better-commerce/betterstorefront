// Package Imports
import { v4 as uuid } from "uuid";
import paypal, { ConfigureOptions, } from "paypal-rest-sdk";

// Other Imports
import { logPaymentRequest } from "@framework/utils/app-util";
import { LOG_REQUEST_OPTIONS } from "@components/utils/payment-constants";
import { stringToBoolean } from "@framework/utils/parse-util";

const logId = "Paypal | GetPaymentDetails";
export default async function useGetPaymentDetails({ data, config, cookies, extras }: any) {
    let logData: any = {};
    let objectId = uuid();
    try {
        const paymentId = Object.keys(data)?.length ? Object.keys(data)[0] : "";
        if (paymentId) {

            const opts: ConfigureOptions = {
                mode: stringToBoolean(config?.useSandbox) ? "sandbox" : "live", // sandbox or live
                client_id: config?.accountCode,
                client_secret: config?.signature,
            }
            paypal.configure(opts);

            logData["request"] = data;
            if (LOG_REQUEST_OPTIONS) {
                console.log(opts);
                logData["requestOptions"] = opts;
            }
            await logPaymentRequest({
                //headers: {},
                paymentGatewayId: config?.paymentGatewayId || 0,
                data: logData,
                cookies,
                pageUrl: "",
                objectId,
            }, `${logId} Request`);

            const promise = new Promise((resolve: any, reject: any) => {
                paypal.payment.get(paymentId, (error: paypal.SDKError, paymentDetails: paypal.PaymentResponse) => {
                    //console.log("error", JSON.stringify(error));
                    //console.log("paymentDetails", JSON.stringify(paymentDetails));
                    if (!error) {

                        resolve({
                            success: true,
                            result: paymentDetails
                        });
                    } else {
                        resolve({
                            success: false,
                            result: error
                        });
                    }
                });
            });

            const paymentDetailsResult: any = await promise;
            if (paymentDetailsResult?.success) {
                logData = {};
                logData["response"] = paymentDetailsResult?.result;
                await logPaymentRequest({
                    //headers: {},
                    paymentGatewayId: config?.paymentGatewayId || 0,
                    data: logData,
                    cookies,
                    pageUrl: "",
                    objectId,
                }, `${logId} Response`);

                return paymentDetailsResult?.result;
            } else {
                logData = {};
                logData["error"] = paymentDetailsResult?.result;
                await logPaymentRequest({
                    //headers: {},
                    paymentGatewayId: config?.paymentGatewayId || 0,
                    data: logData,
                    cookies,
                    pageUrl: "",
                    objectId,
                }, `${logId} Error`);
                return { hasError: true, error: paymentDetailsResult?.result, };
            }
        } else {
            return { hasError: true, };
        }
    } catch (error: any) {

        logData = {};
        logData["error"] = error;
        await logPaymentRequest({
            //headers: {},
            paymentGatewayId: config?.paymentGatewayId || 0,
            data: logData,
            cookies,
            pageUrl: "",
            objectId,
        }, `${logId} Error`);

        //console.log(error);
        return { hasError: true, error: error?.response?.data, };
    }
};
