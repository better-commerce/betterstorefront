import Layout from '@components/Layout/Layout'
import { useEffect, useState } from 'react'
import NextHead from 'next/head'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { BETTERCOMMERCE_DEFAULT_LANGUAGE, EmptyString, NEXT_RESET_PASSWORD, NEXT_VALIDATE_TOKEN, SITE_ORIGIN_URL } from '@components/utils/constants'
import axios from 'axios'
import { useRouter } from 'next/router'
import { Button } from '@components/ui'
import { useUI } from '@components/ui/context'
import Spinner from '@components/ui/Spinner'
import * as yup from 'yup'
import { useFormik } from 'formik'
import { Messages } from '@components/utils/constants'
import { useTranslation } from '@commerce/utils/use-translation'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import useAnalytics from '@components/services/analytics/useAnalytics'
import { EVENTS_MAP } from '@components/services/analytics/constants'

export async function getServerSideProps(context: any) {
  const { locale } = context
  return {
    props: {
      ...(await serverSideTranslations(locale ?? BETTERCOMMERCE_DEFAULT_LANGUAGE!)),
    },
  }
}

function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [token, setToken] = useState(null)
  const translate = useTranslation()
  const router: any = useRouter()
  const { setAlert } = useUI()

  const config = [
    {
      name: 'password',
      label: translate('label.password.enterNewPasswordText'),
      type: 'password',
      placeholder: translate('label.password.enterNewPasswordPlaceHolderText'),
    },
    {
      name: 'confirmPassword',
      label: translate('label.password.confirmNewPasswordText'),
      type: 'password',
      placeholder: translate('label.password.confirmNewPasswordPlaceHolderText'),
    },
  ]
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      userName: EmptyString,
      password: EmptyString,
      confirmPassword: EmptyString,
    },
    onSubmit: (values: any, { setSubmitting }) => {
      values = {
        ...values,
        token: token,
      }
      delete values.confirmPassword
      handlePasswordChangeSubmit(values, () => {
        setSubmitting(false)
      })
    },
    validationSchema: yup.object({
      userName: yup.string(),
      password: yup.string().required(Messages.Validations.ResetPassword.PASSWORD_REQUIRED_MESSAGE).matches(Messages.Validations.RegularExpressions.PASSWORD_VALIDATION, Messages.Validations.ResetPassword.PASSWORD_VALIDATION_MESSAGE),
      confirmPassword: yup
        .string()
        .required(Messages.Validations.ResetPassword.CONFIRM_REQUIRED_MESSAGE)
        .oneOf([yup.ref('password')], Messages.Validations.ResetPassword.MATCHING_PASSWORD_MESSAGE),
    }),
  })

  const validateToken = async (token: any) => {
    setIsLoading(true)
    try {
      const { data }: any = await axios.post(NEXT_VALIDATE_TOKEN, { token })
      if (!data.response.result.isValid) throw new Error('error')
      else {
        setToken(token)
      }
      setIsLoading(false)
    } catch (error) {
      // setIsLoading(false)
      setAlert({ type: 'error', msg: translate('common.message.tokenExpiredErrorMsg') })
      router.push('/my-account/forgot-password')
    }
  }

  useAnalytics(EVENTS_MAP.EVENT_TYPES.PageViewed, {
    entityName: PAGE_TYPES.ResetPassword,
    entityType: EVENTS_MAP.ENTITY_TYPES.Page,
    eventType: EVENTS_MAP.EVENT_TYPES.PageViewed,
  })

  useEffect(() => {
    if (router?.query?.token) {
      validateToken(router?.query?.token[0])
    }
  }, [router?.query?.token])

  const handlePasswordChangeSubmit = async (values: any, cb?: any) => {
    setIsLoading(true)

    try {
      await axios.post(NEXT_RESET_PASSWORD, {
        ...values,
      })
      setIsLoading(false)
      setAlert({
        type: 'success',
        msg: Messages.Messages.RESET_PASSWORD_SUCCESS,
      })
      if (cb) cb()
      router.push('/my-account/login')
    } catch (error) {
      setIsLoading(false)
      if (cb) cb()
    }
  }

  if (isLoading) {
    return <Spinner />
  }

  return (
    <>
      <NextHead>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="canonical" href={SITE_ORIGIN_URL + router.asPath} />
        <title>{translate('label.myAccount.resetPasswordText')}</title>
        <meta name="title" content={translate('label.myAccount.resetPasswordText')} />
        <meta name="description" content={translate('label.myAccount.resetPasswordText')} />
        <meta name="keywords" content={translate('label.myAccount.resetPasswordText')} />
        <meta property="og:image" content="" />
        <meta property="og:title" content={translate('label.myAccount.resetPasswordText')} key="ogtitle" />
        <meta property="og:description" content={translate('label.myAccount.resetPasswordText')} key="ogdesc" />
      </NextHead>

      <section>
        <div className="py-16 sm:py-24 lg:max-w-7xl lg:mx-auto lg:py-32 lg:px-8 header-space">
          <div className="flex flex-col items-center justify-center px-4 sm:px-6 lg:px-0">
            <h1 className="my-4 font-extrabold tracking-tight text-center text-gray-900">{translate('common.label.changePasswordText')}</h1>
          </div>
          <form onSubmit={formik.handleSubmit} className="flex flex-col items-center justify-center w-full px-5 py-5 m-auto font-semibold sm:w-1/2">
            {config.map((field: any, Idx: any) => {
              return (
                <div key={Idx} className="w-full mt-6 sm:w-1/2">
                  <label className="text-sm text-gray-700">{field.label}</label>
                  <input className="w-full min-w-0 px-4 py-2 mt-2 mb-2 text-gray-900 placeholder-gray-500 bg-white border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" name={field.name} type={field.type} onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values[field.name]} />
                  {formik.errors[field.name] && formik.touched[field.name] && (
                    <p className="text-red-500">
                      <>{formik.errors[field.name]}</>
                    </p>
                  )}
                </div>
              )
            })}
            <div className="w-full mt-10 sm:w-1/2">
              <Button type="submit" className="!font-normal w-full" loading={formik.isSubmitting} disabled={!formik.isValid || formik.isSubmitting}>
                {translate('common.label.changePasswordText')}
              </Button>
            </div>
          </form>
        </div>
      </section>
    </>
  )
}

ResetPasswordPage.Layout = Layout

export default withDataLayer(ResetPasswordPage, PAGE_TYPES.ResetPassword)