import React, { useState, useEffect, useReducer } from 'react'
import { useUI } from '@components/ui/context'
import { NEXT_ADDRESS, NEXT_EDIT_ADDRESS, NEXT_CREATE_ADDRESS, NEXT_DELETE_ADDRESS, BETTERCOMMERCE_DEFAULT_COUNTRY, AddressPageAction, NEXT_GET_COUNTRIES, Messages, } from '@components/utils/constants'
import axios from 'axios'
import AddressItem from './AddressItem'
import Form from './AddressBookForm'
import { LoadingDots } from '@components/ui'
import { CustomerAddressModel } from 'models/customer'
import { recordGA4Event } from '@components/services/analytics/ga4'
import { getCurrentPage, resetSubmitData, submitData, parseFullName, } from '@framework/utils/app-util'
import useDataSubmit from '@commerce/utils/use-data-submit'
// import useDevice from '@commerce/utils/use-device'
import NewAddressModal from '@components/checkout-old/CheckoutForm/NewAddressModal'
import { matchStrings } from '@framework/utils/parse-util'
import Link from 'next/link'
import { Guid } from '@commerce/types'
import { AlertType } from '@framework/utils/enums'
import { DEFAULT_COUNTRY } from '@components/checkout/BillingAddressForm'
import { useTranslation } from '@commerce/utils/use-translation'
export function asyncHandler() {
  function getAddress() {
    return async (id: string) => {
      const response = await axios.post(NEXT_ADDRESS, {
        id,
      })
      return response.data
    }
  }
  function updateAddress() {
    return async (data: CustomerAddressModel) => {
      const response = await axios.post(NEXT_EDIT_ADDRESS, data)
      return response.data
    }
  }
  function createAddress() {
    return async (data: CustomerAddressModel) => {
      const response = await axios.post(NEXT_CREATE_ADDRESS, data)
      return response.data
    }
  }
  function deleteAddress() {
    return async (data: any) => {
      const response = await axios.post(NEXT_DELETE_ADDRESS, data)
      return response.data
    }
  }
  return {
    getAddress: getAddress(),
    updateAddress: updateAddress(),
    createAddress: createAddress(),
    deleteAddress: deleteAddress(),
  }
}

export default function AddressBook({ deviceInfo }: any) {
  const [data, setData] = useState([])
  const translate = useTranslation();
  const [isNewFormMode, setNewFormMode] = useState(false)
  const [title, setTitle] = useState(translate('label.addressBook.addressBookTitleText'))
  const [isLoading, setIsLoading] = useState(true)
  const { getAddress, updateAddress, createAddress, deleteAddress } =
    asyncHandler()

  const { user, isGuestUser, cartItems, setAddressId ,setAlert } = useUI()
  const [selectedAddress, setSelectedAddress] = useState()
  const [isNewAddressModalOpen, setIsNewAddressModalOpen] = useState(false)
  const [defaultShippingAddress, setDefaultShippingAddress] = useState({})
  const [defaultBillingAddress, setDefaultBillingAddress] = useState({})
  const [countries, setCountries] = useState<any>(null)
  const defaultDeliveryMethod = cartItems.shippingMethods?.find(
    (i: any) => i.id === cartItems.shippingMethodId
  )
  const isB2B = user?.companyId !== Guid.empty
  const { state: submitState, dispatch: submitDispatch } = useDataSubmit()
  // const { isMobile, isDesktop } = useDevice()
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
    isPaymentIntent: new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret'
    ),
    isPaymentWidgetActive: false,
  }
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE)
  function reducer(state: any, { type, payload }: any) {
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

 useEffect(() => {
    const fetchCountries = async () => {
      try {
        const { data }: any = await axios.post(NEXT_GET_COUNTRIES)
        if ( data?.result?.length > 0) {
          setCountries(data?.result)
        } else {
          setCountries([])
        }
      } catch (error) {
        setCountries([])
        // console.log(error)
      }
    }
    fetchCountries()
  }, [])

  const fetchAddress = async () => {
    !isLoading && setIsLoading(true)
    try {
      const response: any = await getAddress(user.userId)
      setIsLoading(false)
      setData(response)
    } catch (error) {
      console.log(error, 'err')
      failCb()
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAddress()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const success = () => {
    fetchAddress()
    setTitle(translate('label.addressBook.detailsUPdatedText'))
    window.scrollTo(0, 0)
  }

  const failCb = () => {
    setTitle(translate('label.addressBook.updateFailedText'))
    window.scrollTo(0, 0)
  }

  const addNewAddress = async (values: any) => {
    let newValues = { ...values, userId: user.userId }
    let currentPage = getCurrentPage()

    if (typeof window !== 'undefined') {
      if (currentPage) {
        recordGA4Event(window, 'save_new_address', {
          current_page: currentPage,
        })
      }
    }

    return createAddress(newValues)
      .then(() => {
        setNewFormMode(false)
        success()
      })
      .catch(() => failCb())
  }

  const handleEditAddress = async (id: number) => {
    const { data }: any = await axios.post(NEXT_ADDRESS, {
      id: user?.userId,
      addressId: id,
    })
    let res = data.find((el: any) => el?.id === id)
    setSelectedAddress(res)
    // if (isMobile) {
    setAddressId(id)
    openNewAddressModal()
    // } else {
    //   setAddressId(id)
    //   openNewAddressModal()
    // }
  }

  const handleSelectAddress = async (address: any) => {
    if (address?.id) {
      setAddressId(0)
      closeNewAddressModal()
      resetSubmitData(submitDispatch)
    }
  }

  const closeNewAddressModal = () => {
    setIsNewAddressModalOpen(false)
    resetSubmitData(submitDispatch)
  }

  const openNewAddressModal = () => {
    setIsNewAddressModalOpen(true)
  }

  const getUserId = () => {
    if (user?.userId) {
      return user?.userId
    }
    return cartItems?.userId
  }

  const isRegisterAsGuestUser = () => {
    return (getUserId() && isGuestUser) || !getUserId()
  }

  const handleOpenNewAddressModal = () => {
    setAddressId(0)
    setSelectedAddress(undefined)
    openNewAddressModal()
  }
  const handleNewAddress = (data: any, callback?: Function) => {
    const values = {
      address1: data?.address1,
      address2: data?.address2,
      address3: data?.address3,
      city: data?.city,
      state: data?.state,
      firstName: data?.firstName,
      lastName: data?.lastName || '',
      phoneNo: data?.mobileNumber,
      postCode: data?.postCode,
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
      country: data?.country?.split('&')?.[1] || data?.country || DEFAULT_COUNTRY,
      countryCode: data?.country?.includes('&') ? data.country.split('&')[0] : data?.countryCode || BETTERCOMMERCE_DEFAULT_COUNTRY
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
              setAlert({ type: AlertType.ERROR, msg: translate('common.message.requestCouldNotProcessErrorMsg')})
              closeNewAddressModal()
            })
        } else {
          setAlert({ type: AlertType.ERROR, msg: translate('common.message.addressAlreadyExistsErrorMsg') })
          closeNewAddressModal()
        }
      })
    } else {
      updateAddress({
        ...newValues,
        ...{ id: data?.id, customerId: cartItems?.userId },
      })
        .then((saveAddressResult: any) => {
          // const updatedUser = { ...user, ...{ notifyByWhatsapp: data?.whtsappUpdated } };
          // setUser(updatedUser);
          // axios.post(NEXT_UPDATE_DETAILS, updatedUser).then((updateUserResult: any) => {
          // });
          fetchAddress()

          if (callback) { callback()}
          else{ setAlert({ type: AlertType.ERROR, msg: translate('common.message.requestCouldNotProcessErrorMsg')})}
          closeNewAddressModal()
          // setAlert({type:'success',msg:ADDRESS_UPDATE})
        })
        .catch((error: any) => {
          setAlert({ type: AlertType.ERROR, msg: translate('common.message.requestCouldNotProcessErrorMsg')})
          closeNewAddressModal()
        })
    }
  }
  const lookupAddressId = async (addressInfo: any, addresses?: Array<any>) => {
    if (!addresses) {
      addresses = await getAddress(addressInfo?.userId ?? user?.userId)
    }

    const strVal = (val: string): string => {
      if (val) {
        return val.trim().toLowerCase()
      }
      return ''
    }

    let addressId = 0
    if (addresses && addresses.length) {
      const lookupAddress = addresses.filter((address: any) => {
        const titleMatch = strVal(address.title) == strVal(addressInfo.title)
        const firstNameMatch = strVal(address.firstName) == strVal(addressInfo.firstName)
        const lastNameMatch = strVal(address.lastName) == strVal(addressInfo.lastName)
        const address1Match = strVal(address.address1) == strVal(addressInfo.address1)
        const address2Match = strVal(address.address2) == strVal(addressInfo.address2)
        const address3Match = strVal(address.address3) == strVal(addressInfo.address3)
        const cityMatch = strVal(address.city) == strVal(addressInfo.city)
        const stateMatch = strVal(address.state) == strVal(addressInfo.state)
        const country = strVal(address.country) == strVal(addressInfo.country)
        const postCodeMatch = strVal(address.postCode) == strVal(addressInfo.postCode)
        const phoneNoMatch = strVal(address.phoneNo) == strVal(addressInfo.phoneNo)

        return (
          titleMatch &&
          firstNameMatch &&
          lastNameMatch &&
          address1Match &&
          address2Match &&
          address3Match &&
          cityMatch &&
          stateMatch &&
          country &&
          postCodeMatch &&
          phoneNoMatch
        )
      })
      addressId =
        lookupAddress && lookupAddress.length ? lookupAddress[0].id : 0
    }

    return addressId
  }
  return (
    <>
      <div className="px-2 py-4 mb-4 border-b mob-header md:hidden full-m-header">
        <h3 className="max-w-4xl mx-auto text-xl font-semibold text-black">
          <Link href="/my-account">
            <span className="mr-2 leading-none">
              <i className="sprite-icon sprite-left-arrow"></i>
            </span>
          </Link>
          {translate('label.checkout.addressesText')} </h3>
      </div>
      <main className="px-4 mt-4 lg:px-8">
        {!isB2B && (
          <div className="mx-auto lg:px-0 lg:mb-14">
            <div className="px-0 pt-10 sm:px-0">
              <h1 className="mb-3 font-bold tracking-tight text-primary sm:mb-5 dark:text-black">
                <span className="hidden text-xl sm:inline-block">{title}</span>
                <span className="inline-block sm:hidden">{translate('label.addressBook.savedAddressesText')}</span>
              </h1>
            </div>
          </div>
        )}
        <div className="max-w-4xl mx-auto">
          {!data.length && !isLoading && (
            <div className="py-4 sm:py-10 lg:mx-0">{translate('label.addressBook.emptyAddressBookText')}</div>
          )}
          {isLoading ? <LoadingDots /> : null}
        </div>
        {isNewFormMode && (
          <Form
            initialValues={{}}
            closeEditMode={() => setNewFormMode(false)}
            onSubmit={addNewAddress}
          />
        )}
        {!isNewFormMode && (
          <>
            <div className="grid grid-cols-1 gap-5 mx-auto sm:grid-cols-2 sm:gap-y-4 gap-y-2">
              {data.map((item: any, idx: number) => {
                return (
                  <AddressItem
                    errCallback={failCb}
                    successCallback={success}
                    key={idx}
                    user={user}
                    updateAddress={updateAddress}
                    selectedAddress={selectedAddress}
                    onOpenAddressModal={openNewAddressModal}
                    onSelectAddress={handleSelectAddress}
                    onEditAddress={handleEditAddress}
                    item={item}
                    userId={user.userId}
                    deleteAddress={deleteAddress}
                  />
                )
              })}

              <div className="sticky bottom-0 z-10 flex flex-col justify-center w-full mt-12 bg-white sm:hidden">
                {/* {
                displayAlert ? (
                    <div className="mb-3 m-[-40px] w-auto sm:hidden">
                      <AlertRibbon />
                    </div>
                ) : null
              } */}
                <div className="flex flex-col mb-3 sm:my-0">
                  <button
                    type="submit"
                    onClick={(ev: any) => handleOpenNewAddressModal()}
                    className="w-full p-4 font-semibold text-center text-black border border-gray-200 cursor-pointer"
                  >
                    <span className="hidden sm:inline-block">
                      {translate('label.addressBook.addNewAddress')}{' '}
                    </span>
                    <span className="inline-block text-sm sm:hidden">
                      {translate('label.addressBook.addNewAddress')} {' '}
                    </span>
                    <span className="hidden ml-2 leading-none align-middle sm:inline-block">
                      <i className="sprite-icon icon-location-orange"></i>
                    </span>
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-start">
              <div className="items-center justify-center hidden text-white sm:flex add-list-div">
                <button
                  type="submit"
                  onClick={(ev: any) => handleOpenNewAddressModal()}
                  className="btn-primary btn"
                >
                  {translate('label.addressBook.addNewAddress')}{' '}
                  <span className="inline-block ml-2 leading-none align-middle">
                    <i className="sprite-icon icon-location-orange"></i>
                  </span>
                </button>
              </div>
            </div>
          </>
        )}
        <NewAddressModal
          selectedAddress={selectedAddress}
          submitState={submitState}
          isOpen={isNewAddressModalOpen}
          countries = {countries}
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
      </main>
    </>
  )
}
