import { Layout } from '@components/common'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import Form from '@components/customer'
import { NEXT_AUTHENTICATE } from '@components/utils/constants'
import axios from 'axios'
import { useState } from 'react'
import { useUI } from '@components/ui/context'
import Router from 'next/router'
import useWishlist from '@components/services/wishlist'
import cartHandler from '@components/services/cart'
function LoginPage({ recordEvent, setEntities }: any) {
  const [noAccount, setNoAccount] = useState(false)
  const {
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
  if (user.userId) {
    Router.push('/')
  }
  if (user.userId) {
    return (
      <div className="font-extrabold text-center w-full h-full text-gray-900">
        You're already logged in
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
        const userObj = { ...result.data }
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
        Router.push('/')
      }
    }
    asyncLoginUser()
  }
  return (
    <section aria-labelledby="trending-heading" className="bg-white">
      <div className="py-16 sm:py-24 lg:max-w-7xl lg:mx-auto lg:py-32 lg:px-8">
        <div className="px-4 flex flex-col items-center justify-center sm:px-6 lg:px-0">
          <h2 className="text-6xl font-extrabold text-center tracking-tight text-gray-900">
            Login
          </h2>
        </div>
        <Form btnText="Login" type="login" onSubmit={handleUserLogin} />
        <div className="w-full flex flex-col justify-center items-center">
          {noAccount && (
            <span className="text-red-700 text-lg">
              No account has been found with this email/password
            </span>
          )}
        </div>
      </div>
    </section>
  )
}

LoginPage.Layout = Layout

const PAGE_TYPE = PAGE_TYPES.Page
export default withDataLayer(LoginPage, PAGE_TYPE)
