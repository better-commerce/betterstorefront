import React, { FC, useCallback, useMemo } from 'react'
import { ThemeProvider } from 'next-themes'
import { isDesktop, isMobile } from 'react-device-detect'
import { setItem, getItem, removeItem } from '@components/utils/localStorage'
import { v4 as uuid } from 'uuid'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import { Guid } from '@commerce/types'
import { DeviceType } from '@commerce/utils/use-device'
import { getExpiry, getMinutesInDays } from '@components/utils/setSessionId'
import { resetBasket } from '@framework/utils/app-util'
import { LocalStorage } from '@components/utils/payment-constants'
import { LOGOUT } from '@components/utils/textVariables'

declare const window: any

export const basketId = () => {
  if (Cookies.get('basketId')) {
    return Cookies.get('basketId') || ''
  }
  const basketId = uuid()
  Cookies.set('basketId', basketId, {
    expires: getExpiry(getMinutesInDays(365)),
  })
  return basketId
}

export interface IDeviceInfo {
  readonly isMobile: boolean | undefined
  readonly isOnlyMobile: boolean | undefined
  readonly isDesktop: boolean | undefined
  readonly isIPadorTablet: boolean | undefined
  readonly deviceType: DeviceType
}

export interface IOverlayLoaderState {
  readonly visible: boolean
  readonly message?: string
}

export interface IPLPFilterState {
  filters: Array<any>
  sortBy: string
  sortList: Array<any>
  results: number
  total: number
  currentPage: number
  pages: number
  loading: boolean
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
  isGuestUser: boolean
  showSearchBar: boolean
  appConfig: any
  orderId: string
  userIp: string
  overlayLoaderState: IOverlayLoaderState
  deviceInfo: IDeviceInfo
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
  isGuestUser: getItem('isGuest') || false,
  showSearchBar: false,
  appConfig: {},
  orderId: getItem('orderId') || '',
  userIp: '',
  overlayLoaderState: {
    visible: false,
    message: '',
  },
  deviceInfo: {
    isMobile: false,
    isOnlyMobile: false,
    isDesktop: false,
    isIPadorTablet: false,
    deviceType: DeviceType.UNKNOWN,
  },
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
      type: 'REMOVE_FROM_WISHLIST'
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
  | {
      type: 'SET_IS_GUEST_USER'
      payload: boolean
    }
  | { type: 'REMOVE_USER'; payload: any }
  | { type: 'SET_WISHLIST'; payload: any }
  | { type: 'SET_BASKET_ID'; payload: string }
  | { type: 'SHOW_SEARCH_BAR'; payload: boolean }
  | { type: 'SET_APP_CONFIG'; payload: any }
  | { type: 'SET_ORDER_ID'; payload: any }
  | { type: 'SET_USER_IP'; payload: string }
  | { type: 'SET_OVERLAY_STATE'; payload: IOverlayLoaderState }
  | { type: 'SETUP_DEVICE_INFO'; payload: IDeviceInfo }
  | { type: 'SET_SELECTED_ADDRESS_ID'; payload: number }
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
    case 'SETUP_DEVICE_INFO': {
      return {
        ...state,
        deviceInfo: state?.deviceInfo,
      }
    }

    case 'OPEN_SIDEBAR': {
      return {
        ...state,
        displaySidebar: true,
      }
    }
    case 'SET_USER_IP': {
      return {
        ...state,
        userIp: action.payload,
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
    case 'REMOVE_FROM_WISHLIST': {
      const items = state.wishListItems.filter(
        (item: any) => item.recordId !== action.payload
      )
      setItem('wishListItems', items)
      return {
        ...state,
        wishListItems: items,
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
    case 'SET_IS_GUEST_USER': {
      return {
        ...state,
        isGuestUser: action.payload,
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
    case 'SHOW_SEARCH_BAR': {
      return {
        ...state,
        showSearchBar: action.payload,
      }
    }
    case 'SET_APP_CONFIG': {
      return {
        ...state,
        appConfig: action.payload,
      }
    }
    case 'SET_ORDER_ID': {
      return {
        ...state,
        orderId: action.payload,
      }
    }
    case 'SET_OVERLAY_STATE': {
      return {
        ...state,
        overlayLoaderState: action.payload,
      }
    }

    case 'SET_SELECTED_ADDRESS_ID': {
      return {
        ...state,
        selectedAddressId: action.payload,
      }
    }
  }
}

export const UIProvider: FC<React.PropsWithChildren<unknown>> = (
  props: any
) => {
  const Router = useRouter()

  const [state, dispatch] = React.useReducer<React.Reducer<any, any>>(
    uiReducer,
    initialState
  )

  const setupDeviceInfo = useCallback(() => {
    const UA = navigator.userAgent
    const isIPadorTablet = /\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA)

    /**
     * Determine the mobile operating system.
     * This function returns one of 'IOS', 'ANDROID', 'WINDOWS_PHONE', or 'UNKNOWN'.
     *
     * @returns {String}
     */
    const getDeviceType = () => {
      var userAgent = navigator.userAgent || navigator.vendor || window.opera

      // Windows Phone must come first because its UA also contains "Android"
      if (/windows phone/i.test(userAgent)) {
        return DeviceType.WINDOWS_PHONE
      }

      if (/android/i.test(userAgent)) {
        return DeviceType.ANDROID
      }

      // iOS detection from: http://stackoverflow.com/a/9039885/177710
      if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return DeviceType.IOS
      }

      return DeviceType.UNKNOWN
    }
    const deviceTypeInfo = getDeviceType()
    const isOnlyMobile = (isMobile && !isIPadorTablet) || deviceTypeInfo === 2

    const payload: IDeviceInfo = {
      isMobile,
      isOnlyMobile,
      isDesktop: isMobile || isIPadorTablet ? false : isDesktop,
      isIPadorTablet,
      deviceType: deviceTypeInfo,
    }
    setItem('deviceInfo', payload)
    dispatch({ type: 'SETUP_DEVICE_INFO', payload })
  }, [dispatch])

  const addToWishlist = useCallback(
    (payload: any) => {
      const storedItems: any = getItem('wishListItems') || []
      setItem('wishListItems', [...storedItems, payload])
      dispatch({ type: 'ADD_TO_WISHLIST', payload })
    },
    [dispatch]
  )

  const setUserIp = useCallback(
    (payload: string) => {
      dispatch({ type: 'SET_USER_IP', payload })
    },
    [dispatch]
  )
  const setAddressId = useCallback(
    (payload: number) => {
      dispatch({ type: 'SET_SELECTED_ADDRESS_ID', payload })
    },
    [dispatch]
  )
  const removeFromWishlist = useCallback(
    (payload: any) => {
      dispatch({ type: 'REMOVE_FROM_WISHLIST', payload })
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

  const setAppConfig = useCallback(
    (payload: any) => {
      dispatch({ type: 'SET_APP_CONFIG', payload })
    },
    [dispatch]
  )

  const addToCart = useCallback(
    (payload: any) => {
      const storedItems: any = getItem('cartItems') || { lineItems: [] }
      setItem('cartItems', { lineItems: [...storedItems.lineItems, payload] })
      dispatch({ type: 'ADD_TO_CART', payload })
    },
    [dispatch]
  )

  const removeFromCart = useCallback(
    (payload: any) => dispatch({ type: 'REMOVE_FROM_CART', payload }),
    [dispatch]
  )

  const setShowSearchBar = useCallback(
    (payload: any) => dispatch({ type: 'SHOW_SEARCH_BAR', payload }),
    [dispatch]
  )
  const setCartItems = useCallback(
    (payload: any) => {
      const newCartDataClone: any = { ...payload }
      newCartDataClone?.lineItems?.forEach((element: any, idx: number) => {
        newCartDataClone?.lineItems?.forEach((i: any) => {
          if (element.parentProductId === i.productId) {
            i.children = i.children ? [...i.children, element] : [element]
            newCartDataClone.lineItems.splice(idx, 1)
          }
        })
      })

      const cart = { ...payload }
      setItem('cartItems', cart)

      if (cart?.lineItems?.length == 0) {
        resetBasket(setBasketId, basketId)
        /*const user = {
          ...state?.user,
          ...{
            isAssociated: false
          }
        };
        setUser(user);*/
      }
      dispatch({ type: 'SET_CART_ITEMS', payload: newCartDataClone })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch]
  )

  const resetCartItems = useCallback(
    (payload?: any) => {
      setItem('cartItems', { lineItems: [] })
      dispatch({ type: 'SET_CART_ITEMS', payload: { lineItems: [] } })
    },
    [dispatch]
  )

  const resetCartStorage = useCallback(
    (payload?: any) => {
      removeItem(LocalStorage.Key.ORDER_RESPONSE)
      removeItem(LocalStorage.Key.ORDER_PAYMENT)
      removeItem(LocalStorage.Key.CONVERTED_ORDER)
      //setItem('cartItems', { lineItems: [] })
      //dispatch({ type: 'SET_CART_ITEMS', payload: { lineItems: [] } })
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch]
  )

  const setUser = useCallback(
    (payload: any) => {
      setItem('user', payload)
      dispatch({ type: 'SET_USER', payload })
    },
    [dispatch]
  )

  const setIsGuestUser = useCallback(
    (payload: boolean) => {
      setItem('isGuest', payload)
      dispatch({ type: 'SET_IS_GUEST_USER', payload })
    },
    [dispatch]
  )

  const deleteUser = useCallback(
    (payload: any) => {
      if (payload?.router) {
        payload?.router?.push('/').then(() => {
          removeItem('user')
          dispatch({ type: 'SET_WISHLIST', payload: [] })
          setItem('wishListItems', [])
          setItem('cartItems', { lineItems: [] })
          dispatch({ type: 'SET_CART_ITEMS', payload: { lineItems: [] } })
          const basketIdRef = uuid()
          Cookies.set('basketId', basketIdRef, {
            expires: getExpiry(getMinutesInDays(365)),
          })
          dispatch({ type: 'SET_BASKET_ID', payload: basketIdRef })
          dispatch({ type: 'REMOVE_USER', payload: {} })
        })
      }
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
      Cookies.set('basketId', basketId, {
        expires: getExpiry(getMinutesInDays(365)),
      })
      dispatch({ type: 'SET_BASKET_ID', payload: basketId })
    },
    [dispatch]
  )

  const openWishlist = () => {
    setSidebarView('WISHLIST_VIEW')
    openSidebar()
  }

  const setOrderId = useCallback(
    (payload: string) => {
      if (payload) {
        Cookies.set('orderId', payload)
      } else {
        Cookies.remove('orderId')
      }
      dispatch({ type: 'SET_ORDER_ID', payload })
    },
    [dispatch]
  )

  const setOverlayLoaderState = useCallback(
    (payload: IOverlayLoaderState) => {
      dispatch({ type: 'SET_OVERLAY_STATE', payload })
    },
    [dispatch]
  )

  const hideOverlayLoaderState = useCallback(
    (
      payload: IOverlayLoaderState = {
        visible: false,
        message: '',
      }
    ) => {
      const data: IOverlayLoaderState = {
        visible: false,
        message: '',
      }
      dispatch({ type: 'SET_OVERLAY_STATE', payload })
    },
    [dispatch]
  )

  const consolidateCartItems = (payload: any) => {
    let newCartDataClone: any = { ...payload }

    let lineItems = new Array<any>()
    let parentItemsTemp = new Array<any>()

    // If line items exist
    if (newCartDataClone?.lineItems?.length) {
      // Find all child items.
      const allParentProducts = newCartDataClone?.lineItems?.filter(
        (x: any) =>
          !x.parentProductId ||
          (x.parentProductId &&
            (x.parentProductId.trim() === '' ||
              x.parentProductId.trim() === Guid.empty))
      )

      // If parent items found
      if (allParentProducts && allParentProducts.length) {
        // Iterate parent items
        allParentProducts.forEach((parentItem: any) => {
          // Find child items for current item.
          const childItems = newCartDataClone?.lineItems?.filter(
            (x: any) =>
              x.parentProductId &&
              x.parentProductId.trim() !== '' &&
              x.parentProductId.trim() !== Guid.empty &&
              x.parentProductId.toLowerCase().trim() ==
                parentItem.productId.toLowerCase()
          )

          // If child items exists
          if (childItems && childItems.length) {
            // Find current item in temp parent items
            const findParentInTemp = parentItemsTemp.find(
              (x: any) =>
                x.productId.toLowerCase() == parentItem.productId.toLowerCase()
            )

            // If found
            if (findParentInTemp && findParentInTemp.children) {
              // Concat child items to existing parent item
              findParentInTemp.children =
                findParentInTemp.children.concat(childItems)
            } else {
              // Add new parent with child items
              parentItemsTemp.push({
                ...parentItem,
                ...{ children: childItems },
              })
            }
          }
        })
      }

      const parentItemsTempIds = parentItemsTemp.length
        ? parentItemsTemp.map((x: any) => x.productId.toLowerCase())
        : []
      const findUntouchedParentItems = newCartDataClone?.lineItems?.filter(
        (x: any) =>
          !x.parentProductId ||
          (x.parentProductId &&
            (x.parentProductId.trim() === '' ||
              x.parentProductId.trim() === Guid.empty) &&
            !parentItemsTempIds.includes(x.productId.toLowerCase()))
      )

      if (findUntouchedParentItems && findUntouchedParentItems.length) {
        lineItems = lineItems.concat(findUntouchedParentItems)
      }

      if (parentItemsTemp && parentItemsTemp.length) {
        lineItems = lineItems.concat(parentItemsTemp)
      }

      newCartDataClone.lineItems = lineItems
    }

    /*newCartDataClone?.lineItems?.forEach((element: any, idx: number) => {
      newCartDataClone?.lineItems?.forEach((i: any) => {
        if (element?.parentProductId === i.productId) {
          i.children = i.children ? [...i.children, element] : [element]
          newCartDataClone.lineItems.splice(idx, 1)
        }
      })
    })*/

    return newCartDataClone
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
      setIsGuestUser,
      deleteUser,
      openCart,
      openWishlist,
      setWishlist,
      removeFromWishlist,
      setBasketId,
      setShowSearchBar,
      setAppConfig,
      setOrderId,
      setUserIp,
      setOverlayLoaderState,
      hideOverlayLoaderState,
      resetCartItems,
      setupDeviceInfo,
      setAddressId,
    }),

    // eslint-disable-next-line react-hooks/exhaustive-deps
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

export const ManagedUIContext: FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => (
  <UIProvider>
    <ThemeProvider>{children}</ThemeProvider>
  </UIProvider>
)
