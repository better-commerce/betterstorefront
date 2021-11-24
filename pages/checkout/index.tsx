import { Layout } from '@components/common'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import CheckoutRouter from '@components/checkout/CheckoutRouter'
import { useState } from 'react'
import CheckoutForm from '@components/checkout/CheckoutForm'
function Checkout() {
  const [isMailSubscribed, setMailSubscirbed] = useState(false)

  const handleGuestMail = () => setMailSubscirbed(true)

  let accessToken: any = null
  if (typeof window !== 'undefined') {
    accessToken = localStorage.getItem('user')
  }
  if (accessToken || isMailSubscribed) {
    return <CheckoutForm />
  }
  return <CheckoutRouter handleGuestMail={handleGuestMail} />
}

Checkout.Layout = Layout

const PAGE_TYPE = PAGE_TYPES['Checkout']

export default withDataLayer(Checkout, PAGE_TYPE)
