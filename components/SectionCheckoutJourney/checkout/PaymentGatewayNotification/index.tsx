// Base Imports
import React, { useEffect, useState } from 'react'

// Package Imports
import Cookies from 'js-cookie'
import Router from 'next/router'
import { PaymentSelectionType } from 'bc-payments-sdk'

// Other Imports
import cartHandler from '@components/services/cart'
import { getOrderId, getOrderInfo, getRedirectionLocale } from '@framework/utils/app-util'
import setSessionIdCookie from '@components/utils/setSessionId'
import { processPaymentResponse } from '@framework/utils/payment-util'
import { PaymentStatus } from '@components/utils/payment-constants'
import { useUI, basketId as generateBasketId } from '@components/ui/context'
import { Cookie } from '@framework/utils/constants'
import { IGatewayPageProps } from 'framework/contracts/payment/IGatewayPageProps'
import { EmptyString } from '@components/utils/constants'
import useAnalytics from '@components/services/analytics/useAnalytics'
import { IPartialPaymentProps } from '../CheckoutForm/PaymentButton/BasePaymentButton'
import { decrypt } from '@framework/utils/cipher'

const IS_RESPONSE_REDIRECT_ENABLED = true

const PaymentGatewayNotification = (props: IGatewayPageProps & IPartialPaymentProps) => {
  const { recordAnalytics } = useAnalytics()
  const orderInfo = getOrderInfo()
  const { associateCart } = cartHandler()
  const { gateway, params, isCancelled, isCOD = false, config, paymentType = PaymentSelectionType.FULL, partialAmount = 0 } = props
  const { user, setCartItems, basketId, cartItems, setOrderId, orderId: uiOrderId, setBasketId, } = useUI()
  const [redirectUrl, setRedirectUrl] = useState<string>()

  const getCookies = (): Record<string, string> => {
    return document.cookie.split('; ').filter(Boolean)
      .reduce<Record<string, string>>((acc, cookieStr) => {
        const [name, ...rest] = cookieStr.split('=')
        // decode in case the value was URL-encoded

        if (name === Cookie.Key.USER_TOKEN)
          acc[decodeURIComponent(name)] = decrypt(decodeURIComponent(rest.join('=')))
        else
          acc[decodeURIComponent(name)] = decodeURIComponent(rest.join('='));
        return acc
      }, {})
  }


  /**
   * Update order status.
   */
  const asyncHandler = async (gateway: string, params: any, isCancelled: boolean) => {
    /**
     * For future use,
     * For implementation of bank offers.
     */
    let bankOfferDetails:
      | { voucherCode: string; offerCode: string; value: string; status: string; discountedTotal: number; }
      | undefined
      const extras = { ...params, gateway, isCancelled, paymentType, partialAmount, cookies: getCookies(), } // Pass paymentType & partialAmount information

    const paymentResponseRequest: any /*IPaymentProcessingData*/ = {
      isCOD: isCOD,
      orderId: orderInfo?.orderResponse?.id,
      txnOrderId: getOrderId(orderInfo?.order),
      bankOfferDetails: bankOfferDetails,

      /**
       * Note: For PSPs paymentType ("full" | "partial") & partialAmount will be present in PSPs get order details response.
       */
      extras, 
    }

    const paymentResponseResult: any = await processPaymentResponse(gateway, paymentResponseRequest)
    if (paymentResponseResult === PaymentStatus.PAID || paymentResponseResult === PaymentStatus.AUTHORIZED) {
      Cookies.remove(Cookie.Key.SESSION_ID)
      setSessionIdCookie()
      Cookies.remove(Cookie.Key.BASKET_ID)
      const generatedBasketId = generateBasketId()
      setBasketId(generatedBasketId)
      const userId = cartItems.userId
      const newCart = await associateCart(userId, generatedBasketId)
      setCartItems(newCart.data)
      setOrderId(paymentResponseRequest?.orderId)

      const defaultCulture = config?.defaultLanguage && config?.defaultCountry ? `${config?.defaultLanguage}-${config?.defaultCountry}` : EmptyString
      const redirectionLocale = getRedirectionLocale(defaultCulture)
      if (IS_RESPONSE_REDIRECT_ENABLED) {
        setRedirectUrl(`${redirectionLocale}/thank-you`)
      }
    } else if (paymentResponseResult === PaymentStatus.PENDING || paymentResponseResult === PaymentStatus.DECLINED) {
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
  }, [])

  useEffect(() => {
    if (redirectUrl) {
      Router.replace(redirectUrl)
    }
  }, [redirectUrl])

  return <></>
}

export default PaymentGatewayNotification
