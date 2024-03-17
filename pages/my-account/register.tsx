import { Layout } from '@components/common'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import Form from '@components/customer'
import axios from 'axios'
import { NEXT_SIGN_UP, NEXT_VALIDATE_EMAIL, NEXT_SIGN_UP_TRADING_ACCOUNT, Messages } from '@components/utils/constants'
import { useUI } from '@components/ui/context'
import Router from 'next/router'
import { useState, useEffect } from 'react'
import Button from '@components/ui/IndigoButton'
import { validate } from 'email-validator'
import cartHandler from '@components/services/cart'
import eventDispatcher from '@components/services/analytics/eventDispatcher'
import { EVENTS_MAP } from '@components/services/analytics/constants'
import useAnalytics from '@components/services/analytics/useAnalytics'
import SocialSignInLinks from '@components/account/SocialSignInLinks'
import { matchStrings } from '@framework/utils/parse-util'
import { GetServerSideProps } from 'next'
import { Guid } from '@commerce/types'
import { useTranslation } from '@commerce/utils/use-translation'
import { getEnabledSocialLogins } from '@framework/utils/app-util'

const EmailInput = ({ value, onChange, submit, apiError = '', socialLogins, pluginSettings = [] }: any) => {
  const [error, setError] = useState(apiError)
  const translate = useTranslation()
  useEffect(() => {
    setError(apiError)
  }, [apiError])

  const handleSubmit = async () => {
    const isValidEmail = validate(value)
    if (isValidEmail) {
      error ? setError('') : false
      await submit(value)
    } else {
      setError(translate('common.message.pleaseEnterAValidEmailText'))
    }
  }

  function handleKeyPress(e: any) {
    if (e.keyCode == 13) {
      handleSubmit()
    }
  }

  return (
    <div className="w-full flex justify-center mt-10 flex-col items-center sm:pl-10 sm:pr-10">
      <div className="font-semibold w-full px-5 sm:px-0 md:w-1/2">
        <label className="text-gray-700 text-sm">{translate('label.addressBook.emailText')}</label>
        <input
          className="mb-2 mt-2 appearance-none min-w-0 w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 "
          value={value}
          type="email"
          onChange={onChange}
          onKeyUp={(e: any) => handleKeyPress(e)}
        />
      </div>
      {error ? <span className="text-red-500 capitalize">{error}</span> : null}
      <div className="w-full px-5 sm:px-0 md:w-1/2 flex justify-center items-center my-5">
        <Button
          className="btn btn-c btn-primary"
          buttonType="default"
          action={handleSubmit}
          title={'Submit'}
        />
      </div>
      {
        socialLogins && (
          <SocialSignInLinks containerCss="flex justify-center gap-2 mx-auto md:w-1/2 px-3 sm:w-full sm:px-0 width-md-full" pluginSettings={pluginSettings}/>
        )
      }
    </div>
  )
}

function RegisterPage({ recordEvent, setEntities, config, pluginConfig }: any) {
  let b2bSettings = []
  const SOCIAL_LOGINS_ENABLED = getEnabledSocialLogins(pluginConfig)
  const [hasPassedEmailValidation, setHasPassedEmailValidation] =
    useState(false)
  const [userEmail, setUserEmail] = useState('')
  const translate = useTranslation()
  const { isGuestUser, setIsGuestUser, user, basketId } = useUI()
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const { addToCart, associateCart } = cartHandler()
  const { CustomerCreated, PageViewed } = EVENTS_MAP.EVENT_TYPES

  if (config?.configSettings?.length) {
    b2bSettings =
      config?.configSettings?.find((x: any) =>
        matchStrings(x?.configType, 'B2BSettings', true)
      )?.configKeys || []
  }

  useAnalytics(PageViewed, {
    eventType: PageViewed,
  })

  useEffect(() => {
    setError('')
  }, [userEmail])

  if (!isGuestUser && user.userId) {
    Router.push('/')
  }
  if (!isGuestUser && user.userId) {
    return (
      <div className="font-extrabold text-center w-full h-full text-gray-900">
        {translate('common.message.alreadyLoggedInMsg')}
      </div>
    )
  }

  const handleBasketAssociation = async (userId: string) => {
    const response: any = await associateCart(userId, basketId)
  }

  const handleUserRegister = async (values: any) => {
    let userCreated = false
    let recordId = Guid.empty
    const reqData = {
      ...values,
      email: userEmail,
      title: values?.title ?? '',
      gender: values?.gender ?? '',
      firstName: values?.firstName ?? '',
      lastName: values?.lastName ?? '',
      address1: values?.address1 ?? '',
      address2: values?.address2 ?? '',
      address3: values?.address3 ?? '',
      city: values?.city ?? '',
      state: values?.state ?? '',
      country: values?.country ?? '',
      countryCode: values?.countryCode ?? '',
      postCode: values?.postCode ?? '',
      companyName: values?.companyName ?? '',
    }

    // Register trading account, if opted for.
    if (values.isRequestTradingAccount) {
      const tradingAccountResponse: any = await axios.post(
        NEXT_SIGN_UP_TRADING_ACCOUNT,
        {
          data: reqData,
        }
      )

      userCreated =
        tradingAccountResponse &&
        tradingAccountResponse.data?.recordId &&
        tradingAccountResponse.data?.recordId != Guid.empty
          ? true
          : false
      recordId = tradingAccountResponse.data?.recordId
    } else {
      // Otherwise, consider it as user registration.

      const response: any = await axios.post(NEXT_SIGN_UP, {
        data: { ...values, email: userEmail },
      })

      userCreated = (response && response.data?.id) ?? false
      recordId = response.data?.recordId
    }

    // Trigger error message for failed registration.
    if (!userCreated) {
      setError(Messages.Errors['GENERIC_ERROR'])
    }

    // If registration is SUCCESS
    if (userCreated) {
      eventDispatcher(CustomerCreated, {
        entity: JSON.stringify({
          id: recordId,
          name: values.firstName + values.lastName,
          email: values.email,
        }),
        eventType: CustomerCreated,
      })
      await handleBasketAssociation(recordId)
      setSuccessMessage('Success!')
      setIsGuestUser(false)
      Router.push('/my-account/login')
    }
  }

  const handleEmailSubmit = async (email: string) => {
    try {
      const { data }: any = await axios.post(NEXT_VALIDATE_EMAIL, {
        data: email,
      })
      if (!data.length) {
        setHasPassedEmailValidation(true)
      } else {
        setError(translate('common.message.emailAlreadyInUseText'))
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <section aria-labelledby="trending-heading" className="bg-white">
      <div className="py-16 sm:py-24 lg:max-w-7xl lg:mx-auto lg:py-32 lg:px-8">
        <div className="px-4 flex flex-col items-center justify-center sm:px-6 lg:px-0">
          <h1 className="font-extrabold text-center tracking-tight text-gray-900">
            {translate('label.register.freeRegisterText')}
          </h1>
        </div>
        {!successMessage && (
          <>
            {!hasPassedEmailValidation ? (
              <EmailInput
                value={userEmail}
                onChange={(e: any) => setUserEmail(e.target.value)}
                submit={handleEmailSubmit}
                apiError={error}
                pluginSettings={pluginConfig}
                socialLogins={SOCIAL_LOGINS_ENABLED}
              />
            ) : (
              <Form
                type="register"
                b2bSettings={b2bSettings}
                email={userEmail}
                onSubmit={handleUserRegister}
              />
            )}
          </>
        )}
        <span className="flex w-full justify-center items-center text-2xl text-indigo-600">
          {successMessage}
        </span>
      </div>
    </section>
  )
}

RegisterPage.Layout = Layout

const PAGE_TYPE = PAGE_TYPES.Page
export default withDataLayer(RegisterPage, PAGE_TYPE)

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  return {
    props: {}, // will be passed to the page component as props
  }
}
