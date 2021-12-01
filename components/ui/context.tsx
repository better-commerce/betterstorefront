import React, { FC, useCallback, useMemo } from 'react'
import { ThemeProvider } from 'next-themes'
import { setItem, getItem, removeItem } from '@components/utils/localStorage'
import { uuid } from 'uuidv4'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'

export const basketId = () => {
  if (Cookies.get('basketId')) {
    return Cookies.get('basketId') || ''
  }
  const basketId = uuid()
  Cookies.set('basketId', basketId)
  return basketId
}
export interface State {
  displaySidebar: boolean
  displayDropdown: boolean
  displayModal: boolean
  sidebarView: string
  modalView: string
  userAvatar: string
  productId: string
  notifyUser: boolean
  wishListItems: any
  cartItems: any
  basketId: string
  user: any
}

const initialState = {
  displaySidebar: false,
  displayDropdown: false,
  displayModal: false,
  modalView: 'LOGIN_VIEW',
  sidebarView: 'CART_VIEW',
  userAvatar: '',
  productId: '',
  notifyUser: false,
  wishListItems: getItem('wishListItems') || [],
  cartItems: getItem('cartItems') || { lineItems: [] },
  basketId: basketId(),
  user: getItem('user') || {},
}

type Action =
  | {
      type: 'OPEN_SIDEBAR'
    }
  | {
      type: 'CLOSE_SIDEBAR'
    }
  | {
      type: 'OPEN_DROPDOWN'
    }
  | {
      type: 'CLOSE_DROPDOWN'
    }
  | {
      type: 'OPEN_MODAL'
    }
  | {
      type: 'OPEN_NOTIFY_USER_POPUP'
      payload: string
    }
  | {
      type: 'CLOSE_NOTIFY_USER_POPUP'
    }
  | {
      type: 'CLOSE_MODAL'
    }
  | {
      type: 'SET_MODAL_VIEW'
      view: MODAL_VIEWS
    }
  | {
      type: 'SET_SIDEBAR_VIEW'
      view: SIDEBAR_VIEWS
    }
  | {
      type: 'SET_USER_AVATAR'
      value: string
    }
  | {
      type: 'ADD_TO_WISHLIST'
      payload: any
    }
  | {
      type: 'ADD_TO_CART'
      payload: any
    }
  | {
      type: 'REMOVE_FROM_CART'
      payload: any
    }
  | { type: 'SET_CART_ITEMS'; payload: any }
  | {
      type: 'SET_USER'
      payload: any
    }
  | { type: 'REMOVE_USER'; payload: any }
  | { type: 'SET_WISHLIST'; payload: any }
  | { type: 'SET_BASKET_ID'; payload: string }

type MODAL_VIEWS =
  | 'SIGNUP_VIEW'
  | 'LOGIN_VIEW'
  | 'FORGOT_VIEW'
  | 'NEW_SHIPPING_ADDRESS'
  | 'NEW_PAYMENT_METHOD'
  | 'NOTIFY_USER'

type SIDEBAR_VIEWS =
  | 'CART_VIEW'
  | 'CHECKOUT_VIEW'
  | 'PAYMENT_METHOD_VIEW'
  | 'WISHLIST_VIEW'

export const UIContext = React.createContext<State | any>(initialState)

UIContext.displayName = 'UIContext'

function uiReducer(state: State, action: Action) {
  switch (action.type) {
    case 'OPEN_SIDEBAR': {
      return {
        ...state,
        displaySidebar: true,
      }
    }
    case 'CLOSE_SIDEBAR': {
      return {
        ...state,
        displaySidebar: false,
      }
    }
    case 'OPEN_DROPDOWN': {
      return {
        ...state,
        displayDropdown: true,
      }
    }
    case 'CLOSE_DROPDOWN': {
      return {
        ...state,
        displayDropdown: false,
      }
    }
    case 'OPEN_MODAL': {
      return {
        ...state,
        displayModal: true,
        displaySidebar: false,
      }
    }
    case 'OPEN_NOTIFY_USER_POPUP': {
      console.log(action)
      return { ...state, notifyUser: true, productId: action.payload }
    }
    case 'CLOSE_NOTIFY_USER_POPUP': {
      return { ...state, notifyUser: false }
    }
    case 'CLOSE_MODAL': {
      return {
        ...state,
        displayModal: false,
      }
    }
    case 'SET_MODAL_VIEW': {
      return {
        ...state,
        modalView: action.view,
      }
    }
    case 'SET_SIDEBAR_VIEW': {
      return {
        ...state,
        sidebarView: action.view,
      }
    }
    case 'SET_USER_AVATAR': {
      return {
        ...state,
        userAvatar: action.value,
      }
    }
    case 'ADD_TO_WISHLIST': {
      return {
        ...state,
        wishListItems: [...state.wishListItems, action.payload],
      }
    }
    case 'SET_WISHLIST': {
      return {
        ...state,
        wishListItems: action.payload,
      }
    }
    case 'ADD_TO_CART': {
      return {
        ...state,
        cartItems: {
          ...state.cartItems,
          lineItems: [...state.cartItems.lineItems, action.payload],
        },
      }
    }
    case 'SET_CART_ITEMS': {
      return {
        ...state,
        cartItems: action.payload,
      }
    }
    case 'REMOVE_FROM_CART': {
      return {
        ...state,
        cartItems: state.cartItems.lineItems.filter(
          (cartItem: any) => cartItem.id !== action.payload
        ),
      }
    }
    case 'SET_USER': {
      return {
        ...state,
        user: action.payload,
      }
    }
    case 'REMOVE_USER': {
      return {
        ...state,
        user: {},
      }
    }
    case 'SET_BASKET_ID': {
      return {
        ...state,
        basketId: action.payload,
      }
    }
  }
}

export const UIProvider: FC = (props) => {
  const Router = useRouter()

  const [state, dispatch] = React.useReducer(uiReducer, initialState)

  const addToWishlist = useCallback(
    (payload: any) => {
      const storedItems = getItem('wishListItems') || []
      setItem('wishListItems', [...storedItems, payload])
      dispatch({ type: 'ADD_TO_WISHLIST', payload })
    },
    [dispatch]
  )

  const removeFromWishlist = useCallback(
    (payload: any) => {
      const items = state.wishListItems.filter(
        (item: any) => item.recordId !== payload
      )
      dispatch({ type: 'SET_WISHLIST', payload: items })
      setItem('wishListItems', items)
    },
    [dispatch]
  )

  const openSidebar = useCallback(
    () => dispatch({ type: 'OPEN_SIDEBAR' }),
    [dispatch]
  )
  const openNotifyUser = useCallback(
    (payload: any) => dispatch({ type: 'OPEN_NOTIFY_USER_POPUP', payload }),
    [dispatch]
  )
  const closeNotifyUser = useCallback(
    () => dispatch({ type: 'CLOSE_NOTIFY_USER_POPUP' }),
    [dispatch]
  )
  const closeSidebar = useCallback(
    () => dispatch({ type: 'CLOSE_SIDEBAR' }),
    [dispatch]
  )
  const toggleSidebar = useCallback(
    () =>
      state.displaySidebar
        ? dispatch({ type: 'CLOSE_SIDEBAR' })
        : dispatch({ type: 'OPEN_SIDEBAR' }),
    [dispatch, state.displaySidebar]
  )
  const closeSidebarIfPresent = useCallback(
    () => state.displaySidebar && dispatch({ type: 'CLOSE_SIDEBAR' }),
    [dispatch, state.displaySidebar]
  )

  const openDropdown = useCallback(
    () => dispatch({ type: 'OPEN_DROPDOWN' }),
    [dispatch]
  )
  const closeDropdown = useCallback(
    () => dispatch({ type: 'CLOSE_DROPDOWN' }),
    [dispatch]
  )

  const openModal = useCallback(
    () => dispatch({ type: 'OPEN_MODAL' }),
    [dispatch]
  )
  const closeModal = useCallback(
    () => dispatch({ type: 'CLOSE_MODAL' }),
    [dispatch]
  )

  const setUserAvatar = useCallback(
    (value: string) => dispatch({ type: 'SET_USER_AVATAR', value }),
    [dispatch]
  )

  const setModalView = useCallback(
    (view: MODAL_VIEWS) => dispatch({ type: 'SET_MODAL_VIEW', view }),
    [dispatch]
  )

  const setSidebarView = useCallback(
    (view: SIDEBAR_VIEWS) => dispatch({ type: 'SET_SIDEBAR_VIEW', view }),
    [dispatch]
  )

  const addToCart = useCallback(
    (payload: any) => {
      const storedItems = getItem('cartItems') || { lineItems: [] }
      setItem('cartItems', { lineItems: [...storedItems.lineItems, payload] })
      dispatch({ type: 'ADD_TO_CART', payload })
    },
    [dispatch]
  )

  const removeFromCart = useCallback(
    (payload: any) => dispatch({ type: 'REMOVE_FROM_CART', payload }),
    [dispatch]
  )

  const setCartItems = useCallback(
    (payload: any) => {
      const newCartDataClone: any = { ...payload }
      newCartDataClone.lineItems.forEach((element: any, idx: number) => {
        newCartDataClone.lineItems.forEach((i: any) => {
          if (element.parentProductId === i.productId) {
            i.children = i.children ? [...i.children, element] : [element]
            newCartDataClone.lineItems.splice(idx, 1)
          }
        })
      })

      setItem('cartItems', { ...payload })
      dispatch({ type: 'SET_CART_ITEMS', payload: newCartDataClone })
    },
    [dispatch]
  )

  const setUser = useCallback(
    (payload: any) => {
      setItem('user', payload)
      dispatch({ type: 'SET_USER', payload })
    },
    [dispatch]
  )

  const deleteUser = useCallback(
    (payload: any) => {
      Router.push('/').then(() => {
        removeItem('user')
        dispatch({ type: 'SET_WISHLIST', payload: [] })
        setItem('wishListItems', [])
        setItem('cartItems', { lineItems: [] })
        dispatch({ type: 'SET_CART_ITEMS', payload: { lineItems: [] } })
        const basketIdRef = uuid()
        Cookies.set('basketId', basketIdRef)
        dispatch({ type: 'SET_BASKET_ID', payload: basketIdRef })
        dispatch({ type: 'REMOVE_USER', payload: {} })
      })
    },
    [dispatch]
  )

  const setWishlist = useCallback(
    (payload: any) => {
      setItem('wishListItems', payload)
      dispatch({ type: 'SET_WISHLIST', payload })
    },
    [dispatch]
  )

  const openCart = () => {
    setSidebarView('CART_VIEW')
    openSidebar()
  }

  const setBasketId = useCallback(
    (basketId: string) => {
      Cookies.set('basketId', basketId)
      dispatch({ type: 'SET_BASKET_ID', payload: basketId })
    },
    [dispatch]
  )

  const openWishlist = () => {
    setSidebarView('WISHLIST_VIEW')
    openSidebar()
  }
  const value = useMemo(
    () => ({
      ...state,
      openSidebar,
      closeSidebar,
      toggleSidebar,
      closeSidebarIfPresent,
      openDropdown,
      closeDropdown,
      openModal,
      closeModal,
      setModalView,
      setSidebarView,
      setUserAvatar,
      openNotifyUser,
      closeNotifyUser,
      addToWishlist,
      addToCart,
      removeFromCart,
      setCartItems,
      setUser,
      deleteUser,
      openCart,
      openWishlist,
      setWishlist,
      removeFromWishlist,
      setBasketId,
    }),
    [state]
  )

  return <UIContext.Provider value={value} {...props} />
}

export const useUI = () => {
  const context = React.useContext(UIContext)
  if (context === undefined) {
    throw new Error(`useUI must be used within a UIProvider`)
  }
  return context
}

export const ManagedUIContext: FC = ({ children }) => (
  <UIProvider>
    <ThemeProvider>{children}</ThemeProvider>
  </UIProvider>
)
