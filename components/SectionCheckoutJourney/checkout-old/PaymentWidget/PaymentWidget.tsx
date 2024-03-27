import { useReducer, useEffect } from 'react'
import eventDispatcher from '@components//services/analytics/eventDispatcher'
import { EVENTS_MAP } from '@components//services/analytics/constants'

import { getOrderId, getOrderInfo } from '@framework/utils/app-util'
import { processPaymentResponse } from '@framework/utils/payment-util'
import { PaymentMethodType } from '@better-commerce/bc-payments-sdk'
import { PaymentStatus } from '@components//utils/payment-constants'

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
  const { CheckoutConfirmation } = EVENTS_MAP.EVENT_TYPES
  const { Order } = EVENTS_MAP.ENTITY_TYPES

  const CODHandler = async (paymentResponseRequest: any) => {
    const res: any = await processPaymentResponse(
      PaymentMethodType.COD,
      paymentResponseRequest
    )
    if (res === PaymentStatus.AUTHORIZED) {
      // TODO: Get order details
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
      } = res.result
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
        entityId: orderModelResponse.id,
        entityName: orderNo,
        entityType: Order,
        eventType: CheckoutConfirmation,
      })
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
