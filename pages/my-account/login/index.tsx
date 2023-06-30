import { Layout } from '@components/common'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import Form from '@components/customer'
import {
  NEXT_AUTHENTICATE,
  NEXT_GET_CUSTOMER_DETAILS,
  OTP_LOGIN_ENABLED,
} from '@components/utils/constants'
import axios from 'axios'
import { useState } from 'react'
import { useUI } from '@components/ui/context'
import Router from 'next/router'
import useWishlist from '@components/services/wishlist'
import cartHandler from '@components/services/cart'
import useAnalytics from '@components/services/analytics/useAnalytics'
import { EVENTS_MAP } from '@components/services/analytics/constants'
import {
  GENERAL_LOGIN,
  VALIDATION_NO_ACCOUNT_FOUND,
  VALIDATION_YOU_ARE_ALREADY_LOGGED_IN,
} from '@components/utils/textVariables'
import Link from 'next/link'
import LoginOtp from '../../../components/account/login-otp'
import SocialSignInLinks from '@components/account/SocialSignInLinks'

function LoginPage({ recordEvent, setEntities }: any) {
  const [noAccount, setNoAccount] = useState(false)
  const {
    isGuestUser,
    setIsGuestUser,
    setUser,
    user,
    wishListItems,
    setCartItems,
    setBasketId,
    setWishlist,
    cartItems,
    basketId,
  } = useUI()
  const { getWishlist } = useWishlist()
  const { getCartByUser, addToCart } = cartHandler()
  const { PageViewed } = EVENTS_MAP.EVENT_TYPES
  const otpEnabled = OTP_LOGIN_ENABLED
  useAnalytics(PageViewed, {
    eventType: PageViewed,
  })

  if (!isGuestUser && user.userId) {
    Router.push('/')
  }

  if (!isGuestUser && user.userId) {
    return (
      <div className="w-full h-full font-extrabold text-center text-gray-900">
        {VALIDATION_YOU_ARE_ALREADY_LOGGED_IN}
      </div>
    )
  }

  const handleUserLogin = (values: any) => {
    const asyncLoginUser = async () => {
      const result: any = await axios.post(NEXT_AUTHENTICATE, { data: values })
      if (!result.data) {
        setNoAccount(true)
      } else if (result.data) {
        setNoAccount(false)
        let userObj = { ...result.data }

        // get user updated details
        const updatedUserObj = await axios.post(
          `${NEXT_GET_CUSTOMER_DETAILS}?customerId=${userObj?.userId}`
        )
        if (updatedUserObj?.data) userObj = { ...updatedUserObj?.data }

        const wishlist = await getWishlist(result.data.userId, wishListItems)
        setWishlist(wishlist)
        getWishlist(result.data.userId, wishListItems)
        const cart: any = await getCartByUser({
          userId: result.data.userId,
          cart: cartItems,
          basketId,
        })
        if (cart && cart.id) {
          setCartItems(cart)
          setBasketId(cart.id)
          userObj.isAssociated = true
        } else {
          userObj.isAssociated = false
        }
        setUser(userObj)
        setIsGuestUser(false)
        Router.push('/')
      }
    }
    asyncLoginUser()
  }
  if (otpEnabled) {
    return <LoginOtp />
  }
  return (
    <section aria-labelledby="trending-heading" className="bg-white">
      <div className="py-16 sm:py-24 lg:max-w-7xl lg:mx-auto lg:py-32 lg:px-8">
        <div className="flex flex-col items-center justify-center px-4 sm:px-6 lg:px-0">
          <h1 className="font-extrabold tracking-tight text-center text-gray-900">
            {GENERAL_LOGIN}
          </h1>
        </div>
        <Form
          btnText="Login"
          type="login"
          onSubmit={handleUserLogin}
          apiError={noAccount ? VALIDATION_NO_ACCOUNT_FOUND : ''}
        />
        <div className="flex flex-col items-center justify-center w-full">
          {noAccount && (
            <span className="text-lg text-red-700">
              {VALIDATION_NO_ACCOUNT_FOUND}
            </span>
          )}
        </div>
        <SocialSignInLinks containerCss="flex justify-center gap-2 px-3 mx-auto sm:w-1/2" />
        <div className="flex flex-col items-end justify-end w-full px-3 mx-auto mt-4 sm:w-1/2">
          <Link href="/my-account/forgot-password" passHref>
            <span className="block font-medium text-indigo-600 underline cursor-pointer hover:text-indigo-800 hover:underline">
              Forgot password?
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}

LoginPage.Layout = Layout

const PAGE_TYPE = PAGE_TYPES.Page
export default withDataLayer(LoginPage, PAGE_TYPE)
