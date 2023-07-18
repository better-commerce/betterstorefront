// Base Imports
import React, { useEffect } from 'react'

// Package Imports
import axios from 'axios'
import { GetServerSideProps } from 'next'

// Component Imports
import Spinner from '@components/ui/Spinner'

// Other Imports
import { NEXT_VALIDATE_PAYMENT_LINK } from '@components/utils/constants'

const PaymentLinkPage = ({ paymentCode, deviceInfo, config }: any) => {
  useEffect(() => {
    const asyncHandler = async (paymentLink: string) => {
      const validatePaymentLinkResult: any = await axios.post(
        NEXT_VALIDATE_PAYMENT_LINK,
        { data: paymentLink }
      )
      console.log('validatePaymentLinkResult', validatePaymentLinkResult)
    }

    if (paymentCode) {
      asyncHandler(encodeURIComponent(paymentCode))
    }
  }, [paymentCode])

  return (
    <>
      <Spinner />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const params: any = context?.query
  const paymentCode = params?.paymentCode?.length ? params?.paymentCode[0] : ''

  return {
    props: {
      paymentCode: paymentCode,
    }, // will be passed to the page component as props
  }
}

export default PaymentLinkPage
