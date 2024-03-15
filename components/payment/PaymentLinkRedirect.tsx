// Base Imports
import React, { useEffect, useState } from 'react'

// Other Imports
import { useUI } from '@components/ui'

const PAYMENT_LINK_ALLOWED_URLS = [
  '/checkout',
  '/payment-notification',
  '/thank-you',
  '/payment-failed',
]

const PaymentLinkRedirect = ({ router }: any) => {
  const { isPaymentLink, setOverlayLoaderState } = useUI()

  const redirect = (isPaymentLink: boolean, url: string) => {
    if (isPaymentLink) {
      const newUrl = url === '/' ? '' : url
      const lookupUrl = PAYMENT_LINK_ALLOWED_URLS?.find((x: string) =>
        x?.startsWith(newUrl)
      )

      if (!newUrl || !lookupUrl) {
        setOverlayLoaderState({
          visible: true,
          message: 'Please wait...',
          backdropInvisible: true,
        })

        router.push('/checkout')
      }
    }
  }

  useEffect(() => {
    redirect(isPaymentLink, window.location.pathname)
  }, [])

  useEffect(() => {
    // Listener for snippet injector reset.
    router.events.on('routeChangeStart', (newUrl: string, options: any) => {
      redirect(isPaymentLink, newUrl)
    })

    // Dispose listener.
    return () => {
      router.events.off('routeChangeStart', () => {})
    }
  }, [router.events])

  return <></>
}

export default PaymentLinkRedirect
