// Base Imports
import React, { useEffect, useState } from 'react'

// Package Imports
import Cookies from 'js-cookie'
import Router from 'next/router'

// Component Imports
import eventDispatcher from '@components//services/analytics/eventDispatcher'

// Other Imports
import cartHandler from '@components//services/cart'
import { getOrderId, getOrderInfo } from '@framework/utils/app-util'
import setSessionIdCookie from '@components//utils/setSessionId'
import { processPaymentResponse } from '@framework/utils/payment-util'
import { PaymentStatus } from '@components//utils/payment-constants'
import { useUI, basketId as generateBasketId } from '@components//ui/context'
import { EVENTS_MAP } from '@components//services/analytics/constants'
import { Cookie } from '@framework/utils/constants'
import { IGatewayPageProps } from 'framework/contracts/payment/IGatewayPageProps'

const IS_RESPONSE_REDIRECT_ENABLED = true

const PaymentGatewayNotification = (props: IGatewayPageProps) => {
  const orderInfo = getOrderInfo()
  const { associateCart } = cartHandler()
  const { gateway, params, isCancelled, isCOD = false } = props
  const {
    user,
    setCartItems,
    basketId,
    cartItems,
    setOrderId,
    orderId: uiOrderId,
    setBasketId,
  } = useUI()
  const [redirectUrl, setRedirectUrl] = useState<string>()
  const { Order } = EVENTS_MAP.ENTITY_TYPES
  const { CheckoutConfirmation } = EVENTS_MAP.EVENT_TYPES

  /**
   * Update order status.
   */
  const asyncHandler = async (
    gateway: string,
    params: any,
    isCancelled: boolean
  ) => {
    /**
     * For future use,
     * For implementation of bank offers.
     */
    let bankOfferDetails:
      | {
          voucherCode: string
          offerCode: string
          value: string
          status: string
          discountedTotal: number
        }
      | undefined
    const extras = {
      ...params,
      gateway: gateway,
      isCancelled: isCancelled,
    }

    const paymentResponseRequest: any /*IPaymentProcessingData*/ = {
      isCOD: isCOD,
      orderId: orderInfo?.orderResponse?.id,
      txnOrderId: getOrderId(orderInfo?.order),
      bankOfferDetails: bankOfferDetails,
      extras,
    }

    const paymentResponseResult: any = await processPaymentResponse(
      gateway,
      paymentResponseRequest
    )
    if (
      paymentResponseResult === PaymentStatus.PAID ||
      paymentResponseResult === PaymentStatus.AUTHORIZED
    ) {
      const { orderNo, grandTotal } = orderInfo?.orderResponse
      eventDispatcher(CheckoutConfirmation, {
        basketItemCount: cartItems?.lineItems?.length,
        basketTotal: grandTotal?.raw?.withTax,
        shippingCost: cartItems?.shippingCharge?.raw?.withTax,
        promoCodes: cartItems?.promotionsApplied,
        basketItems: JSON.stringify(
          cartItems?.lineItems?.map((i: any) => {
            return {
              categories: i?.categoryItems,
              discountAmt: i?.discount?.raw?.withTax,
              id: i?.id,
              img: i?.image,
              isSubscription: i?.isSubscription,
              itemType: i?.itemType,
              manufacturer: i?.manufacturer || '',
              name: i?.name,
              price: i?.price?.raw?.withTax,
              productId: i?.productId,
              qty: i?.qty,
              rootManufacturer: i?.rootManufacturer || '',
              stockCode: i?.stockCode,
              subManufacturer: i?.subManufacturer,
              tax: i?.totalPrice?.raw?.withTax,
            }
          })
        ),
        entity: JSON.stringify({
          basketId: basketId,
          billingAddress: orderInfo?.orderResponse?.billingAddress,
          customerId: orderInfo?.orderResponse?.customerId,
          discount: orderInfo?.orderResponse?.discount?.raw?.withTax,
          grandTotal: grandTotal?.raw?.withTax,
          id: orderInfo?.orderResponse?.id,
          lineitems: orderInfo?.orderResponse?.items,
          orderNo: orderNo,
          paidAmount: grandTotal?.raw?.withTax,
          payments: orderInfo?.orderResponse?.payments?.map((i: any) => {
            return {
              methodName: i.paymentMethod,
              paymentGateway: i.paymentGateway,
              amount: i.paidAmount,
            }
          }),
          promoCode: orderInfo?.orderResponse?.promotionsApplied,
          shipCharge: orderInfo?.orderResponse?.shippingCharge?.raw?.withTax,
          shippingAddress: orderInfo?.orderResponse?.shippingAddress,
          shippingMethod: orderInfo?.orderResponse?.shipping,
          status: orderInfo?.orderResponse?.orderStatus,
          subTotal: orderInfo?.orderResponse?.subTotal?.raw?.withTax,
          tax: grandTotal?.raw?.withTax,
          taxPercent: orderInfo?.orderResponse?.taxPercent,
          timestamp: orderInfo?.orderResponse?.orderDate,
        }),
        entityId: orderInfo?.orderResponse?.id,
        entityName: orderNo,
        entityType: Order,
        eventType: CheckoutConfirmation,
      })

      Cookies.remove(Cookie.Key.SESSION_ID)
      setSessionIdCookie()
      Cookies.remove(Cookie.Key.BASKET_ID)
      const generatedBasketId = generateBasketId()
      setBasketId(generatedBasketId)
      const userId = cartItems.userId
      const newCart = await associateCart(userId, generatedBasketId)
      setCartItems(newCart.data)
      setOrderId(paymentResponseRequest?.orderId)

      if (IS_RESPONSE_REDIRECT_ENABLED) {
        setRedirectUrl('/thank-you')
      }
    } else if (
      paymentResponseResult === PaymentStatus.PENDING ||
      paymentResponseResult === PaymentStatus.DECLINED
    ) {
      setOrderId(paymentResponseRequest?.orderId)
      if (IS_RESPONSE_REDIRECT_ENABLED) {
        setRedirectUrl(`/payment-failed`) // TODO: Show order failed screen.
      }
    }
  }

  useEffect(() => {
    setTimeout(() => {
      asyncHandler(gateway, params, isCancelled)
    }, 500)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (redirectUrl) {
      Router.replace(redirectUrl)
    }
  }, [redirectUrl])

  return <></>
}

export default PaymentGatewayNotification
