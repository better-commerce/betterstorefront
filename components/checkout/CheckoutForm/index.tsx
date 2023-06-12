import { useUI, basketId as generateBasketId } from '@components/ui/context'
import Cookies from 'js-cookie'
import { useReducer, useEffect, useState } from 'react'
import cartHandler from '@components/services/cart'
import Delivery from './Delivery'
import Summary from './Summary'
import Form from './Form'
import axios from 'axios'
import {
  NEXT_UPDATE_CHECKOUT_ADDRESS,
  NEXT_PAYMENT_METHODS,
  LOQATE_ADDRESS,
  RETRIEVE_ADDRESS,
  BETTERCOMMERCE_DEFAULT_COUNTRY,
  NEXT_ADDRESS,
  AddressPageAction,
} from '@components/utils/constants'
import {
  shippingFormConfig,
  shippingSchema,
  billingFormConfig,
  billingSchema,
} from './config'
import Payments from './Payments'
import Router from 'next/router'
import { asyncHandler } from '@components/account/Address/AddressBook'
import eventDispatcher from '@components/services/analytics/eventDispatcher'
import { EVENTS_MAP } from '@components/services/analytics/constants'
import setSessionIdCookie from '@components/utils/setSessionId'
import {
  BILLING_INFORMATION,
  BTN_DELIVER_TO_THIS_ADDRESS,
  GENERAL_CHECKOUT,
  GENERAL_DELIVERY_ADDRESS,
  GENERAL_PAYMENT,
  GENERAL_SAVE_CHANGES,
  SHIPPING_INFORMATION,
} from '@components/utils/textVariables'
import PaymentWidget from '@components/checkout/PaymentWidget'
import { AddressType } from '@framework/utils/enums'
import { LocalStorage } from '@components/utils/payment-constants'
import { parseFullName, resetSubmitData, submitData } from '@framework/utils/app-util'
import { matchStrings } from '@framework/utils/parse-util'
import useDataSubmit from '@commerce/utils/use-data-submit'
import NewAddressModal from './NewAddressModal'

const Spinner = () => {
  return (
    <main className="fit bg-white">
      <div className="fixed top-0 right-0 h-screen w-screen z-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    </main>
  )
}
export default function CheckoutForm({
  cart,
  user,
  defaultShippingAddress,
  defaultBillingAddress,
  addresses = [],
  getAddress,
  fetchAddress,
  config,
  location,
  recordShippingInfo,
}: any) {
  const {
    setCartItems,
    basketId,
    cartItems,
    setOrderId,
    orderId,
    setBasketId,
    setAddressId,
    isGuestUser
  } = useUI();

  const uiContext = useUI();

  const isShippingDisabled =
    cartItems?.lineItems?.filter(
      (i: any) => i.itemType === 2 || i.itemType === 20
    ).length === cartItems?.lineItems?.length

  const defaultDeliveryMethod = cartItems?.shippingMethods?.find(
    (i: any) => i.id === cartItems.shippingMethodId
  )
  const isBrowser = typeof window !== 'undefined';
  const INITIAL_STATE = {
    isDeliveryMethodSelected: false,
    isShippingInformationCompleted: !!Object.keys(defaultShippingAddress)
      .length,
    isPaymentInformationCompleted: !!Object.keys(defaultBillingAddress).length,
    shippingInformation: defaultShippingAddress,
    billingInformation: defaultBillingAddress,
    deliveryMethod: defaultDeliveryMethod,
    isSameAddress: true,
    selectedPaymentMethod: null,
    shippingMethod: null,
    storeId: '',
    isCNC: false,
    error: '',
    orderResponse: {},
    showStripe: false,
    isPaymentIntent: isBrowser
      ? new URLSearchParams(window.location.search).get('payment_intent_client_secret')
      : null,
    isPaymentWidgetActive: false,
  }

  interface stateInterface {
    isDeliveryMethodSelected: boolean
    isShippingInformationCompleted: boolean
    isPaymentInformationCompleted: boolean
    shippingInformation: any
    billingInformation: any
    deliveryMethod: any
    isSameAddress: boolean
    selectedPaymentMethod: any
    shippingMethod: any
    storeId: string
    isCNC: boolean
    error: string
    orderResponse: any
    showStripe: boolean
    isPaymentIntent: boolean
    isPaymentWidgetActive: boolean
  }
  interface actionInterface {
    type?: string
    payload?: any
  }

  const checkoutCallback = async (orderId: any) => {
    Cookies.remove('sessionId')
    setSessionIdCookie()
    Cookies.remove('basketId')
    const generatedBasketId = generateBasketId()
    setBasketId(generatedBasketId)
    const userId = cartItems.userId
    const newCart = await associateCart(userId, generatedBasketId)
    setCartItems(newCart.data)
    setOrderId(orderId)
    Router.push('/thank-you')
  }
  function reducer(state: stateInterface, { type, payload }: actionInterface) {
    switch (type) {
      case 'SET_SHIPPING_METHOD': {
        return {
          ...state,
          shippingMethod: payload,
        }
      }
      case 'IS_CNC': {
        return {
          ...state,
          storeId: payload,
          isCNC: !state.isCNC,
        }
      }
      case 'SET_PAYMENT_METHOD': {
        return {
          ...state,
          selectedPaymentMethod: payload,
        }
      }
      case 'TOGGLE_DELIVERY_METHOD': {
        return {
          ...state,
          isDeliveryMethodSelected: !state.isDeliveryMethodSelected,
          deliveryMethod: payload || state.deliveryMethod,
        }
      }
      case 'TOGGLE_SHIPPING': {
        return {
          ...state,
          isShippingInformationCompleted: !state.isShippingInformationCompleted,
        }
      }
      case 'TOGGLE_PAYMENT': {
        return {
          ...state,
          isPaymentInformationCompleted: payload,
        }
      }
      case 'SET_SHIPPING_INFORMATION': {
        return {
          ...state,
          shippingInformation: payload,
        }
      }
      case 'SET_BILLING_INFORMATION': {
        return {
          ...state,
          billingInformation: payload,
        }
      }
      case 'SET_SAME_ADDRESS': {
        return {
          ...state,
          isSameAddress: !state.isSameAddress,
        }
      }
      case 'SET_ERROR': {
        return {
          ...state,
          error: payload,
        }
      }
      case 'SET_ORDER_RESPONSE': {
        return {
          ...state,
          orderResponse: payload,
        }
      }
      case 'TRIGGER_STRIPE': {
        return {
          ...state,
          showStripe: payload,
        }
      }
      case 'SET_PAYMENT_INTENT': {
        return {
          ...state,
          isPaymentIntent: payload,
        }
      }
      case 'TRIGGER_PAYMENT_WIDGET': {
        return {
          ...state,
          isPaymentWidgetActive: payload,
        }
      }
      default: {
        return state
      }
    }
  }

  const [state, dispatch] = useReducer(reducer, INITIAL_STATE)
  // const [deliveryCheck, setDeliveryCheck] = useState(false)
  const { addToCart, associateCart } = cartHandler()
  const { state: submitState, dispatch: submitDispatch } = useDataSubmit()

  const { createAddress  } = asyncHandler()

  const { CheckoutConfirmation } = EVENTS_MAP.EVENT_TYPES
  const { Order } = EVENTS_MAP.ENTITY_TYPES

  const [isNewAddressModalOpen, setIsNewAddressModalOpen] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState()
  const handleOpenNewAddressModal = () => {
    setAddressId(0)
    setSelectedAddress(undefined)
    openNewAddressModal()
  }

  const openNewAddressModal = () => {
    setIsNewAddressModalOpen(true)
  }
  const closeNewAddressModal = () => {
    setIsNewAddressModalOpen(false)
    resetSubmitData(submitDispatch)
  }
  const isRegisterAsGuestUser = () => {
    return (getUserId() && isGuestUser) || !getUserId()
  }
  const getUserId = () => {
    if (user?.userId) {
      return user?.userId
    }
    return cartItems?.userId
  }


  // const handleNewAddress = (values: any, callback: any = () => { }) => {
  //   recordShippingInfo()
  //   const newValues = {
  //     ...values,
  //     customerId: cartItems.userId,
  //     userId: cartItems.userId,
  //     country: state.deliveryMethod.name,
  //     countryCode: state.deliveryMethod.twoLetterIsoCode,
  //   }
  //   console.log("called from Form:",newValues)

  //   lookupAddressId(newValues).then((addressId: number) => {
  //     if (addressId == 0) {
  //       createAddress(newValues)
  //         .then((response: any) => {
  //           callback()
  //           fetchAddress()
  //           setShippingInformation({ ...newValues, id: response.id })
  //         })
  //         .catch((error: any) => console.log(error));
  //     } else {
  //       callback()
  //       fetchAddress()
  //     }
  //   }).catch((error: any) => console.log(error));
  // }
  const handleNewAddress = (data: any, callback?: Function) => {
    const name = parseFullName(data?.name)
    const values = {
      address1: data?.address1,
      address2: data?.address2,
      city: data?.city,
      state: data?.state,
      firstName: name?.firstName,
      lastName: name?.lastName ?? '',
      phoneNo: data?.mobileNumber,
      postCode: data?.pinCode,
      label: matchStrings(data?.categoryName, 'Other', true)
        ? data?.otherAddressType
        : data?.categoryName,
      title: '',
      isDefault: data?.useAsDefault,
      isDefaultBilling: data?.useAsDefault ? true : false,
      isDefaultDelivery: data?.useAsDefault ? true : false,
      isConsentSelected: data?.whtsappUpdated,
    }
    const newValues = {
      ...values,
      userId: user?.userId,
      country:
        state?.deliveryMethod?.countryCode || BETTERCOMMERCE_DEFAULT_COUNTRY,
      countryCode:
        state?.deliveryMethod?.countryCode || BETTERCOMMERCE_DEFAULT_COUNTRY,
    }
    if (data?.id == 0) {
      lookupAddressId(newValues).then((addressId: number) => {
        if (addressId == 0) {
          createAddress(newValues)
            .then((createAddressResult: any) => {
              // const updatedUser = { ...user, ...{ notifyByWhatsapp: data?.whtsappUpdated } };
              // setUser(updatedUser);
              // axios.post(NEXT_UPDATE_DETAILS, updatedUser).then((updateUserResult: any) => {
              // });
              fetchAddress()
              const values = {
                ...newValues,
                ...{ id: createAddressResult?.id, state: newValues?.state },
              }

              if (callback) {
                callback()
              }

              closeNewAddressModal()
              // setAlert({type:'success',msg:NEW_ADDRESS})
            })
            .catch((error: any) => {
              // setAlert({type:'error',msg:NETWORK_ERR})
              console.log(error)
            })
        } else {
          // Duplicate address exists
        }
      })
    } 
    // else {
    //   updateAddress({
    //     ...newValues,
    //     ...{ id: data?.id, customerId: cartItems?.userId },
    //   })
    //     .then((saveAddressResult: any) => {
    //       // const updatedUser = { ...user, ...{ notifyByWhatsapp: data?.whtsappUpdated } };
    //       // setUser(updatedUser);
    //       // axios.post(NEXT_UPDATE_DETAILS, updatedUser).then((updateUserResult: any) => {
    //       // });
    //       fetchAddress()

    //       if (callback) {
    //         callback()
    //       }
    //       closeNewAddressModal()
    //       // setAlert({type:'success',msg:ADDRESS_UPDATE})
    //     })
    //     .catch((error: any) => {
    //       console.log(error)
    //     })
    // }
  }
  const handleEditAddress = async (id: number) => {
    const { data }: any = await axios.post(NEXT_ADDRESS, {
      id: user?.userId,
      addressId: id,
    })
    let res = data.find((el: any) => el?.id === id)
    setSelectedAddress(res)
    // if (isMobile) {
      handleNewAddress(data, () => {
      closeNewAddressModal()
      })
      openNewAddressModal()
    // } else {
    //   handleNewAddress(data, () => {
    //   closeNewAddressModal()
    //   })
    //   openNewAddressModal()
    // }
  }

  const toggleDelivery = (payload?: any) =>
    dispatch({ type: 'TOGGLE_DELIVERY_METHOD', payload })

  const toggleShipping = () => {
    dispatch({ type: 'TOGGLE_SHIPPING' })
  }

  const paymentData = async () => {
    const response = await axios.post(NEXT_PAYMENT_METHODS, {
      currencyCode: cartItems.baseCurrency,
      countryCode: state.deliveryMethod.twoLetterIsoCode || 'GB',
      basketId: basketId,
    })
    return response
  }

  const setShippingMethod = (payload: any, isCNC = false, storeId = '') => {
    dispatch({ type: 'SET_SHIPPING_METHOD', payload })
    if (isCNC) {
      dispatch({ type: 'IS_CNC', payload: storeId })
    }
    if (!isCNC && state.isCNC) {
      dispatch({ type: 'IS_CNC', payload: '' })
    }
  }

  const togglePayment = (
    payload: boolean = !state.isPaymentInformationCompleted
  ) => {
    dispatch({
      type: 'TOGGLE_PAYMENT',
      payload: payload,
    })
  }

  const handleItem = (product: any, type = 'increase') => {
    const asyncHandleItem = async () => {
      const data: any = {
        basketId,
        productId: product.id,
        stockCode: product.stockCode,
        manualUnitPrice: product.manualUnitPrice,
        displayOrder: product.displayOrderta,
        qty: -1,
      }
      if (type === 'increase') {
        data.qty = 1
      }
      if (type === 'delete') {
        data.qty = 0
      }
      try {
        const item = await addToCart(data, type, { product })
        setCartItems(item)
      } catch (error) {
        console.log(error)
      }
    }
    asyncHandleItem()
  }

  const setShippingInformation = (payload: any) =>{
     setBillingInformation(payload)
     dispatch({ type: 'SET_SHIPPING_INFORMATION', payload })
  }

  const updateAddress = (type: string, payload: any) => {
    switch (type) {
      case 'SHIPPING':
        dispatch({
          type: 'SET_SHIPPING_INFORMATION',
          payload: { ...state.shippingInformation, ...payload },
        })
        return true
      case 'BILLING':
        dispatch({
          type: 'SET_BILLING_INFORMATION',
          payload: { ...state.billingInformation, ...payload },
        })
        return true
      default:
        return false
    }
  }

  const setBillingInformation = (payload: any, update = true, type = AddressType.BILLING) => {
    const handleAsync = async () => {

      const billingInfoClone = { ...payload }
      //delete billingInfoClone.id // Commenting this to ensure that duplicate address does not get saved in the system
      const shippingClone = { ...state.shippingInformation }
      //delete shippingClone.id // Commenting this to ensure that duplicate address does not get saved in the system

      let data;
      let updateAddress = false;
      const addresses = await loadAddressIDs();

      if (state.isSameAddress) {
        const addressId = await lookupAddressId(payload, addresses);
        updateAddress = (addressId == 0);

        if (updateAddress) {
          data = {
            billingAddress: {
              isDefaultDelivery: false,
            },
            shippingAddress: {
              ...payload,
              id: addressId,
              country: state.deliveryMethod.name,
              countryCode: state.deliveryMethod.twoLetterIsoCode,
              customerId: user.userId,
              isDefault: false,
              isDefaultBilling: false,
              isDefaultDelivery: false,
            },
          };
        }
      } else {
        // This case is only valid for billing address.

        const addressId = await lookupAddressId(payload, addresses);
        updateAddress = (addressId == 0);

        if (updateAddress) {
          data = {
            billingAddress: {
              ...payload,
              id: addressId,
              country: state.deliveryMethod.name,
              countryCode: state.deliveryMethod.twoLetterIsoCode,
              customerId: user.userId,
              isDefault: false,
              isDefaultBilling: false,
              isDefaultDelivery: false,
            },
            shippingAddress: {
              isDefaultBilling: false,
            },
          };
        }
      }

      if (updateAddress) {
        try {
          await axios.post(NEXT_UPDATE_CHECKOUT_ADDRESS, {
            basketId,
            model: data,
          })
        } catch (error) { }
      }
    }
    dispatch({ type: 'SET_BILLING_INFORMATION', payload })
    if (update) handleAsync()
  }

  const handleShippingSubmit = (values: any) => {
    if (values.isDirty) {
      delete values.isDirty;
    }
    toggleShipping()
    if (state.isSameAddress) {
      setBillingInformation(values, true) // For same addresses: 3rd param (AddressType) can be ignored.
      togglePayment(true)
    }
    setShippingInformation(values)
  }

  const handleBillingSubmit = (values: any) => {
    togglePayment()
    setBillingInformation(values, true, AddressType.BILLING)
  }

  const loadAddressIDs = async (): Promise<Array<any>> => {
    const response = await getAddress(user.userId)
    return response;
  }

  const lookupAddressId = async (addressInfo: any, addresses?: Array<any>) => {

    if (!addresses) {
      addresses = await loadAddressIDs();
    }

    const strVal = (val: string): string => {
      if (val) {
        return val.trim().toLowerCase();
      }
      return "";
    };

    let addressId = 0;
    if (addresses && addresses.length) {
      const lookupAddress = addresses.filter((address: any) => {
        const titleMatch = (strVal(address.title) == strVal(addressInfo.title));
        const firstNameMatch = (strVal(address.firstName) == strVal(addressInfo.firstName));
        const lastNameMatch = (strVal(address.lastName) == strVal(addressInfo.lastName));
        const address1Match = (strVal(address.address1) == strVal(addressInfo.address1));
        const address2Match = (strVal(address.address2) == strVal(addressInfo.address2));
        const cityMatch = (strVal(address.city) == strVal(addressInfo.city));
        const postCodeMatch = (strVal(address.postCode) == strVal(addressInfo.postCode));
        const phoneNoMatch = (strVal(address.phoneNo) == strVal(addressInfo.phoneNo));

        return (titleMatch && firstNameMatch && lastNameMatch && address1Match && address2Match && cityMatch && postCodeMatch && phoneNoMatch);
      });
      addressId = (lookupAddress && lookupAddress.length) ? lookupAddress[0].id : 0;
    }

    return addressId;
  };

  useEffect(() => {
    if (!Object.keys(state.shippingInformation).length) {
      setShippingInformation(defaultShippingAddress)
      setBillingInformation(defaultBillingAddress, false)
    }
  }, [defaultShippingAddress]);

  const [basketOrderInfo, setbasketOrderInfo] = useState<any>();
  useEffect(() => {
    if (state?.isPaymentInformationCompleted) {
      getPaymentOrderInfo(state.selectedPaymentMethod)
        .then((basketOrderInfo: any) => {
          setbasketOrderInfo(basketOrderInfo);
        });
    }
  }, [state?.isPaymentInformationCompleted])

  const getPaymentOrderInfo = async (paymentMethod: any) => {
    dispatch({ type: 'SET_PAYMENT_METHOD', payload: paymentMethod });

    const billingInfoClone = { ...state.billingInformation }
    //delete billingInfoClone.id // Commenting this to ensure that duplicate address does not get saved in the system
    const shippingClone = { ...state.shippingInformation }
    //delete shippingClone.id // Commenting this to ensure that duplicate address does not get saved in the system

    const paymentOrderInfo = {
      user,
      basketId,
      customerId: cartItems.userId,
      basket: cartItems,
      billingAddress: {
        ...billingInfoClone,
        country: state.deliveryMethod.name,
        countryCode: state.deliveryMethod.twoLetterIsoCode,
      },
      shippingAddress: {
        ...shippingClone,
        country: state.deliveryMethod.name,
        countryCode: state.deliveryMethod.twoLetterIsoCode,
      },
      selectedShipping: state.shippingMethod,
      selectedPayment: paymentMethod,
      storeId: state.storeId,

      Payment: {
        OrderAmount: cartItems?.grandTotal?.raw?.withTax,
      }
    };

    const billingAddrId = await lookupAddressId(paymentOrderInfo.billingAddress);
    paymentOrderInfo.billingAddress.id = billingAddrId;
    const shippingAddrId = await lookupAddressId(paymentOrderInfo.shippingAddress);
    paymentOrderInfo.shippingAddress.id = shippingAddrId;
    return paymentOrderInfo;
  };

  const loqateAddress = (postCode: string = 'E1') => {
    const handleAsync = async () => {
      const response: any = await axios.post(LOQATE_ADDRESS, {
        postCode,
        country: state.deliveryMethod.twoLetterIsoCode,
      })

      //TODO normalize data
      if (response.data) {
        return response.data.response.data.map((item: any) => {
          return {
            text: item.Text,
            id: item.Id,
            description: item.Description,
          }
        })
      } else return []
    }
    return handleAsync()
  }

  const retrieveAddress = async (id: string) => {
    const response: any = await axios.post(RETRIEVE_ADDRESS, {
      id,
    })
    return {
      postCode: response.data.response.data[0].PostalCode,
      address1: response.data.response.data[0].Line1,
      city: response.data.response.data[0].City,
    }
  }

  const setPaymentIntent = (payload: boolean) =>
    dispatch({ type: 'SET_PAYMENT_INTENT', payload })

  return (
    <>
      {state.isPaymentIntent && <Spinner />}
      <div
        className={`bg-gray-50 relative ${state.isPaymentIntent
          ? 'pointer-events-none hidden overflow-hidden'
          : ''
          }`}
      >
        <div className="max-w-2xl mx-auto pt-4 md:pt-16 lg:pt-16 pb-24 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
          <h2 className="sr-only">{GENERAL_CHECKOUT}</h2>
          <div className="grid lg:grid-cols-5 sm:gap-x-6 xl:gap-x-6">
            <div className='sm:col-span-3 pb-6 lg:order-1 order-2'>
              {!isShippingDisabled && (
                <Delivery
                  appConfig={config}
                  geoData={location}
                  setParentShipping={setShippingMethod}
                  toggleDelivery={toggleDelivery}
                  isDeliveryMethodSelected={state?.isDeliveryMethodSelected}
                />
              )}

              {state.isCNC || isShippingDisabled ? null : (
                <div className="py-6 mt-3 border border-gray-200 bg-white shadow p-6">
                  <h4 className="font-bold uppercase text-black">
                    {GENERAL_DELIVERY_ADDRESS} 
                  </h4>
                  {state?.isDeliveryMethodSelected ? (
                    <>
                      <Form
                        toggleAction={toggleShipping}
                        appConfig={config}
                        values={state?.shippingInformation}
                        updateAddress={updateAddress}
                        onSubmit={handleShippingSubmit}
                        infoType="SHIPPING"
                        schema={shippingSchema}
                        loqateAddress={loqateAddress}
                        config={shippingFormConfig}
                        initialValues={defaultShippingAddress}
                        isInfoCompleted={state?.isShippingInformationCompleted}
                        btnTitle={BTN_DELIVER_TO_THIS_ADDRESS}
                        addresses={addresses}
                        retrieveAddress={retrieveAddress}
                        setAddress={setShippingInformation}
                        isGuest={cartItems.isGuestCheckout}
                        isSameAddress={state?.isSameAddress}
                        isSameAddressCheckboxEnabled={true}
                        sameAddressAction={() => {
                          dispatch({ type: 'SET_SAME_ADDRESS' })
                        }}
                        onEditAddress={handleEditAddress}
                        handleOpenNewAddressModal={handleOpenNewAddressModal}
                      />
                    </>
                  ) : null}
                </div>
              )}

          <NewAddressModal
          selectedAddress={selectedAddress}
          submitState={submitState}
          isOpen={isNewAddressModalOpen}
          onSubmit={(data: any) => {
            submitData(submitDispatch, AddressPageAction.SAVE)
            handleNewAddress(data, () => {
              closeNewAddressModal()
            })
          }}
          onCloseModal={closeNewAddressModal}
          isRegisterAsGuestUser={isRegisterAsGuestUser()}
          btnTitle="Save Address"
          />

              {/* Payment */}
              {/* <div className="py-6 mt-3 border border-gray-200 bg-white shadow p-6">
                <h4 className="font-bold uppercase text-black">
                  {BILLING_INFORMATION}
                </h4>
                {(state?.isShippingInformationCompleted ||
                  state.isCNC ||
                  isShippingDisabled) && (
                    <Form
                      toggleAction={() =>
                        togglePayment(!state.isPaymentInformationCompleted)
                      }
                      onSubmit={handleBillingSubmit}
                      appConfig={config}
                      values={state?.billingInformation}
                      schema={billingSchema}
                      updateAddress={updateAddress}
                      infoType="BILLING"
                      loqateAddress={loqateAddress}
                      config={billingFormConfig}
                      handleNewAddress={handleNewAddress}
                      initialValues={defaultBillingAddress}
                      retrieveAddress={retrieveAddress}
                      isInfoCompleted={state?.isPaymentInformationCompleted}
                      btnTitle={GENERAL_SAVE_CHANGES}
                      addresses={addresses}
                      isGuest={cartItems.isGuestCheckout}
                      setAddress={setBillingInformation}
                      isSameAddressCheckboxEnabled={false}
                    />
                  )}
              </div> */}
              <div className="py-6 mt-3 border border-gray-200 bg-white shadow p-6">
                <h4 className="font-bold uppercase text-black">
                  {GENERAL_PAYMENT}
                </h4>
                {state.isPaymentInformationCompleted && (
                  <Payments
                    paymentData={paymentData}
                    basketOrderInfo={basketOrderInfo}
                    selectedPaymentMethod={state.selectedPaymentMethod}
                    uiContext={uiContext}
                    dispatchState={dispatch}
                  />
                )}
                {(state.isPaymentWidgetActive || !!state.isPaymentIntent) && (
                  <PaymentWidget
                    paymentMethod={state.selectedPaymentMethod}
                    checkoutCallback={checkoutCallback}
                    orderModelResponse={state.orderResponse}
                  />
                )}
                {state.error && (
                  <h4 className="py-5 text-lg font-semibold text-red-500">
                    {state.error}
                  </h4>
                )}
              </div>
            </div>

            {/* Order summary */}
            <div className='sm:col-span-3 md:col-span-3 lg:col-span-2 lg:order-2 order-1'>
              <Summary
                isShippingDisabled={isShippingDisabled}
                cart={cartItems}
                handleItem={handleItem}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
