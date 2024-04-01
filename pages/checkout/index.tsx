import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
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
  EmptyGuid,
  EmptyObject,
  EmptyString,
  LOQATE_ADDRESS,
  Messages,
  NEXT_AUTHENTICATE,
  NEXT_BASKET_VALIDATE,
  NEXT_GET_CUSTOMER_DETAILS,
  NEXT_GUEST_CHECKOUT,
  NEXT_UPDATE_CHECKOUT2_ADDRESS,
  NEXT_UPDATE_DELIVERY_INFO,
  NEXT_UPDATE_SHIPPING,
} from '@components/utils/constants'
import Spinner from '@components/ui/Spinner'
import axios from 'axios'
import { AlertType, CheckoutStep } from '@framework/utils/enums'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import CheckoutLayoutV2 from '@components/Layout/CheckoutLayoutV2'
import { saveUserToken } from '@framework/utils/app-util'
import { asyncHandler as addressHandler } from '@components/account/Address/AddressBook'
import cartHandler from '@components/services/cart'
import {
  matchStrings,
  stringToBoolean,
  tryParseJson,
} from '@framework/utils/parse-util'
import Link from 'next/link'
import { decrypt } from '@framework/utils/cipher'
import { Guid } from '@commerce/types'
import { Logo } from '@components/ui'
import { compact } from 'lodash'
import { GetServerSideProps } from 'next'
import { useTranslation } from '@commerce/utils/use-translation'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
export enum BasketStage {
  CREATED = 0,
  ANONYMOUS = 1,
  LOGGED_IN = 2, // could be registered user or a guest email also.
  SHIPPING_METHOD_SELECTED = 3,
  SHIPPING_ADDRESS_PROVIDED = 4,
  BILLING_ADDRESS_PROVIDED = 41,
  PLACED = 5,
}

const steps = [
  {
    key: 'address',
    label: 'Information',
    shouldActiveOn: 'login,new-address,edit-address,billing-address',
  },
  { key: 'delivery', label: 'Delivery', shouldActiveOn: '' },
  { key: 'review', label: 'Payment', shouldActiveOn: '' },
]

const CheckoutPage: React.FC = ({ appConfig, deviceInfo, basketId }: any) => {
  const router = useRouter()
  const uiContext = useUI()
  const {
    isGuestUser,
    user,
    setAlert,
    setUser,
    setIsGuestUser,
    setIsGhostUser,
    setOverlayLoaderState,
    hideOverlayLoaderState,
  } = useUI()
  const [basket, setBasket] = useState<any>(undefined)
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

  const loqateAddress = async (postCode: string ) => {
    try {
      const cartItems: any = tryParseJson(localStorage.getItem('cartItems'));
      const deliveryMethod = cartItems?.shippingMethods?.find((method: any) => method?.id === cartItems?.shippingMethodId);
      const response = await axios.post(LOQATE_ADDRESS, {
        postCode,
        country: deliveryMethod?.countryCode || BETTERCOMMERCE_DEFAULT_COUNTRY,
      });
  
      const responseData = response?.data?.response?.data || [];
      return responseData?.map((item: any) => ({
        text: item?.Text,
        id: item?.Id,
        description: item?.Description,
      }));
    } catch (error) {
      console.error('Error:', error);
      return [];
    }
  }

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

  const asyncBasket = async () => {
    setOverlayLoaderState({
      visible: true,
      message: 'Please wait...',
      backdropInvisible: true,
    })
    if (!isGuestUser) {
      const addressList = await fetchAddress()
      const basketRes: any = await getBasket(basketId)
      await checkIfDefaultShippingAndBilling(addressList, basketRes)
      new Promise(() => {
        goToStep(CheckoutStep.ADDRESS)
      })
    }
    hideOverlayLoaderState()
  }

  const asyncGuestBasket = async () => {
    setOverlayLoaderState({
      visible: true,
      message: 'Please wait...',
      backdropInvisible: true,
    })
    const basketRes: any = await getBasket(basketId)
    if (basketRes?.shippingAddress?.id !== basketRes?.billingAddress?.id) {
      updateAddressList({ ...basketRes?.shippingAddress, isBilling: false })
      updateAddressList({ ...basketRes?.billingAddress, isBilling: true })
    } else {
      updateAddressList({ ...basketRes?.shippingAddress, isBilling: false })
    }
    // const step = getStepFromStage(basketRes?.stage)
    new Promise(() => {
      goToStep(CheckoutStep.LOGIN)
    })
    hideOverlayLoaderState()
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
      await updateCheckoutAddress({ shippingAddress: defaultDeliveryAddr }, true)
    } else {
      await updateCheckoutAddress({ shippingAddress: basket?.shippingAddress }, true)
    }

    const billingAddress = !defaultBillingAddr ? defaultDeliveryAddr : defaultBillingAddr
    if (!basket?.billingAddress?.id && billingAddress?.id > 0) {
      await updateCheckoutAddress({ billingAddress: billingAddress }, false)
    } else {
      await updateCheckoutAddress({ billingAddress: basket?.billingAddress }, false)
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
          msg: translate('common.message.checkout.noAddressFoundErrorMsg'),
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
        if (!isGuestCheckoutSubmit) {
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
        if (!isGuestCheckoutSubmit) {
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
          await updateCheckoutAddress(
            {
              billingAddress: newAddressData,
              shippingAddress: newAddressData,
            },
            true
          )
          setSelectedAddress({
            billingAddress: newAddressData,
            shippingAddress: newAddressData,
          })
        } else {
          await updateCheckoutAddress(
            {
              shippingAddress: newAddressData,
            },
            true
          )

          setSelectedAddress({
            billingAddress: undefined,
            shippingAddress: newAddressData,
          })
        }
      }
    }
    cb()
    hideOverlayLoaderState()
    if (address?.isBilling || address?.useSameForBilling) {
      if (isGuestCheckoutSubmit) {
        setCompletedSteps((prev) => [
          ...new Set([...prev, CheckoutStep.ADDRESS]),
        ])
      }
      goToStep(CheckoutStep.DELIVERY)
    } else {
      goToStep(CheckoutStep.BILLING_ADDRESS)
    }
  }

  const updateAddressList = (newAddress: any) => {
    setAddressList((prevAddrList: any) => {
      if (!prevAddrList || prevAddrList?.length < 1) {
        prevAddrList = new Array(2).fill(undefined)
      }
      const { isBilling, ...addressData } = newAddress
      if (isBilling) {
        prevAddrList[1] = addressData
      } else {
        prevAddrList[0] = addressData
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

        // Update delivery method
        const deliveryResponse = await axios.post(NEXT_UPDATE_DELIVERY_INFO, {
          id: basketId,
          data: deliveryPlans || [],
        })
      }
    }

    setSelectedDeliveryMethod(method)
    hideOverlayLoaderState()
    goToStep(CheckoutStep.REVIEW)
  }

  const updateCheckoutAddress = async (address: any, cdp = false) => {
    const response = await axios.post(NEXT_UPDATE_CHECKOUT2_ADDRESS, {
      basketId,
      model: address,
      cdp,
      basketItems: basket?.lineItems,
      postCode: basket?.postCode,
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
    await updateCheckoutAddress(
      { shippingAddress: selectedAddress?.shippingAddress },
      true
    )
    hideOverlayLoaderState()
    goToStep(CheckoutStep.DELIVERY)
  }

  const loginOrGuestProps = {
    basket,
    onLoginSuccess: handleLoginSuccess,
    onGuestCheckout: handleGuestCheckout,
  }

  const handleCollect = () => {
    if(deliveryTypeMethod.type === 2){
      setCompletedSteps((prev) => [
        ...new Set([...prev, CheckoutStep.ADDRESS]),
      ])
    }
    goToStep(CheckoutStep.DELIVERY)
  }
  
  const addressBookProps = {
    selectedAddress,
    editAddressValues,
    onEditAddressToggleView,
    addressList,
    onAddressSelect,
    onSubmit: handleAddressSubmit,
    onAddNewAddress: () => {
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
    handleCollect
  }


  const newAddressFormProps = {
    searchAddressByPostcode,
    onSubmit: handleAddressSubmit,
    editAddressValues,
    onEditAddressToggleView,
    shippingCountries: appConfigData?.shippingCountries,
    billingCountries: appConfigData?.billingCountries,
    handleCollect,
    deliveryTypeMethod,
    setDeliveryTypeMethod
  }

  const editAddressFormProps = {
    ...newAddressFormProps,
    editAddressValues,
    onEditAddressToggleView,
    shippingCountries: appConfigData?.shippingCountries,
    billingCountries: appConfigData?.billingCountries,
  }

  const deliveryMethodSelectionProps = {
    basket,
    deliveryMethod: deliveryTypeMethod,
    onDeliveryMethodSelect: handleDeliveryMethodSelect,
    onContinue: () => {
      goToStep(CheckoutStep.REVIEW)
    },
    goToStep
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
    goToStep
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
      default:
        return null
    }
  }

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
          }
        } else {
          if (basketResult?.id === basket?.id) {
            setBasket(basketResult)
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
        <link rel="apple-touch-icon" sizes="57x57" href={`https://cdnbs.bettercommerce.tech/theme/${CURRENT_THEME}/favicon/apple-icon-57x57.png`} />
        <link rel="apple-touch-icon" sizes="60x60" href={`https://cdnbs.bettercommerce.tech/theme/${CURRENT_THEME}/favicon/apple-icon-60x60.png`} />
        <link rel="apple-touch-icon" sizes="72x72" href={`https://cdnbs.bettercommerce.tech/theme/${CURRENT_THEME}/favicon/apple-icon-72x72.png`} />
        <link rel="apple-touch-icon" sizes="76x76" href={`https://cdnbs.bettercommerce.tech/theme/${CURRENT_THEME}/favicon/apple-icon-76x76.png`} />
        <link rel="apple-touch-icon" sizes="114x114" href={`https://cdnbs.bettercommerce.tech/theme/${CURRENT_THEME}/favicon/apple-icon-114x114.png`} />
        <link rel="apple-touch-icon" sizes="120x120" href={`https://cdnbs.bettercommerce.tech/theme/${CURRENT_THEME}/favicon/apple-icon-120x120.png`} />
        <link rel="apple-touch-icon" sizes="144x144" href={`https://cdnbs.bettercommerce.tech/theme/${CURRENT_THEME}/favicon/apple-icon-144x144.png`} />
        <link rel="apple-touch-icon" sizes="152x152" href={`https://cdnbs.bettercommerce.tech/theme/${CURRENT_THEME}/favicon/apple-icon-152x152.png`} />
        <link rel="apple-touch-icon" sizes="180x180" href={`https://cdnbs.bettercommerce.tech/theme/${CURRENT_THEME}/favicon/apple-icon-180x180.png`} />
        <link rel="icon" type="image/png" sizes="192x192" href={`https://cdnbs.bettercommerce.tech/theme/${CURRENT_THEME}/favicon/android-icon-192x192.png`} />
        <link rel="icon" type="image/png" sizes="32x32" href={`https://cdnbs.bettercommerce.tech/theme/${CURRENT_THEME}/favicon/favicon-32x32.png`} />
        <link rel="icon" type="image/png" sizes="96x96" href={`https://cdnbs.bettercommerce.tech/theme/${CURRENT_THEME}/favicon/favicon-96x96.png`} />
        <link rel="icon" type="image/png" sizes="16x16" href={`https://cdnbs.bettercommerce.tech/theme/${CURRENT_THEME}/favicon/favicon-16x16.png`} />
        <link rel="icon" href={`https://cdnbs.bettercommerce.tech/theme/${CURRENT_THEME}/favicon/favicon.ico`} />
      </NextHead>
      <div className="sticky top-0 left-0 z-50 w-full py-2 bg-gray-100 border-b border-gray-300 checkout-header">
        <div className="flex justify-between container-storefront small-screen">
          <Link href="/" title="BetterStore" className="desktop-w-88">
            <Logo />
          </Link>
          <h2 className="flex items-center justify-center text-2xl font-semibold mob-font-14 sm:justify-center dark:text-black mob-line-height-1">
            {translate('label.checkout.secureCheckoutText')}{' '}
            <span>
              <i className="ml-4 sprite-icons sprite-secure"></i>
            </span>
          </h2>
        </div>
      </div>

      {isMobile || isIPadorTablet ? (
        <div className="justify-start w-full">
          <BasketDetails basket={basket} deviceInfo={deviceInfo} />
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
          <div className="grid gap-6 px0 sm:grid-cols-12 sm:px-0">
            <div className="sm:col-span-12">{renderCurrentStep()}</div>
          </div>
        </div>
        {isMobile || isIPadorTablet ? (
          <></>
        ) : (
          <div className="justify-start min-h-screen p-8 bg-gray-100 border-gray-300 border-x basket-container top-14">
            <BasketDetails basket={basket} deviceInfo={deviceInfo} />
          </div>
        )}
      </div>
    </>
  )
}
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { locale } = context
  const cookies = cookie.parse(context.req.headers.cookie || '')
  let basketId: any = cookies?.basketId
  return {
    props: { 
      ...(await serverSideTranslations(locale ?? BETTERCOMMERCE_DEFAULT_LANGUAGE!)),
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
