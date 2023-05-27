// Package Imports
import { v4 as uuid } from "uuid";
import paypal, { ConfigureOptions, Payment } from "paypal-rest-sdk";

// Other Imports
import { logPaymentRequest } from "@framework/utils/app-util";
import { LOG_REQUEST_OPTIONS } from "@components/utils/payment-constants";
import { stringToBoolean } from "@framework/utils/parse-util";
import { getOrderDetails } from "@framework/checkout";
import { EmptyGuid } from "@components/utils/constants";
import { PayPalPaymentIntent } from "./constants";

const logId = "Paypal | CreatePayment";
export default async function useCreatePayment({ data, config, cookies, extras }: any) {
    let logData: any = {};
    let objectId = uuid();
    try {
        const orderId = Object.keys(data)?.length ? Object.keys(data)[0] : EmptyGuid;
        const orderResult: any = await fetchOrderDetails(orderId);
        if (orderResult) {

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

            /*const transactionItems = orderResult?.items?.map((x: any) => { const item: Item = { name: x?.name, sku: x?.stockCode, price: x?.price?.raw?.withTax.toFixed(2), currency: orderResult?.currencyCode, quantity: x?.qty, description: x?.name, } return item; });*/

            // Instead of adding actual item collection for transaction, use only one line item with consolidated price to avoid amount mismatch validation errors at PayPal.
            const transactionItems = [{
                name: `Items for Order: ${orderId}; Basket: ${orderResult?.basketId}`,

                // SKU field contains concatenated stock codes with item quantity in brackets i.e. "SKU1(2), SKU2(4), ..."
                sku: orderResult?.items?.map((x: any) => `${x?.stockCode}(${x?.qty})`)?.join(", "),
                price: orderResult?.grandTotal?.raw?.withTax?.toFixed(2),
                currency: orderResult?.currencyCode,

                // Quantity field contains sum of item quantities.
                quantity: orderResult?.items?.map((x: any) => x?.qty)?.reduce((sum: number, current: number) => sum + current, 0),
            }];

            const createPaymentData: Payment = {
                intent: PayPalPaymentIntent.SALE,
                payer: {
                    payment_method: "paypal"
                },
                redirect_urls: {
                    return_url: config?.returnUrl,
                    cancel_url: config?.cancelUrl,
                },
                transactions: [{
                    item_list: {
                        items: transactionItems,
                    },
                    amount: {
                        currency: orderResult?.currencyCode,
                        total: orderResult?.grandTotal?.raw?.withTax?.toFixed(2),
                    },
                    description: `Order ${orderId} for basket ${orderResult?.basketId}`
                }]
            };
            //console.log("createPaymentData", JSON.stringify(createPaymentData));

            const promise = new Promise((resolve: any, reject: any) => {
                paypal.payment.create(createPaymentData, (error: paypal.SDKError, payment: paypal.PaymentResponse) => {
                    //console.log("error", JSON.stringify(error));
                    //console.log("payment", JSON.stringify(payment));
                    if (!error) {

                        const selfLink = payment?.links?.filter((x: paypal.Link) => x?.rel === "self")?.map(({ rel, ...rest }: any) => ({
                            ...rest
                        }));
                        const approvalUrlLink = payment?.links?.filter((x: paypal.Link) => x?.rel === "approval_url")?.map(({ rel, ...rest }: any) => ({
                            ...rest
                        }));
                        const executeLink = payment?.links?.filter((x: paypal.Link) => x?.rel === "execute")?.map(({ rel, ...rest }: any) => ({
                            ...rest
                        }));

                        resolve({
                            success: true,
                            result: {
                                id: payment?.id,
                                intent: payment?.intent,
                                create_time: payment?.create_time,
                                httpStatusCode: payment?.httpStatusCode,
                                links: {
                                    self: selfLink?.length ? selfLink[0] : null,
                                    approval_url: approvalUrlLink?.length ? approvalUrlLink[0] : null,
                                    execute: executeLink?.length ? executeLink[0] : null,
                                },
                            }
                        });
                    } else {
                        resolve({
                            success: false,
                            result: error
                        });
                    }
                });
            });

            const createPaymentResult: any = await promise;
            if (createPaymentResult?.success) {
                logData = {};
                logData["response"] = createPaymentResult?.result;
                await logPaymentRequest({
                    //headers: {},
                    paymentGatewayId: config?.paymentGatewayId || 0,
                    data: logData,
                    cookies,
                    pageUrl: "",
                    objectId,
                }, `${logId} Response`);

                return createPaymentResult?.result;
            } else {
                logData = {};
                logData["error"] = createPaymentResult?.result;
                await logPaymentRequest({
                    //headers: {},
                    paymentGatewayId: config?.paymentGatewayId || 0,
                    data: logData,
                    cookies,
                    pageUrl: "",
                    objectId,
                }, `${logId} Error`);
                return { hasError: true, error: createPaymentResult?.result, };
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

const fetchOrderDetails = async (orderId: string) => {
    const { result: orderDetailsResult }: any = await getOrderDetails()(orderId);
    return orderDetailsResult;
};