import { useReducer, useEffect } from 'react'
import { EVENTS_MAP } from '@components/services/analytics/constants'

import { getOrderId, getOrderInfo } from '@framework/utils/app-util'
import { processPaymentResponse } from '@framework/utils/payment-util'
import { PaymentMethodType } from 'bc-payments-sdk'
import { PaymentStatus } from '@components/utils/payment-constants'
import { AnalyticsEventType } from '@components/services/analytics'
import useAnalytics from '@components/services/analytics/useAnalytics'
import { SITE_ORIGIN_URL } from '@components/utils/constants'
import Router from 'next/router'

/* ---------------- HOW TO ADD A NEW PAYMENT METHOD

1. Add a new object to the reducer and initial state, for eg triggerPaypal
2. if new payment method requires a component create a component and display it conditionally on the state (e.g Stripe method)
3. if the new payment method requires to be called as a function, simply call it as a function ( e.g COD method)

*/
const reducer = (state: any, { type, payload }: any) => {
  switch (type) {
    case 'SET_PAYMENT_INTENT':
      return { ...state, isPaymentIntent: payload }
    case 'TRIGGER_COD':
      return { ...state, triggerCOD: !state.triggerCOD, triggerStripe: false }
  }
}

export default function PaymentWidget({
  orderModelResponse,
  paymentMethod,
  checkoutCallback,
}: any) {
  const { recordAnalytics } = useAnalytics()
  const orderInfo = getOrderInfo()
  const initialState = {
    triggerStripe: false,
    isPaymentIntent: new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret'
    ),
    triggerCOD: false,
  }

  const PAYMENT_METHOD_MAP: any = {
    COD: () => dispatch({ type: 'TRIGGER_COD', payload: true }),
    Stripe: () => {
      dispatch({ type: 'TRIGGER_STRIPE', payload: true })
    },
    undefined: () => {},
  }
  const [state, dispatch] = useReducer(reducer, initialState)

  const setPaymentIntent = (payload: boolean) =>
    dispatch({ type: 'SET_PAYMENT_INTENT', payload })

  useEffect(() => {
    if (paymentMethod && paymentMethod.systemName) {
      PAYMENT_METHOD_MAP[paymentMethod.systemName]()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentMethod])
  const { Order } = EVENTS_MAP.ENTITY_TYPES

  const CODHandler = async (paymentResponseRequest: any) => {
    const res: any = await processPaymentResponse(
      PaymentMethodType.COD,
      paymentResponseRequest
    )
    if (res === PaymentStatus.AUTHORIZED) {
      // TODO: Get order details
      const { basketId, customerId, billingAddress, discount, grandTotal, id, items, orderNo, paidAmount, payments, promotionsApplied, shippingCharge, shippingAddress, shipping, orderStatus, subTotal, taxPercent, orderDate, } = res.result
      const orderInfo = { orderResponse: { id, orderNo, customerId, discount, paidAmount, grandTotal, shipping, shippingAddress, billingAddress, promotionsApplied, payments, orderStatus, subTotal, taxPercent, orderDate, } }
      const extras = { originalLocation: SITE_ORIGIN_URL + Router.asPath }
      recordAnalytics(AnalyticsEventType.PURCHASE, { ...{ ...extras }, basketId, cartItems: { lineItems: items, shippingCharge, }, orderInfo, entityType: Order, })
      dispatch({ type: 'TRIGGER_COD', payload: false })
      checkoutCallback(orderModelResponse.id)
    }
  }

  if (state.triggerCOD) {
    const paymentResponseRequest: any = {
      isCOD: true,
      orderId: orderInfo?.orderResponse?.id,
      txnOrderId: getOrderId(orderInfo?.order),
      bankOfferDetails: null,
      extras: {},
    }
    console.log(paymentResponseRequest)
    CODHandler(paymentResponseRequest)
    return null
  }
  return null
}
