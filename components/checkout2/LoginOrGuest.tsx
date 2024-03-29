import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import { RadioGroup } from '@headlessui/react'
import * as yup from 'yup'
import {
  EmptyString,
  Messages,
} from '@components/utils/constants'
import { LoadingDots, useUI } from '@components/ui'
import { GUEST_LOGIN_CHECKOUT2_SCHEMA } from './config'
import ShippingAddressForm from './ShippingAddressForm'
import {
  SAVE_AND_CONTINUE_TO_COLLECT,
} from '@components/utils/textVariables'
import DeliveryTypeSelection from './DeliveryTypeSelection'

const loginCheckoutFormSchema = yup.object({
  email: yup
    .string()
    .trim()
    .required(
      Messages.Validations.CheckoutSection.ContactDetails.EMAIL_ADDRESS_REQUIRED
    )
    .email(
      Messages.Validations.CheckoutSection.ContactDetails.EMAIL_ADDRESS_INPUT
    ),
  password: yup
    .string()
    .min(8, Messages.Validations.Login['PASSWORD_MIN_LENGTH_MESSAGE'])
    .max(24, Messages.Validations.Login['PASSWORD_MIN_LENGTH_MESSAGE'])
    .required(Messages.Validations.ResetPassword['PASSWORD_REQUIRED_MESSAGE'])
    .matches(Messages.Validations.RegularExpressions.PASSWORD_VALIDATION, {
      message: Messages.Validations.ResetPassword.PASSWORD_VALIDATION_MESSAGE,
    }),
})

const LoginOrGuest: React.FC<any> = ({
  onLoginSuccess,
  onGuestCheckout,
  onSubmit,
  searchAddressByPostcode,
  shippingCountries,
  handleCollect,
  deliveryTypeMethod,
  setDeliveryTypeMethod
}) => {
  const [isLogin, setIsLogin] = useState<boolean>(false)
  const { user } = useUI()
  const guestCheckoutFormik: any = useFormik({
    initialValues: {
      email: user?.userEmail || EmptyString,
      notifyByEmail: true,
      notifyBySms: false,
      notifyByPost: false,
    },
    validationSchema: GUEST_LOGIN_CHECKOUT2_SCHEMA,
    onSubmit: (values, { setSubmitting }) => {
      const payload: any = GUEST_LOGIN_CHECKOUT2_SCHEMA.cast(values)
      guestCheckoutFormik.values.email = payload.email
      onGuestCheckout(payload, () => setSubmitting(false));
      handleCollect()
    },
  })
  const loginCheckoutFormik = useFormik({
    initialValues: {
      email: EmptyString,
      password: EmptyString,
    },
    validationSchema: loginCheckoutFormSchema,
    onSubmit: (values, { setSubmitting }) => {
      const payload: any = loginCheckoutFormSchema.cast(values)
      loginCheckoutFormik.values.email = payload.email
      onLoginSuccess(payload, () => {
        setSubmitting(false)
      })
    },
  })

  const onToggleLoginView = () => {
    if (guestCheckoutFormik.isSubmitting) return
    setIsLogin(!isLogin)
  }

  return (
    <div className="w-full py-5">
      {isLogin ? (
        <>
          <div className="flex items-center justify-between w-full">
            <div>
              <h5 className="font-semibold text-black uppercase font-18">
                Login
              </h5>
            </div>
            <div>
              <span className="font-12">
                Want to checkout without login?
                <button
                  className="py-4 pl-1 font-semibold text-orange-600"
                  onClick={onToggleLoginView}
                >
                  {isLogin ? 'Guest Checkout' : 'Log in'}
                </button>
              </span>
            </div>
          </div>
          <form
            className="flex flex-col gap-4"
            onSubmit={loginCheckoutFormik.handleSubmit}
          >
            <input
              className="block w-full rounded border-0 h-12 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-black focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6 dark:bg-white"
              type="text"
              value={loginCheckoutFormik.values.email}
              name="email"
              onChange={loginCheckoutFormik.handleChange}
              placeholder="Email Address"
            />
            {loginCheckoutFormik.errors.email &&
              loginCheckoutFormik.touched.email && (
                <span className="form-input-error">
                  {loginCheckoutFormik.errors.email}
                </span>
              )}
            <input
              className="block w-full rounded border-0 h-12 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-black focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6 dark:bg-white"
              type="password"
              name="password"
              value={loginCheckoutFormik.values.password}
              onChange={loginCheckoutFormik.handleChange}
              placeholder="Password"
            />
            {loginCheckoutFormik.errors.password &&
              loginCheckoutFormik.touched.password && (
                <span className="form-input-error">
                  {loginCheckoutFormik.errors.password}
                </span>
              )}
            <button
              type="submit"
              className="px-1 py-3 btn-c btn-primary disabled:cursor-not-allowed disabled:opacity-60 lg:py-2 sm:px-4"
              disabled={loginCheckoutFormik.isSubmitting}
            >
              {loginCheckoutFormik.isSubmitting ? <LoadingDots /> : 'Login'}
            </button>
          </form>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between w-full">
            <div>
              <h5 className="font-semibold text-black uppercase font-18">
                Guest Checkout
              </h5>
            </div>
            <div>
              <span className="font-12">
                Have an account?
                <button
                  className="py-4 pl-1 font-semibold text-orange-600"
                  onClick={onToggleLoginView}
                >
                  {isLogin ? 'Guest Checkout' : 'Log in'}
                </button>
              </span>
            </div>
          </div>
          <form
            className="flex flex-col gap-1 my-0 sm:gap-4 sm:my-2"
            onSubmit={guestCheckoutFormik.handleSubmit}
          >
            <input
              className="block w-full rounded border-0 h-12 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-black focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6 dark:bg-white"
              type="text"
              value={guestCheckoutFormik.values.email}
              name="email"
              onChange={guestCheckoutFormik.handleChange}
              placeholder="Email Address"
            />
            {guestCheckoutFormik.errors.email && (
              <span className="form-input-error">
                {guestCheckoutFormik.errors.email}
              </span>
            )}
          </form>
          <DeliveryTypeSelection
            deliveryTypeMethod={deliveryTypeMethod}
            setDeliveryTypeMethod={setDeliveryTypeMethod}
          />
          {deliveryTypeMethod?.type === 1 ? (
            <ShippingAddressForm
              shippingCountries={shippingCountries}
              guestCheckoutFormik={guestCheckoutFormik}
              onSubmit={onSubmit}
              searchAddressByPostcode={searchAddressByPostcode}
              deliveryType={deliveryTypeMethod.type}
              isGuest={true}
              onGuestCheckout={onGuestCheckout}
            />
          ) : (
            <>
              <div className="grid flex-col w-full gap-2 mt-6 sm:justify-end sm:gap-2 sm:flex-row sm:flex sm:w-auto">
                {isLogin ? (
                  <>
                    <button
                      className="px-3 py-3 border border-black rounded btn-primary disabled:cursor-not-allowed disabled:opacity-60 btn-c lg:py-2 sm:px-4"
                      onClick={handleCollect}
                    >
                      {SAVE_AND_CONTINUE_TO_COLLECT}
                    </button>
                  </>
                ) : (
                  <>
                    <form onSubmit={guestCheckoutFormik.handleSubmit}>
                      <button
                        type="submit"
                        disabled={guestCheckoutFormik.isSubmitting}
                        className="px-3 py-3 border border-black rounded btn-primary disabled:cursor-not-allowed disabled:opacity-60 btn-c lg:py-2 sm:px-4"
                      >
                        {SAVE_AND_CONTINUE_TO_COLLECT}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}

export default LoginOrGuest
