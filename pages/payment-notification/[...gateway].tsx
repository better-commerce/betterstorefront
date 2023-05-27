// Base Imports
import React, { useEffect, useState } from "react";

// Package Imports
import axios from "axios";
import Cookies from "js-cookie";
import Router from "next/router";
import { GetServerSideProps } from "next";

// Component Imports
import Spinner from "@components/ui/Spinner";

// Other Imports
import { decrypt, encrypt } from "@framework/utils/cipher";
import cartHandler from "@components/services/cart";
import { EVENTS_MAP } from "@components/services/analytics/constants";
import setSessionIdCookie from '@components/utils/setSessionId';
import { useUI, basketId as generateBasketId } from '@components/ui/context';
import { executePaypalPayment, getPaypalPaymentDetails, parsePayPalOrder } from "@framework/utils/payment-util";
import { PaymentGateway, PaymentOrderStatus } from "@components/utils/payment-constants";
import { matchStrings, tryParseJson } from "@framework/utils/parse-util";
import { PayPalPaymentState } from "@framework/api/endpoints/payments/paypal/constants";
import { IRequest } from "pages/api/payment-response-v2";
import { BETTERCOMMERCE_DEFAULT_COUNTRY, BETTERCOMMERCE_DEFAULT_CURRENCY, EmptyGuid, NEXT_POST_PAYMENT_RESPONSE_V2, PAYPAL_PAY_METHOD_SYSTEM_NAME } from "@components/utils/constants";
import eventDispatcher from '@components/services/analytics/eventDispatcher';
import { getPaymentMethods } from "@framework/payment";
import { getOrderId, getOrderInfo } from "@framework/utils/app-util";

interface IGatewayPageProps {
  readonly gateway: string;
  readonly token?: string;
  readonly paymentId?: string;
  readonly payerId?: string;
  readonly methods: string;
  readonly isCancelled: boolean;
}

const IS_RESPONSE_REDIRECT_ENABLED = true

const GatewayPage = (props: IGatewayPageProps) => {

  const orderInfo = getOrderInfo();
  const { Order } = EVENTS_MAP.ENTITY_TYPES;
  const { CheckoutConfirmation } = EVENTS_MAP.EVENT_TYPES;
  const { methods, gateway, token, paymentId, payerId, isCancelled, } = props;
  const { associateCart } = cartHandler();
  const { user, setCartItems, basketId, cartItems, setOrderId, orderId: uiOrderId, setBasketId, } = useUI();

  const [redirectUrl, setRedirectUrl] = useState<string>();
  const paymentMethods = methods ? tryParseJson(decrypt(methods)) as [] : [];

  /**
   * Handler for successful payment.
   * @param paymentMethod 
   * @param orderId 
   * @param order 
   * @param paymentResponseRequest 
   */
  const paymentConfirmation = async (paymentMethod: any, orderId: string, order: any, paymentResponseRequest: any,) => {

    const res: any = await axios.post(NEXT_POST_PAYMENT_RESPONSE_V2, encrypt(JSON.stringify(paymentResponseRequest)));

    if (res?.data?.success && res?.data?.result?.id) {
      const {
        basketId,
        customerId,
        billingAddress,
        discount,
        grandTotal,
        id,
        items,
        orderNo,
        paidAmount,
        payments,
        promotionsApplied,
        shippingCharge,
        shippingAddress,
        shipping,
        orderStatus,
        subTotal,
        taxPercent,
        orderDate,
      } = res?.data?.result
      eventDispatcher(CheckoutConfirmation, {
        basketItemCount: items.length,
        basketTotal: grandTotal?.raw?.withTax,
        shippingCost: shippingCharge?.raw?.withTax,
        promoCodes: promotionsApplied,
        basketItems: JSON.stringify(
          items.map((i: any) => {
            return {
              categories: i.categoryItems,
              discountAmt: i.discountAmt?.raw?.withTax,
              id: i.id,
              img: i.image,
              isSubscription: i.isSubscription,
              itemType: i.itemType,
              manufacturer: i.manufacturer,
              name: i.name,
              price: i.price?.raw?.withTax,
              productId: i.productId,
              qty: i.qty,
              rootManufacturer: i.rootManufacturer || '',
              stockCode: i.stockCode,
              subManufacturer: i.subManufacturer,
              tax: i.totalPrice?.raw?.withTax,
            }
          })
        ),
        entity: JSON.stringify({
          basketId: basketId,
          billingAddress: billingAddress,
          customerId: customerId,
          discount: discount?.raw?.withTax,
          grandTotal: grandTotal?.raw?.withTax,
          id: id,
          lineitems: items,
          orderNo: orderNo,
          paidAmount: paidAmount?.raw?.withTax,
          payments: payments.map((i: any) => {
            return {
              methodName: i.paymentMethod,
              paymentGateway: i.paymentGateway,
              amount: i.paidAmount,
            }
          }),
          promoCode: promotionsApplied,
          shipCharge: shippingCharge?.raw?.withTax,
          shippingAddress: shippingAddress,
          shippingMethod: shipping,
          status: orderStatus,
          subTotal: subTotal?.raw?.withTax,
          tax: grandTotal?.raw?.withTax,
          taxPercent: taxPercent,
          timestamp: orderDate,
        }),
        entityId: orderId, //orderModelResponse.id,
        entityName: orderNo,
        entityType: Order,
        eventType: CheckoutConfirmation,
      })
    }
  };

  /**
   * Handler for failed payment.
   * @param paymentMethod 
   * @param orderId 
   * @param order 
   * @param paymentResponseRequest 
   */
  const paymentFailed = async (paymentMethod: any, orderId: string, order: any, paymentResponseRequest: any,) => {

    const res: any = await axios.post(NEXT_POST_PAYMENT_RESPONSE_V2, encrypt(JSON.stringify(paymentResponseRequest)));

    if (res?.data?.success && res?.data?.result?.id) {
      const {
        basketId,
        customerId,
        billingAddress,
        discount,
        grandTotal,
        id,
        items,
        orderNo,
        paidAmount,
        payments,
        promotionsApplied,
        shippingCharge,
        shippingAddress,
        shipping,
        orderStatus,
        subTotal,
        taxPercent,
        orderDate,
      } = res?.data?.result
      eventDispatcher(CheckoutConfirmation, {
        basketItemCount: items.length,
        basketTotal: grandTotal?.raw?.withTax,
        shippingCost: shippingCharge?.raw?.withTax,
        promoCodes: promotionsApplied,
        basketItems: JSON.stringify(
          items.map((i: any) => {
            return {
              categories: i.categoryItems,
              discountAmt: i.discountAmt?.raw?.withTax,
              id: i.id,
              img: i.image,
              isSubscription: i.isSubscription,
              itemType: i.itemType,
              manufacturer: i.manufacturer,
              name: i.name,
              price: i.price?.raw?.withTax,
              productId: i.productId,
              qty: i.qty,
              rootManufacturer: i.rootManufacturer || '',
              stockCode: i.stockCode,
              subManufacturer: i.subManufacturer,
              tax: i.totalPrice?.raw?.withTax,
            }
          })
        ),
        entity: JSON.stringify({
          basketId: basketId,
          billingAddress: billingAddress,
          customerId: customerId,
          discount: discount?.raw?.withTax,
          grandTotal: grandTotal?.raw?.withTax,
          id: id,
          lineitems: items,
          orderNo: orderNo,
          paidAmount: paidAmount?.raw?.withTax,
          payments: payments.map((i: any) => {
            return {
              methodName: i.paymentMethod,
              paymentGateway: i.paymentGateway,
              amount: i.paidAmount,
            }
          }),
          promoCode: promotionsApplied,
          shipCharge: shippingCharge?.raw?.withTax,
          shippingAddress: shippingAddress,
          shippingMethod: shipping,
          status: orderStatus,
          subTotal: subTotal?.raw?.withTax,
          tax: grandTotal?.raw?.withTax,
          taxPercent: taxPercent,
          timestamp: orderDate,
        }),
        entityId: orderId, //orderModelResponse.id,
        entityName: orderNo,
        //entityType: Order,
        eventType: CheckoutConfirmation,
      })
    }
  };

  /**
   * Handler for processing payment.
   * @param paymentMethod 
   * @param orderId 
   * @param order 
   * @param paymentResponseRequest 
   */
  const processPaymentStatus = async (paymentMethod: any, orderId: string, order: any, paymentResponseRequest: any,) => {

    if (isCancelled) {
      await paymentFailed(paymentMethod, orderId, order, paymentResponseRequest,);
      setOrderId(orderId);
      if (IS_RESPONSE_REDIRECT_ENABLED) {
        setRedirectUrl(`/payment-failed`); // TODO: Show order failed screen.
      }
    } else {

      switch (order?.state) {

        case PayPalPaymentState.CREATED:
        case PayPalPaymentState.FAILED:

          await paymentFailed(paymentMethod, orderId, order, paymentResponseRequest,);
          setOrderId(orderId);
          if (IS_RESPONSE_REDIRECT_ENABLED) {
            setRedirectUrl(`/payment-failed`); // TODO: Show order failed screen.
          }
          break;

        case PayPalPaymentState.APPROVED:

          await paymentConfirmation(paymentMethod, orderId, order, paymentResponseRequest,);

          Cookies.remove('sessionId');
          setSessionIdCookie();
          Cookies.remove('basketId');
          const generatedBasketId = generateBasketId();
          setBasketId(generatedBasketId)
          const userId = cartItems.userId
          const newCart = await associateCart(userId, generatedBasketId);
          setCartItems(newCart.data);
          setOrderId(orderId);

          if (IS_RESPONSE_REDIRECT_ENABLED) {
            setRedirectUrl('/thank-you');
          }
          break;
      }
    }
  };

  /**
   * Handler for PaybyPayPal.
   * @param paymentMethod 
   * @param paymentId 
   * @param payerId 
   */
  const asyncPayPalHandler = async (paymentMethod: any, paymentId: string, payerId: string) => {

    let paymentDetailsResult: any;
    let bankOfferDetails:
      | {
        voucherCode: string
        offerCode: string
        value: string
        status: string
        discountedTotal: number
      }
      | undefined;
    const extras = {
      paymentId: paymentId,
      gateway: PaymentGateway.PAYPAL,
      isCancelled: isCancelled,
    };

    if (isCancelled) {
      const paymentResponseRequest: IRequest = {
        isCOD: false,
        txnOrderId: getOrderId(orderInfo?.order),
        orderId: orderInfo?.orderResponse?.id,
        additionalServiceCharge: 0,
        gatewayStatus: null,
        gatewaySignature: `paymentId=${paymentId}&payerId=${payerId ?? ""}&token=${token}`,
        gatewayStatusId: null,
        bankOfferDetails: bankOfferDetails,
        method: paymentMethod,
        extras,
      };

      await processPaymentStatus(paymentMethod, orderInfo?.orderResponse?.id, paymentDetailsResult, paymentResponseRequest,);
    } else {
      if (paymentId) {
        paymentDetailsResult = await getPaypalPaymentDetails(paymentId);
      }

      if (payerId && paymentDetailsResult && matchStrings(paymentDetailsResult?.state, PayPalPaymentState.CREATED, true)) {
        paymentDetailsResult = await executePaypalPayment({ paymentId: paymentId, payerId });
      }

      // If payment status is APPROVED.
      if (matchStrings(paymentDetailsResult?.state, PayPalPaymentState.APPROVED, true)) {
        const transactionDescription = paymentDetailsResult?.transactions?.length ? paymentDetailsResult?.transactions[0]?.description : "";
        if (transactionDescription) {

          const parsedOrder = parsePayPalOrder(transactionDescription);
          if (parsedOrder?.orderId) {

            const paymentResponseRequest: IRequest = {
              isCOD: false,
              txnOrderId: getOrderId(orderInfo?.order),
              orderId: parsedOrder?.orderId,
              additionalServiceCharge: 0,
              gatewayStatus: null,
              gatewaySignature: `paymentId=${paymentId}&payerId=${payerId ?? ""}&token=${token}`,
              gatewayStatusId: null,
              bankOfferDetails: bankOfferDetails,
              method: paymentMethod,
              extras,
            };

            await processPaymentStatus(paymentMethod, parsedOrder?.orderId, paymentDetailsResult, paymentResponseRequest,);
          }
        }
      }
    }
  };

  /**
   * Update order status.
   */
  const asyncHandler = async () => {

    if (gateway) {
      switch (gateway) {

        // Paypal specific flow
        case PaymentGateway.PAYPAL:

          const paymentMethod = paymentMethods?.find((x: any) => x?.systemName === PAYPAL_PAY_METHOD_SYSTEM_NAME);
          asyncPayPalHandler(paymentMethod, paymentId as string, payerId as string);
          break;

        // Juspay specific flow
        case PaymentGateway.JUSPAY:
          break;
      }

    }
  };

  useEffect(() => {

    if (paymentId || isCancelled) {
      setTimeout(() => {
        asyncHandler()
      }, 500);
    }
  }, []);

  useEffect(() => {
    if (redirectUrl) {
      Router.replace(redirectUrl)
    }
  }, [redirectUrl]);

  return (
    <>
      <Spinner />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  //console.log(context?.query);
  const params: any = context?.query;
  const gateway = params?.gateway?.length ? params?.gateway[0] : "";
  const isCancelled = params?.gateway?.length > 1
    ? params?.gateway[1] === "canceled"
      ? true
      : false
    : false;
  const payerId = !isCancelled
    ? params?.PayerID || params?.payerID || params?.payerId
    : "";

  const paymentMethodsResult = await getPaymentMethods()({
    countryCode: BETTERCOMMERCE_DEFAULT_COUNTRY as string,
    currencyCode: BETTERCOMMERCE_DEFAULT_CURRENCY as string,
    basketId: EmptyGuid,
    cookies: context?.req?.cookies,
  });

  return {
    props: {
      gateway: gateway,
      isCancelled: isCancelled,
      methods: paymentMethodsResult?.length ? encrypt(JSON.stringify(paymentMethodsResult?.map((x: any) => ({
        id: x?.id,
        systemName: x?.systemName,
      })))) : "",

      // Paypal specific props
      token: params?.token,
      paymentId: !isCancelled ? params?.paymentId : "",
      payerId: payerId,
    }, // will be passed to the page component as props
  }
};

export default GatewayPage;
