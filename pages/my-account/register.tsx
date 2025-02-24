import Layout from '@components/Layout/Layout'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import Form from '@components/customer'
import NextHead from 'next/head'
import axios from 'axios'
import Link from 'next/link'
import { NEXT_SIGN_UP, NEXT_VALIDATE_EMAIL, NEXT_SIGN_UP_TRADING_ACCOUNT, NEXT_AUTHENTICATE, NEXT_GET_CUSTOMER_DETAILS, SITE_ORIGIN_URL, EmptyString } from '@components/utils/constants'
import { useUI } from '@components/ui/context'
import Router, { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Button from '@components/ui/IndigoButton'
import { validate } from 'email-validator'
import cartHandler from '@components/services/cart'
import useAnalytics from '@components/services/analytics/useAnalytics'
import { matchStrings, stringToBoolean } from '@framework/utils/parse-util'
import { GetServerSideProps } from 'next'
import { Guid } from '@commerce/types'
import { useTranslation } from '@commerce/utils/use-translation'
import { getEnabledSocialLogins, saveUserToken } from '@framework/utils/app-util'
import SocialSignInLinks from '@components/shared/Login/SocialSignInLinks'
import { AlertType } from '@framework/utils/enums'
import { IPagePropsProvider } from '@framework/contracts/page-props/IPagePropsProvider'
import { getPagePropType, PagePropType } from '@framework/page-props'
import { AnalyticsEventType } from '@components/services/analytics'

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
      {/* <div className="flex flex-1 w-full">
        {
          socialLogins && (
            <>
              <SocialSignInLinks containerCss="flex justify-center gap-2 mx-auto w-full" pluginSettings={pluginSettings} />
              <div className="relative text-center">
                <span className="relative z-10 inline-block px-4 text-sm font-medium bg-white dark:text-neutral-400 dark:bg-neutral-900">
                  {translate('label.myAccount.orText')}
                </span>
                <div className="absolute left-0 w-full transform -translate-y-1/2 border top-1/2 border-neutral-100 dark:border-neutral-800"></div>
              </div>
            </>
          )
        }
      </div> */}

      <div className="flex flex-col items-center justify-center w-full">
        <div className="w-full px-10 font-semibold sm:px-0">
          <label className="text-neutral-800 dark:text-neutral-800">{translate('label.addressBook.emailText')}</label>
          <input
            className="block w-full px-4 py-3 mt-1 text-sm font-normal bg-white border-neutral-200 focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 dark:border-neutral-700 dark:focus:ring-primary-6000 dark:focus:ring-opacity-25 dark:bg-white disabled:bg-neutral-200 dark:disabled:bg-neutral-800 rounded-2xl h-11 dark:text-black"
            value={value}
            type="email"
            onChange={onChange}
            onKeyUp={(e: any) => handleKeyPress(e)}
          />
        </div>
        {error ? <span className="text-red-500 capitalize">{error}</span> : null}
        <div className="flex items-center justify-center w-full my-5 px-10 sm:px-0">
          <Button
            className="w-full border border-black btn btn-c btn-primary rounded-2xl"
            buttonType="default"
            action={handleSubmit}
            title={translate('common.label.submitText')}
          />
        </div>
      </div>
    </>
  )
}

function RegisterPage({ recordEvent, setEntities, config, pluginConfig }: any) {
  let b2bSettings = []
  const { recordAnalytics } = useAnalytics()
  const SOCIAL_LOGINS_ENABLED = getEnabledSocialLogins(pluginConfig)
  const [hasPassedEmailValidation, setHasPassedEmailValidation] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const translate = useTranslation()
  const { isGuestUser, setIsGuestUser, user, basketId, setAlert, setUser, deleteUser } = useUI()
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const { associateCart } = cartHandler()
  const router = useRouter()
    if (config?.configSettings?.length) {
      b2bSettings =
        config?.configSettings?.find((x: any) =>
          matchStrings(x?.configType, 'B2BSettings', true)
        )?.configKeys || []
  }

  useAnalytics(AnalyticsEventType.PAGE_VIEWED, { entityName: PAGE_TYPES.Register, })

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

  const b2bEnabled = b2bSettings?.length
  ? stringToBoolean(
    b2bSettings.find((x: any) => x.key === 'B2BSettings.EnableB2B')?.value
    )
    : false

  const handleUserLogin = (values: any, cb?: any) => {
    const asyncLoginUser = async () => {
      const data = {
        ...values,
        email: userEmail
      }
      const result: any = await axios.post(NEXT_AUTHENTICATE, { data: b2bEnabled ? values : data })
      if (!result.data) {
        setAlert({ type: 'error', msg: translate('common.message.authenticationFailedText') })
        Router.push('/my-account/login')
      } else if (result.data) {
        setAlert({ type: 'success', msg: translate('common.label.successText') })
        let userObj = { ...result.data }
        if (userObj?.userToken) saveUserToken(userObj?.userToken)
        const updatedUserObj = await axios.post(
          `${NEXT_GET_CUSTOMER_DETAILS}?customerId=${userObj?.userId}`
        )
        if (updatedUserObj?.data) userObj = { ...updatedUserObj?.data }
        setUser(userObj)
        setIsGuestUser(false)
        Router.push('/')
      }
      if (cb) cb();
    }
    asyncLoginUser()
  }

  const handleUserRegister = async (values: any, cb = () => {}) => {
    let userCreated = false
    let recordId = Guid.empty
    let responseMsg = EmptyString
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

      if (tradingAccountResponse?.data?.message) {
        responseMsg = tradingAccountResponse?.data?.message
      }
    } else {
      // Otherwise, consider it as user registration.

      const response: any = await axios.post(NEXT_SIGN_UP, {
        data: { ...values, email: userEmail },
      })

      userCreated = (response && response.data?.id) ?? false
      recordId = response.data?.recordId
    }

    // execute form helper
    cb()

    // Trigger error message for failed registration.
    if (!userCreated) {
      setAlert({ type: 'error', msg: responseMsg || translate('common.message.requestCouldNotProcessErrorMsg') })
    }

    // If registration is SUCCESS
    if (userCreated) {
      deleteUser({ isSilentLogout: true })
      recordAnalytics(AnalyticsEventType.CUSTOMER_CREATED, { details: { ...values, recordId, }, })
      setAlert({ type: AlertType.SUCCESS, msg: translate('common.message.registerSuccessMsg')})
      Router.push('/my-account/login')
      // await handleBasketAssociation(recordId)
      // handleUserLogin(values)
      setIsGuestUser(false)
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
      <NextHead>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="canonical" href={SITE_ORIGIN_URL + router.asPath} />
        <title>{translate('label.checkout.loginRegistrationText')}</title>
        <meta name="title" content={translate('label.checkout.loginRegistrationText')} />
        <meta name="description" content={translate('label.checkout.loginRegistrationText')} />
        <meta name="keywords" content={translate('label.checkout.loginRegistrationText')} />
        <meta property="og:image" content="" />
        <meta property="og:title" content={translate('label.checkout.loginRegistrationText')} key="ogtitle" />
        <meta property="og:description" content={translate('label.checkout.loginRegistrationText')} key="ogdesc" />
      </NextHead>
      <section aria-labelledby="trending-heading" className="bg-white">
        <div className="pt-10 pb-10 lg:max-w-7xl lg:mx-auto sm:pt-4 sm:pb-20">
          <div className="flex flex-col items-center justify-center px-4 sm:px-6 lg:px-0">
            <h1 className="mt-20 mb-10 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-900 justify-center">
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

            <span className="block text-center text-neutral-700 dark:text-neutral-700">
              {translate('label.myAccount.alreadyAccountText')} {` `}
              <Link passHref className="text-green-600" href="/my-account/login">
                {translate('label.login.loginBtnText')}
              </Link>
            </span>
          </div>
        </div>
      </section>
    </>
  )
}

RegisterPage.Layout = Layout

export default withDataLayer(RegisterPage, PAGE_TYPES.Register)

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const { locale } = context
  const props: IPagePropsProvider = getPagePropType({ type: PagePropType.COMMON })
  const pageProps = await props.getPageProps({ cookies: context?.req?.cookies })

  return {
    props: {
      ...pageProps,
    }, // will be passed to the page component as props
  }
}
