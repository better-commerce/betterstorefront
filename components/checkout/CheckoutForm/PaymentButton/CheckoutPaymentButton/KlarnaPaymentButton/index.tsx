// Base Imports
import React from 'react'

// Component Imports
import BasePaymentButton, { IApplePaymentProps, IDispatchState, IPaymentButtonProps } from '../../BasePaymentButton';

export class CheckoutKlarnaPayPaymentButton extends BasePaymentButton {
 /**
   * CTor
   * @param props
   */
    constructor(
        props: IPaymentButtonProps & IApplePaymentProps & IDispatchState
    ) {
        super(props)
        this.state = {
            confirmed: false,
            paymentMethod: super.getPaymentMethod(props?.paymentMethod),
        }
    }
}
