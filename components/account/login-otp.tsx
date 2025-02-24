import axios from 'axios'
import { useEffect, useState } from 'react'
import Router from 'next/router'

import { useUI } from '@components/ui/context'
import {
  NEXT_AUTHENTICATE,
  OTP_LOGIN_ENABLED,
} from '@components/utils/constants'
import useWishlist from '@components/services/wishlist'
import cartHandler from '@components/services/cart'
import useAnalytics from '@components/services/analytics/useAnalytics'
import LoginOTPForm from '@components/customer/login-otp-form'
import { useTranslation } from '@commerce/utils/use-translation'
import { AnalyticsEventType } from '@components/services/analytics'
import { PAGE_TYPES } from '@components/withDataLayer'

function LoginOTPComp() {
  const { recordAnalytics } = useAnalytics()
  const translate = useTranslation()
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
  const otpEnabled = OTP_LOGIN_ENABLED
  recordAnalytics(AnalyticsEventType.PAGE_VIEWED, { entityName: PAGE_TYPES.Login, })

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
      <div className="w-full h-full font-extrabold text-center text-gray-900">
        {translate('common.message.alreadyLoggedInMsg')}
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
    <section aria-labelledby="trending-heading" className="h-full bg-white">
      <div className="py-16 sm:py-24 lg:max-w-7xl lg:mx-auto lg:py-32 lg:px-8">
        <div className="flex flex-col items-center justify-center px-4 sm:px-6 lg:px-0">
          <h1 className="text-6xl font-extrabold tracking-tight text-center text-gray-900">
            {translate('label.login.loginBtnText')} via OTP
          </h1>
        </div>
        <LoginOTPForm handleUserLogin={handleUserLogin} />
        <div className="flex flex-col items-center justify-center w-full">
          {noAccount && (
            <span className="text-lg text-red-700">
              {translate('label.login.noMobileAccountFoundText')}
            </span>
          )}
        </div>
      </div>
    </section>
  )
}

export default LoginOTPComp
