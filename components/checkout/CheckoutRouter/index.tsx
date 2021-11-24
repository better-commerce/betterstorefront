import { useState } from 'react'
import { useUI } from '@components/ui/context'
import Router from 'next/router'
import useWishlist from '@components/services/wishlist'
import { NEXT_AUTHENTICATE } from '@components/utils/constants'
import axios from 'axios'
import Form from '@components/customer'
import GuestForm from './GuestForm'
import Link from 'next/link'
const config = [
  {
    title: 'Log in',
    key: 'logIn',
  },
  {
    title: 'Guest Checkout',
    key: 'guestCheckout',
  },
]

const DEFAULT_TAB = {
  title: 'Log in',
  key: 'logIn',
}

export default function CheckoutRouter({ handleGuestMail }: any) {
  const [noAccount, setNoAccount] = useState(false)
  const [activeTab, setActiveTab] = useState(DEFAULT_TAB)
  const { setUser, wishlistItems } = useUI()
  const { getWishlist } = useWishlist()

  const handleUserLogin = (values: any) => {
    const asyncLoginUser = async () => {
      const result: any = await axios.post(NEXT_AUTHENTICATE, { data: values })
      if (!result.data) {
        setNoAccount(true)
      } else if (result.data) {
        setNoAccount(false)
        setUser(result.data)
        getWishlist(result.data.userId, wishlistItems)
        Router.push('/checkout')
      }
    }
    asyncLoginUser()
  }

  const handleGuestCheckout = (values: any) => handleGuestMail()

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
          <h2 className="text-6xl font-extrabold text-center tracking-tight text-gray-900">
            Secure checkout
          </h2>
        </div>
        <div className="flex justify-center items-center pt-10">
          {config.map((item: any, idx: number) => {
            return (
              <div
                key={idx}
                onClick={() => handleTabChange(item.key)}
                className={`cursor-pointer py-2 font-semibold text-gray-900 w-1/4 text-center border-b-2 ${
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
          <div className="flex justify-center items-center flex-col">
            <Form btnText="Login" type="login" onSubmit={handleUserLogin} />
            <div>
              <Link href="/my-account/register">
                <span className="text-gray-600 underline cursor-pointer">
                  New customer?
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
              No account has been found with this email/password
            </span>
          )}
        </div>
      </div>
    </section>
  )
}
