import axios from 'axios'
import { useEffect, useState } from 'react'
import Router from 'next/router'

import { useUI } from '@components/ui/context'
import { Layout } from '@components/common'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import {
  NEXT_AUTHENTICATE,
  OTP_LOGIN_ENABLED,
} from '@components/utils/constants'
import useWishlist from '@components/services/wishlist'
import cartHandler from '@components/services/cart'
import useAnalytics from '@components/services/analytics/useAnalytics'
import { EVENTS_MAP } from '@components/services/analytics/constants'
import {
  GENERAL_LOGIN,
  VALIDATION_NO_ACCOUNT_FOUND_VIA_OTP,
  VALIDATION_YOU_ARE_ALREADY_LOGGED_IN,
} from '@components/utils/textVariables'
import LoginOTPForm from '@components/customer/login-otp-form'

function LoginOTPPage() {
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

  useEffect(() => {
    if (!otpEnabled) {
      Router.push('404')
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!isGuestUser && user.userId) {
    return (
      <div className="font-extrabold text-center w-full h-full text-gray-900">
        {VALIDATION_YOU_ARE_ALREADY_LOGGED_IN}
      </div>
    )
  }

  const handleUserLogin = (
    values: {
      username: string
      password: string
      isOTPBasedAuthentication: boolean
    },
    cb?: any
  ) => {
    const asyncLoginUser = async () => {
      try {
        const result: any = await axios.post(NEXT_AUTHENTICATE, {
          data: values,
        })

        if (cb) cb()

        // no account was found provided details
        if (!result.data) {
          setNoAccount(true)
          setTimeout(() => {
            setNoAccount(false)
          }, 5000)
          return
        }

        setNoAccount(false)
        const userObj = { ...result.data }

        // fetch wishlist items
        const wishlist = await getWishlist(result.data.userId, wishListItems)
        setWishlist(wishlist)
        getWishlist(result.data.userId, wishListItems)

        // fetch cart items
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

        // update user
        setUser(userObj)
        setIsGuestUser(false)

        // redirect to home
        Router.push('/')
      } catch (error) {
        // console.log(error)
        if (cb) cb()
      }
    }
    asyncLoginUser()
  }
  if (!otpEnabled) {
    return null
  }
  return (
    <section aria-labelledby="trending-heading" className="bg-white h-full">
      <div className="py-16 sm:py-24 lg:max-w-7xl lg:mx-auto lg:py-32 lg:px-8">
        <div className="px-4 flex flex-col items-center justify-center sm:px-6 lg:px-0">
          <h1 className="text-6xl font-extrabold text-center tracking-tight text-gray-900">
            {GENERAL_LOGIN} via OTP
          </h1>
        </div>
        <LoginOTPForm handleUserLogin={handleUserLogin} />
        <div className="w-full flex flex-col justify-center items-center">
          {noAccount && (
            <span className="text-red-700 text-lg">
              {VALIDATION_NO_ACCOUNT_FOUND_VIA_OTP}
            </span>
          )}
        </div>
      </div>
    </section>
  )
}

LoginOTPPage.Layout = Layout

const PAGE_TYPE = PAGE_TYPES.Page
export default withDataLayer(LoginOTPPage, PAGE_TYPE)
