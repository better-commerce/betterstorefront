// Base Imports
import React from "react";

// Package Imports
import { GetServerSideProps } from "next";

// Component Imports
import Spinner from "@components/ui/Spinner";
import PaymentGatewayNotification from "@components/checkout/PaymentGatewayNotification";

// Other Imports
import { EVENTS_MAP } from "@components/services/analytics/constants";

export interface IGatewayPageProps {
  readonly gateway: string;
  readonly params?: { token?: string, orderId?: string, payerId?: string };
  readonly isCancelled: boolean;
  readonly isCOD?: boolean;
};

const GatewayPage = (props: IGatewayPageProps) => {

  const { gateway, params, isCancelled } = props;
  const { Order } = EVENTS_MAP.ENTITY_TYPES;
  const { CheckoutConfirmation } = EVENTS_MAP.EVENT_TYPES;

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
        token: params?.token, // For Paypal
        orderId: !isCancelled ? params?.orderId : "", // For Paypal & Checkout
        payerId: payerId, // For Paypal & Checkout
      },
    }, // will be passed to the page component as props
  }
};

export default GatewayPage;
