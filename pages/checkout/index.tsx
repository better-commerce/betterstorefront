import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import CheckoutRouter from '@components/checkout/CheckoutRouter'
import { useState, useEffect } from 'react'
import CheckoutForm from '@components/checkout/CheckoutForm'
import cookie from 'cookie'
import { basketId as basketIdGenerator } from '@components/ui/context'
import { useCart as getCart } from '@framework/cart'
import { GetServerSideProps } from 'next'
import { useUI } from '@components/ui/context'
import { asyncHandler } from '@components/account/Address/AddressBook'

function Checkout({ cart }: any) {
  const [isMailSubscribed, setMailSubscirbed] = useState(false)
  const [defaultShippingAddress, setDefaultShippingAddress] = useState({})
  const [defaultBillingAddress, setDefaultBillingAddress] = useState({})
  const { user } = useUI()
  const handleGuestMail = () => setMailSubscirbed(true)
  const { getAddress, updateAddress, createAddress, deleteAddress } =
    asyncHandler()

  let userObject: any = null
  if (typeof window !== 'undefined') {
    userObject = localStorage.getItem('user')
  }

  useEffect(() => {
    const parsedUser = JSON.parse(userObject)
    const fetchAddress = async () => {
      try {
        const response: any = await getAddress(parsedUser.userId)
        const billingAddress = response.find(
          (item: any) => item.isDefaultBilling
        )
        const shippingAddress = response.find(
          (item: any) => item.isDefaultDelivery
        )
        if (billingAddress) setDefaultBillingAddress(billingAddress)
        if (shippingAddress) setDefaultShippingAddress(shippingAddress)
      } catch (error) {
        console.log(error, 'err')
      }
    }
    fetchAddress()
  }, [])

  console.log(defaultBillingAddress, 'addrs')
  console.log(defaultShippingAddress)

  if (userObject || isMailSubscribed) {
    return (
      <CheckoutForm
        cart={cart}
        defaultBillingAddress={defaultBillingAddress}
        defaultShippingAddress={defaultShippingAddress}
        user={user}
      />
    )
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
