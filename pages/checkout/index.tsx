import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import CheckoutRouter from '@components/checkout/CheckoutRouter'
import { useState } from 'react'
import CheckoutForm from '@components/checkout/CheckoutForm'
import cookie from 'cookie'
import { basketId as basketIdGenerator } from '@components/ui/context'
import { useCart as getCart } from '@framework/cart'
import { GetServerSideProps } from 'next'
import { useUI } from '@components/ui/context'
function Checkout({ cart }: any) {
  const [isMailSubscribed, setMailSubscirbed] = useState(false)
  const { user } = useUI()
  const handleGuestMail = () => setMailSubscirbed(true)

  let accessToken: any = null
  if (typeof window !== 'undefined') {
    accessToken = localStorage.getItem('user')
  }
  if (accessToken || isMailSubscribed) {
    return <CheckoutForm cart={cart} user={user} />
  }
  return <CheckoutRouter handleGuestMail={handleGuestMail} />
}
export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = cookie.parse(context.req.headers.cookie || '')
  let basketRef: any = cookies.basketId
  if (!basketRef) {
    basketRef = basketIdGenerator()
    context.res.setHeader('set-cookie', `basketId=${basketRef}`)
  }

  const response = await getCart()({
    basketId: basketRef,
  })

  return {
    props: { cart: response }, // will be passed to the page component as props
  }
}

const PAGE_TYPE = PAGE_TYPES['Checkout']

export default withDataLayer(Checkout, PAGE_TYPE)
