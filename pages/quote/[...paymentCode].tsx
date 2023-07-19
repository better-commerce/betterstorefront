// Base Imports
import React, { useEffect, useState } from 'react'

// Package Imports
import axios from 'axios'
import Router from 'next/router'
import { GetServerSideProps } from 'next'
import { signOut } from 'next-auth/react'

// Component Imports
import Spinner from '@components/ui/Spinner'

// Other Imports
import { Guid } from '@commerce/types'
import { useUI } from '@components/ui'
import {
  Messages,
  NEXT_GET_CART,
  NEXT_GET_CUSTOMER_DETAILS,
  NEXT_VALIDATE_PAYMENT_LINK,
} from '@components/utils/constants'
import { AlertType } from '@framework/utils/enums'

const PaymentLinkPage = ({ paymentCode, deviceInfo, config }: any) => {
  const {
    user,
    setUser,
    deleteUser,
    setBasketId,
    setCartItems,
    setIsPaymentLink,
    setAlert,
  } = useUI()
  const [showLoader, setShowLoader] = useState(true)

  const linkExpired = () => {
    setShowLoader(false)
    setAlert({
      type: AlertType.ERROR,
      msg: Messages.Validations.PaymentLink['LINK_EXPIRED'],
    })
  }

  useEffect(() => {
    const asyncHandler = async (paymentLink: string) => {
      const { data: validatePaymentLinkResult }: any = await axios.post(
        NEXT_VALIDATE_PAYMENT_LINK,
        { data: paymentLink }
      )

      if (
        !validatePaymentLinkResult?.result?.quoteId ||
        (validatePaymentLinkResult?.result?.quoteId &&
          validatePaymentLinkResult?.result?.quoteId === Guid.empty)
      ) {
        // If quote id not received.
        linkExpired()
      } else {
        const userId = validatePaymentLinkResult?.result?.customerId
        const basketId = validatePaymentLinkResult?.result?.quoteId
        if (
          basketId &&
          basketId !== Guid.empty &&
          userId &&
          userId !== Guid.empty
        ) {
          // If there is a user logged-in.
          if (user?.userId) {
            deleteUser({
              isSilentLogout: true,
            })

            if (user?.socialData?.socialMediaType) {
              await signOut()
            }
          }

          const { data: getCustomerResult }: any = await axios.post(
            `${NEXT_GET_CUSTOMER_DETAILS}?customerId=${userId}`
          )

          const { data: getBasketResult }: any = await axios.get(
            NEXT_GET_CART,
            {
              params: { basketId },
            }
          )
          if (getBasketResult && getBasketResult?.id) {
            setCartItems(getBasketResult)
            setBasketId(getBasketResult?.id)
            getCustomerResult.isAssociated = true
          } else {
            getCustomerResult.isAssociated = false
          }
          setUser(getCustomerResult)
          setIsPaymentLink(true)
          setTimeout(() => {
            Router.push('/checkout')
          }, 200)
        } else {
          linkExpired()
        }
      }
    }

    if (paymentCode) {
      asyncHandler(encodeURIComponent(paymentCode))
    }
  }, [paymentCode])

  return <>{showLoader && <Spinner />}</>
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
