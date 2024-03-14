import { useState } from 'react'
import axios from 'axios'
import Router from 'next/router'
import Link from 'next/link'

import Form from '@components/customer'
import { EmptyString, NEXT_AUTHENTICATE, NEXT_GET_CUSTOMER_DETAILS, OTP_LOGIN_ENABLED } from '@components/utils/constants'
import { useUI } from '@components/ui/context'
import useWishlist from '@components/services/wishlist'
import cartHandler from '@components/services/cart'
import useAnalytics from '@components/services/analytics/useAnalytics'
import { EVENTS_MAP } from '@components/services/analytics/constants'
import { GENERAL_LOGIN, INVALID_ACCOUNT, LOGIN_SUCCESSFUL, VALIDATION_YOU_ARE_ALREADY_LOGGED_IN } from '@components/utils/textVariables'
import LoginOtp from '@components/account/login-otp'
import SocialSignInLinks from '@components/account/SocialSignInLinks'
import { getEnabledSocialLogins, saveUserToken } from '@framework/utils/app-util'

interface LoginProps {
  isLoginSidebarOpen?: boolean;
  redirectToOriginUrl?: boolean;
  pluginConfig: any; 
}

export default function Login({ isLoginSidebarOpen, redirectToOriginUrl = false, pluginConfig = [],  }: LoginProps) {
  const [noAccount, setNoAccount] = useState(false)
  const {
    isGuestUser,
    setIsGuestUser,
    setUser,
    user,
    wishListItems,
    setAlert,
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
  const SOCIAL_LOGINS_ENABLED = getEnabledSocialLogins(pluginConfig)

  let redirectUrl = EmptyString
  if (redirectToOriginUrl) {
    const url = new URL(document.URL)
    redirectUrl = `${url?.origin}${url?.pathname}${url?.search}`
  }
  useAnalytics(PageViewed, {
    eventType: PageViewed,
  })

  const handleUserLogin = (values: any, cb?: any) => {
    const asyncLoginUser = async () => {
      const result: any = await axios.post(NEXT_AUTHENTICATE, { data: values })
      if (!result.data) {
        setNoAccount(true)
        setAlert({type:'error',msg:INVALID_ACCOUNT})
      } else if (result.data) {
        setNoAccount(false)
        setAlert({type:'success',msg: LOGIN_SUCCESSFUL})
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
      if (cb) cb();
    }
    asyncLoginUser()
  }

  if (!isGuestUser && user.userId) {
    return (
      <div className="w-full h-full font-extrabold text-center text-gray-900">
        {VALIDATION_YOU_ARE_ALREADY_LOGGED_IN}
      </div>
    )
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
          apiError={noAccount ? INVALID_ACCOUNT : ''}
          isLoginSidebarOpen={isLoginSidebarOpen}
        />
        {/* <div className="flex flex-col items-center justify-center w-full">
          {noAccount && (
            setAlert({type:'success',msg:INVALID_ACCOUNT})
            <span className="text-lg text-red-700">
              {INVALID_ACCOUNT}
            </span>
          )}
        </div> */}
       {
          SOCIAL_LOGINS_ENABLED && (
            <div className='social-login-section'>
              <SocialSignInLinks
                isLoginSidebarOpen={isLoginSidebarOpen}
                containerCss={`flex justify-center gap-2 mx-auto ${isLoginSidebarOpen
                  ? 'sm:w-full width-md-full !px-0'
                  : 'width-md-full sm:w-1/2'
                  }`}
                redirectUrl={redirectUrl}
                pluginSettings={pluginConfig}
              />
            </div>
          )
        }
        <div
          className={`flex flex-col items-end justify-end w-full mx-auto mt-4 ${
            isLoginSidebarOpen ? 'sm:w-full ' : 'sm:w-1/2'
          }`}
        >
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
