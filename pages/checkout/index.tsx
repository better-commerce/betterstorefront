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
import { NEXT_GUEST_CHECKOUT } from '@components/utils/constants'
import axios from 'axios'

function Checkout({ cart }: any) {
  const { user, basketId, setCartItems, cartItems } = useUI()

  const [isMailSubscribed, setMailSubscirbed] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(!!cartItems.userEmail)
  const [defaultShippingAddress, setDefaultShippingAddress] = useState({})
  const [defaultBillingAddress, setDefaultBillingAddress] = useState({})
  const [userAddresses, setUserAddresses] = useState([])
  const handleGuestMail = (values: any) => {
    const handleAsync = async () => {
      const response = await axios.post(NEXT_GUEST_CHECKOUT, {
        basketId: basketId,
        ...values,
      })
      setCartItems(response.data)
      setMailSubscirbed(true)
    }
    handleAsync()
  }
  const { getAddress } = asyncHandler()

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response: any = await getAddress(cartItems.userId)
        const billingAddress = response.find(
          (item: any) => item.isDefaultBilling
        )
        const shippingAddress = response.find(
          (item: any) => item.isDefaultDelivery
        )
        setUserAddresses(response)
        if (billingAddress) setDefaultBillingAddress(billingAddress)
        if (shippingAddress) setDefaultShippingAddress(shippingAddress)
      } catch (error) {
        console.log(error, 'err')
      }
    }
    fetchAddress()
  }, [])

  if (isLoggedIn) {
    return (
      <CheckoutForm
        cart={cart}
        addresses={userAddresses}
        defaultBillingAddress={defaultBillingAddress}
        defaultShippingAddress={defaultShippingAddress}
        user={user}
      />
    )
  }
  return (
    <CheckoutRouter
      setIsLoggedIn={setIsLoggedIn}
      handleGuestMail={handleGuestMail}
    />
  )
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

export default withDataLayer(Checkout, PAGE_TYPE, false)
