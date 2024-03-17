import { Layout } from '@components/common'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import Form from '@components/customer'
import axios from 'axios'
import { NEXT_SIGN_UP, NEXT_VALIDATE_EMAIL, NEXT_SIGN_UP_TRADING_ACCOUNT, Messages, BETTERCOMMERCE_DEFAULT_LANGUAGE } from '@components/utils/constants'
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
import Link from 'next/link'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

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
    <>
      <div className="flex flex-1 w-full">
        {
          socialLogins && (
            <SocialSignInLinks containerCss="flex justify-center gap-2 mx-auto w-full" pluginSettings={pluginSettings} />
          )
        }
      </div>
      <div className="relative text-center">
        <span className="relative z-10 inline-block px-4 text-sm font-medium bg-white dark:text-neutral-400 dark:bg-neutral-900">
          OR
        </span>
        <div className="absolute left-0 w-full transform -translate-y-1/2 border top-1/2 border-neutral-100 dark:border-neutral-800"></div>
      </div>
      <div className="flex flex-col items-center justify-center w-full">
        <div className="w-full px-5 font-semibold sm:px-0">
          <label className="text-neutral-800 dark:text-neutral-200">{translate('label.addressBook.emailText')}</label>
          <input
            className="block w-full px-4 py-3 mt-1 text-sm font-normal bg-white border-neutral-200 focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 dark:border-neutral-700 dark:focus:ring-primary-6000 dark:focus:ring-opacity-25 dark:bg-neutral-900 disabled:bg-neutral-200 dark:disabled:bg-neutral-800 rounded-2xl h-11"
            value={value}
            type="email"
            onChange={onChange}
            onKeyUp={(e: any) => handleKeyPress(e)}
          />
        </div>
        {error ? <span className="text-red-500 capitalize">{error}</span> : null}
        <div className="flex items-center justify-center w-full my-5">
          <Button
            className="w-full border border-black btn btn-c btn-primary rounded-2xl"
            buttonType="default"
            action={handleSubmit}
            title={'Submit'}
          />
        </div>
      </div>
    </>
  )
}

function RegisterPage({ recordEvent, setEntities, config, pluginConfig }: any) {
  let b2bSettings = []
  const SOCIAL_LOGINS_ENABLED = getEnabledSocialLogins(pluginConfig)
  const [hasPassedEmailValidation, setHasPassedEmailValidation] = useState(false)
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
      <div className="w-full h-full font-extrabold text-center text-gray-900">
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
    <>
      <section aria-labelledby="trending-heading" className="bg-white">
        <div className="pt-10 pb-10 lg:max-w-7xl lg:mx-auto sm:pt-4 sm:pb-20">
          <div className="flex flex-col items-center justify-center px-4 sm:px-6 lg:px-0">
            <h1 className="my-20 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
              {translate('label.register.freeRegisterText')}
            </h1>
          </div>
          <div className="max-w-md mx-auto space-y-6">
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

            <span className="block text-center text-neutral-700 dark:text-neutral-300">
              Already have an account? {` `}
              <Link className="text-green-600" href="/my-account/login">
                Sign in
              </Link>
            </span>
          </div>
        </div>
      </section>

    </>
  )
}

RegisterPage.Layout = Layout

const PAGE_TYPE = PAGE_TYPES.Page
export default withDataLayer(RegisterPage, PAGE_TYPE)

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const { locale } = context
  return {
    props: {
      ...(await serverSideTranslations(locale ?? BETTERCOMMERCE_DEFAULT_LANGUAGE!)),
    }, // will be passed to the page component as props
  }
}
