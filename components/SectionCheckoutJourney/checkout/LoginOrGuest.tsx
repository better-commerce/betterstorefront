import React, { useState } from 'react'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { DeliveryType, EmptyString, Messages, } from '@components/utils/constants'
import { LoadingDots, useUI } from '@components/ui'
import { guestLoginCheckout2Schema } from './config'
import ShippingAddressForm from './ShippingAddressForm'
import DeliveryTypeSelection from './DeliveryTypeSelection'
import { useTranslation } from '@commerce/utils/use-translation'
import BillingAddressForm from './BillingAddressForm'

const LoginOrGuest: React.FC<any> = ({
  basket,
  onLoginSuccess,
  onGuestCheckout,
  onSubmit,
  searchAddressByPostcode,
  shippingCountries,
  billingCountries,
  handleCollect,
  deliveryTypeMethod,
  setDeliveryTypeMethod,
  featureToggle,
}) => {
  const GUEST_LOGIN_CHECKOUT2_SCHEMA = guestLoginCheckout2Schema();
  const translate = useTranslation()
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
  const loginCheckoutFormSchema = yup.object({
    email: yup
      .string()
      .trim()
      .required(translate('common.message.profile.emailRequiredMsg'))
      .email(translate('common.message.profile.emailInputMsg')),
    password: yup
      .string()
      .min(8, Messages.Validations.Login['PASSWORD_MIN_LENGTH_MESSAGE'])
      .max(24, Messages.Validations.Login['PASSWORD_MIN_LENGTH_MESSAGE'])
      .required(Messages.Validations.ResetPassword['PASSWORD_REQUIRED_MESSAGE'])
      .matches(Messages.Validations.RegularExpressions.PASSWORD_VALIDATION, {
        message: Messages.Validations.ResetPassword.PASSWORD_VALIDATION_MESSAGE,
      }),
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

  const displayView = () => {
    switch (deliveryTypeMethod?.type) {
      case DeliveryType.DELIVER:
        return (
          <ShippingAddressForm
            shippingCountries={shippingCountries}
            guestCheckoutFormik={guestCheckoutFormik}
            onSubmit={onSubmit}
            searchAddressByPostcode={searchAddressByPostcode}
            deliveryType={deliveryTypeMethod?.type}
            isGuest={true}
            onGuestCheckout={onGuestCheckout}
          />
        )
      case DeliveryType.COLLECT:
        return (
          <BillingAddressForm
            guestCheckoutFormik={guestCheckoutFormik}
            onGuestCheckout={onGuestCheckout}
            editAddressValues={null}
            shippingCountries={shippingCountries}
            billingCountries={billingCountries}
            searchAddressByPostcode={searchAddressByPostcode}
            onSubmit={onSubmit}
            useSameForBilling={false}
            shouldDisplayEmail={false}
          />
        )
      default:
        return (
          <div className="grid flex-col w-full gap-2 mt-6 sm:justify-end sm:gap-2 sm:flex-row sm:flex sm:w-auto">
            {isLogin ? (
              <>
                <button
                  className="px-3 py-3 border border-black rounded btn-primary disabled:cursor-not-allowed disabled:opacity-60 btn-c lg:py-2 sm:px-4"
                  onClick={handleCollect}
                >
                  {translate('label.checkout.saveAndContinueToCollectBtnText')}
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
                    {translate('label.checkout.saveAndContinueToCollectBtnText')}
                  </button>
                </form>
              </>
            )}
          </div>
        )
    }
  }

  return (
    <div className="w-full py-5">
      {isLogin ? (
        <>
          <div className="flex items-center justify-between w-full">
            <div>
              <h5 className="font-semibold text-black uppercase font-18">
                {translate('label.login.loginBtnText')}
              </h5>
            </div>
            <div>
              <span className="font-12">
                {translate('label.checkout.checkoutWithoutLoginText')} 
              <button
                  className="py-4 pl-1 font-semibold text-orange-600"
                  onClick={onToggleLoginView}
                >
                  {isLogin ? translate('label.checkout.guestCheckoutText') :translate('label.checkout.loginText')}
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
              placeholder={translate('label.myAccount.emailAddressText')}
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
              placeholder={translate('label.myAccount.passwordText')}
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
              {loginCheckoutFormik.isSubmitting ? <LoadingDots /> : translate('label.login.loginBtnText')}
            </button>
          </form>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between w-full">
            <div>
              <h5 className="font-semibold text-black uppercase font-18">
                {translate('label.checkout.guestCheckoutText')} 
              </h5>
            </div>
            <div>
              <span className="font-12">
                {translate('label.checkout.haveAnAccountText')} 
                <button
                  className="py-4 pl-1 font-semibold text-orange-600"
                  onClick={onToggleLoginView}
                >
                  {isLogin ? translate('label.checkout.guestCheckoutText') :translate('label.checkout.loginText')}
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
              placeholder={translate('label.myAccount.emailAddressText')}
            />
            {guestCheckoutFormik.errors.email && (
              <span className="form-input-error">
                {guestCheckoutFormik.errors.email}
              </span>
            )}
          </form>
          <DeliveryTypeSelection
            basket={basket}
            deliveryTypeMethod={deliveryTypeMethod}
            setDeliveryTypeMethod={setDeliveryTypeMethod}
            featureToggle={featureToggle}
          />
          {displayView()}
        </>
      )}
    </div>
  )
}

export default LoginOrGuest
