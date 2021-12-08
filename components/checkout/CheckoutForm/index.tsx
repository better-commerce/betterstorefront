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
} from '@components/utils/constants'
import {
  shippingFormConfig,
  shippingSchema,
  billingFormConfig,
  billingSchema,
} from './config'
import Payments from './Payments'

export default function CheckoutForm({
  cart,
  user,
  defaultShippingAddress,
  defaultBillingAddress,
  addresses = [],
}: any) {
  const { setCartItems, basketId, cartItems } = useUI()

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

  const toggleDelivery = (payload?: any) =>
    dispatch({ type: 'TOGGLE_DELIVERY_METHOD', payload })

  const toggleShipping = () => {
    dispatch({ type: 'TOGGLE_SHIPPING' })
  }

  const handlePaymentMethod = (method: any) => {
    dispatch({ type: 'SET_PAYMENT_METHOD', payload: method })
  }

  const paymentData = async () => {
    const response = await axios.post(NEXT_PAYMENT_METHODS, {
      currencyCode: cartItems.baseCurrency,
      countryCode: state.deliveryMethod.code,
    })
    return response
  }

  const setShippingMethod = (payload: any) =>
    dispatch({ type: 'SET_SHIPPING_METHOD', payload })

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

  const confirmOrder = () => {
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
      selectedPayment: state.selectedPaymentMethod,
    }
    const handleAsync = async () => {
      const response = await axios.post(NEXT_CONFIRM_ORDER, {
        basketId,
        model: data,
      })
    }
    handleAsync()
  }

  return (
    <div className="bg-gray-50 relative">
      <div className="max-w-2xl mx-auto pt-16 pb-24 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="sr-only">Checkout</h2>
        <form className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
          <div>
            <Delivery
              setParentShipping={setShippingMethod}
              toggleDelivery={toggleDelivery}
              isDeliveryMethodSelected={state?.isDeliveryMethodSelected}
            />

            <div className="mt-4 border-t border-gray-200 pt-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Shipping information
              </h2>
              {state?.isDeliveryMethodSelected ? (
                <>
                  <Form
                    toggleAction={toggleShipping}
                    values={state?.shippingInformation}
                    onSubmit={handleShippingSubmit}
                    schema={shippingSchema}
                    config={shippingFormConfig}
                    initialValues={defaultShippingAddress}
                    isInfoCompleted={state?.isShippingInformationCompleted}
                    btnTitle="Deliver to this address"
                    addresses={addresses}
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

            {/* Payment */}
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Billing information
              </h2>
              {state?.isShippingInformationCompleted && (
                <Form
                  toggleAction={() =>
                    togglePayment(!state.isPaymentInformationCompleted)
                  }
                  onSubmit={handleBillingSubmit}
                  values={state?.billingInformation}
                  schema={billingSchema}
                  config={billingFormConfig}
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
