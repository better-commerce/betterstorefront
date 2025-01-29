import { useState } from 'react'
import axios from 'axios'
import Router from 'next/router'

import Form from '@components/customer'
import { EmptyString, NEXT_AUTHENTICATE, NEXT_GET_CUSTOMER_DETAILS, OTP_LOGIN_ENABLED } from '@components/utils/constants'
import { useUI } from '@components/ui/context'
import useWishlist from '@components/services/wishlist'
import cartHandler from '@components/services/cart'
import useAnalytics from '@components/services/analytics/useAnalytics'

import { getEnabledSocialLogins, saveUserToken } from '@framework/utils/app-util'
import { useTranslation } from '@commerce/utils/use-translation'
import LoginOTPComp from '@components/account/login-otp'
import SocialSignInLinks from './SocialSignInLinks'
import { AnalyticsEventType } from '@components/services/analytics'
import { PAGE_TYPES } from '@components/withDataLayer'
import SectionHero3 from '@components/SectionHero/SectionHero3'

interface LoginProps {
  isLoginSidebarOpen?: boolean;
  redirectToOriginUrl?: boolean;
  pluginConfig: any;
  closeSideBar?: any;
}

export default function TradeInLogin({ isLoginSidebarOpen, redirectToOriginUrl = false, pluginConfig = [], closeSideBar = () => { } }: LoginProps) {
  const { recordAnalytics } = useAnalytics()
  const translate = useTranslation()
  const [noAccount, setNoAccount] = useState(false)
  const { isGuestUser, setIsGuestUser, setUser, user, wishListItems, setAlert, setCartItems, setBasketId, setWishlist, cartItems, basketId, } = useUI()
  const { getWishlist } = useWishlist()
  const { getCartByUser, addToCart } = cartHandler()
  const otpEnabled = OTP_LOGIN_ENABLED
  const SOCIAL_LOGINS_ENABLED = getEnabledSocialLogins(pluginConfig)

  let redirectUrl = EmptyString
  if (redirectToOriginUrl) {
    const url = new URL(document.URL)
    redirectUrl = `${url?.origin}${url?.pathname}${url?.search}`
  }
  recordAnalytics(AnalyticsEventType.PAGE_VIEWED, { entityName: PAGE_TYPES.Login, })

  const handleUserLogin = (values: any, cb?: any) => {
    const asyncLoginUser = async () => {
      const result: any = await axios.post(NEXT_AUTHENTICATE, { data: values })
      if (!result.data) {
        setNoAccount(true)
        setAlert({ type: 'error', msg: translate('common.message.invalidAccountMsg') })
      } else if (result.data) {
        setNoAccount(false)
        closeSideBar()
        setAlert({ type: 'success', msg: translate('common.message.loginSuccessMsg') })
        let userObj = { ...result.data }
        if (userObj?.userToken) saveUserToken(userObj?.userToken)
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
    <section aria-labelledby="trending-heading" className="bg-gray-50">
      <div className="px-10 pt-10 pb-10 text-left lg:max-w-7xl lg:mx-auto sm:pt-6 sm:pb-6">
        <div className="flex flex-col px-4 mb-4 sm:px-6 lg:px-0 sm:mb-6">
          <h3 className="text-xl font-medium text-left text-black">
            {translate('label.login.loginBtnText')}
          </h3>
          <p className='text-sm font-normal text-left text-gray-600'>Already got a Park Cameras account? Log in below.</p>
        </div>
        <div className='grid grid-cols-12 gap-10'>
          <div className='col-span-6'>
            <div className="w-full">
              <div className="grid gap-3">
                {SOCIAL_LOGINS_ENABLED && (
                  <div className='social-login-section'>
                    <SocialSignInLinks isLoginSidebarOpen={isLoginSidebarOpen} containerCss={`flex justify-center gap-2 mx-auto ${isLoginSidebarOpen ? 'sm:w-full width-md-full !px-0' : 'width-md-full'}`} redirectUrl={redirectUrl} pluginSettings={pluginConfig} />
                  </div>
                )}
              </div>
              {SOCIAL_LOGINS_ENABLED &&
                <div className="relative text-center">
                  <span className="relative z-10 inline-block px-4 text-sm font-medium bg-white dark:text-neutral-400 dark:bg-neutral-900">
                    OR
                  </span>
                  <div className="absolute left-0 w-full transform -translate-y-1/2 border top-1/2 border-neutral-100 dark:border-neutral-800"></div>
                </div>
              }
              <Form btnText={translate('label.login.loginBtnText')} type="login" onSubmit={handleUserLogin} apiError={noAccount ? translate('common.message.invalidAccountMsg') : ''} isLoginSidebarOpen={isLoginSidebarOpen} />
              <div className={`flex flex-col items-start text-left justify-start w-full mt-0 mx-auto ${isLoginSidebarOpen ? 'sm:w-full ' : 'sm:w-full'}`} >
                <a href="/my-account/forgot-password" target='_blank'>
                  <span className="block text-sm font-medium underline cursor-pointer text-sky-600 hover:text-sky-800 hover:underline">
                    {translate('label.login.forgotPasswordBtnText')}
                  </span>
                </a>
              </div>
              <span className="block text-sm text-left text-neutral-700 dark:text-neutral-700">
                {translate('label.login.newUserText')}{` `}
                <a className="underline text-sky-600" href="/my-account/register" target='_blank'>
                  {translate('label.login.createAccountText')}
                </a>
              </span>
            </div>
          </div>
          <div className='col-span-6'>
            <h3 className="text-xl font-medium text-left text-black">Login to get the following benefits:</h3>
            <ul className='pl-0 text-sm list-disc list-inside'>
              <li>Quick and easy trade-in from start to finish</li>
              <li>Track your quote through its journey</li>
              <li>Loyalty points on your account</li>
              <li>Speedier payments</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
