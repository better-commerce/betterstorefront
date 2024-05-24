import { useCallback, useEffect, useState } from 'react'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import axios from 'axios'
import qs from 'qs'
import { signOut } from 'next-auth/react'

// Component Imports
import { EmptyGuid, NEXT_GET_CUSTOMER_DETAILS, } from '@components/utils/constants'
import { useUI } from '@components/ui'
import { LOGIN_SUCCESSFUL } from '@components/utils/textVariables'
import useWishlist from '@components/services/wishlist'
import cartHandler from '@components/services/cart'
import { removeItem } from '@components/utils/localStorage'
import { LocalStorage } from '@components/utils/payment-constants'


// Other Imports
import { AlertType } from '@framework/utils/enums'
import { saveUserToken } from '@framework/utils/app-util'
import { useLogin } from '@framework/auth'
import { UserAuthType } from '@framework/utils/constants'
import Loader from '@components/Loader'
import Layout from '@components/Layout/Layout'

export default function GhostLoginPage({ user }: any) {
  const router = useRouter()
  const {
    setIsGuestUser,
    user: authenticatedUser,
    setUser,
    wishListItems,
    setCartItems,
    setBasketId,
    setAlert,
    closeSidebar,
    setWishlist,
    cartItems,
    basketId,
    deleteUser,
    setIsGhostUser,
    setOverlayLoaderState,
  } = useUI()
  const { getWishlist } = useWishlist()
  const { getCartByUser } = cartHandler()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    userLoginApi()
  }, [])

  const userLoginApi = useCallback(async () => {
    setIsLoading(true)
    setOverlayLoaderState({
      visible: true,
      message: 'Fetching details...',
    })
    // check if any user is already logged in
    if (authenticatedUser && authenticatedUser?.userId !== EmptyGuid) {
      // remove current user session
      deleteUser({ isSilentLogout: true })
      removeItem(LocalStorage.Key.RECENTLY_VIEWED)
      if (authenticatedUser?.socialData?.socialMediaType) {
        await signOut()
      }
    }

    let userObj = { ...user }

    const { userToken, ...rest } = userObj
    saveUserToken(userToken)
    userObj = { ...rest }

    // fetch updated user details
    const userRes: any = await axios.post(`${NEXT_GET_CUSTOMER_DETAILS}?customerId=${userObj?.userId}`)
    if (userRes?.data) userObj = { ...userRes.data }

    setAlert({ type: AlertType.SUCCESS, msg: LOGIN_SUCCESSFUL })
    closeSidebar()

    // set wishlist items
    const wishlist = await getWishlist(userObj?.userId, wishListItems)
    setWishlist(wishlist)
    getWishlist(userObj?.userId, wishListItems)

    // set cart items
    const cart: any = await getCartByUser({
      userId: userObj?.userId,
      cart: cartItems,
      basketId,
    })
    if (cart && cart?.id !== EmptyGuid) {
      setCartItems(cart)
      setBasketId(cart.id)
      userObj.isAssociated = true
    } else {
      userObj.isAssociated = false
    }
    setUser(userObj)
    setIsGhostUser(true)
    setIsGuestUser(false)

    // redirect to home
    router.push('/')

    setIsLoading(false)
    setOverlayLoaderState({ visible: false })
  }, [user, authenticatedUser])

  if (isLoading) {
    return <Loader />
  }

  return <></>
}

GhostLoginPage.Layout = Layout

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req } = context
  const payload = {
    username: '',
    token: '',
  }

  if (req.method !== 'POST') {
    return notFoundRedirect()
  }

  const getUserPayload: any = new Promise((resolve, reject) => {
    let postBody = ''

    req.on('data', (data) => {
      // convert Buffer to string
      postBody += data.toString()
    })

    req.on('end', () => {
      const postData = qs.parse(postBody)
      resolve(postData)
    })
  })

  try {
    const { username, token } = await getUserPayload
    payload.username = username
    payload.token = token

    // check if required fields exist
    if (!payload?.username || !payload?.token) {
      return notFoundRedirect()
    }

    // authenticate user
    const userSession = await useLogin()({
      email: payload.username,
      password: payload.token,
      authType: UserAuthType.LOGIN_TOKEN,
    })

    if (!userSession?.userId || userSession?.userId === EmptyGuid) {
      return notFoundRedirect()
    }

    return {
      props: {
        user: userSession,
      },
    }
  } catch (error) {
    return notFoundRedirect()
  }
}

export const notFoundRedirect = () => {
  return {
    redirect: {
      permanent: false,
      destination: '/404',
    },
  }
}
