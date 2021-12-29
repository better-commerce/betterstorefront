import { useUI } from '@components/ui/context'
import { useReducer, useEffect } from 'react'
import cartHandler from '@components/services/cart'
import Delivery from './Delivery'
import Summary from './Summary'
import Form from './Form'
import axios from 'axios'
import {
  NEXT_UPDATE_CHECKOUT_ADDRESS,
  NEXT_PAYMENT_METHODS,
  NEXT_CONFIRM_ORDER,
  NEXT_POST_PAYMENT_RESPONSE,
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

export default function CheckoutForm({
  cart,
  user,
  defaultShippingAddress,
  defaultBillingAddress,
  addresses = [],
  fetchAddress,
  config,
  location,
}: any) {
  const { setCartItems, basketId, cartItems, setOrderId, orderId } = useUI()

  const defaultDeliveryMethod = cartItems.shippingMethods.find(
    (i: any) => i.id === cartItems.shippingMethodId
  )
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
  }
  interface actionInterface {
    type?: string
    payload?: any
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
      default: {
        return state
      }
    }
  }

  const [state, dispatch] = useReducer(reducer, INITIAL_STATE)
  const { addToCart } = cartHandler()

  const { createAddress } = asyncHandler()

  const handleNewAddress = (values: any, callback: any = () => {}) => {
    const newValues = {
      ...values,
      userId: user.userId,
      country: state.deliveryMethod.value,
      countryCode: state.deliveryMethod.code,
    }
    createAddress(newValues)
      .then((response: any) => {
        callback()
        fetchAddress()
      })
      .catch((error: any) => console.log(error))
  }

  const toggleDelivery = (payload?: any) =>
    dispatch({ type: 'TOGGLE_DELIVERY_METHOD', payload })

  const toggleShipping = () => {
    dispatch({ type: 'TOGGLE_SHIPPING' })
  }

  const paymentData = async () => {
    const response = await axios.post(NEXT_PAYMENT_METHODS, {
      currencyCode: cartItems.baseCurrency,
      countryCode: state.deliveryMethod.twoLetterIsoCode,
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
        const item = await addToCart(data)
        setCartItems(item)
      } catch (error) {
        console.log(error)
      }
    }
    asyncHandleItem()
  }

  const setShippingInformation = (payload: any) =>
    dispatch({ type: 'SET_SHIPPING_INFORMATION', payload })

  const setBillingInformation = (payload: any, update = true) => {
    const handleAsync = async () => {
      const billingInfoClone = { ...payload }
      delete billingInfoClone.id
      const shippingClone = { ...state.shippingInformation }
      delete shippingClone.id

      const data = {
        billingAddress: {
          ...billingInfoClone,
          country: state.deliveryMethod.value,
          countryCode: state.deliveryMethod.code,
        },
        shippingAddress: {
          ...shippingClone,
          country: state.deliveryMethod.value,
          countryCode: state.deliveryMethod.code,
        },
      }

      try {
        await axios.post(NEXT_UPDATE_CHECKOUT_ADDRESS, {
          basketId,
          model: data,
        })
      } catch (error) {}
    }
    dispatch({ type: 'SET_BILLING_INFORMATION', payload })
    if (update) handleAsync()
  }

  const handleShippingSubmit = (values: any) => {
    toggleShipping()
    if (state.isSameAddress) {
      setBillingInformation(values)
      togglePayment(true)
    }
    setShippingInformation(values)
  }

  const handleBillingSubmit = (values: any) => {
    togglePayment()
    setBillingInformation(values)
  }

  useEffect(() => {
    setShippingInformation(defaultShippingAddress)
    setBillingInformation(defaultBillingAddress, false)
  }, [])

  const handlePayments = (method: any) => {
    // const isTestUrl = state.selectedPaymentMethod.settings.find((method:any) => method.key === 'UseSandbox').value === 'True';
    const paymentObject = method.settings.reduce((acc: any, obj: any) => {
      if (obj.key === 'UseSandbox') {
        acc['isTestUrl'] = obj.value === 'True'
        return acc
      }
      if (obj.key === 'TestUrl') {
        acc['testUrl'] = obj.value
        return acc
      }
      if (obj.key === 'ProductionUrl') {
        acc['prodUrl'] = obj.value
        return acc
      }
      return acc
    }, {})
    //@TODO temporary
    // switch (method.inputType) {
    //   case 15:
    //     paymentObject.isTestUrl
    //       ? window.open(paymentObject.testUrl, '_self')
    //       : window.open(paymentObject.prodUrl, '_self')
    //     break
    //   default:
    //     return false
    // }
  }

  const confirmOrder = (method: any) => {
    dispatch({ type: 'SET_PAYMENT_METHOD', payload: method })

    const billingInfoClone = { ...state.billingInformation }
    delete billingInfoClone.id
    const shippingClone = { ...state.shippingInformation }
    delete shippingClone.id

    const data = {
      basketId,
      customerId: cartItems.userId,
      basket: cartItems,
      billingAddress: {
        ...billingInfoClone,
        country: state.deliveryMethod.value,
        countryCode: state.deliveryMethod.code,
      },
      shippingAddress: {
        ...shippingClone,
        country: state.deliveryMethod.value,
        countryCode: state.deliveryMethod.code,
      },
      selectedShipping: state.shippingMethod,
      selectedPayment: method,
      storeId: state.storeId,
      Payment: {
        Id: null,
        CardNo: null,
        OrderNo: 0,
        OrderAmount: cartItems.grandTotal.raw.withTax,
        PaidAmount: 0.0,
        BalanceAmount: 0.0,
        IsValid: false,
        Status: 0,
        AuthCode: null,
        IssuerUrl: null,
        PaRequest: null,
        PspSessionCookie: null,
        PspResponseCode: null,
        PspResponseMessage: null,
        PaymentGatewayId: method.id,
        PaymentGateway: method.systemName,
        Token: null,
        PayerId: null,
        CvcResult: null,
        AvsResult: null,
        Secure3DResult: null,
        CardHolderName: null,
        IssuerCountry: null,
        Info1: null,
        FraudScore: null,
        PaymentMethod: method.systemName,
        IsVerify: false,
        IsValidAddress: false,
        LastUpdatedBy: null,
        OperatorId: null,
        RefStoreId: null,
        TillNumber: null,
        ExternalRefNo: null,
        ExpiryYear: null,
        ExpiryMonth: null,
        IsMoto: false,
      },
    }

    const handleAsync = async () => {
      try {
        const response: any = await axios.post(NEXT_CONFIRM_ORDER, {
          basketId,
          model: data,
        })
        if (response.data.result.id) {
          handlePayments(method)
          //@TODO temporary move to BE
        }
        const orderModel = {
          id: response.data.result.payment.id,
          cardNo: 'null',
          orderNo: response.data.result.orderNo,
          orderAmount: response.data.result.grandTotal.raw.withTax,
          paidAmount: response.data.result.grandTotal.raw.withTax,
          balanceAmount: '0.00',
          isValid: true,
          status: 'paid',
          authCode: 'null',
          issuerUrl: 'null',
          paRequest: 'null',
          pspSessionCookie: 'null',
          pspResponseCode: 'null',
          pspResponseMessage: 'null',
          paymentGatewayId: method.id,
          paymentGateway: method.systemName,
          token: 'null',
          payerId: 'null',
          cvcResult: 'null',
          avsResult: 'null',
          secure3DResult: 'null',
          cardHolderName: 'null',
          issuerCountry: 'null',
          info1: '',
          fraudScore: 'null',
          paymentMethod: method.systemName,
          cardType: 'null',
          operatorId: 'null',
          refStoreId: 'null',
          tillNumber: 'null',
          externalRefNo: 'null',
          expiryYear: 'null',
          expiryMonth: 'null',
          isMoto: 'true',
          upFrontPayment: 'false',
          upFrontAmount: '0.00',
          upFrontTerm: '76245369',
          isPrePaid: 'false',
        }
        if (method.systemName === 'COD') {
          const orderModelResponse: any = await axios.post(
            NEXT_POST_PAYMENT_RESPONSE,
            {
              model: orderModel,
            }
          )
          // if (orderModelResponse.data.success) {
          //   setOrderId(response.data.result.id)
          //   Router.push('/thank-you')
          // }
        }
      } catch (error) {
        console.log(error)
      }
    }
    handleAsync()
  }

  const handlePaymentMethod = (method: any) => {
    confirmOrder(method)
  }

  return (
    <div className="bg-gray-50 relative">
      <div className="max-w-2xl mx-auto pt-16 pb-24 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="sr-only">Checkout</h2>
        <form className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
          <div>
            <Delivery
              appConfig={config}
              geoData={location}
              setParentShipping={setShippingMethod}
              toggleDelivery={toggleDelivery}
              isDeliveryMethodSelected={state?.isDeliveryMethodSelected}
            />

            {state.isCNC ? null : (
              <div className="mt-4 border-t border-gray-200 pt-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Shipping information
                </h2>
                {state?.isDeliveryMethodSelected ? (
                  <>
                    <Form
                      toggleAction={toggleShipping}
                      appConfig={config}
                      values={state?.shippingInformation}
                      onSubmit={handleShippingSubmit}
                      schema={shippingSchema}
                      config={shippingFormConfig}
                      initialValues={defaultShippingAddress}
                      isInfoCompleted={state?.isShippingInformationCompleted}
                      btnTitle="Deliver to this address"
                      addresses={addresses}
                      handleNewAddress={handleNewAddress}
                      setAddress={setShippingInformation}
                      isGuest={cartItems.isGuestCheckout}
                      isSameAddress={state?.isSameAddress}
                      isSameAddressCheckboxEnabled={true}
                      sameAddressAction={() => {
                        dispatch({ type: 'SET_SAME_ADDRESS' })
                      }}
                    />
                  </>
                ) : null}
              </div>
            )}

            {/* Payment */}
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Billing information
              </h2>
              {(state?.isShippingInformationCompleted || state.isCNC) && (
                <Form
                  toggleAction={() =>
                    togglePayment(!state.isPaymentInformationCompleted)
                  }
                  onSubmit={handleBillingSubmit}
                  appConfig={config}
                  values={state?.billingInformation}
                  schema={billingSchema}
                  config={billingFormConfig}
                  handleNewAddress={handleNewAddress}
                  initialValues={defaultBillingAddress}
                  isInfoCompleted={state?.isPaymentInformationCompleted}
                  btnTitle="Save"
                  addresses={addresses}
                  isGuest={cartItems.isGuestCheckout}
                  setAddress={setBillingInformation}
                  isSameAddressCheckboxEnabled={false}
                />
              )}
            </div>
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h2 className="text-lg font-semibold text-gray-900">Payment</h2>
              {state.isPaymentInformationCompleted && (
                <Payments
                  handlePaymentMethod={handlePaymentMethod}
                  paymentData={paymentData}
                  selectedPaymentMethod={state.selectedPaymentMethod}
                />
              )}
            </div>
          </div>

          {/* Order summary */}
          <Summary
            confirmOrder={confirmOrder}
            cart={cartItems}
            handleItem={handleItem}
          />
        </form>
      </div>
    </div>
  )
}
