// Base Imports
import React from "react";

// Package Imports
import { GetServerSideProps } from "next";

// Component Imports
import Spinner from "@components/ui/Spinner";
import PaymentGatewayNotification from "@components/checkout/PaymentGatewayNotification";

// Other Imports
import { EmptyString } from "@components/utils/constants";
import { PaymentGateway } from "@components/utils/payment-constants";


export interface IGatewayPageProps {
  readonly gateway: string;
  readonly params?: { token?: string, orderId?: string, payerId?: string };
  readonly isCancelled: boolean;
  readonly isCOD?: boolean;
};

const GatewayPage = (props: IGatewayPageProps) => {

  const { gateway, params, isCancelled } = props;

  return (
    <>
      <Spinner />
      <PaymentGatewayNotification
        gateway={gateway}
        params={params}
        isCancelled={isCancelled}
      />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  let propParams: any;
  const params: any = context?.query;
  const gateway = params?.gateway?.length ? params?.gateway[0] : "";
  const isCancelled = params?.gateway?.length > 1
    ? params?.gateway[1] === "canceled"
      ? true
      : false
    : false;

  switch (gateway) {
    case PaymentGateway.CHECKOUT:
    case PaymentGateway.PAYPAL:

      const payerId = !isCancelled
        ? params?.PayerID || params?.payerID || params?.payerId
        : "";

      propParams = {
        token: params?.token, // For Paypal
        orderId: !isCancelled ? params?.orderId : "", // For Paypal & Checkout
        payerId: payerId, // For Paypal & Checkout
      };
      break;

    case PaymentGateway.STRIPE:

      propParams = {
        token: params?.payment_intent_client_secret, // For Stripe
        orderId: !isCancelled ? params?.payment_intent : EmptyString, // For Stripe
        payerId: EmptyString,
      };
      break;
  }

  return {
    props: {
      gateway: gateway, // Generic
      isCancelled: isCancelled, // Generic
      params: propParams, // Values depend on payment gateway provider
    }, // will be passed to the page component as props
  }
};

export default GatewayPage;
