// Base Imports
import React, { useEffect, useState } from "react";

// Package Imports
import Cookies from "js-cookie";
import Router from "next/router";
import { GetServerSideProps } from "next";

// Component Imports
import Spinner from "@components/ui/Spinner";

// Other Imports
import cartHandler from "@components/services/cart";
import { EVENTS_MAP } from "@components/services/analytics/constants";
import setSessionIdCookie from '@components/utils/setSessionId';
import { useUI, basketId as generateBasketId } from '@components/ui/context';
import { PaymentOrderStatus } from "@components/utils/payment-constants";
import { getOrderId, getOrderInfo } from "@framework/utils/app-util";
import { processPaymentResponse } from "@framework/utils/payment-util";

interface IGatewayPageProps {
  readonly gateway: string;
  readonly params?: { token?: string, orderId?: string, payerId?: string };
  readonly isCancelled: boolean;
}

const IS_RESPONSE_REDIRECT_ENABLED = true

const GatewayPage = (props: IGatewayPageProps) => {

  const orderInfo = getOrderInfo();
  const { Order } = EVENTS_MAP.ENTITY_TYPES;
  const { CheckoutConfirmation } = EVENTS_MAP.EVENT_TYPES;
  const { gateway, isCancelled, params } = props;
  const { associateCart } = cartHandler();
  const { user, setCartItems, basketId, cartItems, setOrderId, orderId: uiOrderId, setBasketId, } = useUI();

  const [redirectUrl, setRedirectUrl] = useState<string>();

  /**
   * Update order status.
   */
  const asyncHandler = async (gateway: string, params: any, isCancelled: boolean) => {

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
      ...params,
      gateway: gateway,
      isCancelled: isCancelled,
    };

    const paymentResponseRequest: any /*IPaymentProcessingData*/ = {
      isCOD: false,
      orderId: orderInfo?.orderResponse?.id,
      txnOrderId: getOrderId(orderInfo?.order),
      bankOfferDetails: bankOfferDetails,
      extras,
    };

    const paymentResponseResult: any = await processPaymentResponse(gateway, paymentResponseRequest);
    if (paymentResponseResult === PaymentOrderStatus.PAID || paymentResponseResult === PaymentOrderStatus.AUTHORIZED) {

      Cookies.remove('sessionId');
      setSessionIdCookie();
      Cookies.remove('basketId');
      const generatedBasketId = generateBasketId();
      setBasketId(generatedBasketId)
      const userId = cartItems.userId
      const newCart = await associateCart(userId, generatedBasketId);
      setCartItems(newCart.data);
      setOrderId(paymentResponseRequest?.orderId);

      if (IS_RESPONSE_REDIRECT_ENABLED) {
        setRedirectUrl('/thank-you');
      }
    } else if (paymentResponseResult === PaymentOrderStatus.PENDING || paymentResponseResult === PaymentOrderStatus.DECLINED) {

      setOrderId(paymentResponseRequest?.orderId);
      if (IS_RESPONSE_REDIRECT_ENABLED) {
        setRedirectUrl(`/payment-failed`); // TODO: Show order failed screen.
      }
    }
  };

  useEffect(() => {
    setTimeout(() => {
      asyncHandler(gateway, params, isCancelled);
    }, 500);
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

  return {
    props: {
      gateway: gateway, // Generic
      isCancelled: isCancelled, // Generic

      /*methods: paymentMethodsResult?.length ? encrypt(JSON.stringify(paymentMethodsResult?.map((x: any) => ({
        id: x?.id,
        systemName: x?.systemName,
      })))) : "",*/

      params: {
        token: params?.token, // Paypal
        orderId: !isCancelled ? params?.orderId : "", // Paypal
        payerId: payerId, // Paypal
      },
    }, // will be passed to the page component as props
  }
};

export default GatewayPage;
