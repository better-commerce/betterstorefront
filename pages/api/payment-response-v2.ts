import { PayPal, PaymentGateway, PaymentMethodType, PaymentOrderStatus } from '@components/utils/payment-constants';
import { putPaymentResponse } from '@framework/payment'
import { decrypt } from '@framework/utils/cipher';
import { getReferer } from '@framework/utils/payment-util';
import { matchStrings, tryParseJson } from '@framework/utils/parse-util';
import { payPalHandler } from '@framework/api/endpoints/payments/paypal';
import { getOrderDetails } from '@framework/checkout';
import { PayPalPaymentState } from '@framework/api/endpoints/payments/paypal/constants';
import { decipherResult } from '@framework/utils/app-util';
import { writeFetcherLog } from '@framework/utils';

export interface IRequest {
  isCOD: boolean;
  txnOrderId: string;
  orderId?: string;
  additionalServiceCharge: string | 0;
  gatewayStatus?: any;
  gatewaySignature?: any;
  gatewayStatusId?: any;
  method: {
    id: any,
    systemName: string,
  };
  bankOfferDetails?: any;
  pspResponseMessage?: string;
  extras: any;
};

export default async (req: any, res: any) => {

  const { body } = req;
  try {
    if (body) {
      const request = await formRequest(req, body);

      if (request) {
        //writeFetcherLog(request, {});
        const { orderId, model }: any = request;
        const response = await putPaymentResponse()({
          orderId,
          model,
        });
        res.status(200).json(response);
      } else {
        res.status(500);
      }
    } else {
      res.status(500);
    }
  } catch (error) {
    res.status(500).json({ error })
  }
}

const getPayPalOrderModel = async ({ req, paymentId, origin, orderRequest, orderDetailsResult, isCancelled, }: any) => {
  let orderModel;
  const paymentDetailsRequest = {
    params: PayPal.RequestParams.GET_PAYMENT_DETAILS,
    data: { [paymentId]: "" },
    cookies: req?.cookies,
    origin,
  };

  let paymentDetailsResult: any;
  let statusId = PaymentOrderStatus.DECLINED
  if (!isCancelled) {
    paymentDetailsResult = await payPalHandler()(paymentDetailsRequest);
    paymentDetailsResult = decipherResult(paymentDetailsResult);
    //writeFetcherLog(paymentDetailsResult, {});

    if (paymentDetailsResult) {
      switch (paymentDetailsResult?.state) {
        case PayPalPaymentState.CREATED:
        case PayPalPaymentState.FAILED:
          statusId = PaymentOrderStatus.PENDING
          break;

        case PayPalPaymentState.APPROVED:
          statusId = PaymentOrderStatus.PAID
          break;
      }
    }
  }

  const { txnOrderId, orderId, gatewayStatus, gatewaySignature, gatewayStatusId, bankOfferDetails, method, } = orderRequest;
  const { id: methodId, systemName: methodSystemName, } = method;

  if (orderDetailsResult?.id && matchStrings(orderDetailsResult?.id, orderId as string, true)) {
    const orderAmount = orderDetailsResult?.grandTotal?.raw?.withTax || 0;
    //const payments = orderDetailsResult?.payments;
    //const paymentNo = txnOrderId?.split("-")[1];
    //const payment = payments?.find((x: any) => x?.id == paymentNo);

    if (orderAmount > 0) {
      //let savePspInfo = true;

      orderModel = {
        id: txnOrderId?.split('-')[1],
        cardNo: null,
        orderNo: parseInt(txnOrderId?.split('-')[0]),
        orderAmount: orderAmount,
        paidAmount: !isCancelled
          ? paymentDetailsResult?.transactions[0]?.amount?.total
          : 0,
        balanceAmount: '0.00',
        isValid: true,
        status: statusId,
        authCode: !isCancelled
          ? paymentDetailsResult?.id
          : null,
        issuerUrl: null,
        paRequest: null,
        pspSessionCookie: gatewaySignature,
        pspResponseCode: gatewayStatusId,
        pspResponseMessage: gatewayStatus,
        paymentGatewayId: methodId,
        paymentGateway: methodSystemName,
        token: null,
        payerId: null,
        cvcResult: null,
        avsResult: null,
        secure3DResult: null,
        cardHolderName: null,
        issuerCountry: null,
        info1: '',
        fraudScore: null,
        paymentMethod: PaymentMethodType.PAYER_ACCOUNT,
        paymentInfo1: "", // (pspInformation)
        paymentInfo2: "", // (paymentIdentifier)
        paymentInfo3: "", // (gateway i.e. Billdesk, Razorpay, etc)
        paymentInfo4: null, // (cardType)
        paymentInfo5: null, // (cardIssuer)
        paymentInfo6: null, // (cardBrand)
        cardType: null,
        operatorId: null,
        refStoreId: null,
        tillNumber: null,
        externalRefNo: null,
        expiryYear: null,
        expiryMonth: null,
        isMoto: false,
        upFrontPayment: false,
        upFrontAmount: '0.00',
        isPrePaid: false,

        discountedTotal: bankOfferDetails?.discountedTotal ?? 0,
        externalPromoCode: bankOfferDetails?.voucherCode ?? null,
        externalVoucher: bankOfferDetails?.voucherCode
          ? {
            code: bankOfferDetails?.offerCode,
            additionalInfo1: bankOfferDetails?.value,
            additionalInfo2: bankOfferDetails?.status,
          }
          : null,
      };
    }
  }
  return orderModel;
};

const formRequest = async (req: any, body: string) => {
  if (Object.keys(body)?.length) {
    const json = decrypt(Object.keys(body)[0]);

    if (json) {
      const request = tryParseJson(json) as IRequest;

      if (request && request?.txnOrderId) {
        const { isCOD, txnOrderId, method = { id: 0, systemName: "" }, additionalServiceCharge, } = request;
        const { id: methodId, systemName: methodSystemName, } = method;

        const referer = getReferer(req?.headers?.referer);
        const orderDetailsResult: any = await fetchOrderDetails(request?.orderId as string);

        let orderModel: any;
        if (orderDetailsResult) {

          if (isCOD) {
            const orderAmount = orderDetailsResult?.grandTotal?.raw?.withTax || 0;
            orderModel = {
              id: txnOrderId?.split('-')[1],
              cardNo: null,
              orderNo: parseInt(txnOrderId?.split('-')[0]),
              orderAmount: orderAmount,
              paidAmount: 0.0,
              balanceAmount: orderAmount,
              isValid: true,
              status: PaymentOrderStatus.AUTHORIZED,
              authCode: null,
              issuerUrl: null,
              paRequest: null,
              pspSessionCookie: null,
              pspResponseCode: null,
              pspResponseMessage: null,
              paymentGatewayId: methodId,
              paymentGateway: methodSystemName,
              token: null,
              payerId: null,
              cvcResult: null,
              avsResult: null,
              secure3DResult: null,
              cardHolderName: null,
              issuerCountry: null,
              info1: '',
              fraudScore: null,
              paymentMethod: methodSystemName,
              cardType: null,
              operatorId: null,
              refStoreId: null,
              tillNumber: null,
              externalRefNo: null,
              expiryYear: null,
              expiryMonth: null,
              isMoto: true,
              upFrontPayment: false,
              upFrontAmount: '0.00',
              upFrontTerm: '76245369',
              isPrePaid: false,
              additionalServiceCharge: additionalServiceCharge,
            };
          } else {
            switch (request?.extras?.gateway) {

              case PaymentGateway.PAYPAL:
                orderModel = await getPayPalOrderModel({ req, paymentId: request?.extras?.paymentId, origin: referer, orderRequest: request, orderDetailsResult, isCancelled: request?.extras?.isCancelled, });
                break;

              case PaymentGateway.JUSPAY:
                break;
            }
          }
          const requestInput = {
            model: orderModel,
            orderId: request?.orderId,
          };
          return requestInput;
        }
      }
    }
  }
  return null;
};

const fetchOrderDetails = async (orderId: string) => {
  const { result: orderDetailsResult }: any = await getOrderDetails()(orderId);
  return orderDetailsResult;
};
