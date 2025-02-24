import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Cookies from 'js-cookie'
import Router, { useRouter } from 'next/router'
import LoginOrGuest from '@components/SectionCheckoutJourney/checkout/LoginOrGuest'
import ShippingAddressForm from '@components/SectionCheckoutJourney/checkout/ShippingAddressForm'
import BillingAddressForm from '@components/SectionCheckoutJourney/checkout/BillingAddressForm'
import AddressBook from '@components/SectionCheckoutJourney/checkout/AddressBook'
import DeliveryMethodSelection from '@components/SectionCheckoutJourney/checkout/DeliveryMethodSelection'
import ReviewOrder from '@components/SectionCheckoutJourney/checkout/ReviewOrder'
import BasketDetails from '@components/SectionCheckoutJourney/checkout/BasketDetails'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import { useUI, basketId as generateBasketId } from '@components/ui/context'
import NextHead from 'next/head'
import cookie from 'cookie'
import {
  BETTERCOMMERCE_DEFAULT_COUNTRY,
  BETTERCOMMERCE_DEFAULT_LANGUAGE,
  CURRENT_THEME,
  DeliveryType,
  EmptyGuid,
  EmptyObject,
  EmptyString,
  EngageEventTypes,
  LOQATE_ADDRESS,
  Messages,
  NEXT_AUTHENTICATE,
  NEXT_BASKET_VALIDATE,
  NEXT_CLICK_AND_COLLECT_STORE_DELIVERY,
  NEXT_GET_CUSTOMER_DETAILS,
  NEXT_GUEST_CHECKOUT,
  NEXT_SHIPPING_ENDPOINT,
  NEXT_UPDATE_CHECKOUT2_ADDRESS,
  NEXT_UPDATE_DELIVERY_INFO,
  NEXT_UPDATE_SHIPPING,
  SITE_ORIGIN_URL,
} from '@components/utils/constants'
import Spinner from '@components/ui/Spinner'
import axios from 'axios'
import { AlertType, CheckoutStep } from '@framework/utils/enums'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import CheckoutLayoutV2 from '@components/Layout/CheckoutLayoutV2'
import { isB2BUser, logError, loqateAddress, saveUserToken } from '@framework/utils/app-util'
import { asyncHandler as addressHandler } from '@components/account/Address/AddressBook'
import cartHandler from '@components/services/cart'
import {
  matchStrings,
  stringToBoolean,
  stringToNumber,
  tryParseJson,
} from '@framework/utils/parse-util'
import Link from 'next/link'
import { decrypt } from '@framework/utils/cipher'
import { Guid } from '@commerce/types'
import { Logo } from '@components/ui'
import compact from 'lodash/compact'
import size from 'lodash/size'
import { GetServerSideProps } from 'next'
import { useTranslation } from '@commerce/utils/use-translation'
import { Cookie } from '@framework/utils/constants'
import EngageProductCard from '@components/SectionEngagePanels/ProductCard'
import { IPagePropsProvider } from '@framework/contracts/page-props/IPagePropsProvider'
import { getPagePropType, PagePropType } from '@framework/page-props'
import { EVENTS_MAP } from '@components/services/analytics/constants'
import DeliveryTypeSelection from '@components/SectionCheckoutJourney/checkout/DeliveryTypeSelection'
import CheckoutEmailHeader from '@components/SectionCheckoutJourney/CheckoutEmailHeader'
import { AnalyticsEventType } from '@components/services/analytics'
import useAnalytics from '@components/services/analytics/useAnalytics'

export enum BasketStage {
  CREATED = 0,
  ANONYMOUS = 1,
  LOGGED_IN = 2, // could be registered user or a guest email also.
  SHIPPING_METHOD_SELECTED = 3,
  SHIPPING_ADDRESS_PROVIDED = 4,
  BILLING_ADDRESS_PROVIDED = 41,
  PLACED = 5,
}


const CheckoutPage: React.FC = ({ appConfig, deviceInfo, basketId, featureToggle, campaignData, allMembershipPlans, config, defaultDisplayMembership}: any) => {
  const { recordAnalytics } = useAnalytics()
  const router = useRouter()
  const uiContext: any = useUI()
  const { isGuestUser, user, setAlert, setUser, setIsGuestUser, setIsGhostUser, setOverlayLoaderState, hideOverlayLoaderState, } = useUI()
  const [basket, setBasket] = useState<any>(undefined)
  const [isCheckoutStarted, setCheckoutStarted] = useState(false)
  const [appConfigData, setAppConfigData] = useState<any>()
  const { isMobile, isIPadorTablet } = deviceInfo
  const translate = useTranslation()
  const { getAddress, createAddress, updateAddress } = addressHandler()
  const { getCart } = cartHandler()
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | undefined>(undefined)
  const [selectedAddress, setSelectedAddress] = useState<any>(null)
  const [deliveryTypeMethod, setDeliveryTypeMethod] = useState<any>(null)
  const [selectedDelivery, setSelectedDelivery] = useState<any>(null)
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] =
    useState<any>(null)
  const [currentStep, setCurrentStep] = useState<string>('')
  const [completedSteps, setCompletedSteps] = useState<string[]>([])
  const [addressList, setAddressList] = useState<any>(undefined)
  const [prevStep, setPrevStep] = useState<any>(CheckoutStep.ADDRESS)
  const [isApplePayScriptLoaded, setIsApplePayScriptLoaded] =
    useState<boolean>(false)
  const [editAddressValues, setEditAddressValues] = useState<any>(undefined)
  const [deliveryMethods, setDeliveryMethods] = useState(new Array<any>())

  const steps = [
    {
      key: 'address',
      label: translate('label.checkout.informationText'),
      shouldActiveOn: 'login,new-address,edit-address,billing-address',
    },
    { key: 'delivery', label: translate('label.checkout.deliveryText'), shouldActiveOn: 'select-delivery-type' },
    { key: 'review', label: translate('label.checkout.paymentHeadingText'), shouldActiveOn: '' },
  ]

  const DELIVERY_METHODS_TYPE = [
    {
      id: 0,
      title: 'Deliver',
      content: translate('label.checkout.toChoiceAddressText'),
      children: [],
      type: [ DeliveryType.STANDARD_DELIVERY, DeliveryType.EXPRESS_DELIVERY ],
    },
    {
      id: 1,
      type: [ DeliveryType.COLLECT ],
      title: 'Collect',
      content: translate('common.label.inStoreUsingCollectPlusText'),
      children: [],
    },
  ]

  const getStepFromStage = (stage: number) => {
    let step = CheckoutStep.NONE
    switch (stage) {
      case BasketStage.ANONYMOUS:
      case BasketStage.CREATED:
        step = CheckoutStep.LOGIN
        break

      case BasketStage.LOGGED_IN:
        step = CheckoutStep.LOGIN
        break

      case BasketStage.SHIPPING_ADDRESS_PROVIDED:
        step = CheckoutStep.BILLING_ADDRESS
        setCompletedSteps((prev) => [
          ...new Set([...prev, CheckoutStep.ADDRESS]),
        ])
        break

      case BasketStage.BILLING_ADDRESS_PROVIDED:
        step = CheckoutStep.DELIVERY
        setCompletedSteps((prev) => [
          ...new Set([...prev, CheckoutStep.ADDRESS]),
        ])
        break

      case BasketStage.SHIPPING_METHOD_SELECTED:
        step = CheckoutStep.REVIEW
        setCompletedSteps((prev) => [
          ...new Set([...prev, CheckoutStep.ADDRESS, CheckoutStep.DELIVERY]),
        ])
        break

      case BasketStage.PLACED:
      default:
        break
    }
    return step
  }

  const onAddressSelect = (shippingAddress: any, billingAddress?: any) => {
    setSelectedAddress({ shippingAddress, billingAddress })
  }

  const getBasket = async (basketId: string) => {
    const basketResult: any = await getCart({
      basketId,
    })
    const isLoggedIn =
      (user?.userId && user?.userId !== EmptyGuid && !isGuestUser) || false
    setIsLoggedIn(isLoggedIn)
    return basketResult
  }

  const isQuoteBasket = useCallback((basket: any) => {
    return user?.userId !== Guid.empty && isB2BUser(user) && basket?.id && basket?.id !== EmptyGuid && basket?.isQuote
  }, [user])

  const asyncBasket = async () => {
    setOverlayLoaderState({ visible: true, message: 'Please wait...', backdropInvisible: true, })
    
    const basketRes: any = await getBasket(basketId)
    if (isQuoteBasket(basketRes)) {
      let shippingAddress = basketRes?.shippingAddress
      let billingAddress = basketRes?.billingAddress

      await fetchAddress()
      await loadDeliveryMethods(shippingAddress, basketRes?.id)
      await updateCheckoutAddress({ shippingAddress, billingAddress }, true)
      
      new Promise(() => {
        const step = getStepFromStage(BasketStage.SHIPPING_METHOD_SELECTED)
        goToStep(step)
      })
    } else {
      if (!isGuestUser) {
        const addressList = await fetchAddress()
        await loadDeliveryMethods(basketRes?.shippingAddress, basketRes?.id)
        if (!featureToggle?.features?.enableCollectDeliveryOption) {
          await checkIfDefaultShippingAndBilling(addressList, basketRes)
        } else {
          await checkIfCNCBasketUpdated(addressList, basketRes)
        }
        new Promise(() => {
          goToStep(CheckoutStep.ADDRESS)
        })
      }
    }
    hideOverlayLoaderState()
  }

  const asyncGuestBasket = async () => {
    setOverlayLoaderState({ visible: true, message: 'Please wait...', backdropInvisible: true, })
    const basketRes: any = await getBasket(basketId)
    await loadDeliveryMethods(basketRes?.shippingAddress, basketRes?.id)
    if (basketRes?.shippingAddress?.id !== basketRes?.billingAddress?.id) {
      updateAddressList({ ...basketRes?.shippingAddress, isBilling: false })
      updateAddressList({ ...basketRes?.billingAddress, isBilling: true })
    } else {
      updateAddressList({ ...basketRes?.shippingAddress, isBilling: false })
    }
    await checkIfGuestShippingAndBilling(basketRes)
    const step = getStepFromStage(basketRes?.stage)
    new Promise(() => {
      goToStep(step || CheckoutStep.LOGIN)
    })
    hideOverlayLoaderState()
  }

  const checkIfGuestShippingAndBilling = async (basket: any) => {
    let redirectToStep: any = CheckoutStep.LOGIN
    const hasShippingAddress = basket?.shippingAddress?.id > 0
    const hasBillingAddress = basket?.billingAddress?.id > 0
    const isDeliveryMethodSelected = basket?.deliveryPlans?.length > 0

    if (hasShippingAddress && hasBillingAddress && isDeliveryMethodSelected) {
      setCompletedSteps((prev) => [...new Set([...prev, CheckoutStep.ADDRESS, CheckoutStep.DELIVERY])])
      redirectToStep = CheckoutStep.REVIEW
    } else if (hasShippingAddress && hasBillingAddress) {
      setCompletedSteps((prev) => [...new Set([...prev, CheckoutStep.ADDRESS])])
      redirectToStep = CheckoutStep.DELIVERY
    } else if ((hasShippingAddress && !hasBillingAddress) || (!hasShippingAddress && hasBillingAddress)) {
      setCompletedSteps((prev) => [...new Set([...prev, CheckoutStep.ADDRESS])])
      redirectToStep = CheckoutStep.ADDRESS
    }

    if (redirectToStep) {
      return new Promise(() => {
        goToStep(redirectToStep)
        hideOverlayLoaderState()
      })
    }
  }

  const fetchBasketReValidate = async () => {
    const res = await axios.post(NEXT_BASKET_VALIDATE, {
      basketId,
    })
  }

  const getUserId = () => {
    if (localStorage.getItem('user')) {
      const user: any = tryParseJson(localStorage.getItem('user'))
      return user?.userId
    }
    return EmptyGuid
  }

  const fetchAddress = async () => {
    let userId = getUserId()
    setAddressList(undefined)
    try {
      const response: any = await getAddress(userId)
      setAddressList(response || [])
      return response
    } catch (error) {
      setAddressList([])
    }
  }

  const handleLoginSuccess = async (values: any, cb = () => { }) => {
    try {
      setIsLoggedIn(undefined)
      const userRes: any = await axios.post(NEXT_AUTHENTICATE, { data: values })
      cb()
      if (!userRes?.data) {
        setIsLoggedIn(false)
        return setAlert({ type: AlertType.ERROR, msg: translate('common.message.invalidAccountMsg') })
      }
      setAlert({ type: AlertType.SUCCESS, msg: translate('common.message.loginSuccessMsg') })
      const { userToken, ...rest } = userRes?.data
      saveUserToken(userToken)
      let userObj = { ...rest }
      const updatedUserObj = await axios.post(
        `${NEXT_GET_CUSTOMER_DETAILS}?customerId=${userObj?.userId}`
      )
      if (updatedUserObj?.data) userObj = { ...updatedUserObj?.data }
      if (basketId && basketId != Guid.empty) {
        const basketResult: any = await getBasket(basketId)
        if (basketResult?.id && basketResult?.id !== EmptyGuid) {
          userObj.isAssociated = true
        } else {
          userObj.isAssociated = false
        }
        setUser(userObj)
        setIsGuestUser(false)
        // setIsGhostUser(false)
        setOverlayLoaderState({ visible: true, message: 'Please wait...' })

        if (basketResult?.id && basketResult?.id !== EmptyGuid) {
          let shippingAddress: any = EmptyObject
          let billingAddress: any = EmptyObject

          if (!basketResult?.shippingAddress || !basketResult?.billingAddress) {
            const addressList = (await fetchAddress()) || []

            if (basketResult?.shippingAddress?.id > 0) {
              shippingAddress = basketResult?.shippingAddress
            } else {
              shippingAddress = addressList?.find(
                (address: any) => address.isDefaultDelivery
              )
            }

            if (basketResult?.billingAddress?.id > 0) {
              billingAddress = basketResult?.billingAddress
            } else {
              billingAddress = addressList?.find(
                (address: any) => address.isDefaultBilling
              )
            }
          }
          await updateCheckoutAddress({ shippingAddress, billingAddress }, true)
        }
        router.reload()
        /*// await checkIfDefaultShippingAndBilling(addressList, basketResult)
        new Promise(() => {
          goToStep(CheckoutStep.ADDRESS)
        })*/
      }
    } catch (error) {
      cb()
      setAlert({ type: AlertType.ERROR, msg: translate('common.message.requestCouldNotProcessErrorMsg') })
      setIsLoggedIn(false)
    }
  }

  const checkIfCNCBasketUpdated = async (addressList: any, basket: any) => {
    let redirectToStep: any = CheckoutStep.ADDRESS
    const defaultDeliveryAddr = addressList?.find((address: any) => address.isDefaultDelivery || address.isDefault)
    const defaultBillingAddr = addressList?.find((address: any) => address.isDefaultBilling || address.isDefault)
    const hasShippingAddress = basket?.shippingAddress?.id > 0 || defaultDeliveryAddr?.id > 0
    const hasBillingAddress = basket?.billingAddress?.id > 0 || defaultBillingAddr?.id > 0
    const hasStoreId = basket?.storeId !== EmptyGuid
    const hasAddress = (addressList?.length || 0) > 0

    if (!hasAddress) {
      setCompletedSteps((prev) => [
        ...new Set([...prev, CheckoutStep.ADDRESS]),
      ])
      if (!featureToggle?.features?.enableCollectDeliveryOption) {
        redirectToStep = CheckoutStep.NEW_ADDRESS
      } else {
        redirectToStep = CheckoutStep.DELIVERY_TYPE_SELECT
      }
    }
    if (hasStoreId && hasBillingAddress && hasShippingAddress) {
      setCompletedSteps((prev) => [
        ...new Set([...prev, CheckoutStep.ADDRESS, CheckoutStep.DELIVERY]),
      ])
      // redirectToStep = CheckoutStep.REVIEW
    }/** else if (hasBillingAddress) {
      setCompletedSteps((prev) => [
        ...new Set([...prev, CheckoutStep.ADDRESS]),
      ])
      redirectToStep = CheckoutStep.DELIVERY
    } */

    const billingAddress = !defaultBillingAddr ? defaultDeliveryAddr : defaultBillingAddr
    // if (!basket?.billingAddress?.id && billingAddress?.id > 0) {
    //   await updateCheckoutAddress({ billingAddress: billingAddress }, false)
    // } else {
    //   await updateCheckoutAddress({ billingAddress: basket?.billingAddress }, false)
    // }

    if (redirectToStep) {
      return new Promise(() => {
        setSelectedAddress({
          billingAddress: billingAddress,
          shippingAddress: defaultDeliveryAddr,
        })
        goToStep(redirectToStep)
        hideOverlayLoaderState()
      })
    }
  }

  const checkIfDefaultShippingAndBilling = async (
    addressList: any,
    basket: any
  ) => {
    let redirectToStep: any = CheckoutStep.ADDRESS
    const defaultDeliveryAddr = addressList?.find(
      (address: any) => address.isDefaultDelivery
    )
    const defaultBillingAddr = addressList?.find(
      (address: any) => address.isDefaultBilling
    )
    const hasShippingAddress =
      basket?.shippingAddress?.id > 0 || defaultDeliveryAddr?.id > 0
    const hasBillingAddress =
      basket?.billingAddress?.id > 0 || defaultBillingAddr?.id > 0
    const isDeliveryMethodSelected = basket?.deliveryPlans?.length > 0

    if (hasShippingAddress && hasBillingAddress && isDeliveryMethodSelected) {
      setCompletedSteps((prev) => [
        ...new Set([...prev, CheckoutStep.ADDRESS, CheckoutStep.DELIVERY]),
      ])
      redirectToStep = CheckoutStep.REVIEW
    } else if (hasShippingAddress && hasBillingAddress) {
      setCompletedSteps((prev) => [...new Set([...prev, CheckoutStep.ADDRESS])])
      redirectToStep = CheckoutStep.DELIVERY
    } else if (hasShippingAddress && !hasBillingAddress) {
      setCompletedSteps((prev) => [...new Set([...prev, CheckoutStep.ADDRESS])])
      redirectToStep = CheckoutStep.ADDRESS
    } else if (!hasShippingAddress && hasBillingAddress) {
      setCompletedSteps((prev) => [...new Set([...prev, CheckoutStep.ADDRESS])])
      redirectToStep = CheckoutStep.ADDRESS
    } else {
      setCompletedSteps((prev) => [...new Set([...prev, CheckoutStep.ADDRESS])])
      if (addressList?.length > 0) {
        redirectToStep = CheckoutStep.ADDRESS
      } else {
        redirectToStep = CheckoutStep.NEW_ADDRESS
      }
    }

    if (!basket?.shippingAddress?.id && defaultDeliveryAddr?.id > 0) {
      await updateCheckoutAddress({ shippingAddress: defaultDeliveryAddr }, true, basket)
    } else {
      await updateCheckoutAddress({ shippingAddress: basket?.shippingAddress }, true, basket)
    }

    const billingAddress = !defaultBillingAddr ? defaultDeliveryAddr : defaultBillingAddr
    if (!basket?.billingAddress?.id && billingAddress?.id > 0) {
      await updateCheckoutAddress({ billingAddress: billingAddress }, false, basket)
    } else {
      await updateCheckoutAddress({ billingAddress: basket?.billingAddress }, false, basket)
    }

    if (redirectToStep) {
      return new Promise(() => {
        setSelectedAddress({
          billingAddress: billingAddress,
          shippingAddress: defaultDeliveryAddr,
        })
        goToStep(redirectToStep)
        hideOverlayLoaderState()
      })
    }
  }

  const handleGuestCheckout = async (values: any, cb = () => { }) => {
    try {
      const guestCheckoutResult: any = await axios.post(NEXT_GUEST_CHECKOUT, {
        basketId,
        ...values,
      })
      if (isGuestCheckoutFailed(guestCheckoutResult?.data)) {
        hideOverlayLoaderState()
        return setAlert({
          type: AlertType.ERROR,
          msg: translate('common.message.requestCouldNotProcessErrorMsg'),
        })
      }
      cb()
      setUser({ ...guestCheckoutResult?.data, ...values })
      setIsGuestUser(true)
    } catch (error) {
      cb()
      hideOverlayLoaderState()
      setAlert({ type: AlertType.ERROR, msg: translate('common.message.requestCouldNotProcessErrorMsg') })
    }
  }

  const isGuestCheckoutFailed = (guestCheckoutRes: any) => {
    return (
      !guestCheckoutRes ||
      guestCheckoutRes?.userId === EmptyGuid ||
      guestCheckoutRes?.id === EmptyGuid
    )
  }

  const searchAddressByPostcode = async (postCode: string) => {
    if (!postCode) return
    try {
      const postCodeAddressRes: any = await loqateAddress(postCode)
      if (postCodeAddressRes?.length < 1) {
        return setAlert({
          type: AlertType.ERROR,
          msg: translate('common.message.noAddressFoundErrorMsg'),
        })
      }
      return postCodeAddressRes
    } catch (error) {
      setAlert({ type: AlertType.ERROR, msg: translate('common.message.requestCouldNotProcessErrorMsg') })
      return null
    }
  }
  const handleAddressSubmit = async (
    address: any,
    isNew = false,
    cb = () => { },
    isGuestCheckoutSubmit = false
  ) => {
    setOverlayLoaderState({ visible: true, message: 'Please wait...' })
    let payload: any = {
      userId: getUserId(),
      address1: address?.address1,
      address2: address?.address2 || EmptyString,
      address3: address?.address3 || EmptyString,
      city: address?.city || EmptyString,
      state: address?.state || EmptyString,
      countryCode: address?.countryCode || EmptyString,
      country: address?.country || EmptyString,
      firstName: address?.firstName || user?.firstName || EmptyString,
      lastName: address?.lastName || user?.lastName || EmptyString,
      postCode: address?.postCode,
      phoneNo: user?.mobile || address?.phoneNo || user?.phoneNo || EmptyString,
      label: matchStrings(address?.categoryName, 'Other', true)
        ? address?.otherAddressType
        : address?.categoryName || EmptyString,
      title: EmptyString,
      isDefault: address?.useAsDefault || false,
      isDefaultBilling: address?.isDefaultBilling || false,
      isDefaultDelivery: address?.isDefaultDelivery || false,
      isConsentSelected: address?.whtsappUpdated || false,
      companyName: address?.companyName || EmptyString,
    }
    let newAddressData: any = null
    setEditAddressValues(undefined)
    if (isNew) {
      // add new address
      const newAddressResult = await createAddress(payload)
      if (newAddressResult?.isValid) {
        if (isLoggedIn) {
          const updatedAddresses = await fetchAddress()
          newAddressData = updatedAddresses?.find(
            (addr: any) => addr?.id === newAddressResult?.id
          )
        } else {
          newAddressData = { ...payload, id: newAddressResult?.id }
          updateAddressList({
            ...payload,
            id: newAddressResult?.id,
            isBilling: address?.isBilling,
          })
        }
      }
    } else {
      // edit existing address
      payload = {
        ...payload,
        customerId: getUserId(),
        id: editAddressValues?.id,
      }
      const updateAddressResult = await updateAddress(payload)
      if (updateAddressResult) {
        if (isLoggedIn) {
          const updatedAddresses = await fetchAddress()
          newAddressData = updatedAddresses?.find(
            (addr: any) => addr?.id === payload?.id
          )
        } else {
          newAddressData = { ...payload }
          updateAddressList({ ...payload, isBilling: address?.isBilling })
        }
      }
    }
    if (newAddressData) {
      setOverlayLoaderState({ visible: true, message: 'Please wait...' })
      if (address?.isBilling) {
        await updateCheckoutAddress({ billingAddress: newAddressData }, false)
        setSelectedAddress({
          ...selectedAddress,
          billingAddress: newAddressData,
        })
      } else {
        if (address?.useSameForBilling) {
          await updateCheckoutAddress({ billingAddress: newAddressData, shippingAddress: newAddressData, }, true)
          setSelectedAddress({ billingAddress: newAddressData, shippingAddress: newAddressData, })
        } else {
          // if billing addressId is different
          if(basket?.billingAddress?.id !== basket?.shippingAddress?.id){
            await updateCheckoutAddress({ shippingAddress: newAddressData, billingAddress: basket?.billingAddress }, true)
            setSelectedAddress({ billingAddress: basket?.billingAddress, shippingAddress: newAddressData, })
          } else {
            await updateCheckoutAddress({ shippingAddress: newAddressData, }, true)

            setSelectedAddress({ billingAddress: undefined, shippingAddress: newAddressData, })
          }
        }
      }
    }
    cb()
    hideOverlayLoaderState()
    if (address?.isBilling || address?.useSameForBilling) {
      if (!isLoggedIn) {
        setCompletedSteps((prev) => [
          ...new Set([...prev, CheckoutStep.ADDRESS]),
        ])
      }
      goToStep(CheckoutStep.DELIVERY)
    } else {
      // if billing address exists
      if(basket?.billingAddress?.id && (address?.isBilling || address?.useSameForBilling)){
        if (!isLoggedIn) {
          setCompletedSteps((prev) => [
            ...new Set([...prev, CheckoutStep.ADDRESS]),
          ])
        }
        goToStep(CheckoutStep.DELIVERY)
      } else {
        goToStep(CheckoutStep.BILLING_ADDRESS)
      }
    }
  }

  const updateAddressList = (newAddress: any) => {
    setAddressList((prevAddrList: any) => {
      let shippingAddress = prevAddrList?.find((o: any) => o?.id !== newAddress?.id)
      if (shippingAddress) {
        shippingAddress = {
          ...shippingAddress,
          isBilling: false,
          isDefaultBilling: false,
        }
        prevAddrList[0] = shippingAddress
      }
      if (!prevAddrList || prevAddrList?.length < 1) {
        prevAddrList = new Array(2).fill(undefined)
      }
      const { isBilling, ...addressData } = newAddress
      if (size(addressData) > 0) {
        if (isBilling) {
          prevAddrList[1] = {...addressData, isBilling:true }
        } else {
          prevAddrList[0] = addressData
        }
      }
      return compact(prevAddrList)
    })
  }

  const onEditAddressToggleView = (
    address: any,
    step = CheckoutStep.EDIT_ADDRESS
  ) => {
    if (address === undefined) {
      goToStep(prevStep)
      setPrevStep(undefined)
    } else {
      goToStep(step)
      setPrevStep(router.query?.step)
      setEditAddressValues(address)
    }
  }

  const handleDeliveryMethodSelect = async (method: any, store: any) => {
    setOverlayLoaderState({ visible: true, message: 'Please wait...' })

    if (store && basket?.storeId !== store?.Id) {
      const data = { basketId: basket?.id, deliveryMethodId: deliveryTypeMethod?.id, store }
      const { data: clickCollectStoreResult } = await axios.post(NEXT_CLICK_AND_COLLECT_STORE_DELIVERY, data)
      if (clickCollectStoreResult?.message || !clickCollectStoreResult?.isValid) {
        hideOverlayLoaderState()
        setAlert({ type: AlertType.ERROR, msg: clickCollectStoreResult?.message })
        return
      }
    }

    let deliveryPlans = basket?.deliveryPlans
    if (basket?.shippingMethodId != method?.id) {
      // Update shipping method
      const { data: updateShippingMethodResult } = await axios.post(
        NEXT_UPDATE_SHIPPING,
        {
          basketId,
          countryCode:
            selectedAddress?.shippingAddress?.countryCode ||
            BETTERCOMMERCE_DEFAULT_COUNTRY,
          shippingId: method?.id,
        }
      )
      setBasket({ ...basket, ...updateShippingMethodResult })
      deliveryPlans = updateShippingMethodResult?.deliveryPlans
    }

    if (appConfigData && appConfigData?.configSettings?.length) {
      const configSettings = appConfigData?.configSettings
      const domainSettings =
        configSettings?.find((x: any) =>
          matchStrings(x?.configType, 'DomainSettings', true)
        )?.configKeys || []
      const enableOmniOms =
        domainSettings?.find((x: any) =>
          matchStrings(x?.key, 'DomainSettings.EnableOmniOms', true)
        )?.value || 'False'

      // If 'EnableOmniOms' is enabled.
      if (stringToBoolean(enableOmniOms) && deliveryPlans?.length) {
        for (let i = 0; i < deliveryPlans.length; i++) {
          delete deliveryPlans[i].deliveryPlanNo
        }

        // Insert `poolCode` in `deliveryPlans`
        const updatedDeliveryPlans = deliveryPlans?.map((plan: any) => ({
          ...plan,
          poolCode: plan?.items?.[0]?.poolCode,
        }))

        // Update delivery method
        const deliveryResponse = await axios.post(NEXT_UPDATE_DELIVERY_INFO, {
          id: basketId,
          data: updatedDeliveryPlans || [],
        })
      }
    }

    setSelectedDeliveryMethod(method)
    hideOverlayLoaderState()
    goToStep(CheckoutStep.REVIEW)
  }

  const updateCheckoutAddress = async (address: any, cdp = false, basketDetails = basket) => {
    const response = await axios.post(NEXT_UPDATE_CHECKOUT2_ADDRESS, {
      basketId,
      model: address,
      cdp,
      basket: basketDetails,
      postCode: basketDetails?.postCode,
      isCNC: deliveryTypeMethod?.type?.includes(DeliveryType.COLLECT),
    })
    return response
  }

  const renderStepIndicator = ({ key: step, label, shouldActiveOn }: any) => {
    const isCompleted = completedSteps.includes(step)
    const isActive =
      currentStep === step || shouldActiveOn.indexOf(currentStep) > -1

    return (
      <div
        key={step}
        onClick={() => {
          if (completedSteps.includes(step)) {
            goToStep(step)
          }
        }}
        className={`bg-white z-2 cursor-pointer px-0 relative flex items-center gap-2 font-12 font-normal ${isCompleted && isActive
          ? 'text-black font-semibold underline'
          : isCompleted && !isActive
            ? 'text-black font-medium'
            : !isCompleted && !isActive
              ? 'text-gray-400'
              : 'text-black font-semibold underline'
          }`}
      >
        <span>{label}</span>
        {label != 'Payment' ? (
          <span className={`flex items-center font-16`}>
            <ChevronRightIcon
              className={`inline-block w-3 h-3 mx-auto text-gray-800`}
            />
          </span>
        ) : (
          <></>
        )}
      </div>
    )
  }
  const goToStep = (step: string) => {
    setCurrentStep(step)
    setCompletedSteps((prev) => [...new Set([...prev, step])])
    router.push(`/checkout?step=${step}`, undefined, {
      shallow: true,
      scroll: true,
    })
  }

  const onContinueAddressBook = async () => {
    setOverlayLoaderState({ visible: true, message: 'Please wait...' })
    if (deliveryTypeMethod?.type?.includes(DeliveryType.COLLECT)) {
      await updateCheckoutAddress({ billingAddress: selectedAddress?.billingAddress }, true)
    } else {
      await updateCheckoutAddress({ shippingAddress: selectedAddress?.shippingAddress, billingAddress: selectedAddress?.billingAddress }, true)
    }
    hideOverlayLoaderState()
    goToStep(CheckoutStep.DELIVERY)
  }

  const loginOrGuestProps = {
    basket,
    featureToggle,
    onLoginSuccess: handleLoginSuccess,
    onGuestCheckout: handleGuestCheckout,
    appConfig: appConfigData,
  }

  const onContinueToSelectDeliveryType = () => {
    setCompletedSteps((prev) => [
      ...new Set([...prev, CheckoutStep.ADDRESS]),
    ])
    goToStep(CheckoutStep.DELIVERY_TYPE_SELECT)
  }

  const addressBookProps = {
    selectedAddress,
    editAddressValues,
    onEditAddressToggleView,
    addressList,
    onAddressSelect,
    onSubmit: handleAddressSubmit,
    onAddNewAddress: () => {
      if (typeof window !== 'undefined') {
        //debugger
        recordAnalytics(AnalyticsEventType.ADD_SHIPPING_INFO, { cartItems: basket, })
      }
      setPrevStep(router.query?.step)
      setEditAddressValues(undefined)
      goToStep(CheckoutStep.NEW_ADDRESS)
    },
    searchAddressByPostcode,
    onContinue: onContinueAddressBook,
    shippingCountries: appConfigData?.shippingCountries,
    billingCountries: appConfigData?.billingCountries,
    basket,
    deliveryTypeMethod,
    setDeliveryTypeMethod,
    onContinueToSelectDeliveryType,
    featureToggle,
    deliveryMethods,
    currentStep,
    appConfig: appConfigData,
  }


  const newAddressFormProps = {
    searchAddressByPostcode,
    onSubmit: handleAddressSubmit,
    editAddressValues,
    onEditAddressToggleView,
    shippingCountries: appConfigData?.shippingCountries,
    billingCountries: appConfigData?.billingCountries,
    onContinueToSelectDeliveryType,
    deliveryTypeMethod,
    setDeliveryTypeMethod,
    featureToggle,
    deliveryMethods,
    basket,
    appConfig: appConfigData,
  }

  const editAddressFormProps = {
    ...newAddressFormProps,
    editAddressValues,
    setEditAddressValues,
    onEditAddressToggleView,
    shippingCountries: appConfigData?.shippingCountries,
    billingCountries: appConfigData?.billingCountries,
    featureToggle,
    appConfig: appConfigData,
  }

  const deliveryTypeSelectionProps = {
    basket,
    featureToggle,
    shippingCountries: appConfigData?.shippingCountries,
    billingCountries: appConfigData?.billingCountries,
    onSubmit: handleAddressSubmit,
    searchAddressByPostcode,
    deliveryTypeMethod,
    setDeliveryTypeMethod,
    deliveryMethods,
    user,
    currentStep,
    appConfig: appConfigData,
  }

  const deliveryMethodSelectionProps = {
    basket,
    deliveryMethod: deliveryTypeMethod,
    onDeliveryMethodSelect: handleDeliveryMethodSelect,
    onContinue: () => {
      goToStep(CheckoutStep.REVIEW)
    },
    goToStep,
    deliveryTypeMethod,
    setDeliveryTypeMethod,
    featureToggle,
    deliveryMethods,
    deliveryTypeSelectionProps,
  }

  const reviewOrderProps = {
    basket,
    isApplePayScriptLoaded,
    selectedDeliveryMethod,
    onPlaceOrder: () => {
      setOverlayLoaderState({ visible: true, message: 'Please wait...' })
      setTimeout(() => {
        hideOverlayLoaderState()
      }, 100)
    },
    onEditAddressToggleView,
    onPaymentMethodSelect: () => {
      /* Payment handling logic */
    },
    uiContext,
    setAlert,
    setOverlayLoaderState,
    hideOverlayLoaderState,
    generateBasketId,
    goToStep,
    deliveryTypeMethod,
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case CheckoutStep.LOGIN:
        return <LoginOrGuest {...loginOrGuestProps} {...newAddressFormProps} />
      case CheckoutStep.ADDRESS:
        return <AddressBook {...addressBookProps} />
      case CheckoutStep.NEW_ADDRESS:
        return <ShippingAddressForm {...newAddressFormProps} />
      case CheckoutStep.EDIT_ADDRESS:
        return <ShippingAddressForm {...editAddressFormProps} />
      case CheckoutStep.BILLING_ADDRESS:
        return <BillingAddressForm {...newAddressFormProps} />
      case CheckoutStep.DELIVERY:
        return <DeliveryMethodSelection {...deliveryMethodSelectionProps} />
      case CheckoutStep.REVIEW:
        return <ReviewOrder {...reviewOrderProps} />
      case CheckoutStep.DELIVERY_TYPE_SELECT:
        return <DeliveryTypeSelection {...deliveryTypeSelectionProps} addressBookProps={addressBookProps} />
      default:
        return null
    }
  }

  const loadDeliveryMethods = useCallback(async (shippingAddress: any, basketId: any) => {
    try {
      const { data: deliveryMethods = [] }: any = await axios.post(NEXT_SHIPPING_ENDPOINT, {
        basketId,
        countryCode: shippingAddress?.countryCode || Cookies.get(Cookie.Key.COUNTRY) || BETTERCOMMERCE_DEFAULT_COUNTRY,
      })
      if (deliveryMethods?.length) {
        const output: any = DELIVERY_METHODS_TYPE?.map((method: any) => {
          const foundMethods: any = deliveryMethods?.filter((o: any) => method?.type?.includes(o?.type))
          if (foundMethods?.length) {
            method.children = foundMethods
            // check if feature 'enableCollectDeliveryOption' is disabled
            if (method?.type?.includes(DeliveryType.COLLECT) && !featureToggle?.features?.enableCollectDeliveryOption) {
              // then set empty shipping methods' data
              method.children = []
            }
          }
          return method
        })
        setDeliveryMethods(output)
        if (deliveryTypeMethod) {
          setDeliveryTypeMethod(output[deliveryTypeMethod?.id])
        } else {
          setDeliveryTypeMethod(output[0])
        }
      } else {
        return setAlert({ type: AlertType.ERROR, msg: translate('common.message.invalidPostCodeMsg') })
      }
    } catch (error) {
      logError(error)
    }
  }, [])

  const refreshBasket = async () => {
    const basketId = basket?.id
    if (basketId && basketId != Guid.empty) {
      const basketResult = await getBasket(basketId)
      if (basketResult) {
        setBasket(basketResult)
        uiContext?.setCartItems(basketResult)
      }
    }
  }

  const basketDetailsProps = {
    basket,
    setBasket,
    deviceInfo, 
    allMembershipPlans, 
    defaultDisplayMembership, 
    refreshBasket,
    featureToggle,
    config
  }

  useEffect(() => {
    if (basket?.id && basket?.lineItems) {
      if (basket?.lineItems?.length == 0) {
        router.push('/cart')
      } else {
        if (!isCheckoutStarted) {
          setCheckoutStarted(true)
          const extras = { originalLocation: SITE_ORIGIN_URL + Router.asPath }
          recordAnalytics(AnalyticsEventType.BEGIN_CHECKOUT, { ...extras, user, cartItems: basket, entityName: PAGE_TYPE, currentPage: "Checkout", itemIsBundleItem: false, })
        }
      }
    }
  }, [basket])

  useEffect(() => {
    if (basket?.lineItems?.length == 0) {
      router.push('/cart')
      return
    }

    if (appConfig) {
      const appConfigData = tryParseJson(decrypt(appConfig))
      setAppConfigData(appConfigData)
    }

    fetchBasketReValidate()

    const asyncCartItemsChangeHandler = async (oldBasket: any) => {
      if (basketId && basketId != Guid.empty) {
        const basketResult = await getBasket(basketId)
        if (
          oldBasket &&
          basketResult &&
          (oldBasket?.lineItems?.length != basketResult?.lineItems?.length ||
            oldBasket?.id !== basketResult?.id)
        ) {
          router.push('/cart')
        }
      }
    }

    // [GS 20231223] This block can be removed once basket dependency on [localstorage] is completely removed.
    // This makes sure that the user is redirect to basket page
    // once the basket list is emptied on any other tab.
    // TODO:
    window.addEventListener('storage', (ev: StorageEvent) => {
      if (ev.key === 'cartItems') {
        const oldCartItems: any = tryParseJson(ev?.oldValue)
        if (user?.userId && user?.userId !== Guid.empty) {
          asyncCartItemsChangeHandler(oldCartItems)
        } else {
          const newCartItems: any = tryParseJson(ev?.newValue)
          if (
            oldCartItems &&
            newCartItems &&
            oldCartItems?.lineItems?.length != newCartItems?.lineItems?.length
          ) {
            router.push('/cart')
          }
        }
      }
    })

    return () => {
      window.removeEventListener('storage', () => { })
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
  }, [])

  useEffect(() => {
    if (basket?.lineItems && basket?.lineItems?.length == 0) {
      router.push('/cart')
    }
  }, [basket])

  useEffect(() => {
    const isLoggedIn =
      (user?.userId && user?.userId !== EmptyGuid && !isGuestUser) || false
    setIsLoggedIn(isLoggedIn)
  }, [user])

  useEffect(() => {
    const asyncRouteChangeHandler = async () => {
      if (basketId && basketId != Guid.empty) {
        const basketResult = await getBasket(basketId)
        if (basketResult) {
          if (
            !basketResult ||
            (basketResult?.id && basketResult?.lineItems?.length === 0)
          ) {
            router.push('/cart')
          } else {
            setBasket(basketResult)
            uiContext?.setCartItems(basketResult)
          }
        } else {
          if (basketResult?.id === basket?.id) {
            setBasket(basketResult)
            uiContext?.setCartItems(basketResult)
          }
        }
      }
    }

    router.events.on('routeChangeStart', (newUrl: string, options: any) => {
      if (newUrl?.indexOf(`/checkout?step=`) !== -1) {
        asyncRouteChangeHandler()
      }
    })

    // Dispose listener.
    return () => {
      router.events.off('routeChangeStart', () => { })
    }
  }, [router.events])

  useEffect(() => {
    if (isLoggedIn !== undefined) {
      if (isLoggedIn && user?.userId && !isGuestUser) {
        asyncBasket()
      } else {
        asyncGuestBasket()
      }
    }
  }, [isLoggedIn])

  if (isLoggedIn === undefined) {
    return <Spinner />
  }
  return basket === undefined ? (
    <div className="overlay-panel-over-viewport">
      <div className="fixed top-0 right-0 z-50 flex items-center justify-center w-screen h-screen">
        <div className="m-auto">
          <Spinner />
          <div className="loader">
            <img src="/assets/images/loader-logo.svg" alt="" />
          </div>
        </div>
      </div>
    </div>
  ) : (
    <>
      <NextHead>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="canonical" id="canonical" href="https://demostore.bettercommerce.io/checkout" />
        <title>{translate('label.checkout.betterStoreCheckoutText')}</title>
        <meta name="title" content="BetterStore Checkout" />
        <meta name="description" content="BetterStore Checkout" />
        <meta name="keywords" content="BetterStore Checkout" />
        <link rel="apple-touch-icon" sizes="57x57" href={`/theme/${CURRENT_THEME}/favicon/apple-icon-57x57.png`} />
        <link rel="apple-touch-icon" sizes="60x60" href={`/theme/${CURRENT_THEME}/favicon/apple-icon-60x60.png`} />
        <link rel="apple-touch-icon" sizes="72x72" href={`/theme/${CURRENT_THEME}/favicon/apple-icon-72x72.png`} />
        <link rel="apple-touch-icon" sizes="76x76" href={`/theme/${CURRENT_THEME}/favicon/apple-icon-76x76.png`} />
        <link rel="apple-touch-icon" sizes="114x114" href={`/theme/${CURRENT_THEME}/favicon/apple-icon-114x114.png`} />
        <link rel="apple-touch-icon" sizes="120x120" href={`/theme/${CURRENT_THEME}/favicon/apple-icon-120x120.png`} />
        <link rel="apple-touch-icon" sizes="144x144" href={`/theme/${CURRENT_THEME}/favicon/apple-icon-144x144.png`} />
        <link rel="apple-touch-icon" sizes="152x152" href={`/theme/${CURRENT_THEME}/favicon/apple-icon-152x152.png`} />
        <link rel="apple-touch-icon" sizes="180x180" href={`/theme/${CURRENT_THEME}/favicon/apple-icon-180x180.png`} />
        <link rel="icon" type="image/png" sizes="192x192" href={`/theme/${CURRENT_THEME}/favicon/android-icon-192x192.png`} />
        <link rel="icon" type="image/png" sizes="32x32" href={`/theme/${CURRENT_THEME}/favicon/favicon-32x32.png`} />
        <link rel="icon" type="image/png" sizes="96x96" href={`/theme/${CURRENT_THEME}/favicon/favicon-96x96.png`} />
        <link rel="icon" type="image/png" sizes="16x16" href={`/theme/${CURRENT_THEME}/favicon/favicon-16x16.png`} />
        <link rel="icon" href={`/theme/${CURRENT_THEME}/favicon/favicon.ico`} />
      </NextHead>
      <div className="sticky top-0 left-0 z-50 w-full py-2 bg-gray-100 border-b border-gray-300 sm:py-4 checkout-header">
        <div className="flex justify-between container-storefront gap-x-5 small-screen">
          <Link href="/" title="BetterStore" className="desktop-w-88 logo-link-chk">
            <Logo />
          </Link>
          <h1 className="flex items-center justify-center text-lg font-semibold sm:text-2xl mob-font-14 sm:justify-center dark:text-black mob-line-height-1">
            {translate('label.checkout.secureCheckoutText')}{' '}
            <span>
              <i className="ml-4 sprite-icons sprite-secure"></i>
            </span>
          </h1>
        </div>
      </div>

      {isMobile || isIPadorTablet ? (
        <div className="justify-start w-full bar">
          <BasketDetails { ...basketDetailsProps }  />
        </div>
      ) : (
        <></>
      )}
      <div className="flex justify-between w-full gap-0 container-storefront small-screen">
        <div className="justify-start w-full pr-0 bg-white dark:bg-white checkout-container">
          <div className="flex justify-start w-full pt-5 pb-2">
            <div className="flex items-center justify-between gap-2">
              <Link href={`/cart`} passHref legacyBehavior>
                <a
                  href={`/cart`}
                  className={`bg-white text-black font-normal z-2 cursor-pointer px-0 relative flex items-center gap-2 font-12`}
                >
                  <span>{translate('label.basket.basketText')}</span>
                  <span className={`flex items-center font-16`}>
                    <ChevronRightIcon
                      className={`inline-block w-3 h-3 mx-auto text-gray-800`}
                    />
                  </span>
                </a>
              </Link>
              {steps.map((step: any) => renderStepIndicator(step))}
            </div>
          </div>
          <CheckoutEmailHeader user={user} currentStep={currentStep} goToStep={goToStep} isLoggedIn={isLoggedIn} />
          <div className="grid gap-6 px0 sm:grid-cols-12 sm:px-0">
            <div className="sm:col-span-12">{renderCurrentStep()}</div>
          </div>
        </div>
        {isMobile || isIPadorTablet ? (
          <></>
        ) : (
          <div className="justify-start min-h-screen p-8 bg-gray-100 border-gray-300 border-x basket-container top-14">
            <BasketDetails  { ...basketDetailsProps } />
          </div>
        )}
      </div>
      <div className='flex flex-col w-full'>
        <EngageProductCard type={EngageEventTypes.TRENDING_FIRST_ORDER} campaignData={campaignData} isSlider={true} productPerRow={4} productLimit={12}/>
        <EngageProductCard type={EngageEventTypes.INTEREST_USER_ITEMS} campaignData={campaignData} isSlider={true} productPerRow={4} productLimit={12} />
        <EngageProductCard type={EngageEventTypes.TRENDING_COLLECTION} campaignData={campaignData} isSlider={true} productPerRow={4} productLimit={12} />
        <EngageProductCard type={EngageEventTypes.COUPON_COLLECTION} campaignData={campaignData} isSlider={true} productPerRow={4} productLimit={12} />
        <EngageProductCard type={EngageEventTypes.SEARCH} campaignData={campaignData} isSlider={true} productPerRow={4} productLimit={12} />
        <EngageProductCard type={EngageEventTypes.RECENTLY_VIEWED} campaignData={campaignData} isSlider={true} productPerRow={4} productLimit={12} />
      </div>
    </>
  )
}
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { locale } = context
  const cookies = cookie.parse(context.req.headers.cookie || '')
  let basketId: any = cookies?.basketId
  const props: IPagePropsProvider = getPagePropType({ type: PagePropType.CHECKOUT })
  const pageProps = await props.getPageProps({ cookies: context?.req?.cookies })
  
  return {
    props: {
      ...pageProps,
      basketId,
    }
  }
}
const PAGE_TYPE = PAGE_TYPES['Checkout']
export default withDataLayer(
  CheckoutPage,
  PAGE_TYPE,
  true,
  CheckoutLayoutV2
)
