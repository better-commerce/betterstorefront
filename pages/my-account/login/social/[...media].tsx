// Base Imports
import React, { useEffect, useState } from 'react'

// Package Imports
import axios from 'axios'
import Router from 'next/router'
import { GetServerSideProps } from 'next'
import { useSession, signIn } from 'next-auth/react'

// Component Imports
import Spinner from '@components/ui/Spinner'

// Other Imports
import { useUI } from '@components/ui'
import { parseFullName } from '@framework/utils/app-util'
import cartHandler from '@components/services/cart'
import useWishlist from '@components/services/wishlist'
import {
  NEXT_GET_CUSTOMER_DETAILS,
  NEXT_SSO_AUTHENTICATE,
  SocialMediaType,
} from '@components/utils/constants'

interface ISocialLoginPageProps {
  readonly medium: SocialMediaType
}

const SocialLoginPage = (props: ISocialLoginPageProps) => {
  const { medium } = props
  const { data: userData, status } = useSession()
  const { getWishlist } = useWishlist()
  const { getCartByUser, addToCart } = cartHandler()
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

  useEffect(() => {
    const asyncLoginHandler = async (media: string) => {
      switch (media) {
        case SocialMediaType.GOOGLE:
          const googleSocialLoginResult = await signIn('google')
          break

        case SocialMediaType.FACEBOOK:
          const facebookSocialLoginResult = await signIn('facebook')
          break

        case SocialMediaType.APPLE:
          const appleSocialLoginResult = await signIn('apple')
          break
      }
    }

    const asyncAuthHandler = async (medium: string, userData: any) => {
      let data: any = {
        socialMediaType: medium,
        mobile: null,
      }

      switch (medium) {
        case SocialMediaType.GOOGLE:
        case SocialMediaType.FACEBOOK:
        case SocialMediaType.APPLE:
          const fullName = parseFullName(userData?.user?.name)
          data = {
            ...data,
            username: userData?.user?.email,
            firstName: fullName?.firstName,
            lastName: fullName?.lastName,
          }
          break
      }
      const result: any = await axios.post(NEXT_SSO_AUTHENTICATE, { data })

      if (result.data) {
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
        setUser({
          ...userObj,
          socialData: { ...data, expires: userData?.expires },
        })
        setIsGuestUser(false)
        Router.push('/')
      } else {
        setNoAccount(true)
      }
    }
    if (status === 'loading') {
    } else if (status === 'authenticated') {
      asyncAuthHandler(medium, userData)
    } else {
      asyncLoginHandler(medium)
    }
  }, [status])

  return (
    <>
      <Spinner />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const params: any = context?.query
  const media = params?.media?.length ? params?.media[0] : ''
  return {
    props: {
      medium: media, // Generic
    }, // will be passed to the page component as props
  }
}

export default SocialLoginPage
