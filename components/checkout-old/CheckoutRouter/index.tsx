import { useState } from 'react'
import { useUI } from '@components/ui/context'
import Router from 'next/router'
import useWishlist from '@components/services/wishlist'
import {
  NEXT_GET_CUSTOMER_DETAILS,
  NEXT_LOGIN_CHECKOUT,
} from '@components/utils/constants'
import axios from 'axios'
import Form from '@components/customer'
import GuestForm from './GuestForm'
import Link from 'next/link'
import { useTranslation } from '@commerce/utils/use-translation'
const config = [
  {
    title: "Log in",
    key: 'logIn',
  },
  {
    title: "Guest Checkout",
    key: 'guestCheckout',
  },
]

const DEFAULT_TAB = {
  title: "Log in",
  key: 'logIn',
}

export default function CheckoutRouter({
  handleGuestMail,
  setIsLoggedIn,
  fetchAddress,
}: any) {
  const translate = useTranslation()
  const [noAccount, setNoAccount] = useState(false)
  const [activeTab, setActiveTab] = useState(DEFAULT_TAB)
  const { setUser, setIsGuestUser, wishlistItems, basketId, setCartItems } =
    useUI()
  const { getWishlist } = useWishlist()

  const handleUserLogin = (values: any) => {
    const asyncLoginUser = async () => {
      const result: any = await axios.post(NEXT_LOGIN_CHECKOUT, {
        basketId: basketId,
        ...values,
      })
      if (!result.data) {
        setNoAccount(true)
      } else if (result.data) {
        setNoAccount(false)
        setCartItems(result.data)
        setIsLoggedIn(true)
        setIsGuestUser(false)
        let userObj = {
          userId: result?.data?.userId,
          email: result?.data?.userEmail,
        }
        // get user updated details
        const updatedUserObj = await axios.post(
          `${NEXT_GET_CUSTOMER_DETAILS}?customerId=${userObj?.userId}`
        )
        if (updatedUserObj?.data) {
          userObj = { ...userObj, ...updatedUserObj?.data }
        }
        setUser(userObj)
        fetchAddress(userObj?.userId)
        // getWishlist(result.data.userId, wishlistItems)
        Router.push('/checkout')
      }
    }
    asyncLoginUser()
  }

  const handleGuestCheckout = (values: any) => handleGuestMail(values)

  const handleTabChange = (key: string) => {
    const item: any = config.find((item: any) => item.key === key)
    if (item.key !== activeTab.key) {
      setActiveTab(item)
    }
  }

  return (
    <section aria-labelledby="trending-heading" className="bg-white">
      <div className="py-16 sm:py-24 lg:max-w-7xl lg:mx-auto lg:py-32 lg:px-8">
        <div className="px-4 flex flex-col items-center justify-center sm:px-6 lg:px-0">
          <h1 className="sm:text-6xl text-3xl uppercase font-bold text-center tracking-tight text-gray-900">
            {translate('label.checkout.checkoutSecurelyText')}
          </h1>
        </div>
        <div className="flex justify-center items-center pt-10">
          {config.map((item: any, idx: number) => {
            return (
              <div
                key={idx}
                onClick={() => handleTabChange(item.key)}
                className={`cursor-pointer py-2 font-semibold text-gray-900 sm:w-1/3 w-2/3 sm:px-12 px-6 text-center border-b-2 ${
                  activeTab.key === item.key
                    ? 'border-gray-900'
                    : 'border-gray-300'
                }`}
              >
                {item.title}
              </div>
            )
          })}
        </div>
        {activeTab.key === 'logIn' && (
          <div className="flex justify-center items-center flex-col sm:pl-10 sm:pr-10">
            <Form btnText={translate('label.login.loginBtnText')} type="login" onSubmit={handleUserLogin} />
            <div>
              <Link href="/my-account/register">
                <span className="text-gray-600 underline cursor-pointer">
                  {translate('label.checkout.newCustomerText')}
                </span>
              </Link>
            </div>
          </div>
        )}
        {activeTab.key === 'guestCheckout' && (
          <GuestForm onSubmit={handleGuestCheckout} />
        )}
        <div className="w-full flex flex-col justify-center items-center">
          {noAccount && activeTab.key === 'logIn' && (
            <span className="text-red-700 text-lg">
              {translate('message.invalidAccountMsg')}
            </span>
          )}
        </div>
      </div>
    </section>
  )
}
