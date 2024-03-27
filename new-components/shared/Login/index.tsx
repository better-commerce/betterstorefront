import { useState } from 'react'
import axios from 'axios'
import Router from 'next/router'
import Link from 'next/link'

import Form from '@new-components/customer'
import { EmptyString, NEXT_AUTHENTICATE, NEXT_GET_CUSTOMER_DETAILS, OTP_LOGIN_ENABLED } from '@new-components/utils/constants'
import { useUI } from '@new-components/ui/context'
import useWishlist from '@new-components/services/wishlist'
import cartHandler from '@new-components/services/cart'
import useAnalytics from '@new-components/services/analytics/useAnalytics'
import { EVENTS_MAP } from '@new-components/services/analytics/constants'

import { getEnabledSocialLogins, saveUserToken } from '@framework/utils/app-util'
import { useTranslation } from '@commerce/utils/use-translation'
import LoginOTPComp from '@new-components/account/login-otp'
import SocialSignInLinks from './SocialSignInLinks'
interface LoginProps {
  isLoginSidebarOpen?: boolean;
  redirectToOriginUrl?: boolean;
  pluginConfig: any;
}

export default function Login({ isLoginSidebarOpen, redirectToOriginUrl = false, pluginConfig = [], }: LoginProps) {
  const translate = useTranslation()
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
        setAlert({ type: 'error', msg: translate('common.message.invalidAccountMsg') })
      } else if (result.data) {
        setNoAccount(false)
        setAlert({ type: 'success', msg: translate('common.message.loginSuccessMsg') })
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
        {translate('common.message.alreadyLoggedInMsg')}
      </div>
    )
  }

  if (otpEnabled) {
    return <LoginOTPComp />
  }

  return (
    <section aria-labelledby="trending-heading" className="bg-white">
      <div className="px-10 pt-10 pb-10 lg:max-w-7xl lg:mx-auto sm:pt-4 sm:pb-20">
        <div className="flex flex-col items-center justify-center px-4 sm:px-6 lg:px-0">
          <h1 className="my-20 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
            {translate('label.login.loginBtnText')}
          </h1>
        </div>
        <div className="max-w-md mx-auto space-y-6">
          <div className="grid gap-3">
            {SOCIAL_LOGINS_ENABLED && (
              <div className='social-login-section'>
                <SocialSignInLinks isLoginSidebarOpen={isLoginSidebarOpen} containerCss={`flex justify-center gap-2 mx-auto ${isLoginSidebarOpen ? 'sm:w-full width-md-full !px-0' : 'width-md-full'}`} redirectUrl={redirectUrl} pluginSettings={pluginConfig} />
              </div>
            )}
          </div>
          <div className="relative text-center">
            <span className="relative z-10 inline-block px-4 text-sm font-medium bg-white dark:text-neutral-400 dark:bg-neutral-900">
              OR
            </span>
            <div className="absolute left-0 w-full transform -translate-y-1/2 border top-1/2 border-neutral-100 dark:border-neutral-800"></div>
          </div>
          <Form btnText="Login" type="login" onSubmit={handleUserLogin} apiError={noAccount ? translate('common.message.invalidAccountMsg') : ''} isLoginSidebarOpen={isLoginSidebarOpen} />
          <div className={`flex flex-col items-center justify-center w-full mt-0 mx-auto ${isLoginSidebarOpen ? 'sm:w-full ' : 'sm:w-full'}`} >
            <Link href="/my-account/forgot-password" passHref>
              <span className="block font-medium text-green-600 underline cursor-pointer hover:text-green-800 hover:underline">
                {translate('label.login.forgotPasswordBtnText')}
              </span>
            </Link>
          </div>
          <span className="block text-center text-neutral-700 dark:text-neutral-300">
            {translate('label.login.newUserText')}{` `}
            <Link className="text-green-600" href="/my-account/register">
              {translate('label.login.createAccountText')}
            </Link>
          </span>
        </div>
      </div>
    </section>
  )
}
