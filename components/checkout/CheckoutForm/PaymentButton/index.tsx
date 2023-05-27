// Base Imports
import React from "react";

// Component Imports
import { CODPaymentButton } from "./CODPaymentButton";
import { PayPalPaymentButton } from "./PayPalPaymentButton";
import { IDispatchState, IPaymentButtonProps } from "./BasePaymentButton";
import { MasterCardPaymentButton } from "./MasterCardPaymentButton";
import { CheckoutPaymentButton } from "./CheckoutPaymentButton";

// Other Imports
import { matchStrings } from "@framework/utils/parse-util";
import { StripePaymentButton } from "./StripePaymentButton";

/**
 * Factory helper/renderer component for <PaymentButton>
 * @param props 
 * @returns 
 */
const PaymentButton = (props: IPaymentButtonProps & IDispatchState) => {
    const { paymentMethod } = props;

    let Component: any;
    if (matchStrings(paymentMethod?.systemName, "paypal", true)) {
        Component = PayPalPaymentButton;
    } else if (matchStrings(paymentMethod?.systemName, "checkout", true)) {
        Component = CheckoutPaymentButton;
    } else if (matchStrings(paymentMethod?.systemName, "mastercard", true)) {
        Component = MasterCardPaymentButton;
    } else if (matchStrings(paymentMethod?.systemName, "stripe", true)) {
        Component = StripePaymentButton;
    } else {
        Component = CODPaymentButton;
    }

    return (
        <Component {...props} />
    );
}

export default PaymentButton;