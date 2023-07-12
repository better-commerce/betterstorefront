import { Layout } from '@components/common'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import Form from '@components/customer'
import {
  NEXT_AUTHENTICATE,
  NEXT_GET_CUSTOMER_DETAILS,
  OTP_LOGIN_ENABLED,
} from '@components/utils/constants'
import axios from 'axios'
import { useUI } from '@components/ui/context'
import { FC } from 'react'
import { useEffect, Fragment, useState } from 'react'
import Router from 'next/router'
import useWishlist from '@components/services/wishlist'
import cartHandler from '@components/services/cart'
import useAnalytics from '@components/services/analytics/useAnalytics'
import { EVENTS_MAP } from '@components/services/analytics/constants'
import {
  GENERAL_LOGIN,
  VALIDATION_NO_ACCOUNT_FOUND,
  VALIDATION_YOU_ARE_ALREADY_LOGGED_IN,
  CLOSE_PANEL,
} from '@components/utils/textVariables'
import Link from 'next/link'
import LoginOtp from '@components/account/login-otp'
import SocialSignInLinks from '@components/account/SocialSignInLinks'
import { GetServerSideProps } from 'next'
import { XMarkIcon } from '@heroicons/react/24/outline'
import LoginPage from '../../../pages/my-account/login'
import  LoginView  from './LoginView'

const LoginSidebar: FC<React.PropsWithChildren<unknown>> = () => {
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
    closeSidebar,
    displaySidebar,
    basketId,
  } = useUI()
  const { getWishlist } = useWishlist()
  const { getCartByUser, addToCart } = cartHandler()
  const [openSidebar, setOpenSidebar] = useState(false)
  const { PageViewed } = EVENTS_MAP.EVENT_TYPES
  const otpEnabled = OTP_LOGIN_ENABLED
  useAnalytics(PageViewed, {
    eventType: PageViewed,
  })

  useEffect(() => {
    // set to 'true'
    setOpenSidebar(displaySidebar)
  }, [displaySidebar])

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
        handleClose(false)
      }
    }
    asyncLoginUser()
  }

  function handleClose(value: any) {
    closeSidebar()
    setOpenSidebar(false)
    return
  }

  if (otpEnabled) {
    return <LoginOtp />
  }

  return (
    <section aria-labelledby="trending-heading" className="bg-white h-screen overflow-y-auto">
        <div className="flex pt-5 justify-end pr-14 sm:pr-18 lg:pr-8">
            <button
              type="button"
              className="text-gray-400 transition hover:text-gray-500"
              onClick={handleClose}
            >
              <span className="sr-only">{CLOSE_PANEL}</span>
              <XMarkIcon className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
      <LoginView />
    </section>
  )
}

export default LoginSidebar
